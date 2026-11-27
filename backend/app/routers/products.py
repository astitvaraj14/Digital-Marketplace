from datetime import datetime, timezone
from typing import List, Optional
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.security import RoleChecker, get_current_user
from app.db.mongodb import get_database
from app.models.schemas import ProductCreate, ProductResponse, ProductUpdate

router = APIRouter(prefix="/products", tags=["Products"])

require_seller_or_admin = RoleChecker(["seller", "admin"])


def _serialize_product(doc: dict) -> dict:
    serialized = dict(doc)
    serialized["_id"] = str(serialized["_id"])
    serialized["seller_id"] = str(serialized.get("seller_id", ""))
    serialized.setdefault("rating", 0.0)
    serialized.setdefault("numReviews", 0)
    return serialized


def _build_product_filter(product_id: str) -> dict:
    if ObjectId.is_valid(product_id):
        return {"$or": [{"_id": ObjectId(product_id)}, {"_id": product_id}]}
    return {"_id": product_id}


def _can_manage_product(product: dict, current_user: dict) -> bool:
    role = current_user.get("role", "customer")
    if role == "admin":
        return True
    return str(product.get("seller_id")) == str(current_user.get("id"))


@router.get("", response_model=List[ProductResponse])
async def list_products(
    category: Optional[str] = Query(default=None),
    search: Optional[str] = Query(default=None),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    query: dict = {}
    if category and category.strip():
        query["category"] = {"$regex": f"^{category.strip()}$", "$options": "i"}
    if search and search.strip():
        query["$or"] = [
            {"title": {"$regex": search.strip(), "$options": "i"}},
            {"description": {"$regex": search.strip(), "$options": "i"}},
        ]

    cursor = db["products"].find(query).sort("createdAt", -1)
    docs = await cursor.to_list(length=200)
    return [ProductResponse.model_validate(_serialize_product(doc)) for doc in docs]


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    product = await db["products"].find_one(_build_product_filter(product_id))
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )
    return ProductResponse.model_validate(_serialize_product(product))


@router.post(
    "",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_product(
    payload: ProductCreate,
    current_user: dict = Depends(require_seller_or_admin),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    doc = {
        "title": payload.title.strip(),
        "description": payload.description.strip(),
        "price": payload.price,
        "category": payload.category.strip(),
        "stock": payload.stock,
        "seller_id": str(current_user["id"]),
        "imageUrl": payload.imageUrl,
        "rating": 0.0,
        "numReviews": 0,
        "createdAt": datetime.now(timezone.utc),
    }
    result = await db["products"].insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    return ProductResponse.model_validate(_serialize_product(doc))


@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: str,
    payload: ProductUpdate,
    current_user: dict = Depends(require_seller_or_admin),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    product = await db["products"].find_one(_build_product_filter(product_id))
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )
    if not _can_manage_product(product, current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this product",
        )

    updates = payload.model_dump(exclude_unset=True)
    if not updates:
        return ProductResponse.model_validate(_serialize_product(product))

    await db["products"].update_one({"_id": product["_id"]}, {"$set": updates})
    updated_doc = await db["products"].find_one({"_id": product["_id"]})
    return ProductResponse.model_validate(_serialize_product(updated_doc))


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: str,
    current_user: dict = Depends(require_seller_or_admin),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    product = await db["products"].find_one(_build_product_filter(product_id))
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )
    if not _can_manage_product(product, current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this product",
        )

    await db["products"].delete_one({"_id": product["_id"]})
    return None