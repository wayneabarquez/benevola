"""empty message

Revision ID: 236a25eaea73
Revises: eb6a53c023a
Create Date: 2016-04-26 01:23:25.518156

"""

# revision identifiers, used by Alembic.
revision = '236a25eaea73'
down_revision = 'eb6a53c023a'

from alembic import op
import sqlalchemy as sa
import geoalchemy2


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('role',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('date_created', sa.DateTime(), nullable=True),
    sa.Column('date_modified', sa.DateTime(), nullable=True),
    sa.Column('name', sa.String(length=10), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('date_created', sa.DateTime(), nullable=True),
    sa.Column('date_modified', sa.DateTime(), nullable=True),
    sa.Column('username', sa.String(length=50), nullable=False),
    sa.Column('password_hash', sa.String(), nullable=False),
    sa.Column('role_id', sa.Integer(), nullable=True),
    sa.Column('account_status', sa.Integer(), nullable=True),
    sa.Column('last_login_datetime', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['role_id'], ['role.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('user')
    op.drop_table('role')
    ### end Alembic commands ###