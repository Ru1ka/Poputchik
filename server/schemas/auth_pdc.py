from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class SendCode(BaseModel):
    login: Optional[str] = Field(pattern="^7\d{10}$|^[^\s@]+@[^\s@]+\.[^\s@]+$")  # Phone number or email