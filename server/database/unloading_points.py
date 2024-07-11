import sqlalchemy
from sqlalchemy import orm
from .db_session import SqlAlchemyBase


class UnloadingPoint(SqlAlchemyBase):
    __tablename__ = "Unloading_points"
    __table_args__ = {'extend_existing': True}

    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, autoincrement=True)
    locality = sqlalchemy.Column(sqlalchemy.String, nullable=False)
    address = sqlalchemy.Column(sqlalchemy.String, nullable=False)
    phone = sqlalchemy.Column(sqlalchemy.String, nullable=True) # convert all to 7xxxxxxxxxx
    lat = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    lon = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    index = sqlalchemy.Column(sqlalchemy.String, nullable=False)

    order_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('Orders.id'))
    order = orm.relationship("Order", back_populates="unloading_points")

    @property
    def coordinates(self) -> tuple:
        return (self.lon, self.lat)