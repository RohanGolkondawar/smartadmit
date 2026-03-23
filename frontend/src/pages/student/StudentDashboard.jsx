import { useState, useEffect } from 'react'
import { LayoutDashboard, Send, School, LogOut, CheckCircle, Clock, FileText, UserCircle, Pencil, X, Save } from 'lucide-react'
import DashboardLayout from '../../components/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import toast from 'react-hot-toast'

// ─── Overview Tab ───────────────────────────────────────────────────
function Overview() {
  const [stats, setStats] = useState({ totalSchools: 0, pending: 0, total: 0, approved: 0 })
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/student/stats'), api.get('/student/applications')]).then(([s, a]) => {
      setStats(s.data)
      setApplications(a.data.slice(0, 5))
    }).catch(() => toast.error('Failed to load data')).finally(() => setLoading(false))
  }, [])

  const statusBadge = s => {
    if (s === 'APPROVED') return <span className="badge badge-success">✓ Approved</span>
    if (s === 'REJECTED') return <span className="badge badge-danger">✗ Rejected</span>
    return <span className="badge badge-warning">⏳ Pending</span>
  }

  if (loading) return <div className="loading"><span className="spinner" style={{ borderTopColor: 'var(--primary)' }} /> Loading…</div>

  return (
    <>
      <div className="dash-content-title">Dashboard Overview</div>
      <div className="dash-content-subtitle">Track your admission journey at a glance</div>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon-blue"><School size={22} /></div>
          <div className="stat-body"><div className="stat-value">{stats.totalSchools}</div><div className="stat-label">Available Schools</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-orange"><Clock size={22} /></div>
          <div className="stat-body"><div className="stat-value">{stats.pending}</div><div className="stat-label">Pending Applications</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-green"><CheckCircle size={22} /></div>
          <div className="stat-body"><div className="stat-value">{stats.approved}</div><div className="stat-label">Approved</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-purple"><FileText size={22} /></div>
          <div className="stat-body"><div className="stat-value">{stats.total}</div><div className="stat-label">Total Applications</div></div>
        </div>
      </div>

      <div className="section-header">
        <span className="section-title">📋 Recent Applications</span>
      </div>
      {applications.length === 0 ? (
        <div className="card empty">
          <div className="empty-icon">📄</div>
          <div className="empty-text">No applications yet. Start applying!</div>
        </div>
      ) : (
        <div className="table-wrap card" style={{ padding: 0 }}>
          <table>
            <thead><tr><th>School</th><th>Applied On</th><th>Status</th></tr></thead>
            <tbody>
              {applications.map(a => (
                <tr key={a.id}>
                  <td><strong>{a.schoolName}</strong></td>
                  <td style={{ color: 'var(--text-muted)' }}>{new Date(a.appliedDate).toLocaleDateString('en-IN')}</td>
                  <td>{statusBadge(a.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

// ─── Apply Tab ───────────────────────────────────────────────────────
function ApplyAdmission() {
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(null)

  useEffect(() => {
    api.get('/student/schools').then(r => setSchools(r.data))
      .catch(() => toast.error('Failed to load schools'))
      .finally(() => setLoading(false))
  }, [])

  const apply = async school => {
    setApplying(school.id)
    try {
      await api.post('/student/apply', { schoolId: school.id })
      toast.success(`Applied to ${school.name}!`)
      setSchools(s => s.map(sc => sc.id === school.id ? { ...sc, applied: true } : sc))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Already applied or seats full')
    } finally {
      setApplying(null)
    }
  }

  if (loading) return <div className="loading"><span className="spinner" style={{ borderTopColor: 'var(--primary)' }} /> Loading schools…</div>

  return (
    <>
      <div className="dash-content-title">Apply for Admission</div>
      <div className="dash-content-subtitle">Browse available schools and submit your applications</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 18 }}>
        {schools.map(school => (
          <div key={school.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, background: '#dcfce7', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>🏫</div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>{school.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{school.city}, {school.state}</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span>📚 {school.board}</span>
              <span style={{ color: school.availableSeats > 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                {school.availableSeats > 0 ? `${school.availableSeats} seats` : 'Full'}
              </span>
            </div>
            {school.applied ? (
              <div style={{ textAlign: 'center', padding: '10px', background: '#dcfce7', borderRadius: 8, color: '#15803d', fontWeight: 600, fontSize: '0.85rem' }}>
                ✓ Application Submitted
              </div>
            ) : (
              <button
                className="btn btn-primary btn-full btn-sm"
                onClick={() => apply(school)}
                disabled={applying === school.id || school.availableSeats === 0}
              >
                {applying === school.id ? <><span className="spinner" />Applying…</> : school.availableSeats === 0 ? 'No Seats' : 'Apply Now'}
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

// ─── All Schools Tab ─────────────────────────────────────────────────
function AllSchools() {
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/student/schools').then(r => setSchools(r.data))
      .catch(() => toast.error('Failed to load schools'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading"><span className="spinner" style={{ borderTopColor: 'var(--primary)' }} /> Loading…</div>

  return (
    <>
      <div className="dash-content-title">All Schools</div>
      <div className="dash-content-subtitle">Explore all registered schools and their available seats</div>
      <div className="table-wrap card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr><th>#</th><th>School Name</th><th>City</th><th>Board</th><th>Total Seats</th><th>Available</th><th>Status</th></tr>
          </thead>
          <tbody>
            {schools.map((s, i) => (
              <tr key={s.id}>
                <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{i + 1}</td>
                <td><strong>{s.name}</strong></td>
                <td>{s.city}, {s.state}</td>
                <td>{s.board}</td>
                <td>{s.totalSeats}</td>
                <td>
                  <span style={{ fontWeight: 700, color: s.availableSeats > 10 ? 'var(--success)' : s.availableSeats > 0 ? 'var(--warning)' : 'var(--danger)' }}>
                    {s.availableSeats}
                  </span>
                </td>
                <td>
                  {s.availableSeats > 0
                    ? <span className="badge badge-success">Open</span>
                    : <span className="badge badge-danger">Full</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

// ─── Student Profile Tab ─────────────────────────────────────────────
function StudentProfile() {
  const { user, login } = useAuth()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [changingPw, setChangingPw] = useState(false)
  const [savingPw, setSavingPw] = useState(false)
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' })
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'ST'

  const saveProfile = async e => {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('Name cannot be empty'); return }
    setSaving(true)
    try {
      const res = await api.put('/student/profile', form)
      const updatedUser = { ...user, name: res.data.name, phone: res.data.phone }
      login(updatedUser, localStorage.getItem('token'))
      setEditing(false)
      toast.success('Profile updated successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const savePassword = async e => {
    e.preventDefault()
    if (pwForm.newPassword.length < 6) { toast.error('New password must be at least 6 characters'); return }
    if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error('Passwords do not match'); return }
    setSavingPw(true)
    try {
      await api.put('/student/change-password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword
      })
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setChangingPw(false)
      toast.success('Password changed successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Current password is incorrect')
    } finally {
      setSavingPw(false)
    }
  }

  return (
    <>
      <div className="dash-content-title">My Profile</div>
      <div className="dash-content-subtitle">View and update your personal information</div>

      <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20, alignItems: 'start' }}>

        {/* ── Avatar / Info Card ── */}
        <div className="card" style={{ textAlign: 'center', padding: 28 }}>
          {/* Avatar circle */}
          <div style={{
            width: 86, height: 86, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), #0ea5e9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
            fontSize: '1.9rem', fontWeight: 800, color: '#fff',
            fontFamily: 'var(--font-display)',
            boxShadow: '0 4px 18px rgba(37,99,235,0.28)'
          }}>
            {initials}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', marginBottom: 3 }}>{user?.name}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 14, wordBreak: 'break-all' }}>{user?.email}</div>
          <span className="badge badge-info">🎓 Student</span>

          {/* Quick details */}
          <div style={{ marginTop: 20, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Quick Info</div>
            {[
              { icon: '📧', label: 'Email', val: user?.email },
              { icon: '📞', label: 'Phone', val: user?.phone || 'Not set' },
              { icon: '🎭', label: 'Role', val: 'Student' },
            ].map(({ icon, label, val }) => (
              <div key={label} style={{ background: 'var(--surface2)', borderRadius: 8, padding: '8px 12px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>{icon} {label}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 500, marginTop: 2, wordBreak: 'break-all' }}>{val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Personal Info card */}
          <div className="card">
            <div className="section-header" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <UserCircle size={18} color="var(--primary)" />
                <span className="section-title">Personal Information</span>
              </div>
              {!editing && (
                <button className="btn btn-outline btn-sm"
                  onClick={() => { setForm({ name: user?.name || '', phone: user?.phone || '' }); setEditing(true) }}>
                  <Pencil size={13} /> Edit
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={saveProfile}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-input" placeholder="Your full name"
                    value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="tel" className="form-input" placeholder="+91 9876543210"
                    value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                    {saving ? <><span className="spinner" />Saving…</> : <><Save size={13} /> Save Changes</>}
                  </button>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => setEditing(false)}>
                    <X size={13} /> Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                {[
                  { label: 'Full Name', value: user?.name, col: '1/-1' },
                  { label: 'Email Address', value: user?.email, col: '1/-1' },
                  { label: 'Phone Number', value: user?.phone || '—' },
                  { label: 'Account Role', value: 'Student' },
                ].map(({ label, value, col }) => (
                  <div key={label} style={{ padding: '14px 0', borderBottom: '1px solid var(--border)', gridColumn: col }}>
                    <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>{label}</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text)' }}>{value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Change Password card */}
          <div className="card">
            <div className="section-header" style={{ marginBottom: changingPw ? 20 : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🔒</span>
                <span className="section-title">Change Password</span>
              </div>
              {!changingPw && (
                <button className="btn btn-outline btn-sm" onClick={() => setChangingPw(true)}>
                  <Pencil size={13} /> Change
                </button>
              )}
            </div>

            {changingPw ? (
              <form onSubmit={savePassword}>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input type="password" className="form-input" placeholder="Enter your current password"
                    value={pwForm.currentPassword} onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input type="password" className="form-input" placeholder="Min 6 characters"
                      value={pwForm.newPassword} onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input type="password" className="form-input" placeholder="Repeat new password"
                      value={pwForm.confirmPassword} onChange={e => setPwForm(f => ({ ...f, confirmPassword: e.target.value }))} required />
                  </div>
                </div>
                {pwForm.newPassword && pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword && (
                  <div className="alert alert-error">Passwords do not match</div>
                )}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="submit" className="btn btn-primary btn-sm" disabled={savingPw}>
                    {savingPw ? <><span className="spinner" />Updating…</> : <><Save size={13} /> Update Password</>}
                  </button>
                  <button type="button" className="btn btn-outline btn-sm"
                    onClick={() => { setChangingPw(false); setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' }) }}>
                    <X size={13} /> Cancel
                  </button>
                </div>
              </form>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', paddingTop: 10 }}>
                Keep your account secure with a strong, unique password.
              </p>
            )}
          </div>

        </div>
      </div>
    </>
  )
}

// ─── Main Student Dashboard ──────────────────────────────────────────
export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'apply', label: 'Apply for Admission', icon: Send },
    { id: 'schools', label: 'View All Schools', icon: School },
    { id: 'profile', label: 'My Profile', icon: UserCircle },
    { id: 'logout', label: 'Logout', icon: LogOut },
  ]

  const renderTab = () => {
    if (activeTab === 'overview') return <Overview />
    if (activeTab === 'apply') return <ApplyAdmission />
    if (activeTab === 'schools') return <AllSchools />
    if (activeTab === 'profile') return <StudentProfile />
    return null
  }

  return (
    <DashboardLayout role="STUDENT" navItems={navItems} activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderTab()}
    </DashboardLayout>
  )
}
