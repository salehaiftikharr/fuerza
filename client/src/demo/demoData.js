// Demo dataset for Fuerza's no-backend "Live Demo" mode.
// Powers the entire app (feed, profiles, posts, messages) with realistic
// in-memory data so the deployed site is fully clickable without a server.

const avatar = (seed) =>
  `https://api.dicebear.com/9.x/avataaars/png?seed=${encodeURIComponent(seed)}&radius=50`

const hoursAgo = (h) => new Date(Date.now() - h * 60 * 60 * 1000).toISOString()
const daysAgo = (d) => hoursAgo(d * 24)

// The signed-in "you" for the demo session
export const DEMO_USER = {
  uid: 1,
  username: 'demo',
  email: 'demo@fuerza.app',
  name: 'Demo Athlete',
  profile_picture: avatar('demo'),
  profile_bio: 'Exploring Fuerza in demo mode. Chasing PRs one session at a time. 🏋️'
}

const USERS = [
  DEMO_USER,
  {
    uid: 2,
    username: 'maya_lifts',
    email: 'maya@fuerza.app',
    name: 'Maya Chen',
    profile_picture: avatar('maya_lifts'),
    profile_bio: 'Powerlifter | 405 deadlift club | coaching @ Iron Temple'
  },
  {
    uid: 3,
    username: 'marcus_strong',
    email: 'marcus@fuerza.app',
    name: 'Marcus Johnson',
    profile_picture: avatar('marcus_strong'),
    profile_bio: 'Bodybuilding prep 🏆 | high volume, higher standards'
  },
  {
    uid: 4,
    username: 'sofia_fit',
    email: 'sofia@fuerza.app',
    name: 'Sofia Petrova',
    profile_picture: avatar('sofia_fit'),
    profile_bio: 'CrossFit coach | conditioning is a love language'
  },
  {
    uid: 5,
    username: 'jordan_hybrid',
    email: 'jordan@fuerza.app',
    name: 'Jordan Lee',
    profile_picture: avatar('jordan_hybrid'),
    profile_bio: 'Hybrid athlete: lift heavy, run far. Marathon + 500 squat goal.'
  },
  {
    uid: 6,
    username: 'priya_moves',
    email: 'priya@fuerza.app',
    name: 'Priya Sharma',
    profile_picture: avatar('priya_moves'),
    profile_bio: 'Calisthenics + mobility | bodyweight is plenty 🤸'
  }
]

// exercise_type_id -> { name, muscle_group } mirrors database/schema.sql
const EX = {
  1: { name: 'Bench Press', muscle_group: 'Chest' },
  2: { name: 'Incline Bench Press', muscle_group: 'Chest' },
  4: { name: 'Push Ups', muscle_group: 'Chest' },
  5: { name: 'Squat', muscle_group: 'Legs' },
  6: { name: 'Leg Press', muscle_group: 'Legs' },
  7: { name: 'Lunges', muscle_group: 'Legs' },
  10: { name: 'Deadlift', muscle_group: 'Back' },
  11: { name: 'Bent Over Row', muscle_group: 'Back' },
  12: { name: 'Lat Pulldown', muscle_group: 'Back' },
  13: { name: 'Pull Ups', muscle_group: 'Back' },
  15: { name: 'Shoulder Press', muscle_group: 'Shoulders' },
  16: { name: 'Lateral Raise', muscle_group: 'Shoulders' },
  19: { name: 'Bicep Curl', muscle_group: 'Arms' },
  20: { name: 'Hammer Curl', muscle_group: 'Arms' },
  21: { name: 'Tricep Pushdown', muscle_group: 'Arms' },
  24: { name: 'Plank', muscle_group: 'Core' },
  26: { name: 'Russian Twist', muscle_group: 'Core' }
}

const ex = (id, sets, reps, weights, rest_time) => ({
  exercise_name: EX[id].name,
  muscle_group: EX[id].muscle_group,
  sets,
  reps,
  weights,
  rest_time
})

