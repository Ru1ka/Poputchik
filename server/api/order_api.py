from fastapi import APIRouter, Depends

import schemas.order_pdc as order_pdc
import schemas.pdc as pdc
from api.dependencies import verify_jwt
from service.order import OrderService
from schemas.pdc import ErrorResponse
from database.users import User


router = APIRouter(
    prefix="/order",
    tags=["order"],
)


@router.post(
    "/cost", 
    response_model=order_pdc.OrderCostReturn, 
    response_model_exclude_unset=True,
    responses={
        200: {"model": order_pdc.OrderCostReturn},
        400: {"description": "Одного из адресов не существует или ORS error.", "model": ErrorResponse},
        401: {"description": "JWT expired or Wrong JWT.", "model": ErrorResponse},
        404: {"description": "Такого юзера нет в БД, скорее всего ранее он был удален.", "model": ErrorResponse},
    }
)
async def get_cost(data: order_pdc.CreateOrder, user: User = Depends(verify_jwt), service: OrderService = Depends()):
    """
    Получение стоимости заказа
    """
    return service.get_cost(data)


@router.post(
    "/distance", 
    response_model=order_pdc.DistanceReturn, 
    response_model_exclude_unset=True,
    responses={
        200: {"model": order_pdc.DistanceReturn},
        400: {"description": "Одного из адресов не существует или ORS error.", "model": ErrorResponse},
        401: {"description": "JWT expired or Wrong JWT.", "model": ErrorResponse},
        404: {"description": "Такого юзера нет в БД, скорее всего ранее он был удален.", "model": ErrorResponse},
    }
)
async def get_cost(data: order_pdc.Route, user: User = Depends(verify_jwt), service: OrderService = Depends()):
    """
    Получение стоимости заказа
    """
    return service.get_distance(data)


@router.post(
    "/create_order", 
    response_model=order_pdc.Order, 
    response_model_exclude_unset=True,
    status_code=201,
    responses={
        201: {"model": order_pdc.Order},
        401: {"description": "JWT expired or Wrong JWT.", "model": ErrorResponse},
        404: {"description": "Такого юзера нет в БД, скорее всего ранее он был удален.", "model": ErrorResponse},
    }
)
async def create_order(data: order_pdc.CreateOrder, user: User = Depends(verify_jwt), service: OrderService = Depends()):
    """
    Получение стоимости заказа
    """
    return service.create_order(user, data)


@router.post(
    "", 
    response_model=order_pdc.Order, 
    response_model_exclude_unset=True,
    status_code=200,
    responses={
        200: {"model": order_pdc.Order},
        401: {"description": "JWT expired or Wrong JWT.", "model": ErrorResponse},
        404: {"description": "Такого юзера нет в БД, скорее всего ранее он был удален или несуществующий заказ.", "model": ErrorResponse},
    }
)
async def get_order(data: order_pdc.GetOrder, user: User = Depends(verify_jwt), service: OrderService = Depends()):
    """
    Получение стоимости заказа
    """
    return service.get_order(user, data)


@router.put(
    "", 
    response_model=order_pdc.Order, 
    response_model_exclude_unset=True,
    responses={
        200: {"model": order_pdc.Order},
        400: {"description": "Не существующий заказ.", "model": ErrorResponse},
        401: {"description": "JWT expired or Wrong JWT.", "model": ErrorResponse},
        404: {"description": "Заказ не найден.", "model": ErrorResponse},
    }
)
async def update_order(data: order_pdc.UpdateOrder, user: User = Depends(verify_jwt), service: OrderService = Depends()):
    """
    Получение профиля
    """
    return service.update_order_by_user(user, data)


@router.delete(
    "",
    response_model=pdc.OkReturn,
    responses={
        200: {"model": pdc.OkReturn},
        400: {"description": "Не существующий заказ.", "model": ErrorResponse},
        401: {"description": "JWT expired or Wrong JWT.", "model": ErrorResponse},
        404: {"description": "Заказ не найден.", "model": ErrorResponse},
    },
)
async def delete_order(data: order_pdc.deleteOrder, user: User = Depends(verify_jwt), service: OrderService = Depends()):
    return service.delete_order(user, data)