import { useState } from 'react'
import { followService } from '../../services/followService'
import './FollowButton.css'

const FollowButton = ({ uid, initialIsFollowing, onFollowChange }) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      if (isFollowing) {
        await followService.unfollow(uid)
        setIsFollowing(false)
      } else {
        await followService.follow(uid)
        setIsFollowing(true)
      }
      if (onFollowChange) {
        onFollowChange(!isFollowing)
      }
    } catch (error) {
      console.error('Follow error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`follow-btn ${isFollowing ? 'following' : ''}`}
    >
      {loading ? '...' : isFollowing ? 'Following' : 'Follow'}
    </button>
  )
}

export default FollowButton
