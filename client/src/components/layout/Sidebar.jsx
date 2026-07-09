import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { isDemoMode } from '../../demo/demoMode'
import './Sidebar.css'

// Minimal stroke icons so the nav reads modern rather than emoji-y.
const Icon = ({ path, filled }) => (
  <svg
    className="side-icon"
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {path}
  </svg>
)

const icons = {
  home: <path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  explore: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5z" />
    </>
  ),
  messages: <path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z" />,
  profile: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />
}

const links = [
  { to: '/', label: 'Home', icon: 'home', end: true },
  { to: '/explore', label: 'Explore', icon: 'explore' },
  { to: '/messages', label: 'Messages', icon: 'messages' }
]

const Sidebar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <Link to="/" className="sidebar-brand">
        Fuerza
        {isDemoMode() && <span className="sidebar-demo">DEMO</span>}
      </Link>

      <nav className="sidebar-nav">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Icon path={icons[l.icon]} />
            <span>{l.label}</span>
          </NavLink>
        ))}
        {user?.username && (
          <NavLink
            to={`/profile/${user.username}`}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Icon path={icons.profile} />
            <span>Profile</span>
          </NavLink>
        )}
      </nav>

      <Link to="/new-post" className="sidebar-cta">
        <Icon path={icons.plus} />
        <span>Share a workout</span>
      </Link>

      <div className="sidebar-foot">
        {user?.username && (
          <Link to={`/profile/${user.username}`} className="sidebar-user">
            <img
              src={user.profile_picture || '/uploads/default-avatar.png'}
              alt={user.username}
              className="sidebar-avatar"
            />
            <span className="sidebar-user-meta">
              <span className="sidebar-user-name">{user.name || user.username}</span>
              <span className="sidebar-user-handle">@{user.username}</span>
            </span>
          </Link>
        )}
        <button onClick={handleLogout} className="sidebar-logout" title="Log out">
          Log out
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
