"""Add user_movies association table

Revision ID: 002
Revises: 001
Create Date: 2025-11-23 12:10:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '002'
down_revision = '001'
branch_labels = None
depends_on = None

def upgrade():
    # Create user_movies association table
    op.create_table(
        'user_movies',
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('movie_id', sa.Integer(), nullable=False),
        sa.Column('added_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['user.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['movie_id'], ['movie.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('user_id', 'movie_id')
    )
    # Create index for faster lookups
    op.create_index('idx_user_movies_user', 'user_movies', ['user_id'], unique=False)
    op.create_index('idx_user_movies_movie', 'user_movies', ['movie_id'], unique=False)

def downgrade():
    op.drop_table('user_movies')
