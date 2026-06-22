import { useState } from 'react'
import './ThemeToggle.css'

const current = () => document.documentElement.getAttribute('data-theme') || 'dark'

const ThemeToggle = () => {
  const [theme, setTheme] = useState(current())

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem('theme', next)
    } catch {
      /* ignore */
    }
    setTheme(next)
  }

  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      aria-label="Toggle light and dark mode"
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  )
}

export default ThemeToggle
