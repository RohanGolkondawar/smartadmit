import { useState, useEffect } from 'react'
import { LayoutDashboard, UserCheck, Building2, LogOut, Clock, CheckCircle, XCircle, Users } from 'lucide-react'
import DashboardLayout from '../../components/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import toast from 'react-hot-toast'

// ─── Overview ────────────────────────────────────────────────────────
function Overview() {
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 })
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/school/stats'), api.get('/school/applications')]).then(([s, a]) => {
      setStats(s.data)
      setApps(a.data.slice(0, 5))
    }).catch(() => toast.error('Failed to load data')).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading"><span className="spinner" style={{ borderTopColor: 'var(--success)' }} /> Loading…</div>

  return (
    <>
      <div className="dash-content-title">School Overview</div>
      <div className="dash-content-subtitle">Monitor your school's admission activity</div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-icon stat-icon-purple"><Users size={22} /></div><div className="stat-body"><div className="stat-value">{stats.total}</div><div className="stat-label">Total Applications</div></div></div>
        <div className="stat-card"><div className="stat-icon stat-icon-orange"><Clock size={22} /></div><div className="stat-body"><div className="stat-value">{stats.pending}</div><div className="stat-label">Pending Review</div></div></div>
        <div className="stat-card"><div className="stat-icon stat-icon-green"><CheckCircle size={22} /></div><div className="stat-body"><div className="stat-value">{stats.approved}</div><div className="stat-label">Approved</div></div></div>
        <div className="stat-card"><div className="stat-icon stat-icon-red"><XCircle size={22} /></div><div className="stat-body"><div className="stat-value">{stats.rejected}</div><div className="stat-label">Rejected</div></div></div>
      </div>
      <div className="section-header"><span className="section-title">📋 Recent Applications</span></div>
      {apps.length === 0 ? (
        <div className="card empty"><div className="empty-icon">📭</div><div className="empty-text">No applications received yet</div></div>
      ) : (
        <div className="table-wrap card" style={{ padding: 0 }}>
          <table>
            <thead><tr><th>Student</th><th>Email</th><th>Applied</th><th>Status</th></tr></thead>
            <tbody>
              {apps.map(a => (
                <tr key={a.id}>
                  <td><strong>{a.studentName}</strong></td>
                  <td style={{ color: 'var(--text-muted)' }}>{a.studentEmail}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{new Date(a.appliedDate).toLocaleDateString('en-IN')}</td>
                  <td>
                    {a.status === 'APPROVED' && <span className="badge badge-success">Approved</span>}
                    {a.status === 'REJECTED' && <span className="badge badge-danger">Rejected</span>}
                    {a.status === 'PENDING' && <span className="badge badge-warning">Pending</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

// ─── School Profile ──────────────────────────────────────────────────
function SchoolProfile() {
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/school/profile').then(r => { setProfile(r.data); setForm(r.data) })
      .catch(() => toast.error('Failed to load profile')).finally(() => setLoading(false))
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      await api.put('/school/profile', form)
      setProfile(form)
      setEditing(false)
      toast.success('Profile updated!')
    } catch { toast.error('Failed to save') } finally { setSaving(false) }
  }

  if (loading) return <div className="loading"><span className="spinner" style={{ borderTopColor: 'var(--success)' }} /> Loading…</div>

  const fields = [
    { key: 'name', label: 'School Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'phone', label: 'Phone', type: 'tel' },
    { key: 'address', label: 'Address', type: 'text' },
    { key: 'city', label: 'City', type: 'text' },
    { key: 'state', label: 'State', type: 'text' },
    { key: 'board', label: 'Board (CBSE/ICSE/State)', type: 'text' },
    { key: 'totalSeats', label: 'Total Seats', type: 'number' },
    { key: 'established', label: 'Established Year', type: 'number' },
    { key: 'principalName', label: 'Principal Name', type: 'text' }
  ]

  return (
    <>
      <div className="dash-content-title">School Profile</div>
      <div className="dash-content-subtitle">Manage your school's information</div>
      <div className="card" style={{ maxWidth: 720 }}>
        <div className="section-header" style={{ marginBottom: 22 }}>
          <span className="section-title">📝 School Information</span>
          {!editing && <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>Edit Profile</button>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
          {fields.map(f => (
            <div className="form-group" key={f.key} style={{ gridColumn: ['address', 'name'].includes(f.key) ? '1/-1' : undefined }}>
              <label className="form-label">{f.label}</label>
              {editing ? (
                <input type={f.type} className="form-input" value={form[f.key] || ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
              ) : (
                <div style={{ padding: '10px 0', fontSize: '0.95rem', color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>
                  {profile?.[f.key] || <span style={{ color: 'var(--text-muted)' }}>Not set</span>}
                </div>
              )}
            </div>
          ))}
        </div>
        {editing && (
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? <><span className="spinner" />Saving…</> : 'Save Changes'}</button>
            <button className="btn btn-outline" onClick={() => { setEditing(false); setForm(profile) }}>Cancel</button>
          </div>
        )}
      </div>
    </>
  )
}

// ─── View Applications ───────────────────────────────────────────────
function ViewApplications() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [actioning, setActioning] = useState(null)
  const [filter, setFilter] = useState('ALL')

  const load = () => {
    api.get('/school/applications').then(r => setApps(r.data))
      .catch(() => toast.error('Failed to load applications')).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const action = async (id, status) => {
    setActioning(id + status)
    try {
      await api.put(`/school/applications/${id}/${status.toLowerCase()}`)
      toast.success(`Application ${status.toLowerCase()}!`)
      setApps(a => a.map(x => x.id === id ? { ...x, status } : x))
    } catch { toast.error('Action failed') } finally { setActioning(null) }
  }

  const filtered = filter === 'ALL' ? apps : apps.filter(a => a.status === filter)

  if (loading) return <div className="loading"><span className="spinner" style={{ borderTopColor: 'var(--success)' }} /> Loading…</div>

  return (
    <>
      <div className="dash-content-title">Student Applications</div>
      <div className="dash-content-subtitle">Review and manage incoming admission applications</div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className="btn btn-sm"
            style={{ background: filter === f ? 'var(--primary)' : '#fff', color: filter === f ? '#fff' : 'var(--text)', border: '1.5px solid ' + (filter === f ? 'var(--primary)' : 'var(--border)') }}>
            {f} {f === 'ALL' ? `(${apps.length})` : `(${apps.filter(a => a.status === f).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card empty"><div className="empty-icon">📭</div><div className="empty-text">No applications in this category</div></div>
      ) : (
        <div className="table-wrap card" style={{ padding: 0 }}>
          <table>
            <thead><tr><th>#</th><th>Student Name</th><th>Email</th><th>Phone</th><th>Applied On</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map((a, i) => (
                <tr key={a.id}>
                  <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{i + 1}</td>
                  <td><strong>{a.studentName}</strong></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{a.studentEmail}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{a.studentPhone || '—'}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{new Date(a.appliedDate).toLocaleDateString('en-IN')}</td>
                  <td>
                    {a.status === 'APPROVED' && <span className="badge badge-success">Approved</span>}
                    {a.status === 'REJECTED' && <span className="badge badge-danger">Rejected</span>}
                    {a.status === 'PENDING' && <span className="badge badge-warning">Pending</span>}
                  </td>
                  <td>
                    {a.status === 'PENDING' && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-success btn-sm" onClick={() => action(a.id, 'APPROVED')} disabled={!!actioning}>
                          {actioning === a.id + 'APPROVED' ? '…' : '✓ Accept'}
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => action(a.id, 'REJECTED')} disabled={!!actioning}>
                          {actioning === a.id + 'REJECTED' ? '…' : '✗ Reject'}
                        </button>
                      </div>
                    )}
                    {a.status !== 'PENDING' && <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────
export default function SchoolDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'School Profile', icon: Building2 },
    { id: 'applications', label: 'View Applications', icon: UserCheck },
    { id: 'logout', label: 'Logout', icon: LogOut }
  ]

  const renderTab = () => {
    if (activeTab === 'overview') return <Overview />
    if (activeTab === 'profile') return <SchoolProfile />
    if (activeTab === 'applications') return <ViewApplications />
    return null
  }

  return (
    <DashboardLayout role="SCHOOL" navItems={navItems} activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderTab()}
    </DashboardLayout>
  )
}
