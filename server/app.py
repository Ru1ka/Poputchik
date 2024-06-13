from urllib.request import Request

from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from starlette import status
from starlette.responses import JSONResponse

import errors
from api import router
from database import db_session
from settings import settings


db_session.global_init()
app = FastAPI(
    title="API",
    description="PROD v2: Pulse Backend",
    debug=settings().DEBUG,
    docs_url="/api/docs",
)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content=jsonable_encoder({"detail": exc.errors(), "reason": errors.VALIDATION_ERROR}),
    )


@app.exception_handler(errors.APIError)
async def api_error_handler(request: Request, exc: errors.APIError):
    return JSONResponse(
        status_code=exc.status_code,
        content={"reason": exc.reason},
    )


@app.exception_handler(500)
async def internal_server_error_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": [{"msg": exc.__str__}], "reason": errors.INTERNAL_SERVER_ERROR},
    )


@app.get("/api/ping")
async def root():
    return JSONResponse(
        status_code=200,
        content={"status": "ok"},
    )
    