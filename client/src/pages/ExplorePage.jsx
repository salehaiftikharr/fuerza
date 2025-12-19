import { useState, useEffect } from 'react'
import { postService } from '../services/postService'
import PostList from '../components/posts/PostList'
import SearchBar from '../components/search/SearchBar'
import LoadingSpinner from '../components/common/LoadingSpinner'
import './ExplorePage.css'

const ExplorePage = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const data = await postService.getExplore()
      setPosts(data)
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="explore-page">
      <div className="explore-header">
        <h1>Explore</h1>
        <SearchBar />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <PostList
          posts={posts}
          emptyMessage="No posts yet. Be the first to share your workout!"
        />
      )}
    </div>
  )
}

export default ExplorePage
