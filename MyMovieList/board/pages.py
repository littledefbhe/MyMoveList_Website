from flask import Blueprint, render_template, request, redirect, url_for
from .models import db, Movie, Genre, MovieStats
from sqlalchemy.orm import joinedload

# Create a blueprint named "pages"
bp = Blueprint("pages", __name__)

# Define routes using the blueprint
@bp.route("/")
def home():
    # Get top 10 movies ordered by rating with their genres and stats
    movies = Movie.query.options(
        joinedload(Movie.genres),
        joinedload(Movie.stats)
    ).order_by(Movie.rating.desc()).limit(10).all()
    
    return render_template("index.html", movies=movies)

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
