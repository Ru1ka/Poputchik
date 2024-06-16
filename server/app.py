from urllib.request import Request

from fastapi import FastAPI, status
from fastapi.encoders import jsonable_encoder
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.exceptions import RequestValidationError
from starlette import status
from starlette.responses import JSONResponse


import errors
from custom_openapi import custom_openapi
from api import router
from database import db_session
from settings import settings


db_session.global_init()
app = FastAPI(
    title="API",
    description="Попутчик",
    debug=settings().DEBUG,
    docs_url="/docs",
)
app.include_router(router)

# Custom auto autorization using JWT instead of login+password in /docs
app.openapi_schema = None
app.openapi = lambda: custom_openapi(app)


@app.get("/openapi.json", include_in_schema=False)
async def get_open_api_endpoint():
    return app.openapi()


@app.get("/docs", include_in_schema=False)
async def get_documentation():
    return get_swagger_ui_html(openapi_url="/openapi.json", title="docs")


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content=jsonable_encoder({"detail": exc.errors(), "reason": "Validaton error"}),
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
        content={"detail": [{"msg": exc.__str__}], "reason": "Internal server error"},
    )


@app.get("/ping")
async def root():
    return JSONResponse(
        status_code=200,
        content={"status": "ok"},
    )
