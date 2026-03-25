import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, School, ShieldCheck, ArrowRight, CheckCircle, Star, Users, BookOpen, Award, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function HomePage() {
  const { user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const dashLink = () => {
    if (!user) return null
    if (user.role === 'STUDENT') return '/student'
    if (user.role === 'SCHOOL') return '/school'
    return '/admin'
  }

  return (
    <div className="home-page">

      {/* ── NAV ── */}
      <nav className="home-nav">
        <Link to="/" className="home-nav-logo">
          <div className="home-nav-logo-icon">
            <GraduationCap size={22} color="#fff" />
          </div>
          <span className="home-nav-logo-text">
            Smart<span style={{ color: 'var(--primary)' }}>Admit</span>
          </span>
        </Link>

        {/* Desktop nav buttons */}
        <div className="home-nav-actions">
          {user ? (
            <Link to={dashLink()} className="btn btn-primary btn-sm">
              Dashboard <ArrowRight size={14} />
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started <ArrowRight size={14} />
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="home-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="home-mobile-menu">
          {user ? (
            <Link to={dashLink()} className="btn btn-primary btn-full" onClick={() => setMenuOpen(false)}>
              Go to Dashboard <ArrowRight size={15} />
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-full" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-full" onClick={() => setMenuOpen(false)}>
                Get Started <ArrowRight size={15} />
              </Link>
            </>
          )}
        </div>
      )}

      {/* ── HERO ── */}
      <section className="home-hero">
        <div className="home-hero-glow" />
        <div className="home-hero-content">
          <div className="home-hero-badge">
            <Star size={12} color="#60a5fa" fill="#60a5fa" />
            <span>India's Smartest Admission Platform</span>
          </div>
          <h1 className="home-hero-title">
            Admission Process,<br />
            <span style={{ color: '#60a5fa' }}>Simplified.</span>
          </h1>
          <p className="home-hero-desc">
            SmartAdmit connects students, schools, and admins on one seamless platform.
            Apply to multiple schools, track applications, and get admitted — all in one place.
          </p>
          <div className="home-hero-btns">
            <Link to="/register" className="btn btn-primary home-hero-btn-primary">
              Apply Now <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn home-hero-btn-outline">
              Login to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="home-stats">
        <div className="home-stats-grid">
          {[['500+', 'Schools'], ['12K+', 'Students'], ['98%', 'Success Rate'], ['3 Roles', 'Smart Access']].map(([val, lbl]) => (
            <div key={lbl} className="home-stat-item">
              <div className="home-stat-value">{val}</div>
              <div className="home-stat-label">{lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ROLES ── */}
      <section className="home-section home-section-light">
        <div className="home-section-inner">
          <div className="home-section-header">
            <h2 className="home-section-title">Who Uses SmartAdmit?</h2>
            <p className="home-section-subtitle">A role-based platform built for everyone in the admission journey</p>
          </div>
          <div className="home-roles-grid">
            {[
              {
                icon: GraduationCap, color: '#2563eb', bg: '#dbeafe',
                title: 'Students', emoji: '🎓',
                desc: 'Register, browse schools, apply to multiple institutions, and track your application status in real time.',
                features: ['Apply to multiple schools', 'Real-time status tracking', 'Admission dashboard']
              },
              {
                icon: School, color: '#059669', bg: '#dcfce7',
                title: 'Schools', emoji: '🏫',
                desc: 'Manage your school profile, review incoming applications, and accept or reject students efficiently.',
                features: ['Manage student applications', 'View available seats', 'School profile management']
              },
              {
                icon: ShieldCheck, color: '#7c3aed', bg: '#ede9fe',
                title: 'Admins', emoji: '🛡️',
                desc: 'Oversee the entire platform. Add or remove schools and students, and monitor all admission activity.',
                features: ['Manage all schools & students', 'Platform-wide analytics', 'Full access control']
              }
            ].map(({ icon: Icon, color, bg, title, emoji, desc, features }) => (
              <div key={title} className="home-role-card card">
                <div className="home-role-icon-wrap" style={{ background: bg }}>
                  <Icon size={26} color={color} />
                </div>
                <div className="home-role-emoji">{emoji}</div>
                <h3 className="home-role-title" style={{ color }}>{title}</h3>
                <p className="home-role-desc">{desc}</p>
                {features.map(f => (
                  <div key={f} className="home-role-feature">
                    <CheckCircle size={14} color={color} />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="home-section">
        <div className="home-section-inner" style={{ maxWidth: 800 }}>
          <div className="home-section-header">
            <h2 className="home-section-title">How It Works</h2>
            <p className="home-section-subtitle">Get admitted in 3 simple steps</p>
          </div>
          <div className="home-steps-grid">
            {[
              { step: '01', icon: Users, title: 'Register', desc: 'Create your student account in minutes' },
              { step: '02', icon: BookOpen, title: 'Apply', desc: 'Browse schools and submit applications' },
              { step: '03', icon: Award, title: 'Get Admitted', desc: 'Track your status and receive your offer' }
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="home-step-item">
                <div className="home-step-icon">
                  <Icon size={24} color="#fff" />
                </div>
                <div className="home-step-num">STEP {step}</div>
                <h3 className="home-step-title">{title}</h3>
                <p className="home-step-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="home-cta">
        <h2 className="home-cta-title">Ready to Begin Your Journey?</h2>
        <p className="home-cta-subtitle">Join thousands of students who found their perfect school through SmartAdmit</p>
        <Link to="/register" className="btn home-cta-btn">
          Register for Free <ArrowRight size={16} />
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer className="home-footer">
        <div className="home-footer-logo">
          <GraduationCap size={18} color="#60a5fa" />
          <span>SmartAdmit</span>
        </div>
        <p className="home-footer-text">© 2024 SmartAdmit. All rights reserved. Admissions Made Simple.</p>
      </footer>

    </div>
  )
}
