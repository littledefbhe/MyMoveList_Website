from flask import Blueprint, render_template, request, redirect, url_for
from .models import db, Movie, Genre, MovieStats
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

@bp.route('/search', methods=['GET'])
def search():
    try:
        query = request.args.get('q', '').strip()
        
        if not query:
            return redirect(url_for('pages.home'))
        
        # Search for movies by title (case-insensitive) and handle potential errors
        try:
            movies = Movie.query.options(
                joinedload(Movie.genres),
                joinedload(Movie.stats)
            ).filter(
                Movie.title.ilike(f'%{query}%')
            ).order_by(Movie.rating.desc()).all()
            
            return render_template("index.html", 
                                movies=movies, 
                                search_query=query,
                                search_results_count=len(movies))
                                
        except Exception as e:
            print(f"Search error: {str(e)}")
            # Return empty results on error
            return render_template("index.html",
                                movies=[],
                                search_query=query,
                                search_results_count=0,
                                error="An error occurred during search.")
    except Exception as e:
        print(f"Unexpected error in search route: {str(e)}")
        return redirect(url_for('pages.home'))
