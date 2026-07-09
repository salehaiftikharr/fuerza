import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { postService } from '../services/postService'
import { useAuth } from '../context/AuthContext'
import PostList from '../components/posts/PostList'
import SearchBar from '../components/search/SearchBar'
import './HomePage.css'

const FeedSkeleton = () => (
  <div className="feed-skeletons">
    {[0, 1, 2].map((i) => (
      <div key={i} className="post-skeleton">
        <div className="sk-row">
          <div className="sk sk-avatar" />
          <div className="sk-col">
            <div className="sk sk-line short" />
            <div className="sk sk-line tiny" />
          </div>
        </div>
        <div className="sk sk-line" />
        <div className="sk sk-block" />
      </div>
    ))}
  </div>
)

const HomePage = () => {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('feed')

  useEffect(() => {
    loadPosts()
  }, [view])

  const loadPosts = async () => {
    setLoading(true)
    try {
      const data = view === 'feed' ? await postService.getFeed() : await postService.getExplore()
      setPosts(data)
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const firstName = user?.name ? user.name.split(' ')[0] : ''

  return (
    <div className="home-page">
      <div className="home-header">
        <div className="home-title-section">
          <h1>Your Feed</h1>
          <div className="view-toggle">
            <button
              className={`toggle-btn ${view === 'feed' ? 'active' : ''}`}
              onClick={() => setView('feed')}
            >
              Following
            </button>
            <button
              className={`toggle-btn ${view === 'explore' ? 'active' : ''}`}
              onClick={() => setView('explore')}
            >
              Explore
            </button>
          </div>
        </div>
        <SearchBar />
      </div>

      <Link to="/new-post" className="feed-composer">
        <img
          src={user?.profile_picture || '/uploads/default-avatar.png'}
          alt=""
          className="feed-composer-avatar"
        />
        <span className="feed-composer-prompt">
          {firstName ? `Log a workout, ${firstName}…` : 'Log a workout…'}
        </span>
        <span className="feed-composer-btn">Share</span>
      </Link>

      {loading ? (
        <FeedSkeleton />
      ) : (
        <PostList
          posts={posts}
          emptyMessage={
            view === 'feed'
              ? "No posts from people you follow yet. Try Explore to find athletes!"
              : 'No posts yet. Be the first to share your workout!'
          }
        />
      )}
    </div>
  )
}

export default HomePage
