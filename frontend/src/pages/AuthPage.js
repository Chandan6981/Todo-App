import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const styles = {
  page: {
    minHeight: '100vh',
    background: '#07070f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
  },
  blob1: {
    position: 'absolute', width: 600, height: 600,
    background: 'radial-gradient(circle, rgba(124,92,252,0.15) 0%, transparent 70%)',
    top: '-20%', left: '-10%', borderRadius: '50%', pointerEvents: 'none',
  },
  blob2: {
    position: 'absolute', width: 500, height: 500,
    background: 'radial-gradient(circle, rgba(94,234,212,0.08) 0%, transparent 70%)',
    bottom: '-20%', right: '-10%', borderRadius: '50%', pointerEvents: 'none',
  },
  card: {
    background: 'rgba(14,14,26,0.8)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 24,
    padding: '48px 44px',
    width: '100%',
    maxWidth: 440,
    position: 'relative',
    zIndex: 1,
    boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
    animation: 'fadeIn 0.5s ease',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32,
  },
  logoIcon: {
    width: 40, height: 40,
    background: 'linear-gradient(135deg, #7c5cfc, #5eead4)',
    borderRadius: 12,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 18,
  },
  logoText: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 22, fontWeight: 800,
    background: 'linear-gradient(135deg, #f0eeff, #a78bfa)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heading: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 30, fontWeight: 700,
    color: '#f0eeff', marginBottom: 6,
  },
  subtext: {
    color: '#6b6580', fontSize: 14, marginBottom: 32,
  },
  tabs: {
    display: 'flex', background: 'rgba(255,255,255,0.04)',
    borderRadius: 12, padding: 4, marginBottom: 28,
  },
  tab: (active) => ({
    flex: 1, padding: '9px 0', borderRadius: 9, fontSize: 14, fontWeight: 500,
    background: active ? 'linear-gradient(135deg, #7c5cfc, #5b21b6)' : 'transparent',
    color: active ? '#fff' : '#6b6580',
    border: 'none', cursor: 'pointer', transition: 'all 0.2s ease',
    fontFamily: "'DM Sans', sans-serif",
  }),
  group: { marginBottom: 18 },
  label: {
    display: 'block', fontSize: 12, fontWeight: 500,
    color: '#a09ab8', marginBottom: 8, letterSpacing: '0.5px', textTransform: 'uppercase',
  },
  input: {
    width: '100%', padding: '13px 16px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12, color: '#f0eeff', fontSize: 15,
    outline: 'none', transition: 'all 0.2s ease',
    fontFamily: "'DM Sans', sans-serif",
  },
  btn: (loading) => ({
    width: '100%', padding: '14px',
    background: loading ? 'rgba(124,92,252,0.5)' : 'linear-gradient(135deg, #7c5cfc 0%, #5b21b6 100%)',
    color: '#fff', border: 'none', borderRadius: 12,
    fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
    marginTop: 8, transition: 'all 0.2s ease',
    fontFamily: "'Syne', sans-serif", letterSpacing: '0.3px',
    boxShadow: '0 4px 20px rgba(124,92,252,0.3)',
    position: 'relative', overflow: 'hidden',
  }),
  divider: {
    textAlign: 'center', color: '#3d3a52', fontSize: 12, margin: '20px 0',
    position: 'relative',
  },
};

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
        toast.success('Welcome back! 🎉');
      } else {
        if (!form.name) { toast.error('Name is required'); setLoading(false); return; }
        await register(form.name, form.email, form.password);
        toast.success('Account created! Welcome aboard 🚀');
      }
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const inputFocus = (e) => {
    e.target.style.borderColor = 'rgba(124,92,252,0.6)';
    e.target.style.background = 'rgba(124,92,252,0.05)';
    e.target.style.boxShadow = '0 0 0 3px rgba(124,92,252,0.1)';
  };
  const inputBlur = (e) => {
    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
    e.target.style.background = 'rgba(255,255,255,0.04)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div style={styles.page}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      {/* Decorative grid */}
      <div style={{
        position:'absolute', inset:0, 
        backgroundImage:'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
        backgroundSize:'50px 50px', pointerEvents:'none',
      }} />

      <div style={styles.card}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>✦</div>
          <span style={styles.logoText}>Taskflow</span>
        </div>

        <h1 style={styles.heading}>
          {mode === 'login' ? 'Welcome back' : 'Get started'}
        </h1>
        <p style={styles.subtext}>
          {mode === 'login' ? 'Sign in to your workspace' : 'Create your account today'}
        </p>

        <div style={styles.tabs}>
          <button style={styles.tab(mode === 'login')} onClick={() => setMode('login')}>Sign In</button>
          <button style={styles.tab(mode === 'register')} onClick={() => setMode('register')}>Sign Up</button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div style={styles.group}>
              <label style={styles.label}>Full Name</label>
              <input
                name="name" type="text" value={form.name} onChange={handleChange}
                placeholder="Your name" style={styles.input} required
                onFocus={inputFocus} onBlur={inputBlur}
              />
            </div>
          )}
          <div style={styles.group}>
            <label style={styles.label}>Email</label>
            <input
              name="email" type="email" value={form.email} onChange={handleChange}
              placeholder="you@example.com" style={styles.input} required
              onFocus={inputFocus} onBlur={inputBlur}
            />
          </div>
          <div style={styles.group}>
            <label style={styles.label}>Password</label>
            <input
              name="password" type="password" value={form.password} onChange={handleChange}
              placeholder="••••••••" style={styles.input} required minLength={6}
              onFocus={inputFocus} onBlur={inputBlur}
            />
          </div>

          <button
            type="submit"
            style={styles.btn(loading)}
            disabled={loading}
            onMouseEnter={e => { if (!loading) { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 8px 30px rgba(124,92,252,0.45)'; }}}
            onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 20px rgba(124,92,252,0.3)'; }}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In →' : 'Create Account →'}
          </button>
        </form>

        <div style={styles.divider}>
          <span style={{ background: 'rgba(14,14,26,0.9)', padding: '0 12px', position:'relative', zIndex:1, color:'#3d3a52' }}>
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          </span>
          <div style={{ position:'absolute', top:'50%', left:0, right:0, height:1, background:'rgba(255,255,255,0.05)' }} />
        </div>

        <button
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          style={{ width:'100%', padding:'12px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, color:'#a09ab8', fontSize:14, cursor:'pointer', fontFamily:"'DM Sans', sans-serif" }}
        >
          {mode === 'login' ? 'Create an account' : 'Sign in instead'}
        </button>
      </div>
    </div>
  );
}
