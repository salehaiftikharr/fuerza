import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import ThemeToggle from './components/common/ThemeToggle'
import ProtectedRoute from './components/auth/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import ExplorePage from './pages/ExplorePage'
import ProfilePage from './pages/ProfilePage'
import EditProfilePage from './pages/EditProfilePage'
import NewPostPage from './pages/NewPostPage'
import MessagesPage from './pages/MessagesPage'

const protectedPage = (element, rail = true) => (
  <ProtectedRoute>
    <AppLayout rail={rail}>{element}</AppLayout>
  </ProtectedRoute>
)

const App = () => {
  return (
    <>
      <ThemeToggle />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected routes */}
        <Route path="/" element={protectedPage(<HomePage />)} />
        <Route path="/explore" element={protectedPage(<ExplorePage />)} />
        <Route path="/profile/:username" element={protectedPage(<ProfilePage />)} />
        <Route path="/edit-profile" element={protectedPage(<EditProfilePage />, false)} />
        <Route path="/new-post" element={protectedPage(<NewPostPage />, false)} />
        <Route path="/messages" element={protectedPage(<MessagesPage />, false)} />
      </Routes>
    </>
  )
}

export default App
