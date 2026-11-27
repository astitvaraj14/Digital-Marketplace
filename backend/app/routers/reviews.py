from datetime import datetime, timezone
from typing import List
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.security import get_current_user
from app.db.mongodb import get_database
from app.models.schemas import ReviewCreate, ReviewResponse

router = APIRouter(prefix="/reviews", tags=["Reviews"])


def _id_filter(raw_id: str) -> dict:
    if ObjectId.is_valid(raw_id):
        return {"$or": [{"_id": ObjectId(raw_id)}, {"_id": raw_id}]}
    return {"_id": raw_id}


def _serialize_review(doc: dict) -> dict:
    serialized = dict(doc)
    serialized["_id"] = str(serialized["_id"])
    serialized["product_id"] = str(serialized.get("product_id", ""))
    serialized["user_id"] = str(serialized.get("user_id", ""))
    return serialized


async def _recalculate_product_rating(db: AsyncIOMotorDatabase, product_id: str) -> None:
    cursor = db["reviews"].find({"product_id": product_id})
    reviews = await cursor.to_list(length=1000)
    count = len(reviews)
    avg_rating = (
        round(sum(float(r.get("rating", 0)) for r in reviews) / count, 1)
        if count > 0
        else 0.0
    )
    await db["products"].update_one(
        _id_filter(product_id),
        {"$set": {"rating": avg_rating, "numReviews": count}},
    )


@router.get("/{product_id}", response_model=List[ReviewResponse])
async def list_product_reviews(
    product_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    cursor = db["reviews"].find({"product_id": product_id}).sort("createdAt", -1)
    docs = await cursor.to_list(length=200)
    return [ReviewResponse.model_validate(_serialize_review(doc)) for doc in docs]


@router.post(
    "",
    response_model=ReviewResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_or_update_review(
    payload: ReviewCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    product = await db["products"].find_one(_id_filter(payload.product_id))
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    canonical_product_id = str(product["_id"])
    user_id = str(current_user["id"])
    user_name = current_user.get("name", "Verified Customer")
    now = datetime.now(timezone.utc)

    existing = await db["reviews"].find_one(
        {"product_id": canonical_product_id, "user_id": user_id}
    )

    if existing:
        await db["reviews"].update_one(
            {"_id": existing["_id"]},
            {
                "$set": {
                    "rating": payload.rating,
                    "comment": payload.comment.strip(),
                    "user_name": user_name,
                    "updatedAt": now,
                }
            },
        )
        doc = await db["reviews"].find_one({"_id": existing["_id"]})
    else:
        new_doc = {
            "product_id": canonical_product_id,
            "user_id": user_id,
            "user_name": user_name,
            "rating": payload.rating,
            "comment": payload.comment.strip(),
            "createdAt": now,
        }
        inserted = await db["reviews"].insert_one(new_doc)
        doc = await db["reviews"].find_one({"_id": inserted.inserted_id})

    await _recalculate_product_rating(db, canonical_product_id)
    return ReviewResponse.model_validate(_serialize_review(doc))