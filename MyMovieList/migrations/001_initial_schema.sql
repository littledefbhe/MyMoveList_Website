-- Create tables
CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    release_year INTEGER NOT NULL,
    rating REAL,
    certification TEXT,
    runtime_minutes INTEGER,
    poster_url TEXT,
    overview TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS genres (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS movie_genres (
    movie_id INTEGER,
    genre_id INTEGER,
    PRIMARY KEY (movie_id, genre_id),
    FOREIGN KEY (movie_id) REFERENCES movies(id),
    FOREIGN KEY (genre_id) REFERENCES genres(id)
);

CREATE TABLE IF NOT EXISTS movie_stats (
    movie_id INTEGER PRIMARY KEY,
    ratings_count INTEGER DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    watchlist_count INTEGER DEFAULT 0,
    FOREIGN KEY (movie_id) REFERENCES movies(id)
);

-- Insert genres
INSERT OR IGNORE INTO genres (name) VALUES 
    ('Drama'),
    ('Crime'),
    ('Action'),
    ('Thriller'),
    ('Comedy');

-- Insert movies
INSERT INTO movies (title, release_year, rating, certification, runtime_minutes, poster_url, overview) VALUES
('The Shawshank Redemption', 1994, 9.3, 'R', 142, 'https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_.jpg', 'Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden. During his long stretch in prison, Dufresne comes to be admired by the other inmates -- including an older prisoner named Red -- for his integrity and unquenchable sense of hope.'),
('The Godfather', 1972, 9.2, 'R', 175, 'https://m.media-amazon.com/images/M/MV5BNGEwYjgwOGQtYjg5ZS00Njc1LTk2ZGEtM2QwZWQ2NjdhZTE5XkEyXkFqcGc@._V1_.jpg', 'Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers, launching a campaign of bloody revenge.'),
('The Dark Knight', 2008, 9.0, 'PG-13', 152, 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_FMjpg_UX1000_.jpg', 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but the trio soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.'),
('The Godfather Part II', 1974, 9.0, 'R', 202, 'https://m.media-amazon.com/images/M/MV5BMDIxMzBlZDktZjMxNy00ZGI4LTgxNDEtYWRlNzRjMjJmOGQ1XkEyXkFqcGc@._V1_.jpg', 'In the continuing saga of the Corleone crime family, a young Vito Corleone grows up in Sicily and in 1910s New York. In the 1950s, Michael Corleone attempts to expand the family business into Las Vegas, Hollywood and Cuba while dealing with his personal life as the new Don of the family.'),
('Pulp Fiction', 1994, 8.9, 'R', 154, 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg', 'A burger-loving hit man, his philosophical partner, a drug-addled gangster''s moll and a washed-up boxer converge in this sprawling, comedic crime caper. Their adventures unfurl in three stories that ingeniously trip back and forth in time.'),
('The Lord of the Rings: The Return of the King', 2003, 8.9, 'PG-13', 201, 'https://tolkiengateway.net/w/images/5/5e/The_Lord_of_the_Rings_-_The_Return_of_the_King_-_Ensemble_poster.jpg', 'Aragorn is revealed as the heir to the ancient kings as he, Gandalf and the other members of the broken fellowship struggle to save Gondor from Sauron''s forces. Meanwhile, Frodo and Sam take the ring closer to the heart of Mordor, the dark lord''s realm.'),
('Inception', 2010, 8.8, 'PG-13', 148, 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg', 'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: "inception", the implantation of another person''s idea into a target''s subconscious.'),
('The Matrix', 1999, 8.7, 'R', 136, 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg', 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.'),
('Parasite', 2019, 8.6, 'R', 132, 'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZmU0M2YyNmNmOWUwXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_FMjpg_UX1000_.jpg', 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.'),
('Interstellar', 2014, 8.6, 'PG-13', 169, 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity''s survival.'),
('The Silence of the Lambs', 1991, 8.6, 'R', 118, 'https://m.media-amazon.com/images/M/MV5BNjNhZTk0ZmEtNjJhMi00YzFlLWE1MmEtYzM1M2ZmMGMwMTU4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg', 'A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer, a madman who skins his victims.'),
('The Green Mile', 1999, 8.6, 'R', 189, 'https://m.media-amazon.com/images/M/MV5BMTUxMzQyNjA5MF5BMl5BanBnXkFtZTYwOTU2NTY3._V1_.jpg', 'The lives of guards on Death Row are affected by one of their charges: a black man accused of child murder and rape, yet who has a mysterious gift.');

-- Insert movie stats
INSERT INTO movie_stats (movie_id, ratings_count, reviews_count, watchlist_count) VALUES
(1, 2700000, 8200, 1900000),
(2, 2100000, 6500, 1500000),
(3, 2900000, 5600, 2100000),
(4, 1400000, 3900, 1100000),
(5, 2200000, 7500, 1800000),  -- Pulp Fiction
(6, 2000000, 6800, 1900000),  -- LOTR: Return of the King
(7, 2500000, 7200, 2200000),  -- Inception
(8, 2100000, 6400, 2000000),  -- The Matrix
(9, 1800000, 5900, 1600000),  -- Parasite
(10, 2000000, 6300, 1900000),  -- Interstellar
(11, 1700000, 5500, 1500000),  -- The Silence of the Lambs
(12, 1900000, 5800, 1700000);  -- The Green Mile

-- Insert movie-genre relationships
-- The Shawshank Redemption (Drama, Crime)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (1, 1), (1, 2);
-- The Godfather (Drama, Crime)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (2, 1), (2, 2);
-- The Dark Knight (Action, Crime, Drama)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (3, 2), (3, 3), (3, 1);
-- The Godfather Part II (Drama, Crime)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (4, 1), (4, 2);
-- Pulp Fiction (Crime, Drama)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (5, 2), (5, 1);
-- LOTR: Return of the King (Adventure, Fantasy, Action)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (6, 3), (6, 7), (6, 6);
-- Inception (Action, Adventure, Sci-Fi)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (7, 3), (7, 6), (7, 7);
-- The Matrix (Action, Sci-Fi)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (8, 3), (8, 7);
-- Parasite (Drama, Thriller)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (9, 1), (9, 4);
-- Interstellar (Adventure, Drama, Sci-Fi)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (10, 6), (10, 1), (10, 7);
-- The Silence of the Lambs (Crime, Drama, Thriller)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (11, 2), (11, 1), (11, 4);
-- The Green Mile (Crime, Drama, Fantasy)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (12, 2), (12, 1), (12, 7);

-- Create a view for easy movie data retrieval
CREATE VIEW IF NOT EXISTS movie_details AS
SELECT 
    m.id,
    m.title,
    m.release_year,
    m.rating,
    m.certification,
    m.runtime_minutes,
    m.poster_url,
    m.overview,
    ms.ratings_count,
    ms.reviews_count,
    ms.watchlist_count,
    GROUP_CONCAT(g.name, ', ') AS genres
FROM 
    movies m
JOIN 
    movie_stats ms ON m.id = ms.movie_id
LEFT JOIN 
    movie_genres mg ON m.id = mg.movie_id
LEFT JOIN 
    genres g ON mg.genre_id = g.id
GROUP BY 
    m.id;
