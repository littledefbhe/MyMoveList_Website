from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify
from flask_login import login_required, current_user, login_user, logout_user
from urllib.parse import urlparse as url_parse
from .models import db, User, Movie, Genre, MovieStats
from .forms import LoginForm, RegistrationForm
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
    
    # Check if movie is in user's watchlist (only for authenticated users)
    in_watchlist = current_user.is_in_watchlist(movie) if current_user.is_authenticated else False
    
    # Get similar movies (movies that share at least one genre, excluding the current movie)
    similar_movies = []
    if movie.genres:
        # Get the first 3 genre IDs for this movie
        genre_ids = [genre.id for genre in movie.genres][:3]
        
        # Find other movies that share these genres
        similar_movies = Movie.query\
            .join(Movie.genres)\
            .filter(
                Movie.id != movie_id,
                Genre.id.in_(genre_ids)
            )\
            .options(joinedload(Movie.stats))\
            .distinct()\
            .order_by(Movie.rating.desc())\
            .limit(4)\
            .all()
    
    # If we don't have enough similar movies, get some random popular movies
    if len(similar_movies) < 4:
        # Get additional random popular movies to fill the gap
        additional_count = 4 - len(similar_movies)
        additional_movies = Movie.query\
            .options(joinedload(Movie.stats))\
            .filter(Movie.id != movie_id)\
            .order_by(db.func.random())\
            .limit(additional_count)\
            .all()
        
        # Add to similar movies, avoiding duplicates
        existing_ids = {m.id for m in similar_movies}
        for m in additional_movies:
            if m.id not in existing_ids:
                similar_movies.append(m)
                existing_ids.add(m.id)
                if len(similar_movies) >= 4:
                    break
    
    return render_template(
        'movie_detail.html',
        movie=movie,
        similar_movies=similar_movies,
        in_watchlist=in_watchlist,
        title=f"{movie.title} ({movie.release_year})" if movie.release_year else movie.title
    )

@bp.route('/signin', methods=['GET', 'POST'])
def signin():
    if current_user.is_authenticated:
        return redirect(url_for('pages.home'))
        
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and user.check_password(form.password.data):
            login_user(user, remember=form.remember_me.data)
            next_page = request.args.get('next')
            return redirect(next_page or url_for('pages.home'))
        flash('Invalid email or password', 'danger')
    return render_template('auth/signin.html', title='Sign In', form=form)

@bp.route('/signup', methods=['GET', 'POST'])
def signup():
    if current_user.is_authenticated:
        return redirect(url_for('pages.home'))
        
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(
            username=form.username.data,
            email=form.email.data
        )
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('Congratulations, you are now registered!', 'success')
        return redirect(url_for('pages.signin'))
    return render_template('auth/signup.html', title='Sign Up', form=form)

@bp.route('/signout')
@login_required
def signout():
    logout_user()
    return redirect(url_for('pages.home'))

@bp.route('/top-movies')
def top_movies():
    # Get top 50 movies by rating, ordered highest to lowest
    top_movies = Movie.query\
        .options(joinedload(Movie.stats))\
        .filter(Movie.rating.isnot(None))\
        .order_by(Movie.rating.desc())\
        .limit(50)\
        .all()
    
    # Add watchlist status for each movie (only for authenticated users)
    for movie in top_movies:
        movie.in_watchlist = current_user.is_in_watchlist(movie) if current_user.is_authenticated else False
    
    return render_template(
        'top_movies.html',
        movies=top_movies,
        title='Top Movies by IMDB Rating'
    )

@bp.route('/my-library')
@login_required
def my_library():
    # Get all movies in the user's watchlist, ordered by title
    watchlist_movies = current_user.watchlist\
        .options(joinedload(Movie.stats))\
        .order_by(Movie.title)\
        .all()
    
    # Get watched and favorited movies
    watched_movies = current_user.watched_movies\
        .options(joinedload(Movie.stats))\
        .order_by(Movie.title)\
        .all()
    
    favorite_movies = current_user.favorite_movies\
        .options(joinedload(Movie.stats))\
        .order_by(Movie.title)\
        .all()
    
    # Combine all movies and remove duplicates
    all_movies = {}
    for movie in watchlist_movies + watched_movies + favorite_movies:
        all_movies[movie.id] = movie
    all_movies = list(all_movies.values())
    all_movies.sort(key=lambda x: x.title)
    
    return render_template(
        'library.html',
        all_movies=all_movies,
        watchlist_movies=watchlist_movies,
        watched_movies=watched_movies,
        favorite_movies=favorite_movies,
        title='My Library',
        total_movies=len(all_movies),
        watchlist_count=len(watchlist_movies),
        watched_count=len(watched_movies),
        favorites_count=len(favorite_movies)
    )

@bp.route('/api/watchlist/toggle', methods=['POST'])
@login_required
def toggle_watchlist():
    try:
        data = request.get_json()
        movie_id = data.get('movie_id')
        
        if not movie_id:
            return jsonify({'error': 'Movie ID is required'}), 400
            
        movie = Movie.query.get(movie_id)
        if not movie:
            return jsonify({'error': 'Movie not found'}), 404
            
        # Toggle watchlist status
        in_watchlist = current_user.is_in_watchlist(movie)
        
        if in_watchlist:
            current_user.remove_from_watchlist(movie)
            status = 'removed from'
            button_text = 'Add to Watchlist'
        else:
            current_user.add_to_watchlist(movie)
            status = 'added to'
            button_text = 'Remove from Watchlist'
        
        db.session.commit()
        
        # Get updated watchlist count for the movie
        watchlist_count = movie.stats.watchlist_count if movie.stats and hasattr(movie.stats, 'watchlist_count') else 0
        
        return jsonify({
            'status': status,
            'button_text': button_text,
            'watchlist_count': watchlist_count,
            'movie_id': movie_id
        })
        
    except Exception as e:
        print(f"Error toggling watchlist: {str(e)}")
        return jsonify({'error': 'An error occurred while updating your watchlist'}), 500


