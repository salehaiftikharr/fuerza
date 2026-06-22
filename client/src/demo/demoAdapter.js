// A custom axios adapter that serves the entire OpenAPI surface from an
// in-memory store when the app runs in Live Demo mode. This lets the deployed
// frontend be fully interactive (feed, posts, profiles, follows, messages)
// with no backend, and never breaks. Real mode (Railway) is untouched.

import { seedState, EXERCISE_TYPES, DEMO_USER, EX } from './demoData'

const STORAGE_KEY = 'fuerza_demo_state'

let store = null

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    /* ignore quota errors */
  }
}

function getStore() {
  if (store) return store
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      store = JSON.parse(raw)
      return store
    }
  } catch {
    /* fall through to fresh seed */
  }
  store = seedState()
  persist()
  return store
}

// Start a clean demo session (called on demo login).
export function resetDemoStore() {
  store = seedState()
  persist()
}

const FOLLOW_STATS = {
  1: { followers: 128, following: 5 },
  2: { followers: 2400, following: 312 },
  3: { followers: 1830, following: 205 },
  4: { followers: 980, following: 410 },
  5: { followers: 1520, following: 388 },
  6: { followers: 760, following: 540 }
}

const byUid = (uid) => getStore().users.find((u) => u.uid === Number(uid))
const byUsername = (name) => getStore().users.find((u) => u.username === name)
const newest = (a, b) => new Date(b.post_time) - new Date(a.post_time)
const oldest = (a, b) => new Date(a.post_time) - new Date(b.post_time)

function decoratePost(p) {
  const u = byUid(p.uid) || {}
  return { ...p, username: u.username, name: u.name, profile_picture: u.profile_picture }
}

