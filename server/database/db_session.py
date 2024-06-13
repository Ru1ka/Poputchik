from log_config import logger as logging
from time import sleep

import sqlalchemy as sa
import sqlalchemy.ext.declarative as dec
import sqlalchemy.orm as orm
from sqlalchemy.orm import Session

from settings import settings

SqlAlchemyBase = dec.declarative_base()

__factory = None


def global_init():
    global __factory

    if __factory:
        return
    db_connection = f"postgresql://{settings().POSTGRES_USER}:{settings().POSTGRES_PASSWORD}@postgres:5432/{settings().POSTGRES_DB}"
    logging.info(f"Connecting to Postgres at {db_connection}")
    while True:
        try:
            engine = sa.create_engine(db_connection, pool_size=20, max_overflow=50)
            __factory = orm.sessionmaker(engine, autocommit=False, autoflush=False)

            from . import __all_models

            SqlAlchemyBase.metadata.create_all(engine)
            break
        except Exception as error:
            logging.warning("Database is not ready yet")
            logging.debug(f"Database is not ready yet: {error}")
            sleep(2)


def get_session() -> Session:
    session = __factory()
    try:
        yield session
    finally:
        session.close()

