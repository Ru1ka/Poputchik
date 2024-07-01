import sqlalchemy
import datetime
from .db_session import SqlAlchemyBase
from sqlalchemy import orm


class User(SqlAlchemyBase):
    __tablename__ = "Users"
    __table_args__ = {'extend_existing': True}

    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, autoincrement=True)
    name = sqlalchemy.Column(sqlalchemy.String, nullable=False)
    phone = sqlalchemy.Column(sqlalchemy.String, unique=True) # convert all to 7xxxxxxxxxx
    email = sqlalchemy.Column(sqlalchemy.String, unique=True)
    created_at = sqlalchemy.Column(sqlalchemy.DateTime, default=datetime.datetime.utcnow)
    is_organization_account = sqlalchemy.Column(sqlalchemy.Boolean, nullable=False, default=False)
    organization_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('Organizations.id'), nullable=True)

    organization = orm.relationship("Organization", back_populates="organization_account")
    orders = orm.relationship("Order", back_populates="customer")


    def __repr__(self):
        return f"<User> {self.id} {self.name} {self.phone or self.email}"