function handle(config) {
  const method = (config.method || 'get').toLowerCase()
  const url = (config.url || '').split('?')[0]
  const params = config.params || {}
  let body = {}
  try {
    body = config.data ? JSON.parse(config.data) : {}
  } catch {
    body = {}
  }
  const s = getStore()

  // ---- Auth ----
  if (url === '/auth/login' && method === 'post')
    return { accessToken: 'demo-token', refreshToken: 'demo-refresh', user: byUid(1) }
  if (url === '/auth/signup' && method === 'post')
    return { accessToken: 'demo-token', refreshToken: 'demo-refresh', user: byUid(1) }
  if (url === '/auth/logout') return { message: 'ok' }
  if (url === '/auth/me') return byUid(1)
  if (url === '/auth/refresh') return { accessToken: 'demo-token', refreshToken: 'demo-refresh' }

  // ---- Users ----
  if (url === '/users/profile' && method === 'put') {
    const u = byUid(1)
    if (body.name !== undefined) u.name = body.name
    if (body.profile_bio !== undefined) u.profile_bio = body.profile_bio
    persist()
    return { user: u }
  }
  if (url === '/users/profile/picture' && method === 'post') {
    return { profile_picture: byUid(1).profile_picture }
  }
  if (url === '/users/search/query' && method === 'get') {
    const term = (params.term || '').toLowerCase()
    const field = params.searchBy === 'name' ? 'name' : 'username'
    return s.users
      .filter((u) => (u[field] || '').toLowerCase().includes(term))
      .map((u) => ({
        uid: u.uid,
        username: u.username,
        name: u.name,
        profile_picture: u.profile_picture
      }))
  }
  const profileMatch = url.match(/^\/users\/([^/]+)$/)
  if (profileMatch && method === 'get') {
    const u = byUsername(profileMatch[1])
    if (!u) throw buildError(404, 'User not found')
    const stats = FOLLOW_STATS[u.uid] || { followers: 0, following: 0 }
    return {
      uid: u.uid,
      username: u.username,
      name: u.name,
      profile_picture: u.profile_picture,
      profile_bio: u.profile_bio,
      followers: stats.followers,
      following: u.uid === DEMO_USER.uid ? s.follows.length : stats.following,
      isFollowing: s.follows.includes(u.uid),
      isOwnProfile: u.uid === DEMO_USER.uid
    }
  }

  // ---- Posts ----
  if (url === '/posts/feed' && method === 'get')
    return s.posts.filter((p) => s.follows.includes(p.uid)).sort(newest).map(decoratePost)
  if (url === '/posts/explore' && method === 'get')
    return s.posts.slice().sort(newest).map(decoratePost)
  const userPosts = url.match(/^\/posts\/user\/(\d+)$/)
  if (userPosts && method === 'get')
    return s.posts.filter((p) => p.uid === Number(userPosts[1])).sort(newest).map(decoratePost)
  if (url === '/posts' && method === 'post') {
    const exercises = (body.exercises || []).map((e) => ({
      exercise_name: EX[e.exerciseTypeId]?.name || 'Exercise',
      muscle_group: EX[e.exerciseTypeId]?.muscle_group || '',
      sets: e.sets,
      reps: e.reps,
      weights: e.weight,
      rest_time: e.restTime
    }))
    const post = {
      pid: s.nextPid++,
      uid: DEMO_USER.uid,
      caption: body.caption || '',
      post_time: new Date().toISOString(),
      exercises
    }
    s.posts.unshift(post)
    persist()
    return decoratePost(post)
  }
  const postId = url.match(/^\/posts\/(\d+)$/)
  if (postId && method === 'delete') {
    s.posts = s.posts.filter((p) => p.pid !== Number(postId[1]))
    persist()
    return { message: 'deleted' }
  }
  if (postId && method === 'get') {
    const p = s.posts.find((x) => x.pid === Number(postId[1]))
    return p ? decoratePost(p) : {}
  }

  // ---- Exercises ----
  if (url === '/exercises/types') return EXERCISE_TYPES

  // ---- Likes (not surfaced in UI; safe stubs) ----
  if (/^\/likes\/\d+$/.test(url) && method === 'post') return { liked: true }
  if (/^\/likes\/\d+$/.test(url) && method === 'delete') return { liked: false }
  if (/^\/likes\/\d+\/status$/.test(url)) return { liked: false, count: 0 }
  if (/^\/likes\/\d+\/users$/.test(url)) return []

  // ---- Comments (safe stubs) ----
  if (/^\/comments\/\d+$/.test(url) && method === 'get') return []
  if (/^\/comments\/\d+$/.test(url)) return { message: 'ok' }

  // ---- Follows ----
  const follow = url.match(/^\/follows\/(\d+)$/)
  if (follow && method === 'post') {
    const uid = Number(follow[1])
    if (!s.follows.includes(uid)) s.follows.push(uid)
    persist()
    return { following: true }
  }
  if (follow && method === 'delete') {
    s.follows = s.follows.filter((x) => x !== Number(follow[1]))
    persist()
    return { following: false }
  }
  const followStatus = url.match(/^\/follows\/(\d+)\/status$/)
  if (followStatus) return { isFollowing: s.follows.includes(Number(followStatus[1])) }
  if (/^\/follows\/\d+\/(followers|following)$/.test(url)) return []

  // ---- Messages ----
  if (url === '/messages/conversations' && method === 'get') {
    const groups = {}
    s.messages.forEach((m) => {
      const other = m.from_uid === DEMO_USER.uid ? m.to_uid : m.from_uid
      ;(groups[other] = groups[other] || []).push(m)
    })
    return Object.entries(groups)
      .map(([uid, msgs]) => {
        const u = byUid(uid) || {}
        const last = msgs.slice().sort(oldest).pop()
        return {
          other_uid: Number(uid),
          username: u.username,
          name: u.name,
          profile_picture: u.profile_picture,
          last_message: last ? last.contents : '',
          unread_count: 0,
          _time: last ? last.post_time : ''
        }
      })
      .sort((a, b) => new Date(b._time) - new Date(a._time))
  }
  const msgUid = url.match(/^\/messages\/(\d+)$/)
  if (msgUid && method === 'get') {
    const other = Number(msgUid[1])
    return s.messages
      .filter(
        (m) =>
          (m.from_uid === DEMO_USER.uid && m.to_uid === other) ||
          (m.from_uid === other && m.to_uid === DEMO_USER.uid)
      )
      .sort(oldest)
  }
  if (msgUid && method === 'post') {
    const msg = {
      mid: s.nextMid++,
      from_uid: DEMO_USER.uid,
      to_uid: Number(msgUid[1]),
      contents: body.contents,
      post_time: new Date().toISOString(),
      is_read: true
    }
    s.messages.push(msg)
    persist()
    return msg
  }
  if (/^\/messages\/\d+\/read$/.test(url)) return { message: 'ok' }
  if (url === '/messages/unread') return { count: 0 }

  // Unknown route: return empty so nothing throws in the demo.
  return {}
}

function buildError(status, message) {
  const err = new Error(message)
  err.response = { status, data: { message } }
  return err
}

// axios adapter signature: (config) => Promise<response>
export default function demoAdapter(config) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const data = handle(config)
        resolve({ data, status: 200, statusText: 'OK', headers: {}, config, request: {} })
      } catch (err) {
        err.config = config
        reject(err)
      }
    }, 140)
  })
}
