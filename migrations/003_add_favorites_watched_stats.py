"""Add favorites_count and watched_count to movie_stats table

Revision ID: 003
Revises: 002
Create Date: 2025-01-23 12:15:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '003'
down_revision = '002'
branch_labels = None
depends_on = None

def upgrade():
    # Add favorites_count and watched_count columns to movie_stats table
    op.add_column('movie_stats', sa.Column('favorites_count', sa.Integer(), nullable=False, server_default='0'))
    op.add_column('movie_stats', sa.Column('watched_count', sa.Integer(), nullable=False, server_default='0'))

def downgrade():
    # Remove favorites_count and watched_count columns from movie_stats table
    op.drop_column('movie_stats', 'favorites_count')
    op.drop_column('movie_stats', 'watched_count')
