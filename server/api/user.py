from typing import Annotated

from fastapi import APIRouter, Depends

from api.dependencies import verify_jwt
from service.user import UserService
from schemas.user_pdc import Profile
from schemas.pdc import ErrorResponse
from database.users import User


router = APIRouter(
    prefix="",
    tags=["user"],
)


@router.get(
    "/me/profile", 
    response_model=Profile, 
    response_model_exclude_unset=True,
    responses={
        200: {"model": Profile},
        401: {"description": "JWT expired or Wrong JWT.", "model": ErrorResponse},
        404: {"description": "Такого юзера нет в БД, скорее всего ранее он был удален.", "model": ErrorResponse},
    }
)
async def get_me(user: User = Depends(verify_jwt), service: UserService = Depends()):
    """
    Получение профиля
    """
    return service.get_me(user)