from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.security import (
    create_access_token,
    get_current_user,
    get_password_hash,
    verify_password,
)
from app.db.mongodb import get_database
from app.models.schemas import TokenResponse, UserLogin, UserRegister, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

ALLOWED_SELF_ROLES = {"customer", "seller"}


def _serialize_user(user_doc: dict) -> dict:
    doc = dict(user_doc)
    doc["_id"] = str(doc["_id"])
    return doc


@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
)
async def register(
    payload: UserRegister,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    normalized_email = payload.email.strip().lower()
    existing_user = await db["users"].find_one({"email": normalized_email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered",
        )

    requested_role = (payload.role or "customer").strip().lower()
    assigned_role = requested_role if requested_role in ALLOWED_SELF_ROLES else "customer"

    now = datetime.now(timezone.utc)
    new_user_doc = {
        "name": payload.name.strip(),
        "email": normalized_email,
        "password": get_password_hash(payload.password),
        "role": assigned_role,
        "createdAt": now,
    }

    insert_result = await db["users"].insert_one(new_user_doc)
    new_user_doc["_id"] = str(insert_result.inserted_id)

    access_token = create_access_token(
        subject=new_user_doc["_id"],
        roles=[assigned_role],
    )

    user_out = UserResponse.model_validate(_serialize_user(new_user_doc))
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=user_out,
    )


@router.post("/login", response_model=TokenResponse)
async def login(
    payload: UserLogin,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    normalized_email = payload.email.strip().lower()
    user = await db["users"].find_one({"email": normalized_email})
    if not user or not user.get("password"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not verify_password(payload.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    user_id = str(user["_id"])
    role = user.get("role", "customer")
    access_token = create_access_token(
        subject=user_id,
        roles=[role],
    )

    user_out = UserResponse.model_validate(_serialize_user(user))
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=user_out,
    )


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return UserResponse.model_validate(_serialize_user(current_user))