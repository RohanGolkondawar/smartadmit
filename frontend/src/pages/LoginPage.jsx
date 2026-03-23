import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      const { token, user } = res.data
      login(user, token)
      toast.success(`Welcome back, ${user.name}!`)
      if (user.role === 'STUDENT') navigate('/student')
      else if (user.role === 'SCHOOL') navigate('/school')
      else navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg)' }}>
      {/* Left Panel */}
      <div style={{ flex: 1, background: 'linear-gradient(160deg, #0f172a 0%, #1e3a8a 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 48, minHeight: '100vh' }} className="hide-mobile">
        <GraduationCap size={52} color="#60a5fa" style={{ marginBottom: 24 }} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: 14 }}>
          Smart<span style={{ color: '#60a5fa' }}>Admit</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem', textAlign: 'center', maxWidth: 320, lineHeight: 1.7 }}>
          Your gateway to seamless school admissions. Login to continue your journey.
        </p>
        <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {['Students apply to multiple schools easily', 'Track application status in real time', 'Schools manage admissions efficiently'].map(t => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 8, height: 8, background: '#60a5fa', borderRadius: '50%', flexShrink: 0 }} />
              <span style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 40px', background: '#fff' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40, textDecoration: 'none' }}>
          <div style={{ width: 34, height: 34, background: 'var(--primary)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={18} color="#fff" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text)' }}>SmartAdmit</span>
        </Link>

        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', marginBottom: 6 }}>Welcome back 👋</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 28, fontSize: '0.95rem' }}>Sign in to your account to continue</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input name="email" type="email" className="form-input" placeholder="you@example.com"
              value={form.email} onChange={handle} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input name="password" type={showPw ? 'text' : 'password'} className="form-input"
                placeholder="Enter your password" value={form.password} onChange={handle} required style={{ paddingRight: 42 }} />
              <button type="button" onClick={() => setShowPw(!showPw)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: 6 }}>
            {loading ? <><span className="spinner" />Signing in…</> : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Register here</Link>
        </p>

        <div style={{ marginTop: 32, padding: 16, background: 'var(--surface2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Demo Credentials</p>
          {[['STUDENT', 'student@demo.com'], ['SCHOOL', 'school@demo.com'], ['ADMIN', 'admin@demo.com']].map(([role, email]) => (
            <div key={role} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 4 }}>
              <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{role}:</span>
              <span style={{ color: 'var(--text-muted)' }}>{email} / password123</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
