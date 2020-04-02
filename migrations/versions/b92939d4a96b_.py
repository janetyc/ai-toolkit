"""empty message

Revision ID: b92939d4a96b
Revises: 
Create Date: 2020-04-02 15:00:07.020344

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'b92939d4a96b'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('dataset')
    op.add_column('image', sa.Column('image_key', sa.Text(), nullable=True))
    op.add_column('image', sa.Column('project_id', sa.Integer(), nullable=True))
    op.drop_column('image', 'dataset_id')
    op.add_column('project', sa.Column('image_list', postgresql.JSON(astext_type=sa.Text()), nullable=True))
    op.drop_column('project', 'datasets')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('project', sa.Column('datasets', postgresql.JSON(astext_type=sa.Text()), autoincrement=False, nullable=True))
    op.drop_column('project', 'image_list')
    op.add_column('image', sa.Column('dataset_id', sa.INTEGER(), autoincrement=False, nullable=True))
    op.drop_column('image', 'project_id')
    op.drop_column('image', 'image_key')
    op.create_table('dataset',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('project_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('db_type', sa.TEXT(), autoincrement=False, nullable=True),
    sa.Column('dataset_ids', postgresql.JSON(astext_type=sa.Text()), autoincrement=False, nullable=True),
    sa.Column('created_time', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id', name='dataset_pkey')
    )
    # ### end Alembic commands ###
