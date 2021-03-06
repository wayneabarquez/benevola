"""empty message

Revision ID: 11d1df1a1979
Revises: 7905224ce74
Create Date: 2016-05-30 17:39:24.762314

"""

# revision identifiers, used by Alembic.
revision = '11d1df1a1979'
down_revision = '7905224ce74'

from alembic import op
import sqlalchemy as sa
import geoalchemy2


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('deceased_occupancy', 'ref_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.alter_column('deceased_occupancy', 'ref_table',
               existing_type=sa.VARCHAR(length=20),
               nullable=False)
    op.create_index(op.f('ix_deceased_occupancy_ref_id'), 'deceased_occupancy', ['ref_id'], unique=False)
    op.create_index(op.f('ix_deceased_occupancy_ref_table'), 'deceased_occupancy', ['ref_table'], unique=False)
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_deceased_occupancy_ref_table'), table_name='deceased_occupancy')
    op.drop_index(op.f('ix_deceased_occupancy_ref_id'), table_name='deceased_occupancy')
    op.alter_column('deceased_occupancy', 'ref_table',
               existing_type=sa.VARCHAR(length=20),
               nullable=True)
    op.alter_column('deceased_occupancy', 'ref_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    ### end Alembic commands ###
