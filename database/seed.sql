-- Fuerza Seed Data
-- Realistic dummy data for testing and demo purposes

-- Password for all users is: password123
-- BCrypt hash (10 rounds): $2a$10$rQZ8K1YxMxJzGzJ1q5q5qeJ8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X

-- =====================================================
-- USERS (10 fitness enthusiasts)
-- =====================================================
INSERT INTO User (username, email, password_hash, name, profile_bio) VALUES
('alex_lifts', 'alex.thompson@gettysburg.edu', '$2a$10$b7GuPinDKiF1Daw1X9AQ2enjWPW1Yn/zpJV.UgohNCQacihMj2kMe', 'Alex Thompson', 'Gettysburg College ''26 | CS Major | Powerlifting enthusiast. Chasing that 500lb deadlift.'),
('sarah_fitness', 'sarah.chen@gettysburg.edu', '$2a$10$b7GuPinDKiF1Daw1X9AQ2enjWPW1Yn/zpJV.UgohNCQacihMj2kMe', 'Sarah Chen', 'G-burg ''25 | Health Sciences | Personal trainer at Bullet Center. Helping others become their best.'),
('mike_iron', 'mike.rodriguez@gettysburg.edu', '$2a$10$b7GuPinDKiF1Daw1X9AQ2enjWPW1Yn/zpJV.UgohNCQacihMj2kMe', 'Mike Rodriguez', 'Gettysburg Football ''24 | Now just a gym rat. Leg day is the best day.'),
('emma_strong', 'emma.wilson@gettysburg.edu', '$2a$10$b7GuPinDKiF1Daw1X9AQ2enjWPW1Yn/zpJV.UgohNCQacihMj2kMe', 'Emma Wilson', 'G-burg ''26 | Biology | Strongwoman competitor. Breaking barriers one rep at a time.'),
('james_gains', 'james.park@gettysburg.edu', '$2a$10$b7GuPinDKiF1Daw1X9AQ2enjWPW1Yn/zpJV.UgohNCQacihMj2kMe', 'James Park', 'Gettysburg ''27 | Econ Major | Natural bodybuilding journey. Trust the process.'),
('lisa_power', 'lisa@crossfitgettysburg.com', '$2a$10$b7GuPinDKiF1Daw1X9AQ2enjWPW1Yn/zpJV.UgohNCQacihMj2kMe', 'Lisa Martinez', 'Head Coach @ CrossFit Gettysburg | CF-L2 | Olympic lifting specialist. Coffee addict.'),
('david_muscle', 'david.kim@gettysburg.edu', '$2a$10$b7GuPinDKiF1Daw1X9AQ2enjWPW1Yn/zpJV.UgohNCQacihMj2kMe', 'David Kim', 'G-burg ''25 | CS Major | Coding by day, lifting by night. Optimizing both.'),
('nina_fit', 'nina.patel@gettysburg.edu', '$2a$10$b7GuPinDKiF1Daw1X9AQ2enjWPW1Yn/zpJV.UgohNCQacihMj2kMe', 'Nina Patel', 'Gettysburg ''26 | Psychology | Yoga + weightlifting = balance. Mind-body connection.'),
('chris_beast', 'chris@bulletperformance.com', '$2a$10$b7GuPinDKiF1Daw1X9AQ2enjWPW1Yn/zpJV.UgohNCQacihMj2kMe', 'Chris Anderson', 'Bullet Performance Center owner | 3x national powerlifting qualifier. Coach and mentor.'),
('jen_athletic', 'jen.brooks@gettysburg.edu', '$2a$10$b7GuPinDKiF1Daw1X9AQ2enjWPW1Yn/zpJV.UgohNCQacihMj2kMe', 'Jennifer Brooks', 'G-burg Track & Field ''25 | Sprinter turned weightlifter. Speed meets strength.');

