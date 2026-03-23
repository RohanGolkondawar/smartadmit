import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { LogOut, Menu, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function DashboardLayout({ role, navItems, activeTab, setActiveTab, children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  const handleNavClick = (id) => {
    setActiveTab(id)
    setSidebarOpen(false) // close sidebar on mobile after click
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'
  const roleColors = { STUDENT: '#2563eb', SCHOOL: '#059669', ADMIN: '#7c3aed' }
  const roleColor = roleColors[role] || '#2563eb'

  return (
    <div className="dash-layout">

      {/* Overlay (mobile) */}
      <div
        className={`sidebar-overlay${sidebarOpen ? ' open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: '#fff' }}>SA</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="brand-name">SmartAdmit</div>
            <div className="brand-role">{role} Portal</div>
          </div>
          {/* Close button on mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4, display: 'flex' }}
            className="hide-desktop"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Navigation</div>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item${activeTab === item.id ? ' active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          {/* User info */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            marginBottom: 10, padding: '10px 10px',
            background: 'rgba(255,255,255,0.06)', borderRadius: 10
          }}>
            <div style={{
              width: 32, height: 32, background: roleColor, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '0.8rem', color: '#fff', flexShrink: 0
            }}>{initials}</div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.84rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
              <div style={{ color: '#64748b', fontSize: '0.72rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
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
          {/* Hamburger (mobile only) */}
          <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>

          <div className="header-welcome">
            <span className="header-welcome-text">Welcome back,</span>
            <span className="header-name">{user?.name} 👋</span>
          </div>

          <div className="header-right">
            {/* Role badge — hidden on small mobile via CSS */}
            <div className="header-role-badge" style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>Role</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: roleColor }}>{role}</div>
            </div>
            <div className="avatar" style={{ background: roleColor }}>{initials}</div>
            <button className="btn btn-outline btn-sm" onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <LogOut size={14} />
              <span className="hide-mobile-text">Logout</span>
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
