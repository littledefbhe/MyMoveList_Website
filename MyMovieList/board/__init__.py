import os
from flask import Flask
from .models import db
from board import pages  # Import the pages blueprint

def create_app():
    """Application factory function that creates and configures the Flask app"""
    # Create the Flask application instance
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY') or 'your-secret-key-here'
    
    # Database configuration
    basedir = os.path.abspath(os.path.dirname(__file__))
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'movies.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize extensions
    db.init_app(app)
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    # Register the pages blueprint with the application
    app.register_blueprint(pages.bp)
    
    # Custom Jinja filter for formatting numbers
    @app.template_filter('format_number')
    def format_number(value):
        if not value:
            return '0'
        value = int(value)
        if value >= 1000000:
            return f'{value/1000000:.1f}M'.replace('.0', '')
        elif value >= 1000:
            return f'{value/1000:.1f}K'.replace('.0', '')
        return str(value)
    
    return app
