import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './onboardingStyle.css';

const ResetPassword = ({ route = '' }) => {
    const navigate = useNavigate();
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [errors, setErrors] = useState({});

    const EyeIcon = ({ open }) => (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            {open
                ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
                : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>
            }
        </svg>
    );

    const validate = () => {
        const errs = {};
        if (!password) errs.password = 'Password is required.';
        else if (password.length < 6) errs.password = 'Minimum 6 characters.';
        if (!confirm) errs.confirm = 'Please confirm your password.';
        else if (password !== confirm) errs.confirm = 'Passwords do not match.';
        return errs;
    };

    const submit = async () => {
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setErrors({});
        setLoading(true);
        try {
            const res = await fetch(`${route}/api/doctors/reset-password/${token}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            const data = await res.json();
            if (res.ok) {
                setDone(true);
            } else {
                setErrors({ submit: data.message || 'This reset link has expired or is invalid. Please request a new one.' });
            }
        } catch (_) {
            setErrors({ submit: 'Network error. Please check your connection and try again.' });
        } finally {
            setLoading(false);
        }
    };

    const inputWrap = {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    };

    const eyeBtn = {
        position: 'absolute', right: 14, background: 'none',
        border: 'none', cursor: 'pointer', color: 'var(--soft)',
        display: 'flex', alignItems: 'center', padding: 0,
    };

    return (
        <div className="ob-page" style={{ background: 'var(--bg)' }}>
            <main className="ob-main">
                <div className="ob-content" style={{ maxWidth: 480 }}>

                    {!done ? (
                        <div className="ob-panel">
                            <div className="ob-step-head">
                                <div className="ob-step-tag">
                                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    Set new password
                                </div>
                                <h1 className="ob-step-title">Reset your password</h1>
                                <p className="ob-step-subtitle">
                                    Choose a strong password for your ABC Telemedica account. You'll use this to log in going forward.
                                </p>
                            </div>

                            {errors.submit && (
                                <div className="ob-notice" style={{ background: '#FEF2F2', borderColor: '#FECACA' }}>
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#EF4444" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                                    </svg>
                                    <span style={{ color: '#991B1B' }}>{errors.submit}</span>
                                </div>
                            )}

                            <div className="ob-field">
                                <label htmlFor="rp-password">
                                    New password <span className="req">*</span>
                                </label>
                                <div style={inputWrap}>
                                    <input
                                        id="rp-password"
                                        type={showPass ? 'text' : 'password'}
                                        className="ob-input"
                                        placeholder="Minimum 6 characters"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        style={{ paddingRight: 44 }}
                                    />
                                    <button type="button" style={eyeBtn} onClick={() => setShowPass(p => !p)}>
                                        <EyeIcon open={showPass} />
                                    </button>
                                </div>
                                {errors.password && (
                                    <span className="ob-error-msg">
                                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                                        </svg>
                                        {errors.password}
                                    </span>
                                )}
                            </div>

                            <div className="ob-field">
                                <label htmlFor="rp-confirm">
                                    Confirm new password <span className="req">*</span>
                                </label>
                                <input
                                    id="rp-confirm"
                                    type={showPass ? 'text' : 'password'}
                                    className="ob-input"
                                    placeholder="Repeat your password"
                                    value={confirm}
                                    onChange={e => setConfirm(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && submit()}
                                />
                                {errors.confirm && (
                                    <span className="ob-error-msg">
                                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                                        </svg>
                                        {errors.confirm}
                                    </span>
                                )}
                            </div>

                            {/* Password strength hint */}
                            {password.length > 0 && (
                                <div style={{ marginBottom: 20 }}>
                                    <div style={{ height: 4, background: '#E5E7EB', borderRadius: 99, overflow: 'hidden', marginBottom: 6 }}>
                                        <div style={{
                                            height: '100%', borderRadius: 99,
                                            width: password.length < 6 ? '25%' : password.length < 10 ? '60%' : '100%',
                                            background: password.length < 6 ? '#EF4444' : password.length < 10 ? '#F59E0B' : '#10B981',
                                            transition: 'width 0.3s ease, background 0.3s ease'
                                        }} />
                                    </div>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--soft)' }}>
                                        {password.length < 6 ? 'Too short' : password.length < 10 ? 'Could be stronger' : 'Strong password'}
                                    </span>
                                </div>
                            )}

                            <div className="ob-nav" style={{ borderTop: 'none', paddingTop: 0, marginTop: 8 }}>
                                <div className="ob-nav-left">
                                    <button className="ob-btn-back" onClick={() => navigate('/login')} type="button">
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M19 12H5M12 19l-7-7 7-7" />
                                        </svg>
                                        Back to login
                                    </button>
                                </div>
                                <button className="ob-btn-next" onClick={submit} disabled={loading} type="button">
                                    {loading ? (
                                        <>
                                            <span style={{
                                                width: 14, height: 14, border: '2px solid rgba(255,255,255,.4)',
                                                borderTopColor: 'white', borderRadius: '50%',
                                                animation: 'ob-spin .7s linear infinite', display: 'inline-block'
                                            }} />
                                            Updating…
                                        </>
                                    ) : (
                                        <>
                                            Set new password
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
                                    Password updated
                                </div>
                                <h1 className="ob-step-title">You're all set!</h1>
                                <p className="ob-step-subtitle">
                                    Your password has been updated successfully. You can now log in with your new password.
                                </p>
                            </div>

                            <div style={{
                                padding: '24px', borderRadius: 16,
                                background: '#F0FDF4', border: '1px solid #BBF7D0', marginBottom: 32
                            }}>
                                <p style={{ margin: 0, color: '#166534', fontSize: '0.88rem', lineHeight: 1.6 }}>
                                    For security, all other active sessions have been logged out. You'll need to sign in again on any other devices.
                                </p>
                            </div>

                            <div className="ob-nav" style={{ borderTop: 'none', paddingTop: 0 }}>
                                <div className="ob-nav-left" />
                                <button className="ob-btn-next ob-btn-submit" onClick={() => navigate('/login')} type="button">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M20 6 9 17l-5-5" />
                                    </svg>
                                    Go to login
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

export default ResetPassword;