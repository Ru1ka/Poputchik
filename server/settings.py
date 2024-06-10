from enum import Enum
from functools import lru_cache

from pydantic import BaseSettings


class Engine(str, Enum):
    sqlite = "sqlite"
    postgresql = "postgresql"


class Settings(BaseSettings):
    SERVER_ADDRESS: str = "127.0.0.1"
    SERVER_PORT: int = 7999
    SERVER_DEBUG: bool = False

    # postgresql settings
    POSTGRES_USERNAME: str
    POSTGRES_PASSWORD: str
    POSTGRES_HOST: str
    POSTGRES_PORT: int = 5432
    POSTGRES_DB_NAME: str

    # sqlite settings
    SQLITE_DIR: str = "database/db.db"


@lru_cache()
def settings():
    return Settings(
        _env_file=".env",
        _env_file_encoding="utf-8",
    )
