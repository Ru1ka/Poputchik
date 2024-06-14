from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class SendCode(BaseModel):
    phone: Optional[str] = Field(None, pattern="^7\d{10}$", example="70000000000")
    email: Optional[str] = Field(None, pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$", example="your@email.com")

class SendCodeReturn(BaseModel):
    user_exists: str


class VerifyTotpCode(BaseModel):
    phone: Optional[str] = Field(None, pattern="^7\d{10}$", example="70000000000")
    email: Optional[str] = Field(None, pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$", example="your@email.com")
    OTP: str = Field(..., max_length=6, min_length=6, example="123456")
    name: Optional[str] = None

class Token(BaseModel):
    token: str
