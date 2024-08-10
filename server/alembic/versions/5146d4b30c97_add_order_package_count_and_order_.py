"""add order.package_count and order.package_type

Revision ID: 5146d4b30c97
Revises: 59e8aaf91d45
Create Date: 2024-08-07 00:16:12.034584

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5146d4b30c97'
down_revision: Union[str, None] = '59e8aaf91d45'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ALEMBIC COMMANDS WERE CHANGED MANUALLY
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('Orders', sa.Column('package_type', sa.String(), nullable=False, server_default=""))
    op.add_column('Orders', sa.Column('package_count', sa.Integer(), nullable=False, server_default='0'))
    # ### end Alembic commands ###

    # delete default
    op.alter_column('Orders', 'package_type', server_default=None)
    op.alter_column('Orders', 'package_count', server_default=None)


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('Orders', 'package_count')
    op.drop_column('Orders', 'package_type')
    # ### end Alembic commands ###
