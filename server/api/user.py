from typing import Annotated

from fastapi import APIRouter, Depends

from api.dependencies import verify_jwt
from service.user import UserService
from schemas.user_pdc import Profile
from database.users import User


router = APIRouter(
    prefix="",
    tags=["user"],
)


@router.get(
    "/me/profile", 
    response_model=Profile, 
    response_model_exclude_unset=True,
    response_model_exclude_none=True
)
async def get_me(user: User = Depends(verify_jwt), service: UserService = Depends()):
    return service.get_me(user)