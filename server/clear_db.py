from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker
from settings import settings

DATABASE_URL = f"postgresql://{settings.postgres_user}:{settings.postgres_password}@postgres:5432/{settings.postgres_db}"

engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()

meta = MetaData(bind=engine)
meta.reflect()

with engine.connect() as conn:
    trans = conn.begin()
    for table in reversed(meta.sorted_tables):
        print(f'Clearing table {table}')
        conn.execute(table.delete())
    trans.commit()

session.close()
