import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { likeService } from '../../services/likeService'
import { commentService } from '../../services/commentService'
import { useAuth } from '../../context/AuthContext'
import './PostCard.css'

// Color per muscle group so the feed is scannable at a glance.
const MUSCLE_COLORS = {
  Chest: '#ff7a45',
  Legs: '#6ea8fe',
  Back: '#2bd576',
  Shoulders: '#ffb02e',
  Arms: '#ff3d6e',
  Core: '#8b7cff'
}

const PostCard = ({ post, onDelete, showDelete = false }) => {
  const { user } = useAuth()
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [comments, setComments] = useState([])
  const [commentCount, setCommentCount] = useState(0)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let active = true
    likeService
      .getLikeStatus(post.pid)
      .then((d) => active && (setLiked(!!d.liked), setLikeCount(d.likeCount || 0)))
      .catch(() => {})
    commentService
      .getComments(post.pid)
      .then((d) => {
        if (!active) return
        const list = d.comments || []
        setComments(list)
        setCommentCount(d.commentCount ?? list.length)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [post.pid])

  const toggleLike = async () => {
    const next = !liked
    setLiked(next)
    setLikeCount((c) => c + (next ? 1 : -1))
    try {
      const d = next ? await likeService.likePost(post.pid) : await likeService.unlikePost(post.pid)
      setLiked(!!d.liked)
      if (typeof d.likeCount === 'number') setLikeCount(d.likeCount)
    } catch {
      setLiked(!next)
      setLikeCount((c) => c + (next ? -1 : 1))
    }
  }

  const submitComment = async (e) => {
    e.preventDefault()
    const text = newComment.trim()
    if (!text || busy) return
    setBusy(true)
    const optimistic = {
      comment_id: `tmp-${text.length}-${commentCount}`,
      content: text,
      created_at: new Date().toISOString(),
      uid: user?.uid,
      username: user?.username,
      name: user?.name,
      profile_picture: user?.profile_picture
    }
    setComments((c) => [...c, optimistic])
    setCommentCount((n) => n + 1)
    setNewComment('')
    try {
      await commentService.createComment(post.pid, text)
      const d = await commentService.getComments(post.pid)
      setComments(d.comments || [])
      setCommentCount(d.commentCount ?? (d.comments || []).length)
    } catch {
      /* keep optimistic comment */
    } finally {
      setBusy(false)
    }
  }

  const formatDate = (s) => {
    try {
      return format(new Date(s), "MMM d · h:mm a")
    } catch {
      return s
    }
  }

  const exercises = post.exercises || []
  const totalVolume = exercises.reduce(
    (t, e) => t + (Number(e.sets) || 0) * (Number(e.reps) || 0) * (Number(e.weights) || 0),
    0
  )
  const totalSets = exercises.reduce((t, e) => t + (Number(e.sets) || 0), 0)
  const muscleGroups = [...new Set(exercises.map((e) => e.muscle_group).filter(Boolean))]
  const topSet = exercises.reduce(
    (best, e) => ((Number(e.weights) || 0) > (Number(best?.weights) || 0) ? e : best),
    null
  )

  return (
    <div className="post-card">
      <div className="post-header">
        <Link to={`/profile/${post.username}`} className="post-user">
          <img
            src={post.profile_picture || '/uploads/default-avatar.png'}
            alt={post.username}
            className="post-avatar"
          />
          <div className="post-user-info">
            <span className="post-name">{post.name}</span>
            <span className="post-username">@{post.username} · {formatDate(post.post_time)}</span>
          </div>
        </Link>
        {showDelete && onDelete && (
          <button onClick={() => onDelete(post.pid)} className="post-menu-delete" title="Delete post">
            ✕
          </button>
        )}
      </div>

      {post.caption && <p className="post-caption">{post.caption}</p>}

      {muscleGroups.length > 0 && (
        <div className="post-tags">
          {muscleGroups.map((m) => (
            <span
              key={m}
              className="muscle-chip"
              style={{ color: MUSCLE_COLORS[m] || 'var(--primary-color)' }}
            >
              {m}
            </span>
          ))}
        </div>
      )}

      <div className="post-summary">
        <div className="summary-item">
          <span className="summary-value">{exercises.length}</span>
          <span className="summary-label">Exercises</span>
        </div>
        <div className="summary-item">
          <span className="summary-value">{totalVolume.toLocaleString()}</span>
          <span className="summary-label">lbs Volume</span>
        </div>
        <div className="summary-item">
          <span className="summary-value">{totalSets}</span>
          <span className="summary-label">Total Sets</span>
        </div>
      </div>

      {topSet && Number(topSet.weights) > 0 && (
        <div className="top-set">
          <span className="top-set-badge">Top set</span>
          <span className="top-set-text">
            {topSet.exercise_name} · {Number(topSet.weights).toLocaleString()} lbs × {topSet.reps}
          </span>
        </div>
      )}

      <div className="exercises-scroll">
        {exercises.map((ex, index) => (
          <div key={index} className="exercise-card">
            <h5 className="exercise-name">{ex.exercise_name}</h5>
            <span className="exercise-muscle">{ex.muscle_group}</span>
            <div className="exercise-stats">
              <div className="stat">
                <span className="stat-value">{ex.sets}</span>
                <span className="stat-label">Sets</span>
              </div>
              <div className="stat">
                <span className="stat-value">{ex.reps}</span>
                <span className="stat-label">Reps</span>
              </div>
              <div className="stat">
                <span className="stat-value">{ex.weights}</span>
                <span className="stat-label">lbs</span>
              </div>
              <div className="stat">
                <span className="stat-value">{ex.rest_time}s</span>
                <span className="stat-label">Rest</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="post-actions-bar">
        <button className={`action-btn ${liked ? 'liked' : ''}`} onClick={toggleLike}>
          <span className="action-icon">{liked ? '🔥' : '👏'}</span>
          <span>{likeCount} Kudos</span>
        </button>
        <button
          className={`action-btn ${showComments ? 'active' : ''}`}
          onClick={() => setShowComments((v) => !v)}
        >
          <span className="action-icon">💬</span>
          <span>{commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}</span>
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          {comments.map((c) => (
            <div key={c.comment_id} className="comment">
              <img
                src={c.profile_picture || '/uploads/default-avatar.png'}
                alt={c.username}
                className="comment-avatar"
              />
              <div className="comment-body">
                <span className="comment-name">
                  {c.name} <span className="comment-username">@{c.username}</span>
                </span>
                <span className="comment-text">{c.content}</span>
              </div>
            </div>
          ))}
          {comments.length === 0 && <p className="comment-empty">Be the first to comment.</p>}
          <form className="comment-form" onSubmit={submitComment}>
            <input
              className="form-control"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              maxLength={1000}
            />
            <button type="submit" className="btn btn-primary" disabled={busy || !newComment.trim()}>
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default PostCard
