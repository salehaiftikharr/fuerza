import { Routes, Route } from 'react-router-dom'
import Navbar from './components/common/Navbar'
import ProtectedRoute from './components/auth/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import ExplorePage from './pages/ExplorePage'
import ProfilePage from './pages/ProfilePage'
import EditProfilePage from './pages/EditProfilePage'
import NewPostPage from './pages/NewPostPage'
import MessagesPage from './pages/MessagesPage'

const App = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Protected routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Navbar />
          <HomePage />
        </ProtectedRoute>
      } />

      <Route path="/explore" element={
        <ProtectedRoute>
          <Navbar />
          <ExplorePage />
        </ProtectedRoute>
      } />

      <Route path="/profile/:username" element={
        <ProtectedRoute>
          <Navbar />
          <ProfilePage />
        </ProtectedRoute>
      } />

      <Route path="/edit-profile" element={
        <ProtectedRoute>
          <Navbar />
          <EditProfilePage />
        </ProtectedRoute>
      } />

      <Route path="/new-post" element={
        <ProtectedRoute>
          <Navbar />
          <NewPostPage />
        </ProtectedRoute>
      } />

      <Route path="/messages" element={
        <ProtectedRoute>
          <Navbar />
          <MessagesPage />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App
