from fastapi import APIRouter
from .auth_api import router as auth
from .user import router as user

router = APIRouter(prefix="/api")
router.include_router(auth)
router.include_router(user)