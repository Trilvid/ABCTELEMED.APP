import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import './onboardingStyle.css'

const EyeIcon = ({ open }) => open ? (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
) : (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
)

const ArrowLeft = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
)

const Login = ({ route }) => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    const login = async (e) => {
        e.preventDefault()
        setLoading(true)

        let existingDoctorProfile = null
        try {
            existingDoctorProfile = JSON.parse(localStorage.getItem('doctorProfile') || 'null')
        } catch {
            existingDoctorProfile = null
        }

        try {
            const req = await fetch(`${route}/api/doctors/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })
            const res = await req.json()

            if (res.status === 'success') {
                localStorage.setItem('token', res.token)
                localStorage.setItem('doctorProfile', JSON.stringify({
                    ...(existingDoctorProfile || {}),
                    ...(res.data?.doctor || {}),
                    email,
                    status: res.data?.doctor?.status || existingDoctorProfile?.status || 'pending',
                }))
                Toast.fire({ icon: 'success', title: 'Signed in successfully' })
                navigate('/dashboard')
            } else if (res.status === 200 && res.isAdmin === 'admin') {
                localStorage.setItem('atoken', res.token)
                Toast.fire({ icon: 'success', title: 'Admin signed in successfully' })
                navigate('/myadmin')
            } else if (res.status === 403) {
                Toast.fire({ icon: 'error', text: `${res.message}` })
            } else if (res.status === 401) {
                Toast.fire({ icon: 'warning', text: `${res.message}` })
            } else {
                Toast.fire({ icon: 'error', text: `${res.message}` })
            }
        } catch {
            Toast.fire({ icon: 'error', text: 'Network error. Please check your connection.' })
        }

        setLoading(false)
    }

    return (
        <div className="ob-page">
            <main className="ob-main">
                <div className="ob-content">

                    {/* Header nav */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <button
                            type="button"
                            className="ob-btn-back"
                            onClick={() => navigate('/auth-signup')}
                        >
                            <ArrowLeft /> Back
                        </button>
                        <button
                            type="button"
                            className="ob-btn-back"
                            onClick={() => navigate('/')}
                            style={{ padding: '8px 16px' }}
                        >
                            Cancel
                        </button>
                    </div>

                    {/* Panel */}
                    <div className="ob-panel">
                        <div className="ob-step-head">
                            <div className="ob-step-tag">Doctor Portal</div>
                            <h1 className="ob-step-title">Welcome back</h1>
                            <p className="ob-step-subtitle">
                                Login to your dashboard to manage your patients.
                            </p>
                        </div>

                        <form onSubmit={login}>
                            {/* Email */}
                            <div className="ob-field">
                                <label htmlFor="email">
                                    Email Address <span className="req">*</span>
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    className="ob-input"
                                    placeholder="doctor@example.com"
                                    required
                                    autoComplete="off"
                                    value={email}
                                    onChange={e => setEmail(e.target.value.trim())}
                                />
                            </div>

                            {/* Password */}
                            <div className="ob-field">
                                <label htmlFor="password">
                                    Password <span className="req">*</span>
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        className="ob-input"
                                        placeholder="Enter your password"
                                        required
                                        autoComplete="off"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        style={{ paddingRight: '44px' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(p => !p)}
                                        style={{
                                            position: 'absolute',
                                            right: '14px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: 'var(--soft)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: 0,
                                        }}
                                        tabIndex={-1}
                                    >
                                        <EyeIcon open={showPassword} />
                                    </button>
                                </div>
                            </div>

                            {/* Forgot password */}
                            <div style={{ textAlign: 'right', marginTop: '-12px', marginBottom: '24px' }}>
                                <span
                                    onClick={() => navigate('/auth/acctrecovery')}
                                    style={{
                                        fontSize: '0.8rem',
                                        color: 'var(--teal)',
                                        cursor: 'pointer',
                                        fontWeight: 500,
                                    }}
                                >
                                    Forgot password?
                                </span>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="ob-btn-next"
                                disabled={loading}
                                style={{ width: '100%', justifyContent: 'center' }}
                            >
                                {loading ? (
                                    <>
                                        <span style={{
                                            width: 14, height: 14,
                                            border: '2px solid rgba(255,255,255,.4)',
                                            borderTopColor: 'white',
                                            borderRadius: '50%',
                                            animation: 'ob-spin .7s linear infinite',
                                            display: 'inline-block',
                                        }} />
                                        Signing in…
                                    </>
                                ) : 'Login'}
                            </button>

                            {/* Sign up link */}
                            <p style={{
                                textAlign: 'center',
                                marginTop: '24px',
                                fontSize: '0.85rem',
                                color: 'var(--soft)',
                            }}>
                                No account yet?{' '}
                                <span
                                    onClick={() => navigate('/auth-signup')}
                                    style={{ color: 'var(--teal)', fontWeight: 600, cursor: 'pointer' }}
                                >
                                    Sign up
                                </span>
                            </p>
                        </form>
                    </div>

                </div>
            </main>

            <style>{`
                @keyframes ob-spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}

export default Login
