"""empty message

Revision ID: 6ce1f07961be
Revises: 3a7b12151a5f
Create Date: 2020-05-15 23:20:15.194996

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '6ce1f07961be'
down_revision = '3a7b12151a5f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('imageannotation')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('imageannotation',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('img_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('created_user', sa.TEXT(), autoincrement=False, nullable=True),
    sa.Column('label', sa.TEXT(), autoincrement=False, nullable=True),
    sa.Column('x', postgresql.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True),
    sa.Column('y', postgresql.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True),
    sa.Column('w', postgresql.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True),
    sa.Column('h', postgresql.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True),
    sa.Column('created_time', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.Column('modified_time', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id', name='imageannotation_pkey')
    )
    # ### end Alembic commands ###