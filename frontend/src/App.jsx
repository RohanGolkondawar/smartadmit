import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import StudentDashboard from './pages/student/StudentDashboard'
import SchoolDashboard from './pages/school/SchoolDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'

function PrivateRoute({ children, role }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading">Loading…</div>
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return children
}

export default function App() {
  const { user } = useAuth()

  const dashRoute = () => {
    if (!user) return '/login'
    if (user.role === 'STUDENT') return '/student'
    if (user.role === 'SCHOOL') return '/school'
    if (user.role === 'ADMIN') return '/admin'
    return '/login'
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={user ? <Navigate to={dashRoute()} /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to={dashRoute()} /> : <RegisterPage />} />
      <Route path="/student/*" element={
        <PrivateRoute role="STUDENT"><StudentDashboard /></PrivateRoute>
      } />
      <Route path="/school/*" element={
        <PrivateRoute role="SCHOOL"><SchoolDashboard /></PrivateRoute>
      } />
      <Route path="/admin/*" element={
        <PrivateRoute role="ADMIN"><AdminDashboard /></PrivateRoute>
      } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