const POSTS = [
  {
    pid: 101,
    uid: 2,
    caption: 'Deadlift day. Pulled a clean 385 for a triple — 405 is getting closer 👀',
    post_time: hoursAgo(3),
    exercises: [ex(10, 5, 3, 385, 180), ex(11, 4, 8, 185, 90), ex(12, 3, 12, 120, 60)]
  },
  {
    pid: 102,
    uid: 3,
    caption: 'Chest + delts. Time under tension was brutal today, exactly how I like it.',
    post_time: hoursAgo(6),
    exercises: [ex(1, 4, 8, 225, 120), ex(2, 3, 10, 155, 90), ex(16, 4, 15, 25, 45)]
  },
  {
    pid: 103,
    uid: 4,
    caption: 'Conditioning WOD then heavy squats. Legs are officially jelly. 🔥',
    post_time: hoursAgo(10),
    exercises: [ex(5, 5, 5, 205, 150), ex(7, 3, 12, 95, 60), ex(24, 3, 1, 0, 60)]
  },
  {
    pid: 104,
    uid: 5,
    caption: '8 mile easy run this morning, then back squats in the evening. Hybrid life.',
    post_time: daysAgo(1),
    exercises: [ex(5, 4, 6, 275, 180), ex(6, 3, 10, 360, 90)]
  },
  {
    pid: 105,
    uid: 6,
    caption: 'First clean set of 5 pull-ups since starting calisthenics. Small wins compound.',
    post_time: daysAgo(1),
    exercises: [ex(13, 5, 5, 0, 120), ex(4, 4, 20, 0, 60), ex(24, 3, 1, 0, 45)]
  },
  {
    pid: 106,
    uid: 2,
    caption: 'Back + biceps accessory day. Rows felt strong.',
    post_time: daysAgo(2),
    exercises: [ex(11, 4, 10, 165, 90), ex(12, 4, 12, 110, 60), ex(19, 3, 12, 35, 45)]
  },
  {
    pid: 107,
    uid: 3,
    caption: 'Arm day pump. Supersets until the sleeves gave up. 💪',
    post_time: daysAgo(2),
    exercises: [ex(19, 4, 12, 40, 45), ex(20, 4, 12, 35, 45), ex(21, 4, 15, 60, 45)]
  },
  {
    pid: 108,
    uid: 4,
    caption: 'Shoulder press PR! Bodyweight overhead finally feels light.',
    post_time: daysAgo(3),
    exercises: [ex(15, 5, 5, 135, 150), ex(16, 4, 15, 20, 45)]
  },
  {
    pid: 109,
    uid: 1,
    caption: 'Easing back into a push session. Felt great to be under the bar again.',
    post_time: daysAgo(1),
    exercises: [ex(1, 4, 8, 135, 90), ex(15, 3, 10, 75, 75), ex(21, 3, 12, 45, 45)]
  },
  {
    pid: 110,
    uid: 1,
    caption: 'Leg day. Kept it simple and heavy.',
    post_time: daysAgo(4),
    exercises: [ex(5, 5, 5, 185, 150), ex(7, 3, 10, 70, 60), ex(26, 3, 20, 25, 45)]
  }
]

const CONVERSATIONS = [
  {
    other_uid: 2,
    messages: [
      { from_uid: 2, contents: 'Saw your push session — welcome back! How did it feel?', post_time: hoursAgo(5) },
      { from_uid: 1, contents: 'Honestly amazing. Slowly rebuilding my numbers though 😅', post_time: hoursAgo(4) },
      { from_uid: 2, contents: 'Trust the process. Want to train deadlifts together Friday?', post_time: hoursAgo(2) }
    ]
  },
  {
    other_uid: 4,
    messages: [
      { from_uid: 4, contents: 'That conditioning WOD I posted will wreck you in the best way 😈', post_time: daysAgo(1) },
      { from_uid: 1, contents: 'Sending it this weekend. Scaling the box jumps though haha', post_time: hoursAgo(20) }
    ]
  }
]

// Build a fresh, fully-seeded store. Called once per demo session.
export function seedState() {
  let messageId = 500
  const messages = []
  CONVERSATIONS.forEach((conv) => {
    conv.messages.forEach((m) => {
      messages.push({
        mid: messageId++,
        from_uid: m.from_uid,
        to_uid: m.from_uid === DEMO_USER.uid ? conv.other_uid : DEMO_USER.uid,
        contents: m.contents,
        post_time: m.post_time,
        is_read: true
      })
    })
  })

  // Seed kudos: a spread of users like various posts.
  const likes = {}
  POSTS.forEach((p) => {
    likes[p.pid] = USERS.filter((u) => u.uid !== p.uid && (p.pid + u.uid) % 3 === 0).map((u) => u.uid)
  })

  const mkComment = (id, pid, username, content, hrs) => {
    const u = USERS.find((x) => x.username === username)
    return {
      comment_id: id,
      pid,
      uid: u.uid,
      content,
      created_at: hoursAgo(hrs),
      username: u.username,
      name: u.name,
      profile_picture: u.profile_picture
    }
  }
  const comments = {
    101: [
      mkComment(701, 101, 'marcus_strong', 'Monster pull 💪', 2),
      mkComment(702, 101, 'sofia_fit', '405 is yours next week!', 1)
    ],
    103: [mkComment(703, 103, 'maya_lifts', 'That WOD looks brutal 🔥', 8)],
    109: [mkComment(704, 109, 'jordan_hybrid', 'Welcome back! 🙌', 18)]
  }

  return {
    users: USERS.map((u) => ({ ...u })),
    posts: POSTS.map((p) => ({ ...p })),
    // demo user (uid 1) follows everyone else by default
    follows: USERS.filter((u) => u.uid !== DEMO_USER.uid).map((u) => u.uid),
    messages,
    likes,
    comments,
    // deterministic baseline so kudos counts look realistic with few demo users
    nextPid: 200,
    nextMid: 900,
    nextCommentId: 800
  }
}

export const EXERCISE_TYPES = (() => {
  const all = Object.entries(EX).map(([id, v]) => ({
    id: Number(id),
    name: v.name,
    muscle_group: v.muscle_group
  }))
  const byMuscleGroup = {}
  all.forEach((t) => {
    if (!byMuscleGroup[t.muscle_group]) byMuscleGroup[t.muscle_group] = []
    byMuscleGroup[t.muscle_group].push({ id: t.id, name: t.name })
  })
  return { all, byMuscleGroup }
})()

export { EX }
