import { useState, useEffect } from 'react'
import { LayoutDashboard, School, Users, FileText, LogOut, Trash2, Plus, X } from 'lucide-react'
import DashboardLayout from '../../components/DashboardLayout'
import api from '../../api/axios'
import toast from 'react-hot-toast'

// ─── Overview ────────────────────────────────────────────────────────
function Overview() {
  const [stats, setStats] = useState({ totalSchools: 0, totalStudents: 0, totalApplications: 0, pendingApplications: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data))
      .catch(() => toast.error('Failed to load stats')).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading"><span className="spinner" style={{ borderTopColor: '#7c3aed' }} /> Loading…</div>

  return (
    <>
      <div className="dash-content-title">Admin Overview</div>
      <div className="dash-content-subtitle">Full platform visibility and control</div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-icon stat-icon-green"><School size={22} /></div><div className="stat-body"><div className="stat-value">{stats.totalSchools}</div><div className="stat-label">Total Schools</div></div></div>
        <div className="stat-card"><div className="stat-icon stat-icon-blue"><Users size={22} /></div><div className="stat-body"><div className="stat-value">{stats.totalStudents}</div><div className="stat-label">Total Students</div></div></div>
        <div className="stat-card"><div className="stat-icon stat-icon-purple"><FileText size={22} /></div><div className="stat-body"><div className="stat-value">{stats.totalApplications}</div><div className="stat-label">Total Applications</div></div></div>
        <div className="stat-card"><div className="stat-icon stat-icon-orange"><FileText size={22} /></div><div className="stat-body"><div className="stat-value">{stats.pendingApplications}</div><div className="stat-label">Pending Applications</div></div></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <div className="card" style={{ textAlign: 'center', padding: 32 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🏫</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 6 }}>Manage Schools</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 18 }}>Add new schools or remove existing ones from the platform</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 32 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🎓</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 6 }}>Manage Students</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 18 }}>View and manage all student accounts on the platform</p>
        </div>
      </div>
    </>
  )
}

