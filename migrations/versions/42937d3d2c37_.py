"""empty message

Revision ID: 42937d3d2c37
Revises: 4e408282fc03
Create Date: 2016-04-02 19:20:37.143918

"""

# revision identifiers, used by Alembic.
revision = '42937d3d2c37'
down_revision = '4e408282fc03'

from alembic import op
import sqlalchemy as sa
import geoalchemy2


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('lot', sa.Column('or_no', sa.String(length=10), nullable=True))
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('lot', 'or_no')
    ### end Alembic commands ###
