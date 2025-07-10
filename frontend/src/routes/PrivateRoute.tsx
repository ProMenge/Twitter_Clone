import { Navigate } from 'react-router-dom'
import { isAuthenticated } from '../utils/auth'
import type { JSX } from 'react'

interface ProtectedRouteProps {
  children: JSX.Element
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
