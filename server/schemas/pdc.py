from pydantic import BaseModel, Field, Extra
from typing import Optional
from datetime import datetime



class OkReturn(BaseModel):
    status: str = "ok"


class ErrorResponse(BaseModel):
    detail: str = Field(..., example="Description of the error.")

class PointORM(BaseModel):
    locality: str = Field(..., example="Санкт-Петербург")
    address: str = Field(..., example="Невский проспект 1")
    phone: str = Field(None, pattern="^7\d{10}$", example="70000000000")
    lat: str = None
    lon: str = None
    index: int

    class Config:
        orm_mode = True
        

class Order(BaseModel):
    id: int
    readable_id: str
    customer_id: int

    cargo: str
    created_at: datetime
    loading_time: datetime
    cost: int
    distance: int
    weight: int
    readable_weight: str = None
    amount: int
    temperature_condition: bool
    VAT: bool
    status: str

    loading_points: list[PointORM]
    unloading_points: list[PointORM]

    class Config:
        orm_mode = True