@bp.route('/api/favorites/toggle', methods=['POST'])
@login_required
def toggle_favorite():
    try:
        data = request.get_json()
        movie_id = data.get('movie_id')
        
        if not movie_id:
            return jsonify({'error': 'Movie ID is required'}), 400
            
        movie = Movie.query.get(movie_id)
        if not movie:
            return jsonify({'error': 'Movie not found'}), 404
            
        # Toggle favorite status
        is_favorite = current_user.is_favorite(movie)
        
        if is_favorite:
            current_user.remove_from_favorites(movie)
            status = 'removed from'
            button_text = 'Add to Favorites'
        else:
            current_user.add_to_favorites(movie)
            status = 'added to'
            button_text = 'Remove from Favorites'
        
        db.session.commit()
        
        # Get updated favorites count for the movie
        favorites_count = movie.stats.favorites_count if movie.stats and hasattr(movie.stats, 'favorites_count') else 0
        
        return jsonify({
            'status': status,
            'button_text': button_text,
            'favorites_count': favorites_count,
            'movie_id': movie_id
        })
        
    except Exception as e:
        print(f"Error toggling favorite: {str(e)}")
        return jsonify({'error': 'An error occurred while updating your favorites'}), 500


@bp.route('/api/user/movie-statuses')
@login_required
def get_user_movie_statuses():
    """Get the current user's watchlist, favorites, and watched movie IDs"""
    try:
        watchlist_ids = [movie.id for movie in current_user.watchlist.all()]
        favorite_ids = [movie.id for movie in current_user.favorite_movies.all()]
        watched_ids = [movie.id for movie in current_user.watched_movies.all()]
        
        return jsonify({
            'success': True,
            'watchlist': watchlist_ids,
            'favorites': favorite_ids,
            'watched': watched_ids
        })
    except Exception as e:
        print(f"Error getting user movie statuses: {str(e)}")
        return jsonify({'success': False, 'error': 'Failed to get user movie statuses'}), 500

@bp.route('/api/movie/remove', methods=['POST'])
@login_required
def remove_movie():
    try:
        data = request.get_json()
        movie_id = data.get('movie_id')
        
        if not movie_id:
            return jsonify({'error': 'Movie ID is required'}), 400
            
        movie = Movie.query.get(movie_id)
        if not movie:
            return jsonify({'error': 'Movie not found'}), 404
            
        # Remove from all lists
        removed = False
        if current_user.is_in_watchlist(movie):
            current_user.remove_from_watchlist(movie)
            removed = True
            
        if current_user.is_favorite(movie):
            current_user.favorite_movies.remove(movie)
            removed = True
            
        if current_user.has_watched(movie):
            current_user.watched_movies.remove(movie)
            removed = True
            
        if removed:
            db.session.commit()
            return jsonify({
                'success': True,
                'message': 'Movie removed from your library'
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Movie not found in any of your lists'
            }), 404
            
    except Exception as e:
        print(f"Error removing movie: {str(e)}")
        return jsonify({'error': 'An error occurred while removing the movie'}), 500


@bp.route('/api/watched/toggle', methods=['POST'])
@login_required
def toggle_watched():
    try:
        data = request.get_json()
        movie_id = data.get('movie_id')
        
        if not movie_id:
            return jsonify({'error': 'Movie ID is required'}), 400
            
        movie = Movie.query.get(movie_id)
        if not movie:
            return jsonify({'error': 'Movie not found'}), 404
            
        # Toggle watched status
        has_watched = current_user.has_watched(movie)
        
        if has_watched:
            current_user.unmark_as_watched(movie)
            status = 'marked as not watched'
            button_text = 'Mark as Watched'
        else:
            current_user.mark_as_watched(movie)
            status = 'marked as watched'
            button_text = 'Watched'
        
        db.session.commit()
        
        # Get updated watched count for the movie
        watched_count = movie.stats.watched_count if movie.stats and hasattr(movie.stats, 'watched_count') else 0
        
        return jsonify({
            'status': status,
            'button_text': button_text,
            'watched_count': watched_count,
            'movie_id': movie_id,
            'is_watched': not has_watched  # Return the new state
        })
        
    except Exception as e:
        print(f"Error toggling watched status: {str(e)}")
        return jsonify({'error': 'An error occurred while updating watched status'}), 500

@bp.route('/profile')
@login_required
def profile():
    # Get user's movie stats
    stats = {
        'watchlist_count': current_user.watchlist.count(),
        'watched_count': current_user.watched_movies.count(),
        'favorites_count': current_user.favorite_movies.count()
    }
    
    # Get recently added movies (last 6)
    recent_movies = current_user.watchlist.union(
        current_user.watched_movies,
        current_user.favorite_movies
    ).order_by(Movie.created_at.desc()).limit(6).all()
    
    return render_template(
        'profile.html',
        stats=stats,
        recent_movies=recent_movies
    )

@bp.route('/community')
def community():
    """Community page showing user interactions and activity"""
    return render_template('community.html')
