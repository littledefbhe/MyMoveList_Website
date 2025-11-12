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
    ('Comedy'),
    ('War'),
    ('Mystery'),
    ('Biography'),
    ('Romance'),
    ('Adventure'),
    ('Sci-Fi'),
    ('Animation'),
    ('Family'),
    ('Western'),
    ('History');

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
('The Green Mile', 1999, 8.6, 'R', 189, 'https://m.media-amazon.com/images/M/MV5BMTUxMzQyNjA5MF5BMl5BanBnXkFtZTYwOTU2NTY3._V1_.jpg', 'The lives of guards on Death Row are affected by one of their charges: a black man accused of child murder and rape, yet who has a mysterious gift.'),
('Saving Private Ryan', 1998, 8.6, 'R', 169, 'https://m.media-amazon.com/images/M/MV5BZjhkMDM4MWItZTVjOC00ZDRhLThmYTAtM2I5NzBmNmNlMzI1XkEyXkFqcGdeQXVyNDYyMDk5MTU@._V1_.jpg', 'During WWII, a squad of U.S. soldiers embarks on a perilous mission to find and bring home a missing paratrooper.'),
('Good Will Hunting', 1997, 8.3, 'R', 126, 'https://m.media-amazon.com/images/M/MV5BOTI0MzcxMTYtZDVkMy00NjY1LTgyMTYtZmUxN2M3NmQ2NWJhXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg', 'A janitor at MIT with a genius IQ must face his emotional demons when a therapist helps him uncover his true potential.'),
('Gladiator', 2000, 8.5, 'R', 155, 'https://m.media-amazon.com/images/M/MV5BMDliMmNhNDEtODUyOS00MjNlLTgxODEtN2U3NzIxMGVkZTA1L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg', 'A betrayed Roman general seeks vengeance against the corrupt emperor who murdered his family and stole his honor.'),
('The Prestige', 2006, 8.5, 'PG-13', 130, 'https://m.media-amazon.com/images/M/MV5BMjA4NDI0MTIxNF5BMl5BanBnXkFtZTYwNTM0MzY2._V1_.jpg', 'Two rival magicians engage in a deadly feud fueled by obsession, deceit, and the pursuit of the ultimate illusion.'),
('The Departed', 2006, 8.5, 'R', 151, 'https://m.media-amazon.com/images/M/MV5BMTI1MTY2OTIxNV5BMl5BanBnXkFtZTYwNjQ4NjY3._V1_.jpg', 'An undercover cop and a mole within the police infiltrate each other''s organizations in a deadly game of deception.'),
('The Social Network', 2010, 7.8, 'PG-13', 120, 'https://m.media-amazon.com/images/M/MV5BOGUyZDUxZjEtMmIzMC00MzlmLTg4MGItZWJmMzBhZjE5JzJjXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg', 'The rise of Facebook leads to betrayal and legal battles as its founder faces the personal cost of ambition.'),
('Titanic', 1997, 7.8, 'PG-13', 195, 'https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_.jpg', 'A young couple from different social classes fall in love aboard the doomed RMS Titanic.'),
('The Wolf of Wall Street', 2013, 8.2, 'R', 180, 'https://m.media-amazon.com/images/M/MV5BMjIxMjgxNTk0MF5BMl5BanBnXkFtZTgwNjIyOTg2MDE@._V1_.jpg', 'Based on a true story, a stockbroker rises to immense wealth through corruption and fraud before his empire crumbles.'),
('The Revenant', 2015, 8.0, 'R', 156, 'https://m.media-amazon.com/images/M/MV5BMDE5OWMzM2QtOTU2ZS00NzAyLWI2MDEtOTRlYjIxZGM0OWRjXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_.jpg', 'After being left for dead, a frontiersman battles the wilderness and seeks vengeance against those who betrayed him.'),
('1917', 2019, 8.2, 'R', 119, 'https://m.media-amazon.com/images/M/MV5BOTdmNTFjNDEtNzg0My00ZjkxLTg1ZDAtZTdkMDc2ZmFiNWQ1XkEyXkFqcGdeQXVyNTAzNzgwNTg@._V1_.jpg', 'Two British soldiers race against time to deliver a message that could save hundreds during World War I.'),
('Oppenheimer', 2023, 8.4, 'R', 180, 'https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_.jpg', 'Physicist J. Robert Oppenheimer grapples with guilt and power as he leads the creation of the atomic bomb.'),
('Joker', 2019, 8.4, 'R', 122, 'https://m.media-amazon.com/images/M/MV5BNGVjNWI4ZGUtNzE0MS00YTJmLWE0ZDctN2ZiYTk2YmI3NTYyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg', 'A failed comedian''s descent into madness transforms him into Gotham''s most infamous criminal mastermind.'),
('Inglourious Basterds', 2009, 8.3, 'R', 153, 'https://m.media-amazon.com/images/M/MV5BOTJiNDEzOWYtMTVjOC00ZjlmLWE0NGMtZmE1OWVmZDQ2OWJhXkEyXkFqcGdeQXVyNTIzOTk5ODM@._V1_.jpg', 'A group of Jewish soldiers plots to assassinate Nazi leaders, intertwining with a cinema owner''s personal revenge plan.'),
('Django Unchained', 2012, 8.4, 'R', 165, 'https://m.media-amazon.com/images/M/MV5BMjIyNTQ5NjQ1OV5BMl5BanBnXkFtZTcwODg1MDU4OA@@._V1_.jpg', 'A freed slave teams up with a bounty hunter to rescue his wife from a brutal plantation owner.'),
('The Truman Show', 1998, 8.2, 'PG', 103, 'https://m.media-amazon.com/images/M/MV5BMDIzODcyY2EtMmY2MC00ZWVlLTgwMzAtMjQwOWUyNmJjNTYyXkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_.jpg', 'A man discovers his entire life is a scripted television show broadcast to the world.'),
('Her', 2013, 8.0, 'R', 126, 'https://m.media-amazon.com/images/M/MV5BMjA1Nzk0OTM2OF5BMl5BanBnXkFtZTgwNjU2NjEwMDE@._V1_.jpg', 'A lonely writer falls in love with an intelligent operating system, blurring the line between reality and connection.'),
('The Grand Budapest Hotel', 2014, 8.1, 'R', 99, 'https://m.media-amazon.com/images/M/MV5BMzM5NjUxOTEyMl5BMl5BanBnXkFtZTgwNjEyMDM0MDE@._V1_.jpg', 'A concierge and his protégé become entangled in a murder mystery at a luxurious European hotel.'),
('The Pianist', 2002, 8.5, 'R', 150, 'https://m.media-amazon.com/images/M/MV5BOWRiZDIxZjktMTA1NC00MDQ2LWEzMjUtMTliZmY3NjQ3ODJiXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg', 'A Jewish pianist struggles to survive in Nazi-occupied Warsaw during World War II.'),
('A Beautiful Mind', 2001, 8.2, 'PG-13', 135, 'https://m.media-amazon.com/images/M/MV5BMzcwYWFkYzktZjAzNC00OGY1LWI4YTgtNzc5MzVjMDVmNjY0XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg', 'A brilliant mathematician battles schizophrenia while striving to make groundbreaking discoveries in economics.'),
('Coco', 2017, 8.4, 'PG', 105, 'https://m.media-amazon.com/images/M/MV5BYjQ5NjM0Y2YtNjZkNC00ZDhkLWJjMWItN2QyNzFkMDE3ZjAxXkEyXkFqcGdeQXVyODIxMzk5NjA@._V1_.jpg', 'A young musician accidentally enters the Land of the Dead and uncovers his family''s forgotten past.'),
('Up', 2009, 8.3, 'PG', 96, 'https://m.media-amazon.com/images/M/MV5BMTk3NDE2NzI4NF5BMl5BanBnXkFtZTgwNzE1MzEyMTE@._V1_.jpg', 'An old man ties thousands of balloons to his house and sets off on an adventure to fulfill a lifelong dream.'),
('Inside Out', 2015, 8.1, 'PG', 95, 'https://m.media-amazon.com/images/M/MV5BOTgxMDQwMDk0OF5BMl5BanBnXkFtZTgwNjU5OTg2NDE@._V1_.jpg', 'A young girl''s emotions—Joy, Sadness, Anger, Fear, and Disgust—navigate her mind as she adjusts to a new life.'),
('Spider-Man: Into the Spider-Verse', 2018, 8.4, 'PG', 117, 'https://m.media-amazon.com/images/M/MV5BMjMwNDkxMTgzOF5BMl5BanBnXkFtZTgwNTkwNTQ3NjM@._V1_.jpg', 'Teenager Miles Morales becomes Spider-Man and discovers multiple universes filled with different versions of the hero.'),
('The Lion King', 1994, 8.5, 'G', 88, 'https://m.media-amazon.com/images/M/MV5BYTYxNGMyZTYtMjE3MS00MzNjLWFjNmYtMDk3N2FmM2JiM2M1XkEyXkFqcGdeQXVyNjY5NDU4NzI@._V1_.jpg', 'A lion cub must learn to embrace his destiny after the tragic death of his father.'),
('The Intouchables', 2011, 8.5, 'R', 112, 'https://m.media-amazon.com/images/M/MV5BMTYxNDA3MDQwNl5BMl5BanBnXkFtZTcwNTU4Mzc1Nw@@._V1_.jpg', 'A wealthy quadriplegic man hires an ex-convict as his caregiver, forming an unlikely and transformative friendship.'),
('Shutter Island', 2010, 8.2, 'R', 138, 'https://m.media-amazon.com/images/M/MV5BYzhiNDkyNzktNTZmYS00ZTBkLTk2MDAtM2U0YjU1MzgxZjgzXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg', 'A U.S. Marshal investigates a psychiatric facility, uncovering shocking truths about his own reality.'),
('Gone Girl', 2014, 8.1, 'R', 149, 'https://m.media-amazon.com/images/M/MV5BMTk0MDQ3MzAzOV5BMl5BanBnXkFtZTgwNzU1NzAwMTE@._V1_.jpg', 'When a man''s wife disappears, suspicion falls on him as disturbing secrets about their marriage surface.'),
('Blade Runner 2049', 2017, 8.0, 'R', 164, 'https://m.media-amazon.com/images/M/MV5BNzA1Njg4NzYxOV5BMl5BanBnXkFtZTgwODk5NjU3MzI@._V1_.jpg', 'A young blade runner uncovers long-buried secrets that could alter the fate of humanity.'),
('The Imitation Game', 2014, 8.0, 'PG-13', 114, 'https://m.media-amazon.com/images/M/MV5BOTgwMzFiMWYtZDhlNS00ODNkLWJiODAtZDVhNzgyNzJhZjRiXkEyXkFqcGdeQXVyNzEzOTYxNTQ@._V1_.jpg', 'Mathematician Alan Turing helps crack Nazi codes during WWII while hiding his secret life as a gay man.'),
('The Pursuit of Happyness', 2006, 8.0, 'PG-13', 117, 'https://m.media-amazon.com/images/M/MV5BMTQ5NjQ0NDI3NF5BMl5BanBnXkFtZTcwNDI0MjEzMw@@._V1_.jpg', 'A struggling salesman and his young son endure hardship as he fights to build a better future.'),
('Cast Away', 2000, 7.8, 'PG-13', 143, 'https://m.media-amazon.com/images/M/MV5BN2Y5ZTU4YjctMDRmMC00MTg4LWE1M2MtMjk4MzVmOTE4YjkzXkEyXkFqcGdeQXVyNTc1NTQxODI@._V1_.jpg', 'A man stranded on a deserted island must survive alone and find the will to return home.'),
('No Country for Old Men', 2007, 8.2, 'R', 122, 'https://m.media-amazon.com/images/M/MV5BMjA5Njk3MjM4OV5BMl5BanBnXkFtZTcwMTc5MTE1MQ@@._V1_.jpg', 'A hunter''s discovery of a drug deal gone wrong leads to a violent cat-and-mouse chase across Texas.'),
('There Will Be Blood', 2007, 8.2, 'R', 158, 'https://m.media-amazon.com/images/M/MV5BMjAxODQ4MDU5NV5BMl5BanBnXkFtZTcwMDU4MjU1MQ@@._V1_.jpg', 'An ambitious oilman''s greed and ambition lead to moral corruption and personal ruin in early 20th-century America.'),
('The Usual Suspects', 1995, 8.5, 'R', 106, 'https://m.media-amazon.com/images/M/MV5BYTViNjMyNmUtNDFkNC00ZDRlLThmMDUtZDU2YWE4NGI2NzVmXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg', 'A small-time con artist recounts a convoluted story involving a mysterious criminal mastermind named Keyser Söze.');

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
(12, 1900000, 5800, 1700000),  -- The Green Mile
(13, 1400000, 4200, 1300000),  -- Saving Private Ryan
(14, 1000000, 3800, 1200000),  -- Good Will Hunting
(15, 1700000, 5100, 1600000),  -- Gladiator
(16, 1400000, 4500, 1500000),  -- The Prestige
(17, 1400000, 4600, 1500000),  -- The Departed
(18, 800000, 3200, 900000),    -- The Social Network
(19, 1200000, 4000, 1400000),  -- Titanic
(20, 1500000, 4800, 1500000),  -- The Wolf of Wall Street
(21, 1300000, 4400, 1300000),  -- The Revenant
(22, 900000, 3500, 950000),    -- 1917
(23, 1000000, 3800, 1100000),  -- Oppenheimer
(24, 1300000, 4500, 1400000),  -- Joker
(25, 1500000, 4900, 1500000),  -- Inglourious Basterds
(26, 1400000, 4700, 1500000),  -- Django Unchained
(27, 1100000, 4000, 1200000),  -- The Truman Show
(28, 1000000, 3800, 1100000),  -- Her
(29, 900000, 3500, 1000000),   -- The Grand Budapest Hotel
(30, 900000, 3600, 1000000),   -- The Pianist
(31, 1000000, 3800, 1100000),  -- A Beautiful Mind
(32, 800000, 3200, 900000),    -- Coco
(33, 1200000, 4200, 1300000),  -- Up
(34, 900000, 3500, 1000000),   -- Inside Out
(35, 1000000, 3800, 1100000),  -- Spider-Man: Into the Spider-Verse
(36, 1500000, 5000, 1600000),  -- The Lion King
(37, 900000, 3600, 1000000),   -- The Intouchables
(38, 1400000, 4600, 1500000),  -- Shutter Island
(39, 1300000, 4500, 1400000),  -- Gone Girl
(40, 1000000, 3900, 1100000),  -- Blade Runner 2049
(41, 1100000, 4000, 1200000),  -- The Imitation Game
(42, 1000000, 3800, 1100000),  -- The Pursuit of Happyness
(43, 1200000, 4200, 1300000),  -- Cast Away
(44, 1400000, 4700, 1500000),  -- No Country for Old Men
(45, 800000, 3200, 900000),    -- There Will Be Blood
(46, 1100000, 4100, 1200000);  -- The Usual Suspects

