import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './userdashboardhomepage.css';
import {
    FiAlertCircle,
    FiArrowUpRight,
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiDollarSign,
    FiGlobe,
    FiHeart,
    FiMessageSquare,
    FiPlus,
    FiRefreshCw,
    FiSave,
    FiShield,
    FiStar,
    FiToggleLeft,
    FiToggleRight,
    FiTrash2,
    FiUser,
    FiUserCheck,
    FiUsers,
    FiX,
    FiXCircle,
} from 'react-icons/fi';

// ── API base — change this if you move servers ───
const API_BASE = 'https://abctelemed.onrender.com';

const getToken = () => localStorage.getItem('token');
const getStoredDoctor = () => {
    try { return JSON.parse(localStorage.getItem('doctorProfile') || 'null'); } catch { return null; }
};
const setStoredDoctor = (doc) => {
    localStorage.setItem('doctorProfile', JSON.stringify(doc));
    window.dispatchEvent(new Event('doctor-profile-updated'));
};

const apiFetch = async (path, options = {}) => {
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
            ...(options.headers || {}),
        },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
};

// ── Constants ────
const SPECIALTY_LABELS = {
    general_practice: 'General Practice', cardiology: 'Cardiology',
    dermatology: 'Dermatology', pediatrics: 'Pediatrics',
    gynecology: 'Gynecology', orthopedics: 'Orthopedics',
    neurology: 'Neurology', psychiatry: 'Psychiatry',
    ophthalmology: 'Ophthalmology', ent: 'ENT', urology: 'Urology',
    oncology: 'Oncology', endocrinology: 'Endocrinology',
    gastroenterology: 'Gastroenterology', pulmonology: 'Pulmonology',
    nephrology: 'Nephrology', other: 'Other',
};

const STATUS_META = {
    pending: { label: 'Pending verification', tone: 'pending', message: 'Your license is under review. You can complete your profile while we verify your credentials.' },
    verified: { label: 'Verified doctor', tone: 'verified', message: 'Your profile is live and ready for patient assignments.' },
    suspended: { label: 'Temporarily suspended', tone: 'warning', message: 'Your account needs attention before you can receive new consultations.' },
    rejected: { label: 'Verification needs attention', tone: 'warning', message: 'Please review your submitted details and update any missing verification items.' },
};

const SECTION_META = {
    overview: { tag: 'Today', title: 'Your care command center', description: 'A summary of profile strength, availability, and patient-facing readiness.' },
    schedule: { tag: 'Availability', title: 'Shape your consultation hours', description: 'Keep your shifts current so patient assignments land at the right time.' },
    consultations: { tag: 'Queue', title: 'Patient conversations and triage', description: 'Active and recent consultations appear here with triage context.' },
    profile: { tag: 'Profile', title: 'How patients see you', description: 'Your profile should feel confident, clear, and trustworthy.' },
    verification: { tag: 'Verification', title: 'Credential confidence', description: 'Track what is complete, what is pending, and what needs attention.' },
    earnings: {
        tag: 'Finance',
        title: 'Your earnings & withdrawals',
        description: 'Track what you\'ve earned, what\'s pending, and request your payout.',
    },
};

const CONSULT_STATUS = {
    pending: { label: 'Pending', color: '#F59E0B', bg: '#FEF3C7' },
    confirmed: { label: 'Confirmed', color: '#3B82F6', bg: '#EFF6FF' },
    ongoing: { label: 'Ongoing', color: '#10B981', bg: '#D1FAE5' },
    completed: { label: 'Completed', color: '#6B7280', bg: '#F3F4F6' },
    cancelled: { label: 'Cancelled', color: '#EF4444', bg: '#FEE2E2' },
    no_show: { label: 'No-show', color: '#8B5CF6', bg: '#EDE9FE' },
};

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const LANGUAGE_OPTIONS = ['English', 'Igbo', 'Yoruba', 'Hausa', 'Pidgin', 'French', 'Arabic'];

const formatCurrency = (amount = 0, currency = 'NGN') =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency, maximumFractionDigits: 0 }).format(Number(amount || 0));

const formatDay = (v = '') => v ? v.charAt(0).toUpperCase() + v.slice(1) : 'Day';
const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
const getInitials = (name = '') =>
    name.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]?.toUpperCase()).join('') || 'DR';

// ── Toast ─────────────────────────────────────────────────────────────────────
const useToast = () => {
    const [toast, setToast] = useState(null);
    const show = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };
    return { toast, show };
};

const Toast = ({ toast }) => {
    if (!toast) return null;
    const isErr = toast.type === 'error';
    return (
        <div style={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 999,
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '14px 20px', borderRadius: 16,
            background: isErr ? '#FEF2F2' : '#F0FDF4',
            border: `1px solid ${isErr ? '#FECACA' : '#BBF7D0'}`,
            color: isErr ? '#991B1B' : '#166534',
            boxShadow: '0 8px 32px rgba(0,0,0,.12)',
            fontSize: '0.88rem', fontWeight: 500, maxWidth: 320,
            animation: 'slideIn .25s ease'
        }}>
            {isErr ? <FiXCircle /> : <FiCheckCircle />}
            {toast.msg}
        </div>
    );
};

