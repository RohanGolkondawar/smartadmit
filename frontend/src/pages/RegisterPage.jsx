import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'STUDENT' })
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
      await api.post('/auth/register', form)
      toast.success('Account created! Please login.')
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 520, background: '#fff', borderRadius: 'var(--radius)', padding: '40px 36px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28, textDecoration: 'none' }}>
          <div style={{ width: 34, height: 34, background: 'var(--primary)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={18} color="#fff" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text)' }}>SmartAdmit</span>
        </Link>

        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.7rem', marginBottom: 4 }}>Create Account</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 24 }}>Join SmartAdmit and start your admission journey</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={submit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label className="form-label">I am a</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {['STUDENT', 'SCHOOL'].map(r => (
                  <label key={r} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px',
                    borderRadius: 'var(--radius-sm)', border: `2px solid ${form.role === r ? 'var(--primary)' : 'var(--border)'}`,
                    background: form.role === r ? 'var(--primary-light)' : '#fff',
                    cursor: 'pointer', transition: 'all .16s'
                  }}>
                    <input type="radio" name="role" value={r} checked={form.role === r} onChange={handle} style={{ display: 'none' }} />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: form.role === r ? 'var(--primary)' : 'var(--text)' }}>{r === 'STUDENT' ? '🎓 Student' : '🏫 School'}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label className="form-label">Full Name {form.role === 'SCHOOL' ? '/ School Name' : ''}</label>
              <input name="name" type="text" className="form-input" placeholder={form.role === 'SCHOOL' ? 'School Name' : 'Your full name'}
                value={form.name} onChange={handle} required />
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label className="form-label">Email Address</label>
              <input name="email" type="email" className="form-input" placeholder="you@example.com"
                value={form.email} onChange={handle} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input name="phone" type="tel" className="form-input" placeholder="+91 9876543210"
                value={form.phone} onChange={handle} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input name="password" type="password" className="form-input" placeholder="Min 6 characters"
                value={form.password} onChange={handle} required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: 6 }}>
            {loading ? <><span className="spinner" />Creating account…</> : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
