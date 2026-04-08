import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './onboardingStyle.css';

const ForgotPassword = ({ route = '' }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const submit = async () => {
        const val = email.trim();
        if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            setError('Please enter a valid email address.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const res = await fetch(`${route}/api/doctors/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: val }),
            });
            // Always show success to prevent email enumeration
            setSent(true);
        } catch (_) {
            setSent(true); // still show success — don't leak whether email exists
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ob-page" style={{ background: 'var(--bg)' }}>
            <main className="ob-main">
                <div className="ob-content" style={{ maxWidth: 480 }}>

                    <button
                        type="button"
                        onClick={() => navigate('/login')}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: 'var(--soft)', fontSize: '0.85rem', marginBottom: 32,
                            padding: 0, fontFamily: 'var(--font)'
                        }}
                    >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back to login
                    </button>

                    {!sent ? (
                        <div className="ob-panel">
                            <div className="ob-step-head">
                                <div className="ob-step-tag">
                                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                    Account recovery
                                </div>
                                <h1 className="ob-step-title">Forgot your password?</h1>
                                <p className="ob-step-subtitle">
                                    Enter the email address associated with your ABC Telemedica doctor account and we'll send you a password reset link.
                                </p>
                            </div>

                            <div className="ob-field">
                                <label htmlFor="fp-email">
                                    Email address <span className="req">*</span>
                                </label>
                                <input
                                    id="fp-email"
                                    type="email"
                                    className="ob-input"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && submit()}
                                    autoFocus
                                />
                                {error && (
                                    <span className="ob-error-msg">
                                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                                        </svg>
                                        {error}
                                    </span>
                                )}
                            </div>

                            <div className="ob-notice">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
                                </svg>
                                <span>
                                    The reset link expires in <strong>1 hour</strong>. Check your spam folder if you don't see the email within a few minutes.
                                </span>
                            </div>

                            <div className="ob-nav" style={{ marginTop: 24, borderTop: 'none', paddingTop: 0 }}>
                                <div className="ob-nav-left" />
                                <button
                                    className="ob-btn-next"
                                    onClick={submit}
                                    disabled={loading}
                                    type="button"
                                >
                                    {loading ? (
                                        <>
                                            <span style={{
                                                width: 14, height: 14, border: '2px solid rgba(255,255,255,.4)',
                                                borderTopColor: 'white', borderRadius: '50%',
                                                animation: 'ob-spin .7s linear infinite', display: 'inline-block'
                                            }} />
                                            Sending…
                                        </>
                                    ) : (
                                        <>
                                            Send reset link
                                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="ob-panel">
                            <div className="ob-step-head">
                                <div className="ob-step-tag" style={{ background: '#D1FAE5', color: '#065F46' }}>
                                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M20 6 9 17l-5-5" />
                                    </svg>
                                    Check your inbox
                                </div>
                                <h1 className="ob-step-title">Reset link sent</h1>
                                <p className="ob-step-subtitle">
                                    If an account exists for <strong>{email}</strong>, you'll receive a password reset email shortly. The link expires in 1 hour.
                                </p>
                            </div>

                            <div style={{
                                padding: '24px', borderRadius: 16,
                                background: '#F0FDF4', border: '1px solid #BBF7D0',
                                marginBottom: 24
                            }}>
                                <p style={{ margin: 0, color: '#166534', fontSize: '0.88rem', lineHeight: 1.6 }}>
                                    Didn't receive it? Check your <strong>spam or junk</strong> folder. The email will come from <strong>noreply@abctelemedica.ng</strong>.
                                </p>
                            </div>

                            <div className="ob-nav" style={{ borderTop: 'none', paddingTop: 0 }}>
                                <button
                                    className="ob-btn-back"
                                    onClick={() => setSent(false)}
                                    type="button"
                                >
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M19 12H5M12 19l-7-7 7-7" />
                                    </svg>
                                    Try a different email
                                </button>
                                <button
                                    className="ob-btn-next"
                                    onClick={() => navigate('/login')}
                                    type="button"
                                >
                                    Back to login
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <style>{`@keyframes ob-spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default ForgotPassword;