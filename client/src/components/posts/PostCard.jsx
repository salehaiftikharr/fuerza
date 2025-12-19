import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import './PostCard.css'

const PostCard = ({ post, onDelete, showDelete = false }) => {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a')
    } catch {
      return dateString
    }
  }

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
            <span className="post-username">@{post.username}</span>
          </div>
        </Link>
        <span className="post-date">{formatDate(post.post_time)}</span>
      </div>

      {post.caption && (
        <p className="post-caption">{post.caption}</p>
      )}

      <div className="exercises-container">
        <h4 className="exercises-title">Workout</h4>
        <div className="exercises-scroll">
          {post.exercises?.map((exercise, index) => (
            <div key={index} className="exercise-card">
              <h5 className="exercise-name">{exercise.exercise_name}</h5>
              <div className="exercise-stats">
                <div className="stat">
                  <span className="stat-value">{exercise.sets}</span>
                  <span className="stat-label">Sets</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{exercise.reps}</span>
                  <span className="stat-label">Reps</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{exercise.weights}</span>
                  <span className="stat-label">lbs</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{exercise.rest_time}s</span>
                  <span className="stat-label">Rest</span>
                </div>
              </div>
              <span className="exercise-muscle">{exercise.muscle_group}</span>
            </div>
          ))}
        </div>
      </div>

      {showDelete && onDelete && (
        <div className="post-actions">
          <button onClick={() => onDelete(post.pid)} className="btn-delete">
            Delete Post
          </button>
        </div>
      )}
    </div>
  )
}

export default PostCard
