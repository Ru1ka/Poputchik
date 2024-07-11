from fastapi import APIRouter, Depends

from service.admin import AdminService
import schemas.auth_pdc as auth_pdc
import schemas.admin_pdc as admin_pdc
from schemas.pdc import ErrorResponse, OkReturn
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