-- Insert movie-genre relationships
-- The Shawshank Redemption (Drama, Crime)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (1, 1), (1, 2);
-- The Godfather (Drama, Crime)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (2, 1), (2, 2);
-- The Dark Knight (Action, Crime, Drama)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (3, 3), (3, 2), (3, 1);
-- The Godfather Part II (Drama, Crime)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (4, 1), (4, 2);
-- Pulp Fiction (Drama, Crime)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (5, 1), (5, 2);
-- The Lord of the Rings: The Return of the King (Adventure, Action, Drama)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (6, 10), (6, 3), (6, 1);
-- Inception (Action, Adventure, Sci-Fi)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (7, 3), (7, 10), (7, 11);
-- The Matrix (Action, Sci-Fi)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (8, 3), (8, 11);
-- Parasite (Drama, Thriller)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (9, 1), (9, 4);
-- Interstellar (Adventure, Drama, Sci-Fi)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (10, 10), (10, 1), (10, 11);
-- The Silence of the Lambs (Crime, Drama, Thriller)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (11, 2), (11, 1), (11, 4);
-- The Green Mile (Crime, Drama, Fantasy)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (12, 2), (12, 1);
-- Saving Private Ryan (Drama, War)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (13, 1), (13, 6);
-- Good Will Hunting (Drama)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (14, 1);
-- Gladiator (Action, Adventure, Drama)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (15, 3), (15, 10), (15, 1);
-- The Prestige (Drama, Mystery, Thriller)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (16, 1), (16, 7), (16, 4);
-- The Departed (Crime, Drama, Thriller)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (17, 2), (17, 1), (17, 4);
-- The Social Network (Biography, Drama)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (18, 8), (18, 1);
-- Titanic (Drama, Romance)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (19, 1), (19, 9);
-- The Wolf of Wall Street (Biography, Comedy, Crime)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (20, 8), (20, 5), (20, 2);
-- The Revenant (Action, Adventure, Drama)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (21, 3), (21, 10), (21, 1);
-- 1917 (Drama, War)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (22, 1), (22, 6);
-- Oppenheimer (Biography, Drama, History)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (23, 8), (23, 1), (23, 15);
-- Joker (Crime, Drama, Thriller)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (24, 2), (24, 1), (24, 4);
-- Inglourious Basterds (Adventure, Drama, War)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (25, 10), (25, 1), (25, 6);
-- Django Unchained (Drama, Western)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (26, 1), (26, 14);
-- The Truman Show (Comedy, Drama, Sci-Fi)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (27, 5), (27, 1), (27, 11);
-- Her (Drama, Romance, Sci-Fi)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (28, 1), (28, 9), (28, 11);
-- The Grand Budapest Hotel (Adventure, Comedy, Drama)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (29, 10), (29, 5), (29, 1);
-- The Pianist (Biography, Drama, Music)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (30, 8), (30, 1);
-- A Beautiful Mind (Biography, Drama)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (31, 8), (31, 1);
-- Coco (Animation, Adventure, Family)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (32, 12), (32, 10), (32, 13);
-- Up (Animation, Adventure, Comedy)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (33, 12), (33, 10), (33, 5);
-- Inside Out (Animation, Adventure, Comedy)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (34, 12), (34, 10), (34, 5);
-- Spider-Man: Into the Spider-Verse (Animation, Action, Adventure)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (35, 12), (35, 3), (35, 10);
-- The Lion King (Animation, Adventure, Drama)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (36, 12), (36, 10), (36, 1);
-- The Intouchables (Biography, Comedy, Drama)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (37, 8), (37, 5), (37, 1);
-- Shutter Island (Mystery, Thriller)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (38, 7), (38, 4);
-- Gone Girl (Drama, Mystery, Thriller)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (39, 1), (39, 7), (39, 4);
-- Blade Runner 2049 (Action, Drama, Mystery)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (40, 3), (40, 1), (40, 7);
-- The Imitation Game (Biography, Drama, Thriller)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (41, 8), (41, 1), (41, 4);
-- The Pursuit of Happyness (Biography, Drama)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (42, 8), (42, 1);
-- Cast Away (Adventure, Drama, Romance)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (43, 10), (43, 1), (43, 9);
-- No Country for Old Men (Crime, Drama, Thriller)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (44, 2), (44, 1), (44, 4);
-- There Will Be Blood (Drama, History)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (45, 1), (45, 15);
-- The Usual Suspects (Crime, Mystery, Thriller)
INSERT INTO movie_genres (movie_id, genre_id) VALUES (46, 2), (46, 7), (46, 4);

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