-- =====================================================
-- GYMS (5 gyms around Gettysburg, PA)
-- =====================================================
INSERT INTO Gym (gym_name, address) VALUES
('Iron Paradise Gym', '245 Steinwehr Avenue, Gettysburg, PA 17325'),
('PowerHouse Fitness', '1275 York Road, Gettysburg, PA 17325'),
('CrossFit Gettysburg', '35 North Washington Street, Gettysburg, PA 17325'),
('Bullet Performance Center', '680 Chambersburg Road, Gettysburg, PA 17325'),
('Midnight Iron Gym', '1863 Baltimore Pike, Gettysburg, PA 17325');

-- =====================================================
-- GYM MEMBERSHIPS
-- =====================================================
INSERT INTO MemberOf (uid, gym_id) VALUES
(1, 1), (1, 4),  -- Alex: Iron Paradise, Elite Performance
(2, 3),          -- Sarah: CrossFit Central
(3, 1),          -- Mike: Iron Paradise
(4, 4), (4, 2),  -- Emma: Elite Performance, PowerHouse
(5, 2),          -- James: PowerHouse
(6, 3),          -- Lisa: CrossFit Central
(7, 5),          -- David: 24/7 Strength Lab
(8, 1), (8, 3),  -- Nina: Iron Paradise, CrossFit Central
(9, 4),          -- Chris: Elite Performance
(10, 2);         -- Jen: PowerHouse

-- =====================================================
-- FOLLOWS (Social connections)
-- =====================================================
INSERT INTO Follows (follower_uid, following_uid) VALUES
-- Alex follows
(1, 2), (1, 3), (1, 4), (1, 9),
-- Sarah follows
(2, 1), (2, 4), (2, 6), (2, 8),
-- Mike follows
(3, 1), (3, 5), (3, 9),
-- Emma follows
(4, 1), (4, 2), (4, 9), (4, 10),
-- James follows
(5, 1), (5, 3), (5, 4), (5, 7),
-- Lisa follows
(6, 2), (6, 4), (6, 8), (6, 9),
-- David follows
(7, 1), (7, 5), (7, 6),
-- Nina follows
(8, 2), (8, 6), (8, 10),
-- Chris follows
(9, 1), (9, 4), (9, 3),
-- Jen follows
(10, 4), (10, 6), (10, 8);

