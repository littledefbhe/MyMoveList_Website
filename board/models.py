from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

# Association table for user watchlist
watchlist = db.Table('watchlist',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('movie_id', db.Integer, db.ForeignKey('movies.id'), primary_key=True)
)

# Association table for many-to-many relationship between movies and genres
movie_genres = db.Table('movie_genres',
    db.Column('movie_id', db.Integer, db.ForeignKey('movies.id'), primary_key=True),
    db.Column('genre_id', db.Integer, db.ForeignKey('genres.id'), primary_key=True)
)


class User(UserMixin, db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    watchlist = db.relationship(
        'Movie',
        secondary=watchlist,
        lazy='dynamic',
        backref=db.backref('watchers', lazy='dynamic')
    )
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def add_to_watchlist(self, movie):
        """Add a movie to the user's watchlist if not already present."""
        if not self.is_in_watchlist(movie):
            self.watchlist.append(movie)
            if movie.stats:
                movie.stats.watchlist_count += 1
            db.session.commit()
            return True
        return False
        
    def remove_from_watchlist(self, movie):
        """Remove a movie from the user's watchlist if present."""
        if self.is_in_watchlist(movie):
            self.watchlist.remove(movie)
            if movie.stats and movie.stats.watchlist_count > 0:
                movie.stats.watchlist_count -= 1
            db.session.commit()
            return True
        return False
        
    def is_in_watchlist(self, movie):
        """Check if a movie is in the user's watchlist."""
        return self.watchlist.filter(watchlist.c.movie_id == movie.id).count() > 0
        
    def __repr__(self):
        return f'<User {self.username}>'


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
