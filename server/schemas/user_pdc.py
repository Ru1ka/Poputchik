from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class Profile(BaseModel):
    phone: Optional[str] = Field(None, pattern="^7\d{10}$", example="70000000000")
    email: Optional[str] = Field(None, pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$", example="your@email.com")
    name: str


    class Config:
        orm_mode = True