-- =====================================================
-- WORKOUTS (Multiple workouts per user over past 2 weeks)
-- =====================================================
INSERT INTO Workout (uid, date, created_at) VALUES
-- Alex's workouts
(1, DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(1, DATE_SUB(CURDATE(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
(1, DATE_SUB(CURDATE(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
(1, DATE_SUB(CURDATE(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY)),
-- Sarah's workouts
(2, DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(2, DATE_SUB(CURDATE(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
(2, DATE_SUB(CURDATE(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
-- Mike's workouts
(3, CURDATE(), NOW()),
(3, DATE_SUB(CURDATE(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
(3, DATE_SUB(CURDATE(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
-- Emma's workouts
(4, DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(4, DATE_SUB(CURDATE(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
(4, DATE_SUB(CURDATE(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY)),
-- James's workouts
(5, CURDATE(), NOW()),
(5, DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(5, DATE_SUB(CURDATE(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
(5, DATE_SUB(CURDATE(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
-- Lisa's workouts
(6, DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(6, DATE_SUB(CURDATE(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
-- David's workouts
(7, DATE_SUB(CURDATE(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
(7, DATE_SUB(CURDATE(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
-- Nina's workouts
(8, DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(8, DATE_SUB(CURDATE(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
-- Chris's workouts
(9, CURDATE(), NOW()),
(9, DATE_SUB(CURDATE(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
(9, DATE_SUB(CURDATE(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
(9, DATE_SUB(CURDATE(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY)),
-- Jen's workouts
(10, DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(10, DATE_SUB(CURDATE(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY));

-- =====================================================
-- REP SCHEMES (Variety of training styles)
-- =====================================================
INSERT INTO RepScheme (reps, sets, weights, rest_time) VALUES
-- Heavy strength (1-5 reps)
(5, 5, 225.00, 180),   -- 1: 5x5 @ 225
(3, 5, 275.00, 240),   -- 2: 5x3 @ 275
(5, 3, 185.00, 120),   -- 3: 3x5 @ 185
(1, 3, 315.00, 300),   -- 4: 3x1 @ 315 (heavy singles)
(5, 5, 135.00, 120),   -- 5: 5x5 @ 135

-- Hypertrophy (8-12 reps)
(10, 4, 155.00, 90),   -- 6: 4x10 @ 155
(12, 3, 95.00, 60),    -- 7: 3x12 @ 95
(8, 4, 185.00, 90),    -- 8: 4x8 @ 185
(10, 3, 135.00, 75),   -- 9: 3x10 @ 135
(12, 4, 65.00, 60),    -- 10: 4x12 @ 65

-- Endurance/Accessory (15+ reps)
(15, 3, 45.00, 45),    -- 11: 3x15 @ 45
(20, 3, 25.00, 30),    -- 12: 3x20 @ 25
(15, 4, 55.00, 60),    -- 13: 4x15 @ 55

-- Bodyweight
(10, 3, 0.00, 60),     -- 14: 3x10 bodyweight
(15, 4, 0.00, 45),     -- 15: 4x15 bodyweight
(12, 3, 0.00, 60),     -- 16: 3x12 bodyweight

-- More variety
(6, 4, 205.00, 150),   -- 17: 4x6 @ 205
(8, 3, 165.00, 90),    -- 18: 3x8 @ 165
(10, 5, 115.00, 75),   -- 19: 5x10 @ 115
(4, 5, 245.00, 180);   -- 20: 5x4 @ 245

-- =====================================================
-- EXERCISES (Linking workouts to rep schemes and exercise types)
-- =====================================================
-- Workout 1: Alex - Push day
INSERT INTO Exercise (wid, rid, exercise_type_id, exercise_order) VALUES
(1, 1, 1, 1),   -- Bench Press 5x5@225
(1, 6, 2, 2),   -- Incline Bench 4x10@155
(1, 7, 3, 3),   -- DB Fly 3x12@95
(1, 9, 15, 4),  -- Shoulder Press 3x10@135
(1, 10, 16, 5); -- Lateral Raise 4x12@65

-- Workout 2: Alex - Pull day
INSERT INTO Exercise (wid, rid, exercise_type_id, exercise_order) VALUES
(2, 2, 10, 1),  -- Deadlift 5x3@275
(2, 8, 11, 2),  -- Bent Over Row 4x8@185
(2, 14, 13, 3), -- Pull Ups 3x10 BW
(2, 9, 14, 4),  -- Seated Cable Row 3x10@135
(2, 18, 19, 5); -- Bicep Curl 3x8@165

-- Workout 3: Alex - Leg day
INSERT INTO Exercise (wid, rid, exercise_type_id, exercise_order) VALUES
(3, 1, 5, 1),   -- Squat 5x5@225
(3, 6, 6, 2),   -- Leg Press 4x10@155
(3, 7, 7, 3),   -- Lunges 3x12
(3, 11, 8, 4),  -- Leg Curl 3x15@45
(3, 11, 9, 5);  -- Leg Extension 3x15@45

-- Workout 4: Alex - Upper body
INSERT INTO Exercise (wid, rid, exercise_type_id, exercise_order) VALUES
(4, 3, 1, 1),   -- Bench Press 3x5@185
(4, 14, 13, 2), -- Pull Ups 3x10 BW
(4, 9, 15, 3),  -- Shoulder Press 3x10@135
(4, 18, 19, 4); -- Bicep Curl 3x8

-- Workout 5: Sarah - Full body
INSERT INTO Exercise (wid, rid, exercise_type_id, exercise_order) VALUES
(5, 5, 5, 1),   -- Squat 5x5@135
(5, 7, 1, 2),   -- Bench Press 3x12@95
(5, 14, 13, 3), -- Pull Ups 3x10 BW
(5, 11, 15, 4), -- Shoulder Press 3x15@45
(5, 15, 24, 5); -- Plank 4x15

-- Workout 6: Sarah - Lower body
INSERT INTO Exercise (wid, rid, exercise_type_id, exercise_order) VALUES
(6, 5, 5, 1),   -- Squat 5x5@135
(6, 6, 6, 2),   -- Leg Press 4x10
(6, 12, 7, 3),  -- Lunges 3x20@25
(6, 11, 8, 4);  -- Leg Curl 3x15@45

-- Workout 7: Sarah - Upper body
INSERT INTO Exercise (wid, rid, exercise_type_id, exercise_order) VALUES
(7, 7, 2, 1),   -- Incline Bench 3x12@95
(7, 9, 12, 2),  -- Lat Pulldown 3x10@135
(7, 10, 16, 3), -- Lateral Raise 4x12@65
(7, 18, 19, 4); -- Bicep Curl 3x8

-- Workout 8: Mike - Leg day (today!)
INSERT INTO Exercise (wid, rid, exercise_type_id, exercise_order) VALUES
(8, 4, 5, 1),   -- Squat 3x1@315 (heavy!)
(8, 17, 6, 2),  -- Leg Press 4x6@205
(8, 8, 7, 3),   -- Lunges 4x8@185
(8, 13, 8, 4),  -- Leg Curl 4x15@55
(8, 13, 9, 5);  -- Leg Extension 4x15@55

-- Workout 9: Mike - Push
INSERT INTO Exercise (wid, rid, exercise_type_id, exercise_order) VALUES
(9, 17, 1, 1),  -- Bench Press 4x6@205
(9, 8, 2, 2),   -- Incline Bench 4x8@185
(9, 9, 3, 3),   -- DB Fly 3x10@135
(9, 6, 21, 4);  -- Tricep Pushdown 4x10@155

-- Workout 10: Mike - Pull
INSERT INTO Exercise (wid, rid, exercise_type_id, exercise_order) VALUES
(10, 20, 10, 1), -- Deadlift 5x4@245
(10, 8, 11, 2),  -- Bent Over Row 4x8@185
(10, 16, 13, 3), -- Pull Ups 3x12 BW
(10, 19, 19, 4); -- Bicep Curl 5x10@115

-- Workout 11: Emma - Strongwoman training
INSERT INTO Exercise (wid, rid, exercise_type_id, exercise_order) VALUES
(11, 4, 10, 1),  -- Deadlift 3x1@315
(11, 2, 5, 2),   -- Squat 5x3@275
(11, 17, 15, 3), -- Shoulder Press 4x6@205
(11, 15, 24, 4); -- Plank 4x15

-- Workout 12: Emma - Upper body
INSERT INTO Exercise (wid, rid, exercise_type_id, exercise_order) VALUES
(12, 8, 1, 1),   -- Bench Press 4x8@185
(12, 8, 11, 2),  -- Bent Over Row 4x8@185
(12, 9, 15, 3),  -- Shoulder Press 3x10@135
(12, 14, 13, 4); -- Pull Ups 3x10 BW

-- Workout 13: Emma - Lower body
INSERT INTO Exercise (wid, rid, exercise_type_id, exercise_order) VALUES
(13, 1, 5, 1),   -- Squat 5x5@225
(13, 20, 10, 2), -- Deadlift 5x4@245
(13, 6, 6, 3),   -- Leg Press 4x10
(13, 11, 7, 4);  -- Lunges 3x15@45

-- Workout 14: James - Push (today)
INSERT INTO Exercise (wid, rid, exercise_type_id, exercise_order) VALUES
(14, 6, 1, 1),   -- Bench Press 4x10@155
(14, 7, 2, 2),   -- Incline Bench 3x12@95
(14, 10, 3, 3),  -- DB Fly 4x12@65
(14, 6, 15, 4),  -- Shoulder Press 4x10@155
(14, 12, 16, 5); -- Lateral Raise 3x20@25

-- Workout 15: James - Pull
INSERT INTO Exercise (wid, rid, exercise_type_id, exercise_order) VALUES
(15, 3, 10, 1),  -- Deadlift 3x5@185
(15, 9, 11, 2),  -- Bent Over Row 3x10@135
(15, 9, 12, 3),  -- Lat Pulldown 3x10@135
(15, 19, 19, 4), -- Bicep Curl 5x10@115
(15, 18, 20, 5); -- Hammer Curl 3x8

-- Workout 16: James - Legs
INSERT INTO Exercise (wid, rid, exercise_type_id, exercise_order) VALUES
(16, 5, 5, 1),   -- Squat 5x5@135
(16, 6, 6, 2),   -- Leg Press 4x10@155
(16, 7, 7, 3),   -- Lunges 3x12
(16, 13, 8, 4);  -- Leg Curl 4x15@55

-- Workout 17: James - Arms
INSERT INTO Exercise (wid, rid, exercise_type_id, exercise_order) VALUES
(17, 19, 19, 1), -- Bicep Curl 5x10@115
(17, 18, 20, 2), -- Hammer Curl 3x8
(17, 9, 21, 3),  -- Tricep Pushdown 3x10@135
(17, 14, 22, 4), -- Tricep Dips 3x10 BW
(17, 18, 23, 5); -- Skull Crushers 3x8

-- Workout 18: Lisa - CrossFit style
INSERT INTO Exercise (wid, rid, exercise_type_id, exercise_order) VALUES
(18, 5, 5, 1),   -- Squat 5x5@135
(18, 3, 10, 2),  -- Deadlift 3x5@185
(18, 14, 13, 3), -- Pull Ups 3x10 BW
(18, 15, 4, 4),  -- Push Ups 4x15 BW
(18, 15, 24, 5); -- Plank 4x15

-- Workout 19: Lisa - Olympic lifting focus
INSERT INTO Exercise (wid, rid, exercise_type_id, exercise_order) VALUES
(19, 3, 5, 1),   -- Squat 3x5@185
(19, 5, 15, 2),  -- Shoulder Press 5x5@135
(19, 14, 13, 3); -- Pull Ups 3x10 BW

-- Workout 20: David - After work pump
INSERT INTO Exercise (wid, rid, exercise_type_id, exercise_order) VALUES
(20, 6, 1, 1),   -- Bench Press 4x10@155
(20, 9, 11, 2),  -- Bent Over Row 3x10@135
(20, 10, 15, 3), -- Shoulder Press 4x12@65
(20, 19, 19, 4); -- Bicep Curl 5x10@115

-- Workout 21: David - Legs
INSERT INTO Exercise (wid, rid, exercise_type_id, exercise_order) VALUES
(21, 5, 5, 1),   -- Squat 5x5@135
(21, 6, 6, 2),   -- Leg Press 4x10@155
(21, 11, 8, 3),  -- Leg Curl 3x15@45
(21, 11, 9, 4);  -- Leg Extension 3x15@45

-- Workout 22: Nina - Balanced training
INSERT INTO Exercise (wid, rid, exercise_type_id, exercise_order) VALUES
(22, 5, 5, 1),   -- Squat 5x5@135
(22, 7, 1, 2),   -- Bench Press 3x12@95
(22, 14, 13, 3), -- Pull Ups 3x10 BW
(22, 15, 24, 4), -- Plank 4x15
(22, 12, 26, 5); -- Russian Twist 3x20@25

-- Workout 23: Nina - Core focus
INSERT INTO Exercise (wid, rid, exercise_type_id, exercise_order) VALUES
(23, 7, 1, 1),   -- Bench Press 3x12@95
(23, 15, 24, 2), -- Plank 4x15
(23, 15, 25, 3), -- Crunches 4x15
(23, 12, 26, 4), -- Russian Twist 3x20@25
(23, 14, 27, 5); -- Leg Raises 3x10

-- Workout 24: Chris - Competition prep (today)
INSERT INTO Exercise (wid, rid, exercise_type_id, exercise_order) VALUES
(24, 4, 5, 1),   -- Squat 3x1@315
(24, 4, 1, 2),   -- Bench Press 3x1@315
(24, 4, 10, 3);  -- Deadlift 3x1@315

-- Workout 25: Chris - Volume day
INSERT INTO Exercise (wid, rid, exercise_type_id, exercise_order) VALUES
(25, 1, 5, 1),   -- Squat 5x5@225
(25, 1, 1, 2),   -- Bench Press 5x5@225
(25, 8, 11, 3),  -- Bent Over Row 4x8@185
(25, 9, 15, 4);  -- Shoulder Press 3x10@135

-- Workout 26: Chris - Speed day
INSERT INTO Exercise (wid, rid, exercise_type_id, exercise_order) VALUES
(26, 3, 5, 1),   -- Squat 3x5@185
(26, 3, 1, 2),   -- Bench Press 3x5@185
(26, 3, 10, 3),  -- Deadlift 3x5@185
(26, 14, 13, 4); -- Pull Ups 3x10 BW

-- Workout 27: Chris - Accessory day
INSERT INTO Exercise (wid, rid, exercise_type_id, exercise_order) VALUES
(27, 6, 6, 1),   -- Leg Press 4x10@155
(27, 6, 2, 2),   -- Incline Bench 4x10@155
(27, 9, 12, 3),  -- Lat Pulldown 3x10@135
(27, 10, 16, 4); -- Lateral Raise 4x12@65

-- Workout 28: Jen - Athletic training
INSERT INTO Exercise (wid, rid, exercise_type_id, exercise_order) VALUES
(28, 3, 5, 1),   -- Squat 3x5@185
(28, 3, 10, 2),  -- Deadlift 3x5@185
(28, 15, 4, 3),  -- Push Ups 4x15 BW
(28, 14, 13, 4), -- Pull Ups 3x10 BW
(28, 15, 24, 5); -- Plank 4x15

-- Workout 29: Jen - Speed & Power
INSERT INTO Exercise (wid, rid, exercise_type_id, exercise_order) VALUES
(29, 5, 5, 1),   -- Squat 5x5@135
(29, 17, 6, 2),  -- Leg Press 4x6@205
(29, 8, 7, 3),   -- Lunges 4x8
(29, 15, 24, 4); -- Plank 4x15

-- =====================================================
-- POSTS (Sharing workout achievements)
-- =====================================================
INSERT INTO Post (uid, wid, caption, is_private, date, post_time) VALUES
-- Alex's posts
(1, 1, 'Push day at Iron Paradise! Bench felt strong today. Building towards that 275 goal. Finals week gains incoming.', FALSE, DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(1, 3, 'Leg day is the best day. Hit the gym before my 8am CS lecture. No excuses.', FALSE, DATE_SUB(CURDATE(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),

-- Sarah's posts
(2, 5, 'Full body session at Bullet to start the week! Reminder: consistency > intensity. Who needs a training plan? DM me!', FALSE, DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(2, 7, 'Upper body pump after Health Sci lab. Grateful for the Jaeger Center but nothing beats a real gym.', FALSE, DATE_SUB(CURDATE(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),

-- Mike's posts
(3, 8, 'NEW PR! 315 squat for a clean single. Post-football life treating me well. Iron Paradise never disappoints!', FALSE, CURDATE(), NOW()),
(3, 10, 'Heavy pulls today at Iron Paradise. Back day with the boys. Miss the team but not the 5am practices.', FALSE, DATE_SUB(CURDATE(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),

-- Emma's posts
(4, 11, 'Strongwoman training at Bullet! 315 deadlift moved like butter. Chris is an amazing coach.', FALSE, DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(4, 13, 'Squats and deads in the same session. Then walked to Servo for dinner. Earning those carbs!', FALSE, DATE_SUB(CURDATE(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY)),

-- James's posts
(5, 14, 'Chest day at PowerHouse! Volume work for the gains. Spring semester bulk going well.', FALSE, CURDATE(), NOW()),
(5, 16, 'Never skip leg day. Even when you have to walk up the hill to Glatfelter after.', FALSE, DATE_SUB(CURDATE(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
(5, 17, 'Arms day - because sometimes you just need a good pump before a night at The Pub.', TRUE, DATE_SUB(CURDATE(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),

-- Lisa's posts
(6, 18, 'Great morning class at CrossFit Gettysburg! Love seeing new faces. Drop in anytime, Bullets!', FALSE, DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(6, 19, 'Olympic lifting clinic was a success! Thanks everyone who came out. Next one is in January.', FALSE, DATE_SUB(CURDATE(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),

-- David's posts
(7, 20, 'Post-coding pump session at Midnight Iron. Nothing like deadlifts after debugging for 6 hours.', FALSE, DATE_SUB(CURDATE(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
(7, 21, 'Leg day at 11pm. Only at Midnight Iron. CS majors understand the grind.', FALSE, DATE_SUB(CURDATE(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),

-- Nina's posts
(8, 22, 'Morning yoga at the CUB then lifting at Iron Paradise. Balance is everything.', FALSE, DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(8, 23, 'Core focus today. Strong core = better lifts AND better mental health. Psych major approved.', FALSE, DATE_SUB(CURDATE(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),

-- Chris's posts
(9, 24, 'Meet prep at Bullet! All lifts solid. 315 across the board. PA State Championships here I come!', FALSE, CURDATE(), NOW()),
(9, 25, 'Volume day done. If any G-burg students want coaching, first session is free. Trust the process.', FALSE, DATE_SUB(CURDATE(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
(9, 27, 'Accessory work might not be glamorous, but it builds champions. Ask any of my athletes.', FALSE, DATE_SUB(CURDATE(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY)),

-- Jen's posts
(10, 28, 'Athletic training at PowerHouse! Track practice + lifting = tired but happy. Go Bullets!', FALSE, DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(10, 29, 'Power day before the Centennial Conference meet. Explosive movements for explosive sprints.', FALSE, DATE_SUB(CURDATE(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY));

-- =====================================================
-- MESSAGES (Conversations between users)
-- =====================================================
INSERT INTO Message (from_uid, to_uid, contents, post_time, is_read) VALUES
-- Alex and Chris discussing training
(1, 9, 'Hey Chris! Saw your competition prep post. Looking strong!', DATE_SUB(NOW(), INTERVAL 2 HOUR), TRUE),
(9, 1, 'Thanks Alex! Been grinding hard. You should compete too, your lifts are solid.', DATE_SUB(NOW(), INTERVAL 1 HOUR), TRUE),
(1, 9, 'Maybe next year! Still chasing that 500 deadlift first.', DATE_SUB(NOW(), INTERVAL 30 MINUTE), FALSE),

-- Sarah and Nina talking about training styles
(2, 8, 'Love your balanced approach to training! How do you combine yoga with lifting?', DATE_SUB(NOW(), INTERVAL 1 DAY), TRUE),
(8, 2, 'I usually do yoga in the morning and lift in the evening. The flexibility really helps with squat depth!', DATE_SUB(NOW(), INTERVAL 23 HOUR), TRUE),
(2, 8, 'That makes so much sense. Maybe I should try adding yoga to my routine too.', DATE_SUB(NOW(), INTERVAL 22 HOUR), TRUE),
(8, 2, 'You should! Happy to share some resources if you want.', DATE_SUB(NOW(), INTERVAL 21 HOUR), FALSE),

-- Mike and James gym talk
(3, 5, 'Yo James, saw your leg day post. Want to train together next week?', DATE_SUB(NOW(), INTERVAL 3 HOUR), TRUE),
(5, 3, 'For sure! I could use a spotter for heavy squats. Tuesday work?', DATE_SUB(NOW(), INTERVAL 2 HOUR), TRUE),
(3, 5, 'Tuesday is perfect. See you at Iron Paradise at 6pm!', DATE_SUB(NOW(), INTERVAL 1 HOUR), FALSE),

-- Emma and Lisa discussing strongwoman
(4, 6, 'Hey Lisa! Do you ever incorporate strongwoman movements in your CrossFit programming?', DATE_SUB(NOW(), INTERVAL 5 HOUR), TRUE),
(6, 4, 'Sometimes! Farmers walks and sandbag carries are great for conditioning. Would love to learn more about proper strongwoman training though.', DATE_SUB(NOW(), INTERVAL 4 HOUR), TRUE),
(4, 6, 'Come train with me sometime! I can show you the basics.', DATE_SUB(NOW(), INTERVAL 3 HOUR), FALSE),

-- David and Jen quick exchange
(7, 10, 'Great athletic training post! What does your cardio routine look like?', DATE_SUB(NOW(), INTERVAL 6 HOUR), TRUE),
(10, 7, 'Mostly sprints and plyometrics. Old habits from track days. I try to keep the explosive element in my training.', DATE_SUB(NOW(), INTERVAL 5 HOUR), FALSE);
