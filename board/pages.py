from flask import Blueprint, render_template, request, redirect, url_for, abort
from .models import db, Movie, Genre, MovieStats
from sqlalchemy import or_
from sqlalchemy.orm import joinedload

# Create a blueprint named "pages"
bp = Blueprint("pages", __name__)

# Define routes using the blueprint
@bp.route("/")
def home():
    # Get all genres that have movies
    genres = Genre.query.join(Genre.movies).group_by(Genre.id).order_by(Genre.name).all()
    
    # Create a dictionary to hold movies by genre
    movies_by_genre = {}
    
    # For each genre, get top 5 movies
    for genre in genres:
        movies = Movie.query\
            .join(Movie.genres)\
            .filter(Genre.id == genre.id)\
            .options(joinedload(Movie.stats))\
            .order_by(Movie.rating.desc())\
            .limit(5)\
            .all()
            
        if movies:  # Only add genres that have movies
            movies_by_genre[genre] = movies
    
    return render_template("index.html", movies_by_genre=movies_by_genre)

@bp.route('/genre/<int:genre_id>')
def genre_movies(genre_id):
    # Get the genre by ID or return 404 if not found
    genre = Genre.query.get_or_404(genre_id)
    
    # Get all movies in this genre, ordered by rating (highest first)
    movies = Movie.query\
        .join(Movie.genres)\
        .filter(Genre.id == genre_id)\
        .options(joinedload(Movie.stats))\
        .order_by(Movie.rating.desc())\
        .all()
    
    return render_template(
        'genre_movies.html',
        genre=genre,
        movies=movies,
        title=f"{genre.name} Movies"
    )

@bp.route('/search', methods=['GET'])
def search():
    query = request.args.get('q', '').strip()
    
    if not query:
        return redirect(url_for('pages.home'))
    
    # Search for movies where the title contains the search query
    movies = Movie.query.filter(
        Movie.title.ilike(f'%{query}%')
    ).order_by(Movie.rating.desc()).all()
    
    return render_template(
        'search_results.html',
        query=query,
        movies=movies,
        title=f'Search: {query}'
    )

@bp.route('/movie/<int:movie_id>')
def movie_detail(movie_id):
    # Get the movie by ID or return 404 if not found
    movie = Movie.query.options(
        joinedload(Movie.genres),
        joinedload(Movie.stats)
    ).get_or_404(movie_id)
    
    return render_template(
        'movie_detail.html',
        movie=movie,
        title=movie.title
    )

@bp.route('/top-movies')
def top_movies():
    # Get all movies with their stats, ordered by rating (highest first)
    movies = Movie.query\
        .options(joinedload(Movie.stats), joinedload(Movie.genres))\
        .order_by(Movie.rating.desc())\
        .all()
    
    return render_template(
        'top_movies.html',
        movies=movies,
        title='Top Movies by IMDB Rating'
    )
