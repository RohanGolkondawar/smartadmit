import { Link } from 'react-router-dom'
import { GraduationCap, School, ShieldCheck, ArrowRight, CheckCircle, Star, Users, BookOpen, Award } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function HomePage() {
  const { user } = useAuth()

  const dashLink = () => {
    if (!user) return null
    if (user.role === 'STUDENT') return '/student'
    if (user.role === 'SCHOOL') return '/school'
    return '/admin'
  }

  return (
    <div style={{ fontFamily: 'var(--font)', minHeight: '100vh', background: '#fff' }}>
      {/* NAV */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 48px', background: '#fff', borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 8px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, background: 'var(--primary)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={22} color="#fff" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem', color: 'var(--text)' }}>
            Smart<span style={{ color: 'var(--primary)' }}>Admit</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user ? (
            <Link to={dashLink()} className="btn btn-primary">Go to Dashboard <ArrowRight size={15} /></Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Get Started <ArrowRight size={15} /></Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)',
        padding: '90px 48px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 40%, rgba(37,99,235,0.3) 0%, transparent 70%)' }} />
        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(37,99,235,0.25)', border: '1px solid rgba(96,165,250,0.4)', borderRadius: 99, padding: '6px 16px', marginBottom: 24 }}>
            <Star size={13} color="#60a5fa" fill="#60a5fa" />
            <span style={{ color: '#93c5fd', fontSize: '0.8rem', fontWeight: 600 }}>India's Smartest Admission Platform</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3.4rem)', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: 20 }}>
            Admission Process,<br />
            <span style={{ color: '#60a5fa' }}>Simplified.</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#94a3b8', lineHeight: 1.7, marginBottom: 36 }}>
            SmartAdmit connects students, schools, and admins on one seamless platform.
            Apply to multiple schools, track applications, and get admitted — all in one place.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary" style={{ fontSize: '1rem', padding: '13px 28px' }}>
              Apply Now <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn btn-outline" style={{ fontSize: '1rem', padding: '13px 28px', color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>
              Login to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* STATS BANNER */}
      <section style={{ background: 'var(--primary)', padding: '32px 48px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 24, textAlign: 'center' }}>
          {[['500+', 'Schools'], ['12K+', 'Students'], ['98%', 'Success Rate'], ['3 Roles', 'Smart Access']].map(([val, lbl]) => (
            <div key={lbl}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: '#fff' }}>{val}</div>
              <div style={{ color: '#bfdbfe', fontWeight: 500, fontSize: '0.9rem' }}>{lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ROLES */}
      <section style={{ padding: '80px 48px', background: '#f8faff' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: 10 }}>Who Uses SmartAdmit?</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>A role-based platform built for everyone in the admission journey</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(270px,1fr))', gap: 24 }}>
            {[
              { icon: GraduationCap, color: '#2563eb', bg: '#dbeafe', title: 'Students', desc: 'Register, browse schools, apply to multiple institutions, and track your application status in real time.', features: ['Apply to multiple schools', 'Real-time status tracking', 'Admission dashboard'] },
              { icon: School, color: '#059669', bg: '#dcfce7', title: 'Schools', desc: 'Manage your school profile, review incoming applications, and accept or reject students efficiently.', features: ['Manage student applications', 'View available seats', 'School profile management'] },
              { icon: ShieldCheck, color: '#7c3aed', bg: '#ede9fe', title: 'Admins', desc: 'Oversee the entire platform. Add or remove schools and students, and monitor all admission activity.', features: ['Manage all schools & students', 'Platform-wide analytics', 'Full access control'] }
            ].map(({ icon: Icon, color, bg, title, desc, features }) => (
              <div key={title} className="card" style={{ padding: 28, transition: 'transform .2s, box-shadow .2s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                <div style={{ width: 52, height: 52, background: bg, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <Icon size={26} color={color} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', marginBottom: 10, color }}>{title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: 18 }}>{desc}</p>
                {features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                    <CheckCircle size={15} color={color} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text)' }}>{f}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '80px 48px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: 10 }}>How It Works</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 48 }}>Get admitted in 3 simple steps</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {[
              { step: '01', icon: Users, title: 'Register', desc: 'Create your student account in minutes' },
              { step: '02', icon: BookOpen, title: 'Apply', desc: 'Browse schools and submit applications' },
              { step: '03', icon: Award, title: 'Get Admitted', desc: 'Track status and receive your offer' }
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} style={{ textAlign: 'center', padding: 24 }}>
                <div style={{ width: 56, height: 56, background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Icon size={24} color="#fff" />
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 8 }}>STEP {step}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 8 }}>{title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', padding: '64px 48px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: 12 }}>Ready to Begin Your Journey?</h2>
        <p style={{ color: '#bfdbfe', marginBottom: 28, fontSize: '1rem' }}>Join thousands of students who found their perfect school through SmartAdmit</p>
        <Link to="/register" className="btn" style={{ background: '#fff', color: 'var(--primary)', fontWeight: 700, padding: '13px 32px', fontSize: '1rem' }}>
          Register for Free <ArrowRight size={16} />
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0f172a', padding: '28px 48px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 10 }}>
          <GraduationCap size={18} color="#60a5fa" />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#fff' }}>SmartAdmit</span>
        </div>
        <p style={{ color: '#475569', fontSize: '0.85rem' }}>© 2024 SmartAdmit. All rights reserved. Admissions Made Simple.</p>
      </footer>
    </div>
  )
}
