from datetime import datetime, timezone
from typing import Any, List
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.security import get_current_user
from app.db.mongodb import get_database
from app.models.schemas import OrderCreateSchema, OrderResponse, UpdateCartSchema

router = APIRouter(tags=["Cart & Orders"])


def _id_filter(raw_id: str) -> dict:
    if ObjectId.is_valid(raw_id):
        return {"$or": [{"_id": ObjectId(raw_id)}, {"_id": raw_id}]}
    return {"_id": raw_id}


def _serialize_order(doc: dict) -> dict:
    serialized = dict(doc)
    serialized["_id"] = str(serialized["_id"])
    serialized["user_id"] = str(serialized.get("user_id", ""))
    return serialized


async def _hydrate_cart_items(db: AsyncIOMotorDatabase, raw_items: List[dict]) -> List[dict]:
    hydrated: List[dict] = []
    for item in raw_items:
        pid = str(item.get("product_id", ""))
        qty = int(item.get("quantity", 0))
        if not pid or qty <= 0:
            continue
        product = await db["products"].find_one(_id_filter(pid))
        if not product:
            continue
        hydrated.append(
            {
                "product_id": str(product["_id"]),
                "title": product.get("title", "Untitled Product"),
                "price": float(product.get("price", 0.0)),
                "stock": int(product.get("stock", 0)),
                "imageUrl": product.get("imageUrl"),
                "quantity": qty,
                "subtotal": round(float(product.get("price", 0.0)) * qty, 2),
            }
        )
    return hydrated


@router.get("/cart")
async def get_cart(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    user_id = str(current_user["id"])
    cart = await db["carts"].find_one({"user_id": user_id})
    raw_items = cart.get("items", []) if cart else []
    items = await _hydrate_cart_items(db, raw_items)
    total_amount = round(sum(entry["subtotal"] for entry in items), 2)
    return {
        "user_id": user_id,
        "items": items,
        "total_amount": total_amount,
    }


@router.put("/cart")
async def update_cart(
    payload: UpdateCartSchema,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    user_id = str(current_user["id"])
    cleaned_items: List[dict[str, Any]] = []

    for item in payload.items:
        product = await db["products"].find_one(_id_filter(item.product_id))
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product not found: {item.product_id}",
            )
        available_stock = int(product.get("stock", 0))
        if item.quantity > available_stock:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for '{product.get('title')}'. Available: {available_stock}",
            )
        cleaned_items.append(
            {
                "product_id": str(product["_id"]),
                "quantity": item.quantity,
            }
        )

    now = datetime.now(timezone.utc)
    await db["carts"].update_one(
        {"user_id": user_id},
        {
            "$set": {"items": cleaned_items, "updatedAt": now},
            "$setOnInsert": {"user_id": user_id, "createdAt": now},
        },
        upsert=True,
    )

    items = await _hydrate_cart_items(db, cleaned_items)
    total_amount = round(sum(entry["subtotal"] for entry in items), 2)
    return {
        "user_id": user_id,
        "items": items,
        "total_amount": total_amount,
    }


@router.post(
    "/orders",
    response_model=OrderResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_order(
    payload: OrderCreateSchema,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    user_id = str(current_user["id"])
    cart = await db["carts"].find_one({"user_id": user_id})
    cart_items = cart.get("items", []) if cart else []

    if not cart_items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot place an order with an empty cart",
        )

    order_items: List[dict[str, Any]] = []
    total_amount = 0.0

    for item in cart_items:
        pid = str(item["product_id"])
        qty = int(item["quantity"])
        product = await db["products"].find_one(_id_filter(pid))
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product no longer exists: {pid}",
            )
        stock = int(product.get("stock", 0))
        if qty > stock:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for '{product.get('title')}'. Available: {stock}",
            )

        price = float(product.get("price", 0.0))
        total_amount += price * qty
        order_items.append(
            {
                "product_id": str(product["_id"]),
                "title": product.get("title", "Untitled Product"),
                "price": price,
                "quantity": qty,
            }
        )

    for entry in order_items:
        await db["products"].update_one(
            _id_filter(entry["product_id"]),
            {"$inc": {"stock": -entry["quantity"]}},
        )

    order_doc = {
        "user_id": user_id,
        "items": order_items,
        "total_amount": round(total_amount, 2),
        "shipping_address": payload.shipping_address.strip(),
        "payment_method": payload.payment_method.strip(),
        "status": "Confirmed",
        "createdAt": datetime.now(timezone.utc),
    }

    result = await db["orders"].insert_one(order_doc)
    order_doc["_id"] = str(result.inserted_id)

    await db["carts"].update_one(
        {"user_id": user_id},
        {"$set": {"items": [], "updatedAt": datetime.now(timezone.utc)}},
    )

    return OrderResponse.model_validate(_serialize_order(order_doc))


@router.get("/orders", response_model=List[OrderResponse])
async def list_orders(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    query = {} if current_user.get("role") == "admin" else {"user_id": str(current_user["id"])}
    cursor = db["orders"].find(query).sort("createdAt", -1)
    docs = await cursor.to_list(length=200)
    return [OrderResponse.model_validate(_serialize_order(doc)) for doc in docs]