// ── End Consultation Modal ─────────────────────────────────────────────────────
const EndConsultModal = ({ consultation, onClose, onDone, toast }) => {
    const [notes, setNotes] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [followUpDate, setFollowUpDate] = useState('');
    const [prescriptions, setPrescriptions] = useState([{ medication: '', dosage: '', frequency: '', duration: '' }]);
    const [loading, setLoading] = useState(false);

    const addRx = () => setPrescriptions(p => [...p, { medication: '', dosage: '', frequency: '', duration: '' }]);
    const removeRx = (i) => setPrescriptions(p => p.filter((_, idx) => idx !== i));
    const updateRx = (i, field, val) => setPrescriptions(p => p.map((rx, idx) => idx === i ? { ...rx, [field]: val } : rx));

    const submit = async () => {
        setLoading(true);
        try {
            const validRx = prescriptions.filter(r => r.medication.trim() && r.dosage.trim() && r.frequency.trim() && r.duration.trim());
            await apiFetch(`/api/consultations/${consultation._id}/end`, {
                method: 'POST',
                body: JSON.stringify({
                    doctorNotes: notes.trim() || undefined,
                    diagnosis: diagnosis.trim() || undefined,
                    prescriptions: validRx.length ? validRx : undefined,
                    followUpDate: followUpDate || undefined,
                }),
            });
            toast.show('Consultation ended. Patient review prompt sent.');
            onDone();
        } catch (e) {
            toast.show(e.message || 'Could not end consultation.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const overlay = { position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(5,20,35,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 };
    const modal = { background: 'white', borderRadius: 24, padding: 28, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,.22)' };
    const inp = { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontFamily: 'inherit', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' };
    const label = { display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#4B5563', marginBottom: 6 };

    return (
        <div style={overlay} onClick={e => e.target === e.currentTarget && onClose()}>
            <div style={modal}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div>
                        <p style={{ margin: 0, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '.1em', color: '#9CA3AF' }}>End session</p>
                        <h3 style={{ margin: '4px 0 0', color: '#0F2940' }}>
                            {consultation.patient?.firstName} {consultation.patient?.lastName}
                        </h3>
                    </div>
                    <button onClick={onClose} style={{ background: '#F3F4F6', border: 'none', borderRadius: 10, padding: 8, cursor: 'pointer', display: 'flex' }}><FiX /></button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                        <label style={label}>Doctor notes (optional)</label>
                        <textarea style={{ ...inp, height: 80, resize: 'vertical' }} placeholder="Clinical notes visible only to you..." value={notes} onChange={e => setNotes(e.target.value)} />
                    </div>
                    <div>
                        <label style={label}>Diagnosis (optional)</label>
                        <input style={inp} placeholder="e.g. Viral upper respiratory tract infection" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} />
                    </div>
                    <div>
                        <label style={label}>Follow-up date (optional)</label>
                        <input type="date" style={inp} value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} />
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                            <label style={{ ...label, marginBottom: 0 }}>Prescriptions (optional)</label>
                            <button onClick={addRx} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#EEF8FB', border: 'none', borderRadius: 8, padding: '6px 12px', color: '#0F5367', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
                                <FiPlus size={12} /> Add
                            </button>
                        </div>
                        {prescriptions.map((rx, i) => (
                            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10, padding: 12, background: '#F9FAFB', borderRadius: 10, position: 'relative' }}>
                                {i > 0 && <button onClick={() => removeRx(i)} style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}><FiX size={14} /></button>}
                                <input style={inp} placeholder="Medication" value={rx.medication} onChange={e => updateRx(i, 'medication', e.target.value)} />
                                <input style={inp} placeholder="Dosage (e.g. 500mg)" value={rx.dosage} onChange={e => updateRx(i, 'dosage', e.target.value)} />
                                <input style={inp} placeholder="Frequency (e.g. Twice daily)" value={rx.frequency} onChange={e => updateRx(i, 'frequency', e.target.value)} />
                                <input style={inp} placeholder="Duration (e.g. 7 days)" value={rx.duration} onChange={e => updateRx(i, 'duration', e.target.value)} />
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
                    <button onClick={onClose} style={{ padding: '11px 20px', borderRadius: 12, border: '1.5px solid #E5E7EB', background: 'none', cursor: 'pointer', fontSize: '0.88rem', color: '#4B5563' }}>Cancel</button>
                    <button onClick={submit} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 24px', borderRadius: 12, border: 'none', background: '#564DDF', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' }}>
                        {loading ? <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'ob-spin .7s linear infinite', display: 'inline-block' }} /> : <FiCheckCircle />}
                        End consultation
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Main Component ─────────────────────────────────────────────────────────────
const Userdashboardhomepage = ({ activeSection = 'overview', onSelectSection }) => {
    const [doctor, setDoctor] = useState(getStoredDoctor);
    const [consultations, setConsultations] = useState([]);
    const [consultLoading, setConsultLoading] = useState(false);
    const [availLoading, setAvailLoading] = useState(false);
    const [profileSaving, setProfileSaving] = useState(false);
    const [scheduleSaving, setScheduleSaving] = useState(false);
    const [profileForm, setProfileForm] = useState(null);
    const [scheduleForm, setScheduleForm] = useState(null);
    const [endModal, setEndModal] = useState(null);
    const toast = useToast();

    // ── Fetch doctor profile from API ──────────────────────────────────────────
    const fetchProfile = useCallback(async () => {
        const stored = getStoredDoctor();
        const id = stored?.id;
        if (!id) return;
        try {
            const data = await apiFetch(`/api/doctors/${id}`);
            const merged = { ...stored, ...data.data?.doctor };
            setDoctor(merged);
            setStoredDoctor(merged);
        } catch (_) { /* keep localStorage version if offline */ }
    }, []);

    useEffect(() => { fetchProfile(); }, [fetchProfile]);

    // ── Sync profile form when doctor data loads ───────────────────────────────
    useEffect(() => {
        if (doctor) {
            setProfileForm({
                bio: doctor.bio || '',
                phone: doctor.phone || '',
                whatsappNumber: doctor.whatsappNumber || '',
                consultationFee: doctor.consultationFee ?? '',
                languages: doctor.languages || ['English'],
            });
            setScheduleForm({
                isAvailableNow: doctor.isAvailableNow || false,
                isOnCall: doctor.isOnCall || false,
                availabilitySchedule: doctor.availabilitySchedule || [],
                consultationDuration: doctor.consultationDuration || 15,
            });
        }
    }, [doctor]);

    // ── Fetch consultations ────────────────────────────────────────────────────
    const fetchConsultations = useCallback(async () => {
        const id = getStoredDoctor()?.id;
        if (!id) return;
        setConsultLoading(true);
        try {
            const data = await apiFetch(`/api/consultations/doctor/${id}?limit=20`);
            setConsultations(data.data?.consultations || []);
        } catch (e) {
            toast.show('Could not load consultations.', 'error');
        } finally {
            setConsultLoading(false);
        }
    }, []);

    useEffect(() => {
        if (activeSection === 'consultations') fetchConsultations();
    }, [activeSection, fetchConsultations]);

    // ── Toggle availability ────────────────────────────────────────────────────
    const toggleAvailability = async () => {
        const id = doctor?.id;
        if (!id || availLoading) return;
        const next = !doctor.isAvailableNow;
        setAvailLoading(true);
        try {
            await apiFetch(`/api/doctors/${id}/availability`, {
                method: 'PATCH',
                body: JSON.stringify({ isAvailableNow: next }),
            });
            const updated = { ...doctor, isAvailableNow: next };
            setDoctor(updated);
            setStoredDoctor(updated);
            toast.show(next ? 'You are now online for consultations.' : 'You are now offline.');
        } catch (e) {
            toast.show(e.message || 'Could not update availability.', 'error');
        } finally {
            setAvailLoading(false);
        }
    };

    // ── Save profile ───────────────────────────────────────────────────────────
    const saveProfile = async () => {
        const id = doctor?.id;
        if (!id || profileSaving) return;
        setProfileSaving(true);
        try {
            const data = await apiFetch(`/api/doctors/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(profileForm),
            });
            const updated = { ...doctor, ...data.data?.doctor };
            setDoctor(updated);
            setStoredDoctor(updated);
            toast.show('Profile updated successfully.');
        } catch (e) {
            toast.show(e.message || 'Could not save profile.', 'error');
        } finally {
            setProfileSaving(false);
        }
    };

    // ── Save schedule ──────────────────────────────────────────────────────────
    const saveSchedule = async () => {
        const id = doctor?.id;
        if (!id || scheduleSaving) return;
        setScheduleSaving(true);
        try {
            await apiFetch(`/api/doctors/${id}/availability`, {
                method: 'PATCH',
                body: JSON.stringify({
                    isAvailableNow: scheduleForm.isAvailableNow,
                    isOnCall: scheduleForm.isOnCall,
                    availabilitySchedule: scheduleForm.availabilitySchedule,
                    consultationDuration: scheduleForm.consultationDuration,
                }),
            });
            const updated = { ...doctor, ...scheduleForm };
            setDoctor(updated);
            setStoredDoctor(updated);
            toast.show('Schedule updated.');
        } catch (e) {
            toast.show(e.message || 'Could not save schedule.', 'error');
        } finally {
            setScheduleSaving(false);
        }
    };

    // ── Derived data ───────────────────────────────────────────────────────────
    const dashboardData = useMemo(() => {
        const profile = doctor || {};
        const statusKey = profile.status || 'pending';
        const statusMeta = STATUS_META[statusKey] || STATUS_META.pending;
        const qualifications = Array.isArray(profile.qualifications) ? profile.qualifications : [];
        const schedule = Array.isArray(profile.availabilitySchedule) ? profile.availabilitySchedule : [];
        const languages = Array.isArray(profile.languages) ? profile.languages : [];
        const specialty = SPECIALTY_LABELS[profile.specialty] || profile.specialty || 'Specialty not set';
        const completionChecks = [
            !!profile.photo, !!profile.bio, !!profile.specialty,
            profile.consultationFee !== undefined && profile.consultationFee !== '',
            qualifications.some(q => q.degree), schedule.length > 0, languages.length > 0,
        ];
        const completionScore = Math.round((completionChecks.filter(Boolean).length / completionChecks.length) * 100);
        const order = DAYS;
        const sortedSchedule = [...schedule].sort((a, b) => order.indexOf(a.day) - order.indexOf(b.day));
        return {
            doctor: profile, specialty, statusMeta, completionScore, sortedSchedule,
            languages, qualifications,
            topQualification: qualifications.find(q => q.degree)?.degree || 'Add your main qualification',
            fee: formatCurrency(profile.consultationFee, profile.currency || 'NGN'),
            rating: Number(profile.rating || 0).toFixed(1),
            totalReviews: profile.totalReviews || 0,
            totalConsultations: profile.totalConsultations || 0,
            nextAvailability: sortedSchedule.length > 0
                ? `${formatDay(sortedSchedule[0].day)} ${sortedSchedule[0].startTime} – ${sortedSchedule[0].endTime}`
                : 'Add your consultation hours',
        };
    }, [doctor]);

    if (!doctor) {
        return (
            <div className="doctor-home">
                <section className="doctor-empty-state">
                    <div className="doctor-empty-badge">Doctor workspace</div>
                    <h1>Finish sign in to open your dashboard</h1>
                    <p>We could not find a saved doctor profile. Sign in again or complete onboarding.</p>
                </section>
            </div>
        );
    }

    const { doctor: profile, specialty, statusMeta, completionScore, sortedSchedule, languages, qualifications, topQualification, fee, rating, totalReviews, totalConsultations, nextAvailability } = dashboardData;

    // ══════════════════════════════════════════════════════════════════════════
    // SECTION RENDERERS
    // ══════════════════════════════════════════════════════════════════════════

    const renderOverview = () => {
        const insightCards = [
            { label: 'Profile completion', value: `${completionScore}%`, description: 'Keep this above 85% for stronger patient trust.', icon: <FiUserCheck />, tone: 'sea' },
            { label: 'Consultation fee', value: fee, description: 'Patients see this before requesting a consultation.', icon: <FiDollarSign />, tone: 'gold' },
            { label: 'Patient rating', value: `${rating} / 5`, description: `${totalReviews} review${totalReviews === 1 ? '' : 's'} recorded.`, icon: <FiStar />, tone: 'rose' },
            { label: 'Availability', value: profile.isAvailableNow ? 'Online now' : 'Offline', description: nextAvailability, icon: <FiClock />, tone: 'sky' },
        ];
        const focusItems = [
            { title: 'Verification status', text: statusMeta.message, icon: <FiShield /> },
            { title: 'Consultation readiness', text: sortedSchedule.length > 0 ? `${sortedSchedule.length} slot${sortedSchedule.length === 1 ? '' : 's'} configured.` : 'No consultation slots yet. Add at least one time window.', icon: <FiMessageSquare /> },
            { title: 'Patient-facing profile', text: profile.bio ? 'Your bio is ready and visible to patients.' : 'Add a short professional bio so patients know your approach.', icon: <FiHeart /> },
        ];

        return (
            <>
                <section className="doctor-hero">
                    <div className="doctor-hero-copy">
                        <div className={`doctor-status-pill ${statusMeta.tone}`}>{statusMeta.label}</div>
                        <p className="doctor-eyebrow">{SECTION_META.overview.tag}</p>
                        <h1>{profile.fullName || 'Doctor profile'}</h1>
                        <p className="doctor-subtitle">{specialty} • {profile.yearsOfExperience || 0} year{Number(profile.yearsOfExperience || 0) === 1 ? '' : 's'} experience</p>
                        <p className="doctor-hero-text">{statusMeta.message}</p>
                        <div className="doctor-hero-actions">
                            <button type="button" className="doctor-primary-btn" onClick={toggleAvailability} disabled={availLoading}>
                                {availLoading ? <span style={{ width: 14, height: 14, border: '2px solid rgba(8,50,78,.3)', borderTopColor: '#08324e', borderRadius: '50%', animation: 'ob-spin .7s linear infinite', display: 'inline-block' }} />
                                    : (profile.isAvailableNow ? <FiToggleRight /> : <FiToggleLeft />)}
                                {profile.isAvailableNow ? 'Set offline now' : 'Go available now'}
                            </button>
                            <div className="doctor-inline-metric">
                                <FiCheckCircle />
                                <span>{completionScore}% profile strength</span>
                            </div>
                        </div>
                    </div>

                    <div className="doctor-hero-card">
                        <div className="doctor-identity">
                            <div className="doctor-avatar">
                                {profile.photo ? <img src={profile.photo} alt={profile.fullName} /> : <span>{getInitials(profile.fullName)}</span>}
                            </div>
                            <div>
                                <h3>{profile.fullName || 'Doctor profile'}</h3>
                                <p>{specialty}</p>
                            </div>
                        </div>
                        <div className="doctor-mini-grid">
                            <article><span>Qualification</span><strong>{topQualification}</strong></article>
                            <article><span>Languages</span><strong>{languages.length ? languages.join(', ') : 'Not set'}</strong></article>
                            <article><span>Experience</span><strong>{profile.yearsOfExperience || 0} years</strong></article>
                            <article><span>Consultations</span><strong>{totalConsultations}</strong></article>
                        </div>
                    </div>
                </section>

                <section className="doctor-insights-grid">
                    {insightCards.map(card => (
                        <article key={card.label} className={`doctor-insight-card ${card.tone}`}>
                            <div className="doctor-insight-icon">{card.icon}</div>
                            <span>{card.label}</span>
                            <strong>{card.value}</strong>
                            <p>{card.description}</p>
                        </article>
                    ))}
                </section>

                <section className="doctor-main-grid">
                    <div className="doctor-panel doctor-panel-large">
                        <div className="doctor-panel-head">
                            <div><p className="doctor-section-tag">This week</p><h2>Consultation schedule</h2></div>
                            <button type="button" className="doctor-panel-chip action" onClick={() => onSelectSection('schedule')}>
                                <FiCalendar /><span>Edit schedule</span>
                            </button>
                        </div>
                        {sortedSchedule.length > 0 ? (
                            <div className="doctor-schedule-list">
                                {sortedSchedule.map((slot, i) => (
                                    <article key={i} className="doctor-schedule-item">
                                        <div className="doctor-schedule-day">
                                            <span>{formatDay(slot.day)}</span>
                                            <strong>{slot.startTime} – {slot.endTime}</strong>
                                        </div>
                                        <div className="doctor-schedule-badge"><FiUsers /><span>Open for bookings</span></div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="doctor-empty-card">
                                <h3>No availability yet</h3>
                                <p>Add consultation windows so patients know when to reach you.</p>
                            </div>
                        )}
                    </div>

                    <div className="doctor-stack">
                        <div className="doctor-panel">
                            <div className="doctor-panel-head"><div><p className="doctor-section-tag">Quick actions</p><h2>Move faster</h2></div></div>
                            <div className="doctor-action-list">
                                {[
                                    { id: 'consultations', label: 'View consultations', icon: <FiMessageSquare /> },
                                    { id: 'schedule', label: 'Manage schedule', icon: <FiCalendar /> },
                                    { id: 'profile', label: 'Edit profile', icon: <FiUser /> },
                                    { id: 'earnings', label: 'Earnings & Payouts', icon: <FiDollarSign /> },
                                ].map(item => (
                                    <button key={item.id} type="button" className="doctor-action-card" onClick={() => onSelectSection(item.id)}>
                                        <span>{item.icon}</span><strong>{item.label}</strong>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="doctor-panel">
                            <div className="doctor-panel-head"><div><p className="doctor-section-tag">Priority focus</p><h2>What to improve next</h2></div></div>
                            <div className="doctor-focus-list">
                                {focusItems.map(item => (
                                    <article key={item.title}>
                                        <div className="doctor-focus-icon">{item.icon}</div>
                                        <div><h3>{item.title}</h3><p>{item.text}</p></div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </>
        );
    };

    // ── Schedule ───────────────────────────────────────────────────────────────
    const renderSchedule = () => {
        if (!scheduleForm) return null;

        const addSlot = () => setScheduleForm(f => ({ ...f, availabilitySchedule: [...f.availabilitySchedule, { day: 'monday', startTime: '08:00', endTime: '17:00' }] }));
        const removeSlot = (i) => setScheduleForm(f => ({ ...f, availabilitySchedule: f.availabilitySchedule.filter((_, idx) => idx !== i) }));
        const updateSlot = (i, field, val) => setScheduleForm(f => ({ ...f, availabilitySchedule: f.availabilitySchedule.map((s, idx) => idx === i ? { ...s, [field]: val } : s) }));

        const inp = { padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontFamily: 'inherit', fontSize: '0.85rem', outline: 'none', background: 'white', width: '100%', boxSizing: 'border-box' };

        return (
            <section className="doctor-panel doctor-section-panel">
                <div className="doctor-panel-head">
                    <div>
                        <p className="doctor-section-tag">{SECTION_META.schedule.tag}</p>
                        <h2>{SECTION_META.schedule.title}</h2>
                        <p className="doctor-panel-copy">{SECTION_META.schedule.description}</p>
                    </div>
                </div>

                {/* Toggles */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
                    <button type="button" className="doctor-primary-btn subtle"
                        onClick={() => setScheduleForm(f => ({ ...f, isAvailableNow: !f.isAvailableNow }))}>
                        {scheduleForm.isAvailableNow ? <FiToggleRight /> : <FiToggleLeft />}
                        {scheduleForm.isAvailableNow ? 'Available now (on)' : 'Available now (off)'}
                    </button>
                    <button type="button" className="doctor-primary-btn subtle"
                        onClick={() => setScheduleForm(f => ({ ...f, isOnCall: !f.isOnCall }))}>
                        {scheduleForm.isOnCall ? <FiToggleRight /> : <FiToggleLeft />}
                        {scheduleForm.isOnCall ? 'On-call (on)' : 'On-call (off)'}
                    </button>
                </div>

                {/* Duration */}
                <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#4B5563', marginBottom: 6 }}>
                        Consultation duration (minutes)
                    </label>
                    <select style={{ ...inp, width: 200 }} value={scheduleForm.consultationDuration}
                        onChange={e => setScheduleForm(f => ({ ...f, consultationDuration: Number(e.target.value) }))}>
                        {[10, 15, 20, 30, 45, 60].map(v => <option key={v} value={v}>{v} minutes</option>)}
                    </select>
                </div>

                {/* Slots */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <p style={{ margin: 0, fontWeight: 600, color: '#12334a', fontSize: '0.9rem' }}>Availability windows</p>
                    <button onClick={addSlot} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#EEF8FB', border: 'none', borderRadius: 10, padding: '8px 14px', color: '#0F5367', fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem' }}>
                        <FiPlus size={13} /> Add slot
                    </button>
                </div>

                {scheduleForm.availabilitySchedule.length === 0 && (
                    <div className="doctor-empty-card"><h3>No slots yet</h3><p>Click "Add slot" to define when you're available for consultations.</p></div>
                )}

                {scheduleForm.availabilitySchedule.map((slot, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 10, marginBottom: 10, padding: 14, background: '#F9FAFB', borderRadius: 14, alignItems: 'end' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#6B7280', marginBottom: 4 }}>Day</label>
                            <select style={inp} value={slot.day} onChange={e => updateSlot(i, 'day', e.target.value)}>
                                {DAYS.map(d => <option key={d} value={d}>{formatDay(d)}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#6B7280', marginBottom: 4 }}>Start</label>
                            <input type="time" style={inp} value={slot.startTime} onChange={e => updateSlot(i, 'startTime', e.target.value)} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#6B7280', marginBottom: 4 }}>End</label>
                            <input type="time" style={inp} value={slot.endTime} onChange={e => updateSlot(i, 'endTime', e.target.value)} />
                        </div>
                        <button onClick={() => removeSlot(i)} style={{ width: 38, height: 38, background: '#FEE2E2', border: 'none', borderRadius: 10, cursor: 'pointer', display: 'grid', placeItems: 'center', color: '#EF4444' }}>
                            <FiTrash2 size={14} />
                        </button>
                    </div>
                ))}

                <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={saveSchedule} disabled={scheduleSaving}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 28px', borderRadius: 14, border: 'none', background: '#564DDF', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
                        {scheduleSaving ? <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'ob-spin .7s linear infinite', display: 'inline-block' }} /> : <FiSave />}
                        Save schedule
                    </button>
                </div>
            </section>
        );
    };

    // ── Consultations ──────────────────────────────────────────────────────────
    const renderConsultations = () => {
        const active = consultations.find(c => c.status === 'ongoing' || c.status === 'confirmed');
        const rest = consultations.filter(c => c !== active);

        return (
            <section className="doctor-panel doctor-section-panel">
                <div className="doctor-panel-head">
                    <div>
                        <p className="doctor-section-tag">{SECTION_META.consultations.tag}</p>
                        <h2>{SECTION_META.consultations.title}</h2>
                        <p className="doctor-panel-copy">{SECTION_META.consultations.description}</p>
                    </div>
                    <button type="button" className="doctor-panel-chip action" onClick={fetchConsultations} disabled={consultLoading}>
                        <FiRefreshCw style={{ animation: consultLoading ? 'ob-spin .7s linear infinite' : 'none' }} />
                        <span>Refresh</span>
                    </button>
                </div>

                {consultLoading && (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#9CA3AF' }}>
                        <span style={{ display: 'inline-block', width: 24, height: 24, border: '3px solid #E5E7EB', borderTopColor: '#564DDF', borderRadius: '50%', animation: 'ob-spin .7s linear infinite' }} />
                        <p style={{ marginTop: 12, fontSize: '0.88rem' }}>Loading consultations…</p>
                    </div>
                )}

                {!consultLoading && (
                    <>
                        {/* Active consultation banner */}
                        {active && (
                            <div style={{ padding: 20, borderRadius: 16, background: 'linear-gradient(135deg, #0F2940, #1a3f6b)', color: 'white', marginBottom: 20 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                                    <div>
                                        <p style={{ margin: '0 0 4px', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '.1em', color: '#93C5FD' }}>Active consultation</p>
                                        <h3 style={{ margin: '0 0 6px', fontSize: '1.1rem' }}>
                                            {active.patient?.firstName} {active.patient?.lastName}
                                        </h3>
                                        <p style={{ margin: 0, color: '#BAE6FD', fontSize: '0.82rem' }}>
                                            Scheduled: {formatDate(active.scheduledAt)} • {active.symptoms?.slice(0, 2).join(', ') || 'No symptoms recorded'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setEndModal(active)}
                                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 20px', borderRadius: 12, border: 'none', background: '#EF4444', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>
                                        <FiCheckCircle /> End session
                                    </button>
                                </div>
                            </div>
                        )}

                        {!active && !consultLoading && consultations.length === 0 && (
                            <div className="doctor-placeholder-grid">
                                <article className="doctor-placeholder-card emphasis">
                                    <strong>No active consultations</strong>
                                    <p>When patients book you, their sessions will appear here with full triage context.</p>
                                </article>
                                <article className="doctor-placeholder-card">
                                    <strong>Ready when you are</strong>
                                    <p>Make sure your availability is on so patients can be matched to you instantly.</p>
                                </article>
                            </div>
                        )}

                        {/* Consultation list */}
                        {rest.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {rest.map(c => {
                                    const sm = CONSULT_STATUS[c.status] || CONSULT_STATUS.pending;
                                    return (
                                        <div key={c._id} style={{ padding: 16, borderRadius: 14, background: '#F9FAFB', border: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                                                    <span style={{ fontWeight: 600, color: '#12334a', fontSize: '0.92rem' }}>
                                                        {c.patient?.firstName} {c.patient?.lastName}
                                                    </span>
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, background: sm.bg, color: sm.color }}>
                                                        {sm.label}
                                                    </span>
                                                </div>
                                                <p style={{ margin: 0, fontSize: '0.78rem', color: '#6B7280' }}>
                                                    {formatDate(c.scheduledAt)} • {c.symptoms?.slice(0, 2).join(', ') || 'No symptoms'} {c.urgency ? `• Urgency: ${c.urgency}` : ''}
                                                </p>
                                                {c.diagnosis && <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#374151' }}>Dx: {c.diagnosis}</p>}
                                                {c.review && <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#F59E0B' }}>{'⭐'.repeat(c.review.rating)} {c.review.comment || ''}</p>}
                                            </div>
                                            {(c.status === 'confirmed' || c.status === 'ongoing') && (
                                                <button onClick={() => setEndModal(c)}
                                                    style={{ padding: '8px 16px', borderRadius: 10, border: 'none', background: '#564DDF', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}>
                                                    End session
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </section>
        );
    };

    // ── Profile edit ───────────────────────────────────────────────────────────
    const renderProfile = () => {
        if (!profileForm) return null;
        const inp = { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontFamily: 'inherit', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' };
        const lbl = { display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#4B5563', marginBottom: 6 };
        const toggleLang = (lang) => setProfileForm(f => ({
            ...f,
            languages: f.languages.includes(lang) ? f.languages.filter(l => l !== lang) : [...f.languages, lang]
        }));

        return (
            <section className="doctor-bottom-grid">
                <div className="doctor-panel doctor-section-panel">
                    <div className="doctor-panel-head">
                        <div>
                            <p className="doctor-section-tag">{SECTION_META.profile.tag}</p>
                            <h2>{SECTION_META.profile.title}</h2>
                            <p className="doctor-panel-copy">{SECTION_META.profile.description}</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <label style={lbl}>Professional bio</label>
                            <textarea style={{ ...inp, height: 110, resize: 'vertical' }}
                                placeholder="A short summary of your expertise, style, and the cases you handle best…"
                                value={profileForm.bio}
                                onChange={e => setProfileForm(f => ({ ...f, bio: e.target.value }))}
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div>
                                <label style={lbl}>Phone number</label>
                                <input style={inp} placeholder="e.g. 08012345678" value={profileForm.phone}
                                    onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))} />
                            </div>
                            <div>
                                <label style={lbl}>WhatsApp number</label>
                                <input style={inp} placeholder="If different from phone" value={profileForm.whatsappNumber}
                                    onChange={e => setProfileForm(f => ({ ...f, whatsappNumber: e.target.value }))} />
                            </div>
                        </div>
                        <div>
                            <label style={lbl}>Consultation fee (₦)</label>
                            <input type="number" style={{ ...inp, width: 200 }} placeholder="e.g. 5000" value={profileForm.consultationFee}
                                onChange={e => setProfileForm(f => ({ ...f, consultationFee: e.target.value }))} />
                        </div>
                        <div>
                            <label style={lbl}>Languages spoken</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {LANGUAGE_OPTIONS.map(lang => {
                                    const selected = profileForm.languages.includes(lang);
                                    return (
                                        <button key={lang} type="button" onClick={() => toggleLang(lang)}
                                            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 999, border: '1.5px solid', fontFamily: 'inherit', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', background: selected ? '#564DDF' : 'white', borderColor: selected ? '#564DDF' : '#E5E7EB', color: selected ? 'white' : '#4B5563' }}>
                                            {selected && <FiCheckCircle size={12} />}
                                            {lang}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={saveProfile} disabled={profileSaving}
                            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 28px', borderRadius: 14, border: 'none', background: '#564DDF', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
                            {profileSaving ? <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'ob-spin .7s linear infinite', display: 'inline-block' }} /> : <FiSave />}
                            Save changes
                        </button>
                    </div>
                </div>

                {/* Read-only info panel */}
                <div className="doctor-panel doctor-section-panel">
                    <div className="doctor-panel-head"><div><p className="doctor-section-tag">Account info</p><h2>Your credentials</h2></div></div>
                    <div className="doctor-profile-list">
                        <article><span>Email</span><strong>{profile.email || '—'}</strong></article>
                        <article><span>Specialty</span><strong>{specialty}</strong></article>
                        <article><span>Rating</span><strong>⭐ {rating} ({totalReviews} reviews)</strong></article>
                        <article><span>Total consultations</span><strong>{totalConsultations}</strong></article>
                        <article><span>Account status</span><strong style={{ textTransform: 'capitalize' }}>{profile.status || 'pending'}</strong></article>
                    </div>
                    <div className="doctor-bio-card" style={{ marginTop: 16 }}>
                        <div className="doctor-bio-meta">
                            <span><FiGlobe /> {languages.length ? languages.join(', ') : 'No languages set'}</span>
                            <span><FiStar /> {rating} average rating</span>
                        </div>
                    </div>
                </div>
            </section>
        );
    };

    // ── Verification ───
    const renderVerification = () => (
        <section className="doctor-bottom-grid">
            <div className="doctor-panel doctor-section-panel">
                <div className="doctor-panel-head">
                    <div>
                        <p className="doctor-section-tag">{SECTION_META.verification.tag}</p>
                        <h2>{SECTION_META.verification.title}</h2>
                        <p className="doctor-panel-copy">{SECTION_META.verification.description}</p>
                    </div>
                </div>
                <div className="doctor-focus-list">
                    <article>
                        <div className="doctor-focus-icon"><FiShield /></div>
                        <div><h3>Current review state</h3><p>{statusMeta.message}</p></div>
                    </article>
                    <article>
                        <div className="doctor-focus-icon"><FiCheckCircle /></div>
                        <div><h3>License details</h3>
                            <p>{profile.licenseNumber ? `License #${profile.licenseNumber} — submitted for review.` : 'License number not on record.'}</p>
                        </div>
                    </article>
                </div>
            </div>
            <div className="doctor-panel doctor-section-panel">
                <div className="doctor-panel-head"><div><p className="doctor-section-tag">Qualifications</p><h2>Submitted credentials</h2></div></div>
                {qualifications.length > 0 ? (
                    <div className="doctor-qualifications-grid">
                        {qualifications.map((q, i) => (
                            <article key={i}>
                                <strong>{q.degree || 'Qualification'}</strong>
                                <span>{q.institution || 'Institution not set'}</span>
                                <small>{q.year || 'Year pending'}</small>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="doctor-empty-card compact"><h3>No qualifications added</h3><p>Your professional credentials will appear here once saved.</p></div>
                )}
            </div>
        </section>
    );

    const renderEarnings = () => {
        // State local to the section
        const [earnings, setEarnings] = React.useState([]);
        const [summary, setSummary] = React.useState(null);
        const [withdrawals, setWithdrawals] = React.useState([]);
        const [loading, setLoading] = React.useState(true);
        const [showForm, setShowForm] = React.useState(false);
        const [bankForm, setBankForm] = React.useState({ bankName: '', accountNumber: '', accountName: '' });
        const [submitting, setSubmitting] = React.useState(false);
        const [errMsg, setErrMsg] = React.useState('');

        React.useEffect(() => {
            const id = doctor?.id;
            if (!id) return;
            setLoading(true);
            Promise.all([
                apiFetch('/api/doctors/earnings/summary'),
                apiFetch('/api/doctors/withdrawals'),
            ]).then(([sumRes, wdRes]) => {
                setEarnings(sumRes.data?.earnings || []);
                setSummary(sumRes.data?.summary);
                setWithdrawals(wdRes.data?.withdrawals || []);
            }).catch(() => { })
                .finally(() => setLoading(false));
        }, []);

        const requestWithdrawal = async () => {
            if (!bankForm.bankName || !bankForm.accountNumber || !bankForm.accountName) {
                setErrMsg('All bank fields are required.'); return;
            }
            setErrMsg(''); setSubmitting(true);
            try {
                await apiFetch('/api/doctors/withdraw', { method: 'POST', body: JSON.stringify(bankForm) });
                toast.show('Withdrawal request submitted! Admin will process it shortly.');
                setShowForm(false);
            } catch (e) { setErrMsg(e.message); }
            finally { setSubmitting(false); }
        };

        const inp = { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontFamily: 'inherit', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' };
        const lbl = { display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#4B5563', marginBottom: 6 };
        const fmt = (n = 0) => `₦${Number(n).toLocaleString('en-NG')}`;

        if (loading) return <div style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>Loading earnings…</div>;

        return (
            <section className="doctor-panel doctor-section-panel">
                <div className="doctor-panel-head">
                    <div>
                        <p className="doctor-section-tag">Finance</p>
                        <h2>Your earnings & withdrawals</h2>
                        <p className="doctor-panel-copy">Track what you've earned (85% of each consultation fee) and request payouts.</p>
                    </div>
                    {summary?.pending?.total > 0 && !showForm && (
                        <button type="button" className="doctor-primary-btn" onClick={() => setShowForm(true)}>
                            Request withdrawal
                        </button>
                    )}
                </div>

                {/* Summary cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gap: 12, marginBottom: 24 }}>
                    {[
                        { label: 'Available to withdraw', value: fmt(summary?.pending?.total), color: '#10B981', sub: `${summary?.pending?.count || 0} transaction(s)` },
                        { label: 'Processing', value: fmt(summary?.processing?.total), color: '#3B82F6', sub: `${summary?.processing?.count || 0} in progress` },
                        { label: 'Total paid out', value: fmt(summary?.paid?.total), color: '#6B7280', sub: `${summary?.paid?.count || 0} completed` },
                    ].map(card => (
                        <div key={card.label} style={{ padding: 16, borderRadius: 16, background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                            <p style={{ margin: '0 0 6px', fontSize: '0.72rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.08em' }}>{card.label}</p>
                            <p style={{ margin: '0 0 4px', fontSize: '1.3rem', fontWeight: 800, color: card.color }}>{card.value}</p>
                            <p style={{ margin: 0, fontSize: '0.74rem', color: '#9CA3AF' }}>{card.sub}</p>
                        </div>
                    ))}
                </div>

                {/* Platform commission note */}
                <div style={{ padding: '12px 16px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 12, marginBottom: 20, fontSize: '0.82rem', color: '#1E40AF' }}>
                    💡 ABC Telemedica retains a <strong>15% platform commission</strong> on each consultation. You receive <strong>85%</strong> of every consultation fee.
                </div>

                {/* Withdrawal form */}
                {showForm && (
                    <div style={{ padding: 20, borderRadius: 16, background: '#F0FDF4', border: '1px solid #BBF7D0', marginBottom: 24 }}>
                        <h4 style={{ margin: '0 0 16px', color: '#166534' }}>Request withdrawal of {fmt(summary?.pending?.total)}</h4>
                        {errMsg && <p style={{ color: '#EF4444', fontSize: '0.82rem', marginBottom: 12 }}>{errMsg}</p>}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div><label style={lbl}>Bank name</label><input style={inp} placeholder="e.g. GTBank, Access, Zenith" value={bankForm.bankName} onChange={e => setBankForm(f => ({ ...f, bankName: e.target.value }))} /></div>
                            <div><label style={lbl}>Account number</label><input style={inp} placeholder="10-digit NUBAN" value={bankForm.accountNumber} onChange={e => setBankForm(f => ({ ...f, accountNumber: e.target.value }))} /></div>
                            <div><label style={lbl}>Account name</label><input style={inp} placeholder="Exactly as it appears on the account" value={bankForm.accountName} onChange={e => setBankForm(f => ({ ...f, accountName: e.target.value }))} /></div>
                        </div>
                        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                            <button onClick={() => setShowForm(false)} style={{ padding: '10px 20px', borderRadius: 10, border: '1.5px solid #E5E7EB', background: 'none', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'inherit' }}>Cancel</button>
                            <button onClick={requestWithdrawal} disabled={submitting} style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: '#10B981', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'inherit' }}>
                                {submitting ? 'Submitting…' : 'Submit request'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Withdrawal history */}
                {withdrawals.length > 0 && (
                    <div style={{ marginBottom: 24 }}>
                        <h4 style={{ margin: '0 0 12px', color: '#0F2940' }}>Withdrawal requests</h4>
                        {withdrawals.map(w => {
                            const statusColor = { pending: '#F59E0B', processing: '#3B82F6', paid: '#10B981', rejected: '#EF4444' }[w.status] || '#6B7280';
                            return (
                                <div key={w._id} style={{ padding: 14, borderRadius: 12, background: '#F9FAFB', border: '1px solid #E5E7EB', marginBottom: 8, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                                    <div>
                                        <p style={{ margin: '0 0 2px', fontWeight: 600, color: '#111827' }}>{fmt(w.amount)}</p>
                                        <p style={{ margin: 0, fontSize: '0.76rem', color: '#9CA3AF' }}>{w.bankName} • {w.accountNumber} • {new Date(w.createdAt).toLocaleDateString('en-NG')}</p>
                                        {w.rejectionReason && <p style={{ margin: '4px 0 0', fontSize: '0.76rem', color: '#EF4444' }}>Reason: {w.rejectionReason}</p>}
                                        {w.payoutReference && <p style={{ margin: '4px 0 0', fontSize: '0.76rem', color: '#10B981' }}>Ref: {w.payoutReference}</p>}
                                    </div>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, background: `${statusColor}15`, color: statusColor }}>
                                        {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Earnings list */}
                <h4 style={{ margin: '0 0 12px', color: '#0F2940' }}>Earnings history</h4>
                {earnings.length === 0 ? (
                    <div className="doctor-empty-card"><h3>No earnings yet</h3><p>Your earnings appear here after each paid consultation.</p></div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {earnings.map(e => (
                            <div key={e._id} style={{ padding: '12px 16px', borderRadius: 12, background: '#F9FAFB', border: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                                <div>
                                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: '#111827' }}>{fmt(e.doctorAmount)} <span style={{ fontWeight: 400, color: '#9CA3AF', fontSize: '0.78rem' }}>({fmt(e.grossAmount)} gross − {e.commissionRate}% commission)</span></p>
                                    <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#9CA3AF' }}>{new Date(e.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                </div>
                                <span style={{ display: 'inline-flex', padding: '3px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, background: e.status === 'paid' ? '#D1FAE5' : e.status === 'processing' ? '#DBEAFE' : '#FEF3C7', color: e.status === 'paid' ? '#065F46' : e.status === 'processing' ? '#1E40AF' : '#92400E' }}>
                                    {e.status.charAt(0).toUpperCase() + e.status.slice(1)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        );
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'schedule': return renderSchedule();
            case 'consultations': return renderConsultations();
            case 'profile': return renderProfile();
            case 'verification': return renderVerification();
            case 'earnings': return renderEarnings();
            default: return renderOverview();
        }
    };

    return (
        <div className="doctor-home">
            <section className="doctor-mobile-intro">
                <span>{SECTION_META[activeSection]?.tag}</span>
                <h2>{SECTION_META[activeSection]?.title}</h2>
                <p>{SECTION_META[activeSection]?.description}</p>
            </section>

            {renderSection()}

            {endModal && (
                <EndConsultModal
                    consultation={endModal}
                    onClose={() => setEndModal(null)}
                    onDone={() => { setEndModal(null); fetchConsultations(); fetchProfile(); }}
                    toast={toast}
                />
            )}

            <Toast toast={toast.toast} />

            <style>{`
                @keyframes ob-spin { to { transform: rotate(360deg); } }
                @keyframes slideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default Userdashboardhomepage;