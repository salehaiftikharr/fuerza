import { useState } from 'react'
import { userService } from '../../services/userService'
import { Link } from 'react-router-dom'
import './SearchBar.css'

const SearchBar = () => {
  const [query, setQuery] = useState('')
  const [searchBy, setSearchBy] = useState('username')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handleSearch = async (e) => {
    const value = e.target.value
    setQuery(value)

    if (value.trim().length < 2) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const users = await userService.search(value, searchBy)
      setResults(users)
      setShowResults(true)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="search-bar-container">
      <div className="search-input-group">
        <input
          type="text"
          className="search-input"
          placeholder="Search users..."
          value={query}
          onChange={handleSearch}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
        />
        <select
          className="search-select"
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
        >
          <option value="username">Username</option>
          <option value="name">Name</option>
          <option value="gym">Gym</option>
        </select>
      </div>

      {showResults && results.length > 0 && (
        <div className="search-results">
          {results.map(user => (
            <Link
              key={user.uid}
              to={`/profile/${user.username}`}
              className="search-result-item"
            >
              <img
                src={user.profile_picture || '/uploads/default-avatar.png'}
                alt={user.username}
                className="search-result-avatar"
              />
              <div>
                <span className="search-result-name">{user.name}</span>
                <span className="search-result-username">@{user.username}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {showResults && query.length >= 2 && results.length === 0 && !loading && (
        <div className="search-results">
          <div className="search-no-results">No users found</div>
        </div>
      )}
    </div>
  )
}

export default SearchBar
