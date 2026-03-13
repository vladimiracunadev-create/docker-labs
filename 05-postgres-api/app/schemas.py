from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class CustomerCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr


class CustomerRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: EmailStr
    status: str
    created_at: datetime


class ProductCreate(BaseModel):
    sku: str = Field(min_length=3, max_length=60)
    name: str = Field(min_length=2, max_length=160)
    description: str = Field(default="", max_length=500)
    price: Decimal = Field(gt=0)
    stock: int = Field(ge=0)


class ProductRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    sku: str
    name: str
    description: str
    price: Decimal
    stock: int
    status: str
    created_at: datetime


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)


class OrderCreate(BaseModel):
    customer_id: int
    items: list[OrderItemCreate] = Field(min_length=1)


class OrderLineRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int
    quantity: int
    unit_price: Decimal
    line_total: Decimal


class OrderRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    customer_id: int
    status: str
    total_amount: Decimal
    created_at: datetime
    lines: list[OrderLineRead]


class OrderStatusUpdate(BaseModel):
    status: str = Field(pattern="^(draft|confirmed|cancelled)$")


class InventorySummary(BaseModel):
    customers: int
    products: int
    orders: int
    active_products: int
    low_stock_products: int
    revenue: Decimal


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str


class ReadinessResponse(BaseModel):
    status: str
    database: str
    checked_at: datetime
