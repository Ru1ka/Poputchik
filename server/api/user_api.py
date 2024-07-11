from typing import Annotated

from fastapi import APIRouter, Depends

from api.dependencies import verify_jwt, verify_admin_jwt
from service.user import UserService
from service.admin import AdminService
from schemas.user_pdc import Profile, UsersList, UpdateMe
from schemas import order_pdc
from schemas.pdc import ErrorResponse
from database.users import User


router = APIRouter(
    prefix="/user",
    tags=["user"],
)


@router.get(
    "/me/profile", 
    response_model=Profile, 
    response_model_exclude_unset=True,
    responses={
        200: {"model": Profile},
        400: {"description": "Не существующий адрес.", "model": ErrorResponse},
        401: {"description": "JWT expired or Wrong JWT.", "model": ErrorResponse},
        404: {"description": "Такого юзера нет в БД, скорее всего ранее он был удален.", "model": ErrorResponse},
    }
)
async def get_me(user: User = Depends(verify_jwt), service: UserService = Depends()):
    """
    Получение профиля
    """
    return service.get_me(user)


@router.get(
    "/all", 
    response_model=UsersList, 
    response_model_exclude_unset=True,
    responses={
        200: {"model": UsersList},
        400: {"description": "Не существующий адрес.", "model": ErrorResponse},
        401: {"description": "JWT expired or Wrong JWT.", "model": ErrorResponse},
        404: {"description": "Такого юзера нет в БД, скорее всего ранее он был удален.", "model": ErrorResponse},
    }
)
async def get_users(verification = Depends(verify_admin_jwt), service: AdminService = Depends()):
    """
    Получение профиля
    """
    return service.get_all_users()


@router.get(
    "/me/orders", 
    response_model=order_pdc.OrdersList, 
    response_model_exclude_unset=True,
    responses={
        200: {"model": order_pdc.OrdersList},
        400: {"description": "Не существующий адрес.", "model": ErrorResponse},
        401: {"description": "JWT expired or Wrong JWT.", "model": ErrorResponse},
        404: {"description": "Такого юзера нет в БД, скорее всего ранее он был удален.", "model": ErrorResponse},
    }
)
async def get_orders(user: User = Depends(verify_jwt), service: UserService = Depends()):
    """
    Получение профиля
    """
    return service.get_orders(user)


@router.put(
    "/me", 
    response_model=Profile, 
    response_model_exclude_unset=True,
    responses={
        200: {"model": Profile},
        400: {"description": "Не существующий адрес.", "model": ErrorResponse},
        401: {"description": "JWT expired or Wrong JWT.", "model": ErrorResponse},
        404: {"description": "Такого юзера нет в БД, скорее всего ранее он был удален.", "model": ErrorResponse},
    }
)
async def update_me(data: UpdateMe, user: User = Depends(verify_jwt), service: UserService = Depends()):
    """
    Получение профиля
    """
    return service.update_me(user, data)

