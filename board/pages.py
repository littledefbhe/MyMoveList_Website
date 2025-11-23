from flask import Blueprint, render_template, request, redirect, url_for, abort, flash
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import check_password_hash, generate_password_hash
from .models import db, Movie, Genre, MovieStats, User
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
    
    return render_template(
        'movie_detail.html',
        movie=movie,
        title=movie.title
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
