from datetime import datetime, timezone
from typing import List
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel

from app.core.security import RoleChecker
from app.db.mongodb import get_database
from app.models.schemas import OrderResponse, UserResponse

router = APIRouter(prefix="/admin", tags=["Admin"])

require_admin = RoleChecker(["admin"])


def _id_filter(raw_id: str) -> dict:
    if ObjectId.is_valid(raw_id):
        return {"$or": [{"_id": ObjectId(raw_id)}, {"_id": raw_id}]}
    return {"_id": raw_id}


class OrderStatusUpdate(BaseModel):
    status: str


@router.get("/users", response_model=List[UserResponse])
async def list_users(
    _: dict = Depends(require_admin),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    cursor = db["users"].find({}, {"password": 0}).sort("createdAt", -1)
    docs = await cursor.to_list(length=500)
    serialized = []
    for doc in docs:
        item = dict(doc)
        item["_id"] = str(item["_id"])
        serialized.append(UserResponse.model_validate(item))
    return serialized


@router.get("/stats")
async def get_platform_stats(
    _: dict = Depends(require_admin),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    users_count = await db["users"].count_documents({})
    products_count = await db["products"].count_documents({})
    orders_count = await db["orders"].count_documents({})
    reviews_count = await db["reviews"].count_documents({})

    orders_cursor = db["orders"].find({}, {"total_amount": 1})
    orders = await orders_cursor.to_list(length=5000)
    gross_revenue = round(
        sum(float(order.get("total_amount", 0.0)) for order in orders), 2
    )

    return {
        "users": users_count,
        "products": products_count,
        "orders": orders_count,
        "reviews": reviews_count,
        "gross_revenue": gross_revenue,
    }


@router.patch("/orders/{order_id}/status", response_model=OrderResponse)
async def update_order_status(
    order_id: str,
    payload: OrderStatusUpdate,
    _: dict = Depends(require_admin),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    allowed_statuses = {"Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"}
    normalized_status = payload.status.strip().title()
    if normalized_status not in allowed_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Allowed: {sorted(allowed_statuses)}",
        )

    order = await db["orders"].find_one(_id_filter(order_id))
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )

    await db["orders"].update_one(
        {"_id": order["_id"]},
        {
            "$set": {
                "status": normalized_status,
                "updatedAt": datetime.now(timezone.utc),
            }
        },
    )
    updated = await db["orders"].find_one({"_id": order["_id"]})
    serialized = dict(updated)
    serialized["_id"] = str(serialized["_id"])
    serialized["user_id"] = str(serialized.get("user_id", ""))
    return OrderResponse.model_validate(serialized)