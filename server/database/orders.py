import sqlalchemy
from string import ascii_uppercase
from sqlalchemy import orm
from .db_session import SqlAlchemyBase
import datetime


class Order(SqlAlchemyBase):
    __tablename__ = "Orders"
    __table_args__ = {'extend_existing': True}

    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True)
    cargo = sqlalchemy.Column(sqlalchemy.String, nullable=False)
    created_at = sqlalchemy.Column(sqlalchemy.DateTime, default=datetime.datetime.utcnow)
    loading_time = sqlalchemy.Column(sqlalchemy.DateTime, nullable=False)
    cost = sqlalchemy.Column(sqlalchemy.Integer, nullable=True)  # rubles
    distance = sqlalchemy.Column(sqlalchemy.Integer, nullable=True)  # meters
    weight = sqlalchemy.Column(sqlalchemy.Integer, nullable=False)
    amount = sqlalchemy.Column(sqlalchemy.Integer, nullable=False)
    temperature_condition = sqlalchemy.Column(sqlalchemy.Boolean, nullable=False)
    status = sqlalchemy.Column(sqlalchemy.String, nullable=False, default="Created")  # Created -> Transit -> Delivered

    customer_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('Users.id'))
    customer = orm.relationship("User", back_populates="orders")

    loading_points = orm.relationship("LoadingPoint", back_populates="order")
    unloading_points = orm.relationship("UnloadingPoint", back_populates="order")

    @property
    def readable_id(self) -> str:
        """Генерация читаемого id"""
        id = self.id + 21243  # +21243 - для красоты
        return f'#{ascii_uppercase[id % len(ascii_uppercase)]}{ascii_uppercase[(id // len(ascii_uppercase)) % len(ascii_uppercase)]}{id}'

    @property
    def route(self):
        return sorted(self.loading_points, key=lambda p: p.index) + sorted(self.unloading_points, key=lambda p: p.index)