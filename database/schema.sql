-- Fuerza Database Schema
-- Social Fitness Tracking Application

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS RefreshToken;
DROP TABLE IF EXISTS Message;
DROP TABLE IF EXISTS Exercise;
DROP TABLE IF EXISTS RepScheme;
DROP TABLE IF EXISTS Post;
DROP TABLE IF EXISTS Workout;
DROP TABLE IF EXISTS Follows;
DROP TABLE IF EXISTS MemberOf;
DROP TABLE IF EXISTS Gym;
DROP TABLE IF EXISTS ExerciseType;
DROP TABLE IF EXISTS User;

-- Users table
CREATE TABLE User (
    uid INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    profile_picture VARCHAR(255) DEFAULT '/uploads/default-avatar.png',
    profile_bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Gyms table
CREATE TABLE Gym (
    gym_id INT AUTO_INCREMENT PRIMARY KEY,
    gym_name VARCHAR(100) NOT NULL UNIQUE,
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User gym membership
CREATE TABLE MemberOf (
    uid INT NOT NULL,
    gym_id INT NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (uid, gym_id),
    FOREIGN KEY (uid) REFERENCES User(uid) ON DELETE CASCADE,
    FOREIGN KEY (gym_id) REFERENCES Gym(gym_id) ON DELETE CASCADE
);

-- Following relationships
CREATE TABLE Follows (
    follower_uid INT NOT NULL,
    following_uid INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_uid, following_uid),
    FOREIGN KEY (follower_uid) REFERENCES User(uid) ON DELETE CASCADE,
    FOREIGN KEY (following_uid) REFERENCES User(uid) ON DELETE CASCADE,
    INDEX idx_follower (follower_uid),
    INDEX idx_following (following_uid)
);

-- Exercise types catalog
CREATE TABLE ExerciseType (
    exercise_type_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    muscle_group VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workouts table
CREATE TABLE Workout (
    wid INT AUTO_INCREMENT PRIMARY KEY,
    uid INT NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uid) REFERENCES User(uid) ON DELETE CASCADE,
    INDEX idx_user_date (uid, date)
);

-- Rep schemes
CREATE TABLE RepScheme (
    rid INT AUTO_INCREMENT PRIMARY KEY,
    reps INT NOT NULL,
    sets INT NOT NULL,
    weights DECIMAL(6,2) NOT NULL,
    rest_time INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exercises linking workouts to rep schemes
CREATE TABLE Exercise (
    exercise_id INT AUTO_INCREMENT PRIMARY KEY,
    wid INT NOT NULL,
    rid INT NOT NULL,
    exercise_type_id INT NOT NULL,
    exercise_order INT DEFAULT 1,
    FOREIGN KEY (wid) REFERENCES Workout(wid) ON DELETE CASCADE,
    FOREIGN KEY (rid) REFERENCES RepScheme(rid) ON DELETE CASCADE,
    FOREIGN KEY (exercise_type_id) REFERENCES ExerciseType(exercise_type_id),
    INDEX idx_workout (wid)
);

-- Posts table
CREATE TABLE Post (
    pid INT AUTO_INCREMENT PRIMARY KEY,
    uid INT NOT NULL,
    wid INT NOT NULL,
    caption TEXT,
    is_private BOOLEAN DEFAULT FALSE,
    post_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date DATE NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (uid) REFERENCES User(uid) ON DELETE CASCADE,
    FOREIGN KEY (wid) REFERENCES Workout(wid) ON DELETE CASCADE,
    INDEX idx_user_posts (uid, post_time DESC),
    INDEX idx_public_posts (is_private, post_time DESC)
);

-- Messages table
CREATE TABLE Message (
    mid INT AUTO_INCREMENT PRIMARY KEY,
    from_uid INT NOT NULL,
    to_uid INT NOT NULL,
    contents TEXT NOT NULL,
    post_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (from_uid) REFERENCES User(uid) ON DELETE CASCADE,
    FOREIGN KEY (to_uid) REFERENCES User(uid) ON DELETE CASCADE,
    INDEX idx_conversation (from_uid, to_uid, post_time),
    INDEX idx_recipient (to_uid, is_read)
);

-- Refresh tokens for JWT
CREATE TABLE RefreshToken (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uid INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uid) REFERENCES User(uid) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_tokens (uid)
);

-- Seed exercise types
INSERT INTO ExerciseType (name, muscle_group) VALUES
    ('Bench Press', 'Chest'),
    ('Incline Bench Press', 'Chest'),
    ('Dumbbell Fly', 'Chest'),
    ('Push Ups', 'Chest'),
    ('Squat', 'Legs'),
    ('Leg Press', 'Legs'),
    ('Lunges', 'Legs'),
    ('Leg Curl', 'Legs'),
    ('Leg Extension', 'Legs'),
    ('Deadlift', 'Back'),
    ('Bent Over Row', 'Back'),
    ('Lat Pulldown', 'Back'),
    ('Pull Ups', 'Back'),
    ('Seated Cable Row', 'Back'),
    ('Shoulder Press', 'Shoulders'),
    ('Lateral Raise', 'Shoulders'),
    ('Front Raise', 'Shoulders'),
    ('Rear Delt Fly', 'Shoulders'),
    ('Bicep Curl', 'Arms'),
    ('Hammer Curl', 'Arms'),
    ('Tricep Pushdown', 'Arms'),
    ('Tricep Dips', 'Arms'),
    ('Skull Crushers', 'Arms'),
    ('Plank', 'Core'),
    ('Crunches', 'Core'),
    ('Russian Twist', 'Core'),
    ('Leg Raises', 'Core'),
    ('Cable Crunch', 'Core');
