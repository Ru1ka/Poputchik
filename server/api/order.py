from fastapi import APIRouter, Depends

import schemas.order_pdc as order_pdc
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
        401: {"description": "JWT expired or Wrong JWT.", "model": ErrorResponse},
        404: {"description": "Такого юзера нет в БД, скорее всего ранее он был удален.", "model": ErrorResponse},
    }
)
async def get_cost(data: order_pdc.OrderCost, user: User = Depends(verify_jwt), service: OrderService = Depends()):
    """
    Получение стоимости заказа
    """
    return service.get_cost(data)