import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import toast from 'react-hot-toast'

export default function DashboardLayout({ role, navItems, activeTab, setActiveTab, children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

  const roleColors = { STUDENT: '#2563eb', SCHOOL: '#059669', ADMIN: '#7c3aed' }
  const roleColor = roleColors[role] || '#2563eb'

  return (
    <div className="dash-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>SA</span>
          </div>
          <div>
            <div className="brand-name">SmartAdmit</div>
            <div className="brand-role">{role} Portal</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Navigation</div>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item${activeTab === item.id ? ' active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, padding: '10px 12px', background: 'rgba(255,255,255,0.06)', borderRadius: 10 }}>
            <div style={{ width: 34, height: 34, background: roleColor, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', color: '#fff', flexShrink: 0 }}>{initials}</div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
              <div style={{ color: '#64748b', fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
            </div>
          </div>
          <button className="nav-item" onClick={handleLogout} style={{ color: '#ef4444', width: '100%' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="dash-main">
        {/* Header */}
        <header className="dash-header">
          <div className="header-welcome">
            <span className="header-welcome-text">Welcome back,</span>
            <span className="header-name">{user?.name} 👋</span>
          </div>
          <div className="header-right">
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Role</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: roleColor }}>{role}</span>
            </div>
            <div className="avatar" style={{ background: roleColor }}>{initials}</div>
            <button className="btn btn-outline btn-sm" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <LogOut size={14} /> Logout
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="dash-content">
          {children}
        </main>
      </div>
    </div>
  )
}
