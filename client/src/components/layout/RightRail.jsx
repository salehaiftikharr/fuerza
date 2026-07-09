import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { postService } from '../../services/postService'
import { followService } from '../../services/followService'
import './RightRail.css'

const DAY = 24 * 60 * 60 * 1000

const volumeOf = (post) =>
  (post.exercises || []).reduce(
    (t, e) => t + (Number(e.sets) || 0) * (Number(e.reps) || 0) * (Number(e.weights) || 0),
    0
  )

const RightRail = () => {
  const { user } = useAuth()
  const [week, setWeek] = useState(null)
  const [suggested, setSuggested] = useState([])
  const [followed, setFollowed] = useState({})

  useEffect(() => {
    if (!user?.uid) return
    let active = true

    postService
      .getUserPosts(user.uid)
      .then((posts) => {
        if (!active) return
        const now = Date.now()
        const weekAgo = now - 7 * DAY
        const recent = (posts || []).filter((p) => new Date(p.post_time).getTime() >= weekAgo)
        // volume per day, oldest to newest (last 7 days)
        const daily = Array(7).fill(0)
        recent.forEach((p) => {
          const dayIndex = 6 - Math.floor((now - new Date(p.post_time).getTime()) / DAY)
          if (dayIndex >= 0 && dayIndex < 7) daily[dayIndex] += volumeOf(p)
        })
        setWeek({
          workouts: recent.length,
          volume: recent.reduce((t, p) => t + volumeOf(p), 0),
          sets: recent.reduce(
            (t, p) => t + (p.exercises || []).reduce((s, e) => s + (Number(e.sets) || 0), 0),
            0
          ),
          daily
        })
      })
      .catch(() => active && setWeek({ workouts: 0, volume: 0, sets: 0, daily: Array(7).fill(0) }))

    postService
      .getExplore()
      .then((posts) => {
        if (!active) return
        const seen = new Set()
        const people = []
        for (const p of posts || []) {
          if (p.uid === user.uid || seen.has(p.uid)) continue
          seen.add(p.uid)
          people.push({ uid: p.uid, username: p.username, name: p.name, profile_picture: p.profile_picture })
          if (people.length >= 3) break
        }
        setSuggested(people)
      })
      .catch(() => {})

    return () => {
      active = false
    }
  }, [user?.uid])

  const follow = async (uid) => {
    setFollowed((f) => ({ ...f, [uid]: true }))
    try {
      await followService.follow(uid)
    } catch {
      setFollowed((f) => ({ ...f, [uid]: false }))
    }
  }

  const maxDaily = week ? Math.max(...week.daily, 1) : 1

  return (
    <aside className="rail">
      <section className="rail-card">
        <h3 className="rail-title">Your week</h3>
        {week ? (
          <>
            <div className="rail-stats">
              <div className="rail-stat">
                <span className="rail-stat-value">{week.workouts}</span>
                <span className="rail-stat-label">Workouts</span>
              </div>
              <div className="rail-stat">
                <span className="rail-stat-value">{(week.volume / 1000).toFixed(1)}k</span>
                <span className="rail-stat-label">lbs volume</span>
              </div>
              <div className="rail-stat">
                <span className="rail-stat-value">{week.sets}</span>
                <span className="rail-stat-label">Sets</span>
              </div>
            </div>
            <div className="rail-chart" aria-hidden="true">
              {week.daily.map((v, i) => (
                <span key={i} className="rail-bar" style={{ height: `${8 + (v / maxDaily) * 92}%` }} />
              ))}
            </div>
            <p className="rail-chart-caption">Volume, last 7 days</p>
          </>
        ) : (
          <div className="rail-skeleton" />
        )}
      </section>

      {suggested.length > 0 && (
        <section className="rail-card">
          <h3 className="rail-title">Athletes to follow</h3>
          <div className="rail-people">
            {suggested.map((p) => (
              <div key={p.uid} className="rail-person">
                <Link to={`/profile/${p.username}`} className="rail-person-link">
                  <img
                    src={p.profile_picture || '/uploads/default-avatar.png'}
                    alt={p.username}
                    className="rail-person-avatar"
                  />
                  <span className="rail-person-meta">
                    <span className="rail-person-name">{p.name}</span>
                    <span className="rail-person-handle">@{p.username}</span>
                  </span>
                </Link>
                <button
                  className="rail-follow"
                  onClick={() => follow(p.uid)}
                  disabled={followed[p.uid]}
                >
                  {followed[p.uid] ? 'Following' : 'Follow'}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <p className="rail-foot">
        Built by Saleha Iftikhar · <a href="https://github.com/salehaiftikharr/fuerza" target="_blank" rel="noreferrer">Source</a>
      </p>
    </aside>
  )
}

export default RightRail
