from fastapi import APIRouter
from .auth_api import router as auth

router = APIRouter(prefix="/api")
router.include_router(auth)