// ─── Manage Schools ──────────────────────────────────────────────────
function ManageSchools() {
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', city: '', state: '', board: 'CBSE', totalSeats: 100 })
  const [creating, setCreating] = useState(false)

  const load = () => api.get('/admin/schools').then(r => setSchools(r.data)).catch(() => toast.error('Failed')).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const create = async e => {
    e.preventDefault()
    setCreating(true)
    try {
      await api.post('/admin/schools', form)
      toast.success('School created!')
      setShowModal(false)
      setForm({ name: '', email: '', password: '', phone: '', city: '', state: '', board: 'CBSE', totalSeats: 100 })
      load()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create') } finally { setCreating(false) }
  }

  const del = async id => {
    if (!window.confirm('Delete this school? This cannot be undone.')) return
    setDeleting(id)
    try { await api.delete(`/admin/schools/${id}`); toast.success('School deleted'); load() }
    catch { toast.error('Failed to delete') } finally { setDeleting(null) }
  }

  if (loading) return <div className="loading"><span className="spinner" style={{ borderTopColor: '#7c3aed' }} /> Loading…</div>

  return (
    <>
      <div className="dash-content-title">Manage Schools</div>
      <div className="dash-content-subtitle">Add or remove schools from the SmartAdmit platform</div>
      <div className="section-header">
        <span className="section-title">All Schools ({schools.length})</span>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}><Plus size={15} /> Add School</button>
      </div>
      <div className="table-wrap card" style={{ padding: 0 }}>
        <table>
          <thead><tr><th>#</th><th>School Name</th><th>City</th><th>Board</th><th>Seats</th><th>Available</th><th>Action</th></tr></thead>
          <tbody>
            {schools.map((s, i) => (
              <tr key={s.id}>
                <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{i + 1}</td>
                <td><strong>{s.name}</strong><br /><span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{s.email}</span></td>
                <td>{s.city}, {s.state}</td>
                <td>{s.board}</td>
                <td>{s.totalSeats}</td>
                <td><span style={{ fontWeight: 700, color: s.availableSeats > 10 ? 'var(--success)' : s.availableSeats > 0 ? 'var(--warning)' : 'var(--danger)' }}>{s.availableSeats}</span></td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => del(s.id)} disabled={deleting === s.id}>
                    {deleting === s.id ? '…' : <><Trash2 size={13} /> Delete</>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div className="modal-title">🏫 Add New School</div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>
            <form onSubmit={create}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
                {[['name','School Name','text','1/-1'],['email','Email','email','1/-1'],['password','Login Password','password','1/-1'],['phone','Phone','tel'],['city','City','text'],['state','State','text'],['board','Board','text'],['totalSeats','Total Seats','number']].map(([k,l,t,col]) => (
                  <div className="form-group" key={k} style={{ gridColumn: col }}>
                    <label className="form-label">{l}</label>
                    <input type={t} className="form-input" value={form[k]} required onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} />
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={creating}>{creating ? <><span className="spinner" />Creating…</> : 'Create School'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

// ─── Manage Students ─────────────────────────────────────────────────
function ManageStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [creating, setCreating] = useState(false)

  const load = () => api.get('/admin/students').then(r => setStudents(r.data)).catch(() => toast.error('Failed')).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const create = async e => {
    e.preventDefault()
    setCreating(true)
    try {
      await api.post('/admin/students', form)
      toast.success('Student created!')
      setShowModal(false)
      setForm({ name: '', email: '', password: '', phone: '' })
      load()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create') } finally { setCreating(false) }
  }

  const del = async id => {
    if (!window.confirm('Delete this student account?')) return
    setDeleting(id)
    try { await api.delete(`/admin/students/${id}`); toast.success('Student deleted'); load() }
    catch { toast.error('Failed to delete') } finally { setDeleting(null) }
  }

  if (loading) return <div className="loading"><span className="spinner" style={{ borderTopColor: '#7c3aed' }} /> Loading…</div>

  return (
    <>
      <div className="dash-content-title">Manage Students</div>
      <div className="dash-content-subtitle">View and manage all student accounts</div>
      <div className="section-header">
        <span className="section-title">All Students ({students.length})</span>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}><Plus size={15} /> Add Student</button>
      </div>
      <div className="table-wrap card" style={{ padding: 0 }}>
        <table>
          <thead><tr><th>#</th><th>Student Name</th><th>Email</th><th>Phone</th><th>Registered On</th><th>Action</th></tr></thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={s.id}>
                <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{i + 1}</td>
                <td><strong>{s.name}</strong></td>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{s.email}</td>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{s.phone || '—'}</td>
                <td style={{ color: 'var(--text-muted)' }}>{s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => del(s.id)} disabled={deleting === s.id}>
                    {deleting === s.id ? '…' : <><Trash2 size={13} /> Delete</>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div className="modal-title">🎓 Add New Student</div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>
            <form onSubmit={create}>
              {[['name','Full Name','text'],['email','Email','email'],['password','Password','password'],['phone','Phone','tel']].map(([k,l,t]) => (
                <div className="form-group" key={k}>
                  <label className="form-label">{l}</label>
                  <input type={t} className="form-input" value={form[k]} required onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} />
                </div>
              ))}
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={creating}>{creating ? <><span className="spinner" />Creating…</> : 'Create Student'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'schools', label: 'Manage Schools', icon: School },
    { id: 'students', label: 'Manage Students', icon: Users },
    { id: 'logout', label: 'Logout', icon: LogOut }
  ]

  const renderTab = () => {
    if (activeTab === 'overview') return <Overview />
    if (activeTab === 'schools') return <ManageSchools />
    if (activeTab === 'students') return <ManageStudents />
    return null
  }

  return (
    <DashboardLayout role="ADMIN" navItems={navItems} activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderTab()}
    </DashboardLayout>
  )
}