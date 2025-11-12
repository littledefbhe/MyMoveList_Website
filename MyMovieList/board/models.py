from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

# Association table for many-to-many relationship between movies and genres
movie_genres = db.Table('movie_genres',
    db.Column('movie_id', db.Integer, db.ForeignKey('movies.id'), primary_key=True),
    db.Column('genre_id', db.Integer, db.ForeignKey('genres.id'), primary_key=True)
)

class Movie(db.Model):
    __tablename__ = 'movies'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    release_year = db.Column(db.Integer, nullable=False)
    rating = db.Column(db.Float)
    certification = db.Column(db.String(10))
    runtime_minutes = db.Column(db.Integer)
    poster_url = db.Column(db.String(500))
    overview = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    genres = db.relationship('Genre', secondary=movie_genres, lazy='subquery',
                           backref=db.backref('movies', lazy=True))
    stats = db.relationship('MovieStats', backref='movie', uselist=False, lazy=True)
    
    def __repr__(self):
        return f'<Movie {self.title} ({self.release_year})>'

class Genre(db.Model):
    __tablename__ = 'genres'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    
    def __repr__(self):
        return f'<Genre {self.name}>'

class MovieStats(db.Model):
    __tablename__ = 'movie_stats'
    
    movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'), primary_key=True)
    ratings_count = db.Column(db.Integer, default=0)
    reviews_count = db.Column(db.Integer, default=0)
    watchlist_count = db.Column(db.Integer, default=0)
    
    def __repr__(self):
        return f'<MovieStats for movie {self.movie_id}>'
