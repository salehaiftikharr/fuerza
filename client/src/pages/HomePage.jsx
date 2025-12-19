import { useState, useEffect } from 'react'
import { postService } from '../services/postService'
import PostList from '../components/posts/PostList'
import SearchBar from '../components/search/SearchBar'
import LoadingSpinner from '../components/common/LoadingSpinner'
import './HomePage.css'

const HomePage = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('feed')

  useEffect(() => {
    loadPosts()
  }, [view])

  const loadPosts = async () => {
    setLoading(true)
    try {
      const data = view === 'feed'
        ? await postService.getFeed()
        : await postService.getExplore()
      setPosts(data)
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
  }

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

      {loading ? (
        <LoadingSpinner />
      ) : (
        <PostList
          posts={posts}
          emptyMessage={
            view === 'feed'
              ? "No posts from people you follow. Try exploring!"
              : "No posts yet. Be the first to share your workout!"
          }
        />
      )}
    </div>
  )
}

export default HomePage
