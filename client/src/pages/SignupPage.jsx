import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import SignupForm from '../components/auth/SignupForm'

const SignupPage = () => {
  const { user, loading } = useAuth()

  if (loading) return null

  if (user) {
    return <Navigate to="/" replace />
  }

  return <SignupForm />
}

export default SignupPage
