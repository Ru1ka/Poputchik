from fastapi import APIRouter
from .auth_api import router as auth
from .user_api import router as user
from .order_api import router as order
from .admin_api import router as admin

router = APIRouter(prefix="/api")
router.include_router(auth)
router.include_router(user)
router.include_router(order)
router.include_router(admin)