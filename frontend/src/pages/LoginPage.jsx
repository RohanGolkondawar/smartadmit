import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap, Eye, EyeOff, Mail, Lock, GraduationCap as StudentIcon, School, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'

const ROLES = [
  {
    id: 'STUDENT',
    label: 'Student',
    icon: '🎓',
    color: '#2563eb',
    bg: '#dbeafe',
    border: '#93c5fd',
    desc: 'Apply to schools & track admissions'
  },
  {
    id: 'SCHOOL',
    label: 'School',
    icon: '🏫',
    color: '#059669',
    bg: '#dcfce7',
    border: '#6ee7b7',
    desc: 'Manage applications & students'
  },
  {
    id: 'ADMIN',
    label: 'Admin',
    icon: '🛡️',
    color: '#7c3aed',
    bg: '#ede9fe',
    border: '#c4b5fd',
    desc: 'Full platform control & oversight'
  }
]

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState('STUDENT')
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const activeRole = ROLES.find(r => r.id === selectedRole)

  const submit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      const { token, user } = res.data

      // Validate role matches
      if (user.role !== selectedRole) {
        setError(`This account is not a ${selectedRole.charAt(0) + selectedRole.slice(1).toLowerCase()} account. Please select the correct role.`)
        setLoading(false)
        return
      }

      login(user, token)
      toast.success(`Welcome back, ${user.name}!`)
      if (user.role === 'STUDENT') navigate('/student')
      else if (user.role === 'SCHOOL') navigate('/school')
      else navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">

      {/* Left decorative panel — hidden on mobile */}
      <div className="login-left-panel">
        <div className="login-left-content">
          <div className="login-left-logo">
            <GraduationCap size={36} color="#fff" />
          </div>
          <h1 className="login-left-title">
            Smart<span style={{ color: '#60a5fa' }}>Admit</span>
          </h1>
          <p className="login-left-subtitle">
            India's smartest school admission platform. One login for students, schools, and admins.
          </p>
          <div className="login-left-features">
            {[
              { icon: '🎓', text: 'Students apply to multiple schools' },
              { icon: '🏫', text: 'Schools manage admissions easily' },
              { icon: '🛡️', text: 'Admins control the full platform' },
              { icon: '📊', text: 'Real-time application tracking' },
            ].map(({ icon, text }) => (
              <div key={text} className="login-left-feature-item">
                <span className="login-feature-icon">{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="login-right-panel">
        <div className="login-form-wrap">

          {/* Logo — shown on mobile only */}
          <Link to="/" className="login-mobile-logo">
            <div className="login-mobile-logo-icon">
              <GraduationCap size={18} color="#fff" />
            </div>
            <span className="login-mobile-logo-text">SmartAdmit</span>
          </Link>

          <h2 className="login-title">Welcome back 👋</h2>
          <p className="login-subtitle">Select your role and sign in to continue</p>

          {/* Role Selector */}
          <div className="role-selector">
            {ROLES.map(role => (
              <button
                key={role.id}
                type="button"
                className={`role-btn${selectedRole === role.id ? ' role-btn-active' : ''}`}
                style={{
                  borderColor: selectedRole === role.id ? role.color : 'var(--border)',
                  background: selectedRole === role.id ? role.bg : '#fff',
                }}
                onClick={() => { setSelectedRole(role.id); setError('') }}
              >
                <span className="role-btn-icon">{role.icon}</span>
                <span className="role-btn-label" style={{ color: selectedRole === role.id ? role.color : 'var(--text)' }}>
                  {role.label}
                </span>
                <span className="role-btn-desc">{role.desc}</span>
                {selectedRole === role.id && (
                  <span className="role-btn-check" style={{ background: role.color }}>✓</span>
                )}
              </button>
            ))}
          </div>

          {/* Role info bar */}
          <div className="role-info-bar" style={{ background: activeRole.bg, borderColor: activeRole.border }}>
            <span>{activeRole.icon}</span>
            <span style={{ color: activeRole.color, fontWeight: 600, fontSize: '0.85rem' }}>
              Signing in as <strong>{activeRole.label}</strong> — {activeRole.desc}
            </span>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {/* Form */}
          <form onSubmit={submit} className="login-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-icon-wrap">
                <Mail size={16} className="input-icon" />
                <input
                  name="email" type="email"
                  className="form-input input-with-icon"
                  placeholder="Enter your email"
                  value={form.email} onChange={handle} required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-icon-wrap">
                <Lock size={16} className="input-icon" />
                <input
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  className="form-input input-with-icon"
                  placeholder="Enter your password"
                  value={form.password} onChange={handle}
                  required style={{ paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="input-eye-btn">
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full login-submit-btn"
              disabled={loading}
              style={{ background: activeRole.color }}
            >
              {loading
                ? <><span className="spinner" />Signing in…</>
                : <>{activeRole.icon} Sign in as {activeRole.label}</>
              }
            </button>
          </form>

          {selectedRole === 'STUDENT' && (
            <p className="login-register-text">
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">Register here</Link>
            </p>
          )}

          {selectedRole !== 'STUDENT' && (
            <p className="login-register-text" style={{ color: 'var(--text-muted)', fontSize: '0.82rem', textAlign: 'center', marginTop: 16 }}>
              {selectedRole === 'SCHOOL'
                ? '🏫 School accounts are created by the administrator.'
                : '🛡️ Admin accounts are managed internally.'}
            </p>
          )}

          <div className="login-back-home">
            <Link to="/" className="auth-link" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              ← Back to Home
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
