import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { userService } from '../services/userService'
import { postService } from '../services/postService'
import { useAuth } from '../context/AuthContext'
import PostList from '../components/posts/PostList'
import FollowButton from '../components/profile/FollowButton'
import LoadingSpinner from '../components/common/LoadingSpinner'
import './ProfilePage.css'

const ProfilePage = () => {
  const { username } = useParams()
  const { user: currentUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadProfile()
  }, [username])

  const loadProfile = async () => {
    setLoading(true)
    setError('')
    try {
      const profileData = await userService.getProfile(username)
      setProfile(profileData)

      const userPosts = await postService.getUserPosts(profileData.uid)
      setPosts(userPosts)
    } catch (err) {
      setError('User not found')
    } finally {
      setLoading(false)
    }
  }

  const handleFollowChange = (isNowFollowing) => {
    setProfile(prev => ({
      ...prev,
      followers: prev.followers + (isNowFollowing ? 1 : -1),
      isFollowing: isNowFollowing
    }))
  }

  const handleDeletePost = async (pid) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return

    try {
      await postService.deletePost(pid)
      setPosts(posts.filter(p => p.pid !== pid))
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  if (loading) return <LoadingSpinner />

  if (error) {
    return (
      <div className="profile-page">
        <div className="error-container">
          <h2>{error}</h2>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img
          src={profile.profile_picture || '/uploads/default-avatar.png'}
          alt={profile.username}
          className="profile-picture"
        />

        <div className="profile-info">
          <div className="profile-top">
            <h1 className="profile-name">{profile.name}</h1>
            {profile.isOwnProfile ? (
              <Link to="/edit-profile" className="btn btn-outline">
                Edit Profile
              </Link>
            ) : (
              <FollowButton
                uid={profile.uid}
                initialIsFollowing={profile.isFollowing}
                onFollowChange={handleFollowChange}
              />
            )}
          </div>

          <p className="profile-username">@{profile.username}</p>

          {profile.profile_bio && (
            <p className="profile-bio">{profile.profile_bio}</p>
          )}

          <div className="profile-stats">
            <div className="stat">
              <span className="stat-value">{posts.length}</span>
              <span className="stat-label">Posts</span>
            </div>
            <div className="stat">
              <span className="stat-value">{profile.followers}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat">
              <span className="stat-value">{profile.following}</span>
              <span className="stat-label">Following</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-posts">
        <h2>Workouts</h2>
        <PostList
          posts={posts}
          onDelete={handleDeletePost}
          showDelete={profile.isOwnProfile}
          emptyMessage="No workouts posted yet"
        />
      </div>
    </div>
  )
}

export default ProfilePage
