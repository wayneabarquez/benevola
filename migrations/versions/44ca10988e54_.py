"""empty message

Revision ID: 44ca10988e54
Revises: 3bcb58bde0c9
Create Date: 2016-03-08 22:44:16.217096

"""

# revision identifiers, used by Alembic.
revision = '44ca10988e54'
down_revision = '3bcb58bde0c9'

from alembic import op
import sqlalchemy as sa
import geoalchemy2


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('settings',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('date_created', sa.DateTime(), nullable=True),
    sa.Column('date_modified', sa.DateTime(), nullable=True),
    sa.Column('lot_price_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['lot_price_id'], ['lot_price.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('settings')
    ### end Alembic commands ###
