import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Navbar.css'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Fuerza
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/explore" className="nav-link">Explore</Link>
          <Link to="/new-post" className="nav-link">New Post</Link>
          <Link to="/messages" className="nav-link">Messages</Link>
        </div>

        <div className="navbar-user">
          <Link to={`/profile/${user?.username}`} className="nav-link user-link">
            <img
              src={user?.profile_picture || '/uploads/default-avatar.png'}
              alt={user?.username}
              className="nav-avatar"
            />
            <span>{user?.username}</span>
          </Link>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
