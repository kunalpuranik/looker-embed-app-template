import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'

export const Authenticated = ({ children }) => {
  const { user } = useAuth()
  if (!user) {
    return <Navigate to="/login" />
  }
  return children
}
