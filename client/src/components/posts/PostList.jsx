import PostCard from './PostCard'

const PostList = ({ posts, onDelete, showDelete = false, emptyMessage = 'No posts yet' }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="empty-state">
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="post-list">
      {posts.map(post => (
        <PostCard
          key={post.pid}
          post={post}
          onDelete={onDelete}
          showDelete={showDelete}
        />
      ))}
    </div>
  )
}

export default PostList
