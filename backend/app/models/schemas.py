from datetime import datetime
from typing import Any, List, Optional
from bson import ObjectId
from pydantic import BaseModel, ConfigDict, EmailStr, Field, GetCoreSchemaHandler
from pydantic_core import core_schema


class PyObjectId(str):
    @classmethod
    def __get_pydantic_core_schema__(
        cls, _source_type: Any, _handler: GetCoreSchemaHandler
    ) -> core_schema.CoreSchema:
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.no_info_plain_validator_function(cls.validate),
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda x: str(x)
            ),
        )

    @classmethod
    def validate(cls, value: Any) -> str:
        if isinstance(value, ObjectId):
            return str(value)
        if isinstance(value, str) and value.strip():
            return value
        raise ValueError("Invalid ObjectId or String format")


# User Schemas
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: Optional[str] = Field(default="customer")


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: PyObjectId = Field(alias="_id")
    name: str
    email: EmailStr
    role: str
    createdAt: Optional[datetime] = None

    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# Product Schemas
class ProductCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=150)
    description: str
    price: float = Field(..., gt=0)
    category: str
    stock: int = Field(..., ge=0)
    imageUrl: Optional[str] = "https://via.placeholder.com/300"


class ProductUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    stock: Optional[int] = None
    imageUrl: Optional[str] = None


class ProductResponse(BaseModel):
    id: PyObjectId = Field(alias="_id")
    title: str
    description: str
    price: float
    category: str
    stock: int
    seller_id: str
    imageUrl: Optional[str] = None
    rating: float = 0.0
    numReviews: int = 0
    createdAt: Optional[datetime] = None

    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True)


# Cart & Order Schemas
class CartItemSchema(BaseModel):
    product_id: str
    quantity: int = Field(..., gt=0)


class UpdateCartSchema(BaseModel):
    items: List[CartItemSchema]


class OrderCreateSchema(BaseModel):
    shipping_address: str
    payment_method: str = "Credit Card"


class OrderItemSchema(BaseModel):
    product_id: str
    title: str
    price: float
    quantity: int


class OrderResponse(BaseModel):
    id: PyObjectId = Field(alias="_id")
    user_id: str
    items: List[OrderItemSchema]
    total_amount: float
    shipping_address: str
    payment_method: str
    status: str
    createdAt: Optional[datetime] = None

    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True)


# Review Schemas
class ReviewCreate(BaseModel):
    product_id: str
    rating: int = Field(..., ge=1, le=5)
    comment: str


class ReviewResponse(BaseModel):
    id: PyObjectId = Field(alias="_id")
    product_id: str
    user_id: str
    user_name: str
    rating: int
    comment: str
    createdAt: Optional[datetime] = None

    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True)