from urllib.request import Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from fastapi.openapi.docs import get_swagger_ui_html
from starlette.responses import JSONResponse
from custom_openapi import custom_openapi
from api import router
from database import db_session
from settings import settings


def setup_app():
    db_session.global_init()
    app = FastAPI(
        title="API",
        description="Попутчик",
        debug=settings().DEBUG,
        openapi_url="/openapi/openapi.json"
    )
    app.include_router(router)

    # CORS
    origins = [
        "http://localhost.tiangolo.com",
        "http://putchik.ru",
        "http://backend.putchik.ru",
        "http://localhost",
        "http://127.0.0.1:5173",
        "http://localhost:5173",
        "http://localhost:8080",
        "https://localhost.tiangolo.com",
        "https://putchik.ru",
        "https://backend.putchik.ru",
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
    return app


app = setup_app()


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
        content={"status": "ok."},
    )
