#!/usr/bin/env python3
"""
Script to manually update specific movie posters.
"""
from board import create_app, db
from board.models import Movie

def fix_specific_posters():
    """Update specific movie posters."""
    app = create_app()
    
    with app.app_context():
        # Define the correct poster URLs
        updates = [
            {
                'title': 'The Dark Knight',
                'poster_url': 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg'
            },
            {
                'title': 'The Lord of the Rings: The Return of the King',
                'poster_url': 'https://tolkiengateway.net/w/images/5/5e/The_Lord_of_the_Rings_-_The_Return_of_the_King_-_Ensemble_poster.jpg'
            },
            {
                'title': 'Parasite',
                'poster_url': 'https://m.media-amazon.com/images/M/MV5BYjk1Y2U4MjQtY2ZiNS00OWQyLWI3MmYtZWUwNmRjYWRiNWNhXkEyXkFqcGc@._V1_.jpg'
            },
            {
                'title': 'The Shawshank Redemption',
                'poster_url': 'https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_.jpg'
            },
            {
                'title': 'The Usual Suspects',
                'poster_url': 'https://m.media-amazon.com/images/M/MV5BOTE5MDUxZDUtZWZmZC00NDVmLWFhOGQtNWI2YTc4NzY3MGQ0XkEyXkFqcGc@._V1_.jpg'
            },
            {
                'title': 'Up',
                'poster_url': 'https://m.media-amazon.com/images/M/MV5BNmI1ZTc5MWMtMDYyOS00ZDc2LTkzOTAtNjQ4NWIxNjYyNDgzXkEyXkFqcGc@._V1_.jpg'
            },
            {
                'title': 'Gone Girl',
                'poster_url': 'https://m.media-amazon.com/images/M/MV5BMTk0MDQ3MzAzOV5BMl5BanBnXkFtZTgwNzU1NzE3MjE@._V1_.jpg'
            },
            {
                'title': 'The Imitation Game',
                'poster_url': 'https://m.media-amazon.com/images/M/MV5BNjI3NjY1Mjg3MV5BMl5BanBnXkFtZTgwMzk5MDQ3MjE@._V1_FMjpg_UX1000_.jpg'
            },
            {
                'title': 'The Social Network',
                'poster_url': 'https://m.media-amazon.com/images/M/MV5BMjlkNTE5ZTUtNGEwNy00MGVhLThmZjMtZjU1NDE5Zjk1NDZkXkEyXkFqcGc@._V1_.jpg'
            }
        ]
        
        for movie_data in updates:
            movie = Movie.query.filter_by(title=movie_data['title']).first()
            if movie:
                print(f"Updating {movie.title}")
                print(f"Old URL: {movie.poster_url}")
                print(f"New URL: {movie_data['poster_url']}")
                movie.poster_url = movie_data['poster_url']
                db.session.commit()
            else:
                print(f"Movie not found: {movie_data['title']}")

if __name__ == "__main__":
    print("Fixing specific movie posters...")
    fix_specific_posters()
    print("\nDone!")