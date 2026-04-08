import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'https://abctelemed.onrender.com';

export default function AdminLogin({ route }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const login = async (e) => {
        e.preventDefault();
        if (!email || !password) { setError('Email and password are required.'); return; }
        setLoading(true); setError('');
        try {
            const res = await fetch(`${route}/api/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email.trim().toLowerCase(), password }) });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Login failed.');
            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminProfile', JSON.stringify(data.data?.admin || {}));
            navigate('/myadmin');
        } catch (e) { setError(e.message); }
        finally { setLoading(false); }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0D1F35 0%, #0B2040 60%, #112047 100%)', fontFamily: "'DM Sans', 'Inter', sans-serif", padding: 16 }}>
            <div style={{ width: '100%', maxWidth: 420 }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 16, background: '#564DDF', display: 'grid', placeItems: 'center', margin: '0 auto 16px', fontSize: '1.4rem', fontWeight: 800, color: 'white' }}>A</div>
                    <h1 style={{ margin: 0, color: 'white', fontSize: '1.6rem', fontWeight: 800 }}>Admin portal</h1>
                    <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,.5)', fontSize: '0.88rem' }}>ABC Telemedica — restricted access</p>
                </div>

                <form onSubmit={login} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 24, padding: 32, backdropFilter: 'blur(12px)' }}>
                    {error && (
                        <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(239,68,68,.15)', border: '1px solid rgba(239,68,68,.3)', color: '#FCA5A5', fontSize: '0.85rem', marginBottom: 20 }}>
                            {error}
                        </div>
                    )}
                    <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'rgba(255,255,255,.6)', marginBottom: 6, letterSpacing: '.04em' }}>Email address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@abctelemedica.ng" autoFocus
                            style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.07)', color: 'white', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ marginBottom: 24 }}>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'rgba(255,255,255,.6)', marginBottom: 6, letterSpacing: '.04em' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password"
                                style={{ width: '100%', padding: '12px 44px 12px 16px', borderRadius: 12, border: '1.5px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.07)', color: 'white', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                            <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,.4)' }}>
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                                    {showPass ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></> : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>}
                                </svg>
                            </button>
                        </div>
                    </div>
                    <button type="submit" disabled={loading} style={{ width: '100%', padding: '13px 0', borderRadius: 14, border: 'none', background: '#564DDF', color: 'white', fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? .7 : 1 }}>
                        {loading ? <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,.4)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin .7s linear infinite' }} /> Signing in…</> : 'Sign in to admin portal'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: 20, color: 'rgba(255,255,255,.3)', fontSize: '0.78rem' }}>Unauthorised access is a criminal offence and will be prosecuted.</p>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } } * { box-sizing: border-box; }`}</style>
        </div>
    );
}