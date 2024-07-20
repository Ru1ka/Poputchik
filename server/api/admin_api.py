from fastapi import APIRouter, Depends

from service.admin import AdminService
import schemas.auth_pdc as auth_pdc
import schemas.admin_pdc as admin_pdc
import schemas.order_pdc as order_pdc
from schemas.pdc import ErrorResponse, OkReturn
from service.order import OrderService
from api.dependencies import verify_admin_jwt

# from api.dependencies import oauth2_scheme

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
)

@router.post(
        "/sign_in", 
        responses={
            200: {"model": auth_pdc.Token},
            401: {"description": "Неправильный логин или пароль.", "model": ErrorResponse}
        }
)
async def sign_in(data: admin_pdc.SignIn, service: AdminService = Depends()):
    """
    Вход в админку
    """
    return service.sign_in(data)


@router.put(
    "/order", 
    response_model=order_pdc.Order, 
    response_model_exclude_unset=True,
    responses={
        200: {"model": order_pdc.Order},
        400: {"description": "Не существующий заказ.", "model": ErrorResponse},
        401: {"description": "JWT expired or Wrong JWT.", "model": ErrorResponse},
        404: {"description": "Заказ не найден.", "model": ErrorResponse},
    }
)
async def update_order(data: order_pdc.UpdateOrder, verification = Depends(verify_admin_jwt), service: OrderService = Depends()):
    """
    Получение профиля
    """
    return service.update_order_by_admin(data)