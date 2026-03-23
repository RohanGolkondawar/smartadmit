import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap, Eye, EyeOff, User, Mail, Phone, Lock } from 'lucide-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'STUDENT' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await api.post('/auth/register', { ...form, role: 'STUDENT' })
      toast.success('Account created! Please login.')
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Logo */}
        <Link to="/" className="auth-logo">
          <div className="auth-logo-icon">
            <GraduationCap size={20} color="#fff" />
          </div>
          <span className="auth-logo-text">SmartAdmit</span>
        </Link>

        {/* Header */}
        <div className="auth-header">
          <div className="auth-badge">🎓 Student Registration</div>
          <h2 className="auth-title">Create Your Account</h2>
          <p className="auth-subtitle">Join SmartAdmit and start your admission journey today</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={submit} className="auth-form">

          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-icon-wrap">
              <User size={16} className="input-icon" />
              <input
                name="name" type="text" className="form-input input-with-icon"
                placeholder="Enter your full name"
                value={form.name} onChange={handle} required
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-icon-wrap">
              <Mail size={16} className="input-icon" />
              <input
                name="email" type="email" className="form-input input-with-icon"
                placeholder="you@example.com"
                value={form.email} onChange={handle} required
              />
            </div>
          </div>

          {/* Phone + Password side by side on desktop */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div className="input-icon-wrap">
                <Phone size={16} className="input-icon" />
                <input
                  name="phone" type="tel" className="form-input input-with-icon"
                  placeholder="+91 9876543210"
                  value={form.phone} onChange={handle}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-icon-wrap">
                <Lock size={16} className="input-icon" />
                <input
                  name="password" type={showPw ? 'text' : 'password'}
                  className="form-input input-with-icon"
                  placeholder="Min 6 characters"
                  value={form.password} onChange={handle} required
                  style={{ paddingRight: 42 }}
                />
                <button
                  type="button" onClick={() => setShowPw(!showPw)}
                  className="input-eye-btn"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* Info box */}
          <div className="register-info-box">
            <span>ℹ️</span>
            <span>Only students can self-register. Schools are added by the administrator.</span>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: 4 }}>
            {loading ? <><span className="spinner" />Creating account…</> : '🎓 Create Student Account'}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in here</Link>
        </p>

      </div>
    </div>
  )
}
