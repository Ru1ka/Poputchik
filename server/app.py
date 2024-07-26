from urllib.request import Request

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, APIRouter
from fastapi.encoders import jsonable_encoder
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.exceptions import RequestValidationError
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
    # root_path="/api/",
    # docs_url="/docs",
    openapi_url="/openapi/openapi.json"
)
# app.openapi_version = "3.0.3"
app.include_router(router)


# CORS
origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://127.0.0.1:5173",
    "http://localhost:8000",
    "http://localhost:8080",
    "http://localhost:5173",
    "http://putchik.ru",
    "https://putchik.ru"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom auto autorization using JWT instead of login+password in /docs
app.openapi_schema = None
app.openapi = lambda: custom_openapi(app)


@app.get("/openapi.json", include_in_schema=False)
async def get_open_api_endpoint():
    return app.openapi()


@app.get("/docs", include_in_schema=False)
async def get_documentation():
    print("here")
    return get_swagger_ui_html(openapi_url="/openapi/aa", title="docs")


@app.exception_handler(500)
async def internal_server_error_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": [{"msg": exc.__str__}], "reason": "Internal server error"},
    )


@app.get("/api/ping")
async def root():
    return JSONResponse(
        status_code=200,
        content={"status": "ok"},
    )
