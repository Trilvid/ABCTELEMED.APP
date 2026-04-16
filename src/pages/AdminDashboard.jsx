import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FiActivity, FiAlertTriangle, FiCheck, FiCheckCircle, FiChevronDown,
    FiChevronLeft, FiChevronRight, FiClipboard, FiClock, FiDollarSign,
    FiDownload, FiEye, FiFileText, FiFilter, FiLogOut, FiMenu,
    FiRefreshCw, FiSearch, FiShield, FiTrash2, FiUser, FiUserCheck,
    FiUsers, FiX, FiXCircle, FiZap,
} from 'react-icons/fi';

// ── Config ──────
const API_BASE = 'https://abctelemed-production.up.railway.app';
// const API_BASE = 'http://localhost:5000';

const getToken = () => localStorage.getItem('adminToken');
const getAdmin = () => { try { return JSON.parse(localStorage.getItem('adminProfile') || 'null'); } catch { return null; } };
const setAdmin = (a) => { localStorage.setItem('adminProfile', JSON.stringify(a)); };

const apiFetch = async (path, opts = {}) => {
    const res = await fetch(`${API_BASE}${path}`, {
        ...opts,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}`, ...(opts.headers || {}) },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
};

// ── Helpers ────
const fmt = (n = 0) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(Number(n));
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
const fmtTime = (d) => d ? new Date(d).toLocaleString('en-NG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';
const initials = (n = '') => n.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]?.toUpperCase()).join('') || 'A';
const cap = (s = '') => s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ');

const STATUS_COLORS = {
    pending: { bg: '#FEF3C7', color: '#92400E' },
    verified: { bg: '#D1FAE5', color: '#065F46' },
    suspended: { bg: '#FEE2E2', color: '#991B1B' },
    rejected: { bg: '#FEE2E2', color: '#991B1B' },
    completed: { bg: '#EDE9FE', color: '#5B21B6' },
    ongoing: { bg: '#DBEAFE', color: '#1E40AF' },
    confirmed: { bg: '#DCFCE7', color: '#166534' },
    cancelled: { bg: '#F3F4F6', color: '#374151' },
    paid: { bg: '#D1FAE5', color: '#065F46' },
    processing: { bg: '#DBEAFE', color: '#1E40AF' },
    free: { bg: '#F3F4F6', color: '#374151' },
    basic_monthly: { bg: '#EFF6FF', color: '#1D4ED8' },
    basic_annual: { bg: '#EFF6FF', color: '#1D4ED8' },
    premium_monthly: { bg: '#F5F3FF', color: '#6D28D9' },
    premium_annual: { bg: '#F5F3FF', color: '#6D28D9' },
};
const Chip = ({ label, status }) => {
    const s = STATUS_COLORS[status] || { bg: '#F3F4F6', color: '#374151' };
    return <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, background: s.bg, color: s.color }}>{label || cap(status)}</span>;
};

// ── Toast ─────────────────────────────────────────────────────────────────────
const useToast = () => {
    const [toast, setToast] = useState(null);
    const show = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3800); };
    return { toast, show };
};
const Toast = ({ toast }) => {
    if (!toast) return null;
    const err = toast.type === 'error';
    return (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px', borderRadius: 16, background: err ? '#FEF2F2' : '#F0FDF4', border: `1px solid ${err ? '#FECACA' : '#BBF7D0'}`, color: err ? '#991B1B' : '#166534', boxShadow: '0 8px 32px rgba(0,0,0,.14)', fontSize: '0.88rem', fontWeight: 500, maxWidth: 340 }}>
            {err ? <FiXCircle /> : <FiCheckCircle />} {toast.msg}
        </div>
    );
};

// ── Shared UI ─────────────────────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
    <div style={{ background: 'white', borderRadius: 20, border: '1px solid rgba(20,48,74,.08)', boxShadow: '0 4px 24px rgba(12,40,61,.06)', padding: 24, ...style }}>{children}</div>
);

const StatCard = ({ icon, label, value, sub, color = '#564DDF' }) => (
    <Card style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: `${color}18`, display: 'grid', placeItems: 'center', color, fontSize: '1.1rem' }}>{icon}</div>
        <div>
            <p style={{ margin: 0, fontSize: '0.76rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '.1em' }}>{label}</p>
            <p style={{ margin: '4px 0 0', fontSize: '1.6rem', fontWeight: 800, color: '#0F2940', lineHeight: 1 }}>{value}</p>
            {sub && <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#9CA3AF' }}>{sub}</p>}
        </div>
    </Card>
);

const TableWrapper = ({ children }) => (
    <div style={{ overflowX: 'auto', borderRadius: 16, border: '1px solid #E5E7EB' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>{children}</table>
    </div>
);
const Th = ({ children }) => <th style={{ padding: '12px 16px', background: '#F9FAFB', textAlign: 'left', fontWeight: 700, color: '#374151', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '.08em', whiteSpace: 'nowrap', borderBottom: '1px solid #E5E7EB' }}>{children}</th>;
const Td = ({ children, style = {} }) => <td style={{ padding: '13px 16px', borderBottom: '1px solid #F3F4F6', color: '#374151', verticalAlign: 'middle', ...style }}>{children}</td>;

const Btn = ({ children, onClick, color = '#564DDF', outline, small, disabled, style = {} }) => (
    <button onClick={onClick} disabled={disabled} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: small ? '6px 14px' : '10px 18px', borderRadius: small ? 10 : 12, border: outline ? `1.5px solid ${color}` : 'none', background: outline ? 'transparent' : color, color: outline ? color : 'white', fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', fontSize: small ? '0.78rem' : '0.85rem', opacity: disabled ? .6 : 1, fontFamily: 'inherit', ...style }}>
        {children}
    </button>
);

const Input = ({ value, onChange, placeholder, icon, style = {} }) => (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon && <span style={{ position: 'absolute', left: 12, color: '#9CA3AF' }}>{icon}</span>}
        <input value={value} onChange={onChange} placeholder={placeholder} style={{ padding: icon ? '10px 14px 10px 38px' : '10px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontSize: '0.85rem', outline: 'none', fontFamily: 'inherit', width: '100%', ...style }} />
    </div>
);

const Pagination = ({ page, totalPages, onPage }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
        <Btn outline small onClick={() => onPage(page - 1)} disabled={page <= 1}><FiChevronLeft /></Btn>
        <span style={{ fontSize: '0.82rem', color: '#6B7280' }}>Page {page} of {totalPages || 1}</span>
        <Btn outline small onClick={() => onPage(page + 1)} disabled={page >= totalPages}><FiChevronRight /></Btn>
    </div>
);

const Spinner = () => (
    <div style={{ textAlign: 'center', padding: '48px 0', color: '#9CA3AF' }}>
        <span style={{ display: 'inline-block', width: 28, height: 28, border: '3px solid #E5E7EB', borderTopColor: '#564DDF', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
        <p style={{ marginTop: 12, fontSize: '0.88rem' }}>Loading…</p>
    </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION: OVERVIEW
// ═══════════════════════════════════════════════════════════════════════════════
const OverviewSection = ({ toast }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiFetch('/api/admin/stats')
            .then(d => setStats(d.data))
            .catch(e => toast.show(e.message, 'error'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Spinner />;
    if (!stats) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                <StatCard icon={<FiUsers />} label="Total patients" value={stats.patients.total} color="#0EA5E9" />
                <StatCard icon={<FiUserCheck />} label="Verified doctors" value={stats.doctors.verified} sub={`${stats.doctors.pending} pending`} color="#10B981" />
                <StatCard icon={<FiClipboard />} label="Consultations" value={stats.consultations.total} sub={`${stats.consultations.thisMonth} this month`} color="#564DDF" />
                <StatCard icon={<FiDollarSign />} label="Platform revenue" value={fmt(stats.revenue.allTime.commission)} sub={`${fmt(stats.revenue.thisMonth.commission)} this month`} color="#F59E0B" />
                <StatCard icon={<FiClock />} label="Pending payouts" value={stats.consultations.pending} color="#EF4444" />
                <StatCard icon={<FiActivity />} label="Total fees collected" value={fmt(stats.revenue.allTime.gross)} color="#8B5CF6" />
            </div>

            {/* Doctor status breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                <Card>
                    <p style={{ margin: '0 0 16px', fontWeight: 700, color: '#0F2940' }}>Doctor status</p>
                    {[
                        { label: 'Pending verification', value: stats.doctors.pending, color: '#F59E0B' },
                        { label: 'Verified', value: stats.doctors.verified, color: '#10B981' },
                        { label: 'Suspended', value: stats.doctors.suspended, color: '#EF4444' },
                        { label: 'Total', value: stats.doctors.total, color: '#564DDF' },
                    ].map(row => (
                        <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
                            <span style={{ fontSize: '0.85rem', color: '#4B5563' }}>{row.label}</span>
                            <strong style={{ color: row.color }}>{row.value}</strong>
                        </div>
                    ))}
                </Card>

                <Card>
                    <p style={{ margin: '0 0 16px', fontWeight: 700, color: '#0F2940' }}>Revenue split</p>
                    {[
                        { label: 'Gross collected', value: fmt(stats.revenue.allTime.gross), color: '#0F2940' },
                        { label: 'Platform (15%)', value: fmt(stats.revenue.allTime.commission), color: '#10B981' },
                        { label: 'Doctor payouts (85%)', value: fmt(stats.revenue.allTime.doctorPayouts), color: '#564DDF' },
                    ].map(row => (
                        <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
                            <span style={{ fontSize: '0.85rem', color: '#4B5563' }}>{row.label}</span>
                            <strong style={{ color: row.color }}>{row.value}</strong>
                        </div>
                    ))}
                </Card>

                {stats.recentConsultations?.length > 0 && (
                    <Card style={{ gridColumn: '1 / -1' }}>
                        <p style={{ margin: '0 0 16px', fontWeight: 700, color: '#0F2940' }}>Live confirmed consultations</p>
                        <TableWrapper>
                            <thead><tr><Th>Patient</Th><Th>Doctor</Th><Th>Specialty</Th><Th>Scheduled</Th></tr></thead>
                            <tbody>
                                {stats.recentConsultations.map(c => (
                                    <tr key={c._id}>
                                        <Td>{c.patient?.firstName} {c.patient?.lastName}</Td>
                                        <Td>Dr. {c.doctor?.firstName} {c.doctor?.lastName}</Td>
                                        <Td><Chip label={cap(c.doctor?.specialty)} status="confirmed" /></Td>
                                        <Td>{fmtDate(c.scheduledAt)}</Td>
                                    </tr>
                                ))}
                            </tbody>
                        </TableWrapper>
                    </Card>
                )}
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION: DOCTORS
// ═══════════════════════════════════════════════════════════════════════════════
const DoctorsSection = ({ toast }) => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTP] = useState(1);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [selected, setSelected] = useState(null);
    const [actionModal, setActionModal] = useState(null); // { doctor, type: 'verify'|'suspend'|'reject' }
    const [reason, setReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const fetch_ = useCallback(() => {
        setLoading(true);
        const q = new URLSearchParams({ page, limit: 15, ...(search && { search }), ...(status && { status }) });
        apiFetch(`/api/admin/doctors?${q}`)
            .then(d => { setDoctors(d.data?.doctors || []); setTP(d.totalPages || 1); })
            .catch(e => toast.show(e.message, 'error'))
            .finally(() => setLoading(false));
    }, [page, search, status]);

    useEffect(() => { fetch_(); }, [fetch_]);

    const doAction = async () => {
        if (!actionModal) return;
        setActionLoading(true);
        try {
            const { doctor, type } = actionModal;
            if (type === 'verify') {
                await apiFetch(`/api/admin/doctors/${doctor._id}/verify`, { method: 'PATCH', body: JSON.stringify({ action: 'approve' }) });
                toast.show(`Dr. ${doctor.lastName} verified.`);
            } else {
                await apiFetch(`/api/admin/doctors/${doctor._id}/status`, { method: 'PATCH', body: JSON.stringify({ status: type, reason }) });
                toast.show(`Doctor status changed to ${type}.`);
            }
            setActionModal(null); setReason(''); fetch_();
        } catch (e) { toast.show(e.message, 'error'); }
        finally { setActionLoading(false); }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Filters */}
            <Card style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                <Input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search name, email, license…" icon={<FiSearch size={14} />} style={{ width: 240 }} />
                <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontSize: '0.85rem', fontFamily: 'inherit', outline: 'none', cursor: 'pointer' }}>
                    <option value="">All statuses</option>
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="suspended">Suspended</option>
                    <option value="rejected">Rejected</option>
                </select>
                <Btn onClick={fetch_} outline small><FiRefreshCw size={13} /> Refresh</Btn>
            </Card>

            <Card>
                {loading ? <Spinner /> : (
                    <>
                        <TableWrapper>
                            <thead><tr><Th>Doctor</Th><Th>Specialty</Th><Th>Status</Th><Th>Rating</Th><Th>Consultations</Th><Th>Joined</Th><Th>Actions</Th></tr></thead>
                            <tbody>
                                {doctors.length === 0 && <tr><Td colSpan={7} style={{ textAlign: 'center', color: '#9CA3AF' }}>No doctors found.</Td></tr>}
                                {doctors.map(doc => (
                                    <tr key={doc._id}>
                                        <Td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#EDE9FE', display: 'grid', placeItems: 'center', fontWeight: 700, color: '#5B21B6', fontSize: '0.8rem', flexShrink: 0 }}>
                                                    {doc.photo ? <img src={doc.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} /> : initials(`${doc.firstName} ${doc.lastName}`)}
                                                </div>
                                                <div>
                                                    <p style={{ margin: 0, fontWeight: 600, color: '#111827', fontSize: '0.88rem' }}>Dr. {doc.firstName} {doc.lastName}</p>
                                                    <p style={{ margin: 0, fontSize: '0.74rem', color: '#9CA3AF' }}>{doc.email}</p>
                                                </div>
                                            </div>
                                        </Td>
                                        <Td><Chip label={cap(doc.specialty)} status="confirmed" /></Td>
                                        <Td><Chip status={doc.status} /></Td>
                                        <Td>⭐ {Number(doc.rating || 0).toFixed(1)}</Td>
                                        <Td>{doc.totalConsultations || 0}</Td>
                                        <Td>{fmtDate(doc.createdAt)}</Td>
                                        <Td>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <Btn small outline onClick={() => setSelected(doc)}><FiEye size={13} /> View</Btn>
                                                {doc.status === 'pending' && <Btn small color="#10B981" onClick={() => setActionModal({ doctor: doc, type: 'verify' })}><FiCheck size={13} /> Verify</Btn>}
                                                {doc.status === 'verified' && <Btn small color="#EF4444" outline onClick={() => setActionModal({ doctor: doc, type: 'suspended' })}><FiXCircle size={13} /> Suspend</Btn>}
                                                {doc.status === 'suspended' && <Btn small color="#10B981" onClick={() => setActionModal({ doctor: doc, type: 'verified' })}><FiCheckCircle size={13} /> Reinstate</Btn>}
                                            </div>
                                        </Td>
                                    </tr>
                                ))}
                            </tbody>
                        </TableWrapper>
                        <Pagination page={page} totalPages={totalPages} onPage={setPage} />
                    </>
                )}
            </Card>

            {/* Detail drawer */}
            {selected && <DoctorDetailModal doctor={selected} onClose={() => setSelected(null)} toast={toast} onRefresh={fetch_} />}

            {/* Action modal */}
            {actionModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(5,20,35,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 16 }}>
                    <Card style={{ maxWidth: 420, width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                            <h3 style={{ margin: 0, color: '#0F2940' }}>{actionModal.type === 'verify' ? 'Verify doctor' : actionModal.type === 'suspended' ? 'Suspend doctor' : 'Update status'}</h3>
                            <button onClick={() => { setActionModal(null); setReason(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}><FiX /></button>
                        </div>
                        <p style={{ color: '#6B7280', fontSize: '0.88rem', marginBottom: 16 }}>
                            {actionModal.type === 'verify'
                                ? `Verify Dr. ${actionModal.doctor.firstName} ${actionModal.doctor.lastName} and make them visible to patients?`
                                : `Change Dr. ${actionModal.doctor.firstName} ${actionModal.doctor.lastName}'s status to "${actionModal.type}"?`}
                        </p>
                        {actionModal.type !== 'verify' && (
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#4B5563', marginBottom: 6 }}>Reason (optional)</label>
                                <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontFamily: 'inherit', fontSize: '0.85rem', resize: 'vertical', boxSizing: 'border-box', outline: 'none' }} placeholder="Provide a reason…" />
                            </div>
                        )}
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                            <Btn outline small onClick={() => { setActionModal(null); setReason(''); }}>Cancel</Btn>
                            <Btn small color={actionModal.type === 'verify' || actionModal.type === 'verified' ? '#10B981' : '#EF4444'} onClick={doAction} disabled={actionLoading}>
                                {actionLoading ? 'Processing…' : 'Confirm'}
                            </Btn>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

const DoctorDetailModal = ({ doctor, onClose, toast, onRefresh }) => {
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiFetch(`/api/admin/doctors/${doctor._id}`)
            .then(d => setDetail(d.data))
            .catch(e => toast.show(e.message, 'error'))
            .finally(() => setLoading(false));
    }, [doctor._id]);

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(5,20,35,.55)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', zIndex: 200 }}>
            <div style={{ width: 'min(560px, 96vw)', height: '100vh', background: 'white', overflowY: 'auto', padding: 28, boxShadow: '-24px 0 80px rgba(0,0,0,.18)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <h2 style={{ margin: 0, color: '#0F2940' }}>Dr. {doctor.firstName} {doctor.lastName}</h2>
                    <button onClick={onClose} style={{ background: '#F3F4F6', border: 'none', borderRadius: 10, padding: 8, cursor: 'pointer', display: 'flex' }}><FiX /></button>
                </div>
                {loading ? <Spinner /> : detail && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {[
                            { label: 'Email', value: detail.doctor.email },
                            { label: 'Phone', value: detail.doctor.phone },
                            { label: 'WhatsApp', value: detail.doctor.whatsappNumber || '—' },
                            { label: 'Specialty', value: cap(detail.doctor.specialty) },
                            { label: 'License No.', value: detail.doctor.licenseNumber },
                            { label: 'License Expiry', value: fmtDate(detail.doctor.licenseExpiry) },
                            { label: 'Experience', value: `${detail.doctor.yearsOfExperience} years` },
                            { label: 'Consultation fee', value: fmt(detail.doctor.consultationFee) },
                            { label: 'Rating', value: `⭐ ${Number(detail.doctor.rating || 0).toFixed(1)} (${detail.doctor.totalReviews} reviews)` },
                            { label: 'Status', value: <Chip status={detail.doctor.status} /> },
                            { label: 'License verified', value: detail.doctor.licenseVerified ? '✅ Yes' : '❌ No' },
                        ].map(r => (
                            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
                                <span style={{ fontSize: '0.82rem', color: '#6B7280' }}>{r.label}</span>
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111827' }}>{r.value}</span>
                            </div>
                        ))}
                        {detail.doctor.bio && <div style={{ padding: 14, background: '#F9FAFB', borderRadius: 12 }}><p style={{ margin: 0, fontSize: '0.85rem', color: '#374151', lineHeight: 1.6 }}>{detail.doctor.bio}</p></div>}
                        {detail.earnings?.length > 0 && (
                            <>
                                <h4 style={{ margin: '8px 0 0', color: '#0F2940' }}>Recent earnings</h4>
                                {detail.earnings.slice(0, 5).map(e => (
                                    <div key={e._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
                                        <span style={{ fontSize: '0.82rem', color: '#6B7280' }}>{fmtDate(e.createdAt)}</span>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{fmt(e.doctorAmount)} <Chip status={e.status} /></span>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION: PATIENTS
// ═══════════════════════════════════════════════════════════════════════════════
const PatientsSection = ({ toast }) => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTP] = useState(1);
    const [search, setSearch] = useState('');
    const [plan, setPlan] = useState('');
    const [selected, setSelected] = useState(null);

    const fetch_ = useCallback(() => {
        setLoading(true);
        const q = new URLSearchParams({ page, limit: 20, ...(search && { search }), ...(plan && { plan }) });
        apiFetch(`/api/admin/patients?${q}`)
            .then(d => { setPatients(d.data?.patients || []); setTP(d.totalPages || 1); })
            .catch(e => toast.show(e.message, 'error'))
            .finally(() => setLoading(false));
    }, [page, search, plan]);

    useEffect(() => { fetch_(); }, [fetch_]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Card style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <Input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search name or WhatsApp…" icon={<FiSearch size={14} />} style={{ width: 240 }} />
                <select value={plan} onChange={e => { setPlan(e.target.value); setPage(1); }} style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontSize: '0.85rem', fontFamily: 'inherit', outline: 'none', cursor: 'pointer' }}>
                    <option value="">All plans</option>
                    <option value="free">Free</option>
                    <option value="basic_monthly">Basic Monthly</option>
                    <option value="basic_annual">Basic Annual</option>
                    <option value="premium_monthly">Premium Monthly</option>
                    <option value="premium_annual">Premium Annual</option>
                </select>
                <Btn outline small onClick={fetch_}><FiRefreshCw size={13} /> Refresh</Btn>
            </Card>
            <Card>
                {loading ? <Spinner /> : (
                    <>
                        <TableWrapper>
                            <thead><tr><Th>Patient</Th><Th>WhatsApp</Th><Th>Location</Th><Th>Plan</Th><Th>Consultations</Th><Th>Joined</Th><Th>Actions</Th></tr></thead>
                            <tbody>
                                {patients.length === 0 && <tr><Td colSpan={7} style={{ textAlign: 'center', color: '#9CA3AF' }}>No patients found.</Td></tr>}
                                {patients.map(p => (
                                    <tr key={p._id}>
                                        <Td><span style={{ fontWeight: 600, color: '#111827' }}>{p.firstName || '—'} {p.lastName || ''}</span></Td>
                                        <Td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>+{p.whatsappNumber}</Td>
                                        <Td>{p.location?.state || '—'}{p.location?.country ? `, ${p.location.country}` : ''}</Td>
                                        <Td><Chip label={cap(p.plan || 'free')} status={p.plan || 'free'} /></Td>
                                        <Td>{p.totalConsultations || 0}</Td>
                                        <Td>{fmtDate(p.createdAt)}</Td>
                                        <Td><Btn small outline onClick={() => setSelected(p)}><FiEye size={13} /> View</Btn></Td>
                                    </tr>
                                ))}
                            </tbody>
                        </TableWrapper>
                        <Pagination page={page} totalPages={totalPages} onPage={setPage} />
                    </>
                )}
            </Card>
            {selected && <PatientDetailModal patient={selected} onClose={() => setSelected(null)} toast={toast} />}
        </div>
    );
};

const PatientDetailModal = ({ patient, onClose, toast }) => {
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiFetch(`/api/admin/patients/${patient._id}`)
            .then(d => setDetail(d.data))
            .catch(e => toast.show(e.message, 'error'))
            .finally(() => setLoading(false));
    }, [patient._id]);

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(5,20,35,.55)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', zIndex: 200 }}>
            <div style={{ width: 'min(560px, 96vw)', height: '100vh', background: 'white', overflowY: 'auto', padding: 28, boxShadow: '-24px 0 80px rgba(0,0,0,.18)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div>
                        <p style={{ margin: 0, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '.1em', color: '#9CA3AF' }}>Patient record — NDPC protected</p>
                        <h2 style={{ margin: '4px 0 0', color: '#0F2940' }}>{patient.firstName || 'Unknown'} {patient.lastName || ''}</h2>
                    </div>
                    <button onClick={onClose} style={{ background: '#F3F4F6', border: 'none', borderRadius: 10, padding: 8, cursor: 'pointer', display: 'flex' }}><FiX /></button>
                </div>
                <div style={{ padding: 10, background: '#FEF3C7', borderRadius: 10, marginBottom: 20, fontSize: '0.78rem', color: '#92400E' }}>
                    ⚠️ This access has been logged to the audit trail per NDPC data protection requirements.
                </div>
                {loading ? <Spinner /> : detail && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {[
                            { label: 'WhatsApp', value: `+${detail.patient.whatsappNumber}` },
                            { label: 'Gender', value: cap(detail.patient.gender || '—') },
                            { label: 'Date of Birth', value: fmtDate(detail.patient.dateOfBirth) },
                            { label: 'Location', value: `${detail.patient.location?.state || '—'}, ${detail.patient.location?.country || '—'}` },
                            { label: 'Plan', value: <Chip label={cap(detail.patient.plan || 'free')} status={detail.patient.plan || 'free'} /> },
                            { label: 'Plan expires', value: fmtDate(detail.patient.planExpiresAt) },
                            { label: 'Blood group', value: detail.patient.bloodGroup || '—' },
                            { label: 'Genotype', value: detail.patient.genotype || '—' },
                            { label: 'Total consultations', value: detail.patient.totalConsultations || 0 },
                        ].map(r => (
                            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
                                <span style={{ fontSize: '0.82rem', color: '#6B7280' }}>{r.label}</span>
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111827' }}>{r.value}</span>
                            </div>
                        ))}
                        {detail.consultations?.length > 0 && (
                            <>
                                <h4 style={{ margin: '8px 0 0', color: '#0F2940' }}>Consultation history</h4>
                                {detail.consultations.map(c => (
                                    <div key={c._id} style={{ padding: 14, background: '#F9FAFB', borderRadius: 12, marginBottom: 8 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                            <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Dr. {c.doctor?.firstName} {c.doctor?.lastName}</span>
                                            <Chip status={c.status} />
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.78rem', color: '#6B7280' }}>{fmtDate(c.scheduledAt)} • {c.symptoms?.join(', ') || 'No symptoms'}</p>
                                        {c.diagnosis && <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#374151' }}>Dx: {c.diagnosis}</p>}
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION: PAYMENTS/EARNINGS
// ═══════════════════════════════════════════════════════════════════════════════
const PaymentsSection = ({ toast }) => {
    const [earnings, setEarnings] = useState([]);
    const [summary, setSummary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTP] = useState(1);
    const [statusFilter, setStatusFilter] = useState('pending');
    const [selected, setSelected] = useState([]); // for bulk payout
    const [payoutModal, setPayoutModal] = useState(null); // single earning
    const [bulkModal, setBulkModal] = useState(false);
    const [payoutRef, setPayoutRef] = useState('');
    const [payoutMethod, setPayoutMethod] = useState('bank_transfer');
    const [payoutNote, setPayoutNote] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const fetch_ = useCallback(() => {
        setLoading(true);
        const q = new URLSearchParams({ page, limit: 20, ...(statusFilter && { status: statusFilter }) });
        apiFetch(`/api/admin/earnings?${q}`)
            .then(d => { setEarnings(d.data?.earnings || []); setSummary(d.data?.summary || []); setTP(d.totalPages || 1); })
            .catch(e => toast.show(e.message, 'error'))
            .finally(() => setLoading(false));
    }, [page, statusFilter]);

    useEffect(() => { fetch_(); setSelected([]); }, [fetch_]);

    const processSingle = async () => {
        setActionLoading(true);
        try {
            await apiFetch(`/api/admin/earnings/${payoutModal._id}/payout`, {
                method: 'PATCH',
                body: JSON.stringify({ payoutMethod, payoutReference: payoutRef, payoutNote }),
            });
            toast.show(`Payout of ${fmt(payoutModal.doctorAmount)} processed.`);
            setPayoutModal(null); setPayoutRef(''); setPayoutNote(''); fetch_();
        } catch (e) { toast.show(e.message, 'error'); }
        finally { setActionLoading(false); }
    };

    const processBulk = async () => {
        setActionLoading(true);
        try {
            await apiFetch('/api/admin/earnings/bulk-payout', {
                method: 'POST',
                body: JSON.stringify({ earningIds: selected, payoutMethod, payoutReference: payoutRef, payoutNote }),
            });
            toast.show(`${selected.length} payouts processed.`);
            setBulkModal(false); setSelected([]); setPayoutRef(''); fetch_();
        } catch (e) { toast.show(e.message, 'error'); }
        finally { setActionLoading(false); }
    };

    const toggleSelect = (id) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
    const selectAll = () => setSelected(earnings.filter(e => e.status === 'pending').map(e => e._id));

    const PayoutForm = ({ onSubmit }) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
            <div><label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#4B5563', marginBottom: 6 }}>Payout method</label>
                <select value={payoutMethod} onChange={e => setPayoutMethod(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontFamily: 'inherit', fontSize: '0.85rem', outline: 'none' }}>
                    <option value="bank_transfer">Bank transfer</option>
                    <option value="paystack_transfer">Paystack Transfer</option>
                    <option value="cash">Cash</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div><label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#4B5563', marginBottom: 6 }}>Transaction reference</label>
                <input value={payoutRef} onChange={e => setPayoutRef(e.target.value)} placeholder="Bank ref or transfer ID" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontFamily: 'inherit', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div><label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#4B5563', marginBottom: 6 }}>Note (optional)</label>
                <input value={payoutNote} onChange={e => setPayoutNote(e.target.value)} placeholder="Any note for this payout…" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontFamily: 'inherit', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                <Btn outline small onClick={() => { setPayoutModal(null); setBulkModal(false); }}>Cancel</Btn>
                <Btn small color="#10B981" onClick={onSubmit} disabled={actionLoading}>{actionLoading ? 'Processing…' : 'Confirm payout'}</Btn>
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
                {summary.map(s => (
                    <Card key={s._id} style={{ padding: 16 }}>
                        <Chip status={s._id} />
                        <p style={{ margin: '10px 0 0', fontSize: '1.2rem', fontWeight: 800, color: '#0F2940' }}>{fmt(s.doctorTotal)}</p>
                        <p style={{ margin: '2px 0 0', fontSize: '0.76rem', color: '#9CA3AF' }}>{s.count} earning{s.count === 1 ? '' : 's'}</p>
                    </Card>
                ))}
            </div>

            <Card style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontSize: '0.85rem', fontFamily: 'inherit', outline: 'none', cursor: 'pointer' }}>
                    <option value="">All</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="paid">Paid</option>
                </select>
                {selected.length > 0 && <Btn small color="#10B981" onClick={() => setBulkModal(true)}><FiZap size={13} /> Pay {selected.length} selected ({fmt(earnings.filter(e => selected.includes(e._id)).reduce((s, e) => s + e.doctorAmount, 0))})</Btn>}
                {statusFilter === 'pending' && earnings.length > 0 && <Btn outline small onClick={selectAll}>Select all pending</Btn>}
                <Btn outline small onClick={fetch_}><FiRefreshCw size={13} /> Refresh</Btn>
            </Card>

            <Card>
                {loading ? <Spinner /> : (
                    <>
                        <TableWrapper>
                            <thead>
                                <tr>
                                    <Th><input type="checkbox" checked={selected.length > 0 && selected.length === earnings.filter(e => e.status === 'pending').length} onChange={() => selected.length > 0 ? setSelected([]) : selectAll()} /></Th>
                                    <Th>Doctor</Th><Th>Patient</Th><Th>Gross</Th><Th>Commission (15%)</Th><Th>Doctor gets</Th><Th>Status</Th><Th>Date</Th><Th>Action</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {earnings.length === 0 && <tr><Td colSpan={9} style={{ textAlign: 'center', color: '#9CA3AF' }}>No earnings found.</Td></tr>}
                                {earnings.map(e => (
                                    <tr key={e._id} style={{ background: selected.includes(e._id) ? '#F0FDF4' : 'transparent' }}>
                                        <Td><input type="checkbox" checked={selected.includes(e._id)} onChange={() => toggleSelect(e._id)} disabled={e.status !== 'pending'} /></Td>
                                        <Td><span style={{ fontWeight: 600 }}>Dr. {e.doctor?.firstName} {e.doctor?.lastName}</span><br /><span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{e.doctor?.email}</span></Td>
                                        <Td>{e.patient?.firstName} {e.patient?.lastName}</Td>
                                        <Td style={{ fontWeight: 600 }}>{fmt(e.grossAmount)}</Td>
                                        <Td style={{ color: '#10B981', fontWeight: 600 }}>{fmt(e.commissionAmount)}</Td>
                                        <Td style={{ color: '#564DDF', fontWeight: 700 }}>{fmt(e.doctorAmount)}</Td>
                                        <Td><Chip status={e.status} /></Td>
                                        <Td>{fmtDate(e.createdAt)}</Td>
                                        <Td>{e.status === 'pending' && <Btn small color="#10B981" onClick={() => setPayoutModal(e)}><FiDollarSign size={13} /> Pay</Btn>}</Td>
                                    </tr>
                                ))}
                            </tbody>
                        </TableWrapper>
                        <Pagination page={page} totalPages={totalPages} onPage={setPage} />
                    </>
                )}
            </Card>

            {payoutModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(5,20,35,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 16 }}>
                    <Card style={{ maxWidth: 440, width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <h3 style={{ margin: 0, color: '#0F2940' }}>Process payout</h3>
                            <button onClick={() => setPayoutModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><FiX /></button>
                        </div>
                        <p style={{ color: '#6B7280', fontSize: '0.88rem', margin: '0 0 4px' }}>Paying <strong>Dr. {payoutModal.doctor?.lastName}</strong></p>
                        <p style={{ color: '#0F2940', fontSize: '1.3rem', fontWeight: 800, margin: '0 0 4px' }}>{fmt(payoutModal.doctorAmount)}</p>
                        <p style={{ color: '#9CA3AF', fontSize: '0.76rem', margin: 0 }}>Platform commission {fmt(payoutModal.commissionAmount)} already deducted from {fmt(payoutModal.grossAmount)}</p>
                        <PayoutForm onSubmit={processSingle} />
                    </Card>
                </div>
            )}

            {bulkModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(5,20,35,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 16 }}>
                    <Card style={{ maxWidth: 440, width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <h3 style={{ margin: 0, color: '#0F2940' }}>Bulk payout</h3>
                            <button onClick={() => setBulkModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><FiX /></button>
                        </div>
                        <p style={{ color: '#6B7280', fontSize: '0.88rem', margin: '0 0 4px' }}>Processing <strong>{selected.length}</strong> pending payouts</p>
                        <p style={{ color: '#0F2940', fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>{fmt(earnings.filter(e => selected.includes(e._id)).reduce((s, e) => s + e.doctorAmount, 0))} total</p>
                        <PayoutForm onSubmit={processBulk} />
                    </Card>
                </div>
            )}
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION: AUDIT LOGS
// ═══════════════════════════════════════════════════════════════════════════════
const AuditSection = ({ toast }) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTP] = useState(1);
    const [action, setAction] = useState('');
    const [entity, setEntity] = useState('');

    const fetch_ = useCallback(() => {
        setLoading(true);
        const q = new URLSearchParams({ page, limit: 30, ...(action && { action }), ...(entity && { entity }) });
        apiFetch(`/api/admin/audit-logs?${q}`)
            .then(d => { setLogs(d.data?.logs || []); setTP(d.totalPages || 1); })
            .catch(e => toast.show(e.message, 'error'))
            .finally(() => setLoading(false));
    }, [page, action, entity]);

    useEffect(() => { fetch_(); }, [fetch_]);

    const ACTION_COLORS = { READ: '#0EA5E9', CREATE: '#10B981', UPDATE: '#F59E0B', DELETE: '#EF4444', PAYOUT: '#8B5CF6', LOGIN: '#6B7280', LOGOUT: '#6B7280', EXPORT: '#14B8A6' };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Card style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <select value={action} onChange={e => { setAction(e.target.value); setPage(1); }} style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontSize: '0.85rem', fontFamily: 'inherit', outline: 'none' }}>
                    <option value="">All actions</option>
                    {['READ', 'CREATE', 'UPDATE', 'DELETE', 'PAYOUT', 'LOGIN', 'LOGOUT', 'EXPORT'].map(a => <option key={a} value={a}>{a}</option>)}
                </select>
                <select value={entity} onChange={e => { setEntity(e.target.value); setPage(1); }} style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontSize: '0.85rem', fontFamily: 'inherit', outline: 'none' }}>
                    <option value="">All entities</option>
                    {['Patient', 'Consultation', 'Doctor', 'Admin', 'Earning'].map(e => <option key={e} value={e}>{e}</option>)}
                </select>
                <Btn outline small onClick={fetch_}><FiRefreshCw size={13} /> Refresh</Btn>
            </Card>
            <Card>
                {loading ? <Spinner /> : (
                    <>
                        <TableWrapper>
                            <thead><tr><Th>Time</Th><Th>Actor</Th><Th>Role</Th><Th>Action</Th><Th>Entity</Th><Th>Description</Th><Th>IP</Th></tr></thead>
                            <tbody>
                                {logs.length === 0 && <tr><Td colSpan={7} style={{ textAlign: 'center', color: '#9CA3AF' }}>No logs found.</Td></tr>}
                                {logs.map(l => (
                                    <tr key={l._id}>
                                        <Td style={{ whiteSpace: 'nowrap', fontSize: '0.78rem', color: '#6B7280' }}>{fmtTime(l.createdAt)}</Td>
                                        <Td style={{ fontWeight: 600, fontSize: '0.85rem' }}>{l.performedByName}</Td>
                                        <Td><Chip label={cap(l.performedByRole)} status={l.performedByRole === 'superAdmin' ? 'verified' : 'pending'} /></Td>
                                        <Td><span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, background: `${ACTION_COLORS[l.action] || '#6B7280'}18`, color: ACTION_COLORS[l.action] || '#6B7280' }}>{l.action}</span></Td>
                                        <Td style={{ fontSize: '0.8rem' }}>{l.entity}{l.entitySnapshot ? ` — ${l.entitySnapshot}` : ''}</Td>
                                        <Td style={{ fontSize: '0.78rem', color: '#6B7280', maxWidth: 300 }}>{l.description}</Td>
                                        <Td style={{ fontFamily: 'monospace', fontSize: '0.74rem', color: '#9CA3AF' }}>{l.ipAddress || '—'}</Td>
                                    </tr>
                                ))}
                            </tbody>
                        </TableWrapper>
                        <Pagination page={page} totalPages={totalPages} onPage={setPage} />
                    </>
                )}
            </Card>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION: ADMIN MANAGEMENT (superAdmin only)
// ═══════════════════════════════════════════════════════════════════════════════
const AdminManagementSection = ({ currentAdmin, toast }) => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createModal, setCreateModal] = useState(false);
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'admin' });
    const [creating, setCreating] = useState(false);

    const fetch_ = () => {
        setLoading(true);
        apiFetch('/api/admin/admins')
            .then(d => setAdmins(d.data?.admins || []))
            .catch(e => toast.show(e.message, 'error'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetch_(); }, []);

    const create = async () => {
        if (!form.firstName || !form.email || !form.password) { toast.show('Fill all required fields.', 'error'); return; }
        setCreating(true);
        try {
            await apiFetch('/api/admin/create', { method: 'POST', body: JSON.stringify(form) });
            toast.show('Admin account created.');
            setCreateModal(false); setForm({ firstName: '', lastName: '', email: '', password: '', role: 'admin' }); fetch_();
        } catch (e) { toast.show(e.message, 'error'); }
        finally { setCreating(false); }
    };

    const toggle = async (id) => {
        try { await apiFetch(`/api/admin/admins/${id}/status`, { method: 'PATCH' }); toast.show('Admin status updated.'); fetch_(); }
        catch (e) { toast.show(e.message, 'error'); }
    };

    const inp = { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontFamily: 'inherit', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' };
    const lbl = { display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#4B5563', marginBottom: 6 };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Card style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3 style={{ margin: 0, color: '#0F2940' }}>Admin accounts</h3>
                    <p style={{ margin: '4px 0 0', color: '#6B7280', fontSize: '0.85rem' }}>Only superAdmins can create, activate or delete admin accounts.</p>
                </div>
                <Btn onClick={() => setCreateModal(true)}><FiUser size={14} /> Create admin</Btn>
            </Card>
            <Card>
                {loading ? <Spinner /> : (
                    <TableWrapper>
                        <thead><tr><Th>Name</Th><Th>Email</Th><Th>Role</Th><Th>Status</Th><Th>Last login</Th><Th>Created by</Th><Th>Actions</Th></tr></thead>
                        <tbody>
                            {admins.map(a => (
                                <tr key={a._id}>
                                    <Td style={{ fontWeight: 600 }}>{a.firstName} {a.lastName}</Td>
                                    <Td style={{ fontSize: '0.82rem', color: '#6B7280' }}>{a.email}</Td>
                                    <Td><Chip label={a.role === 'superAdmin' ? 'Super Admin' : 'Admin'} status={a.role === 'superAdmin' ? 'verified' : 'confirmed'} /></Td>
                                    <Td><Chip label={a.isActive ? 'Active' : 'Inactive'} status={a.isActive ? 'verified' : 'suspended'} /></Td>
                                    <Td style={{ fontSize: '0.78rem', color: '#6B7280' }}>{fmtDate(a.lastLogin)}</Td>
                                    <Td style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>{a.createdBy?.firstName || 'System'}</Td>
                                    <Td>
                                        {a._id !== currentAdmin?._id && (
                                            <Btn small outline color={a.isActive ? '#EF4444' : '#10B981'} onClick={() => toggle(a._id)}>
                                                {a.isActive ? 'Deactivate' : 'Activate'}
                                            </Btn>
                                        )}
                                    </Td>
                                </tr>
                            ))}
                        </tbody>
                    </TableWrapper>
                )}
            </Card>

            {createModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(5,20,35,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 16 }}>
                    <Card style={{ maxWidth: 480, width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                            <h3 style={{ margin: 0, color: '#0F2940' }}>Create admin account</h3>
                            <button onClick={() => setCreateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><FiX /></button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div><label style={lbl}>First name *</label><input style={inp} value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} /></div>
                                <div><label style={lbl}>Last name *</label><input style={inp} value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} /></div>
                            </div>
                            <div><label style={lbl}>Email *</label><input type="email" style={inp} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
                            <div><label style={lbl}>Temporary password *</label><input type="password" style={inp} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} /></div>
                            <div><label style={lbl}>Role</label>
                                <select style={inp} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                                    <option value="admin">Admin</option>
                                    <option value="superAdmin">Super Admin</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
                            <Btn outline small onClick={() => setCreateModal(false)}>Cancel</Btn>
                            <Btn small onClick={create} disabled={creating}>{creating ? 'Creating…' : 'Create account'}</Btn>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
const NAV = [
    { id: 'overview', label: 'Overview', icon: <FiActivity /> },
    { id: 'doctors', label: 'Doctors', icon: <FiUserCheck /> },
    { id: 'patients', label: 'Patients', icon: <FiUsers /> },
    { id: 'consultations', label: 'Consultations', icon: <FiClipboard /> },
    { id: 'payments', label: 'Payments', icon: <FiDollarSign /> },
    { id: 'audit', label: 'Audit logs', icon: <FiFileText /> },
    { id: 'admins', label: 'Admin accounts', icon: <FiShield />, superOnly: true },
];

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [admin, setAdmin_] = useState(getAdmin);
    const [active, setActive] = useState('overview');
    const [sideOpen, setSideOpen] = useState(false);
    const [dropdown, setDropdown] = useState(false);
    const toast = useToast();

    useEffect(() => {
        const token = getToken();
        if (!token) { navigate('/admin/login'); return; }
        apiFetch('/api/admin/me')
            .then(d => { setAdmin_(d.data?.admin); setAdmin(d.data?.admin); })
            .catch(() => { localStorage.removeItem('adminToken'); localStorage.removeItem('adminProfile'); navigate('/admin/login'); });
    }, []);

    const logout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminProfile');
        navigate('/admin/login');
    };

    const SECTION_TITLES = {
        overview: { kicker: 'Platform command center', title: 'Admin overview' },
        doctors: { kicker: 'Doctor workforce', title: 'Doctor management' },
        patients: { kicker: 'Patient records', title: 'Patient registry' },
        consultations: { kicker: 'Care operations', title: 'Consultations' },
        payments: { kicker: 'Financial management', title: 'Earnings & payouts' },
        audit: { kicker: 'NDPC compliance trail', title: 'Audit logs' },
        admins: { kicker: 'Access control', title: 'Admin management' },
    };
    const heading = SECTION_TITLES[active] || SECTION_TITLES.overview;

    const renderSection = () => {
        switch (active) {
            case 'overview': return <OverviewSection toast={toast} />;
            case 'doctors': return <DoctorsSection toast={toast} />;
            case 'patients': return <PatientsSection toast={toast} />;
            case 'payments': return <PaymentsSection toast={toast} />;
            case 'audit': return <AuditSection toast={toast} />;
            case 'admins': return <AdminManagementSection currentAdmin={admin} toast={toast} />;
            case 'consultations':
                return <ConsultationsSection toast={toast} />;
            default: return null;
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: 'min(280px, 100vw) 1fr', background: '#F4F8FB', fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
            {/* ── SIDEBAR ──────────────────────────────────────────────────── */}
            <aside style={{ position: 'fixed', inset: '0 auto 0 0', width: 'min(280px, 84vw)', background: 'linear-gradient(180deg, #0D1F35 0%, #0B2040 100%)', display: 'flex', flexDirection: 'column', gap: 0, zIndex: 50, transform: sideOpen ? 'none' : 'translateX(-102%)', transition: 'transform .28s ease' }}>
                <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 12, background: '#564DDF', display: 'grid', placeItems: 'center', color: 'white', fontWeight: 800 }}>A</div>
                        <div>
                            <p style={{ margin: 0, fontWeight: 700, color: 'white', fontSize: '0.95rem' }}>ABC Telemedica</p>
                            <p style={{ margin: 0, fontSize: '0.72rem', color: 'rgba(255,255,255,.45)' }}>Admin workspace</p>
                        </div>
                        <button onClick={() => setSideOpen(false)} style={{ marginLeft: 'auto', background: 'rgba(255,255,255,.08)', border: 'none', borderRadius: 10, padding: 6, cursor: 'pointer', color: 'white', display: 'flex' }}><FiX size={16} /></button>
                    </div>
                    {admin && (
                        <div style={{ marginTop: 16, padding: 12, borderRadius: 14, background: 'rgba(255,255,255,.06)' }}>
                            <p style={{ margin: 0, fontWeight: 600, color: 'white', fontSize: '0.85rem' }}>{admin.firstName} {admin.lastName}</p>
                            <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: 'rgba(255,255,255,.45)' }}>{admin.role === 'superAdmin' ? 'Super Admin' : 'Admin'}</p>
                        </div>
                    )}
                </div>

                <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <p style={{ margin: '0 0 8px 8px', fontSize: '0.66rem', textTransform: 'uppercase', letterSpacing: '.14em', color: 'rgba(255,255,255,.3)', fontWeight: 700 }}>Navigation</p>
                    {NAV.filter(n => !n.superOnly || admin?.role === 'superAdmin').map(n => (
                        <button key={n.id} onClick={() => { setActive(n.id); setSideOpen(false); }}
                            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 14, border: 'none', background: active === n.id ? 'rgba(86,77,223,.35)' : 'transparent', color: active === n.id ? 'white' : 'rgba(255,255,255,.55)', fontWeight: active === n.id ? 600 : 400, fontSize: '0.87rem', cursor: 'pointer', fontFamily: 'inherit', marginBottom: 2, transition: 'background .18s ease', textAlign: 'left' }}>
                            <span style={{ fontSize: '1rem' }}>{n.icon}</span> {n.label}
                        </button>
                    ))}
                </nav>

                <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,.06)' }}>
                    <button onClick={logout} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '11px 0', borderRadius: 14, border: 'none', background: 'rgba(239,68,68,.15)', color: '#FCA5A5', fontWeight: 600, fontSize: '0.87rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                        <FiLogOut size={15} /> Logout
                    </button>
                </div>
            </aside>

            {sideOpen && <button onClick={() => setSideOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(5,20,35,.55)', border: 'none', cursor: 'pointer' }} />}

            {/* ── MAIN ─────────────────────────────────────────────────────── */}
            <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                {/* Header */}
                <header style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(244,248,251,.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(20,48,74,.06)', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <button onClick={() => setSideOpen(true)} style={{ width: 40, height: 40, borderRadius: 12, border: '1px solid rgba(20,48,74,.08)', background: 'white', display: 'grid', placeItems: 'center', cursor: 'pointer', color: '#14304a' }}><FiMenu /></button>
                        <div>
                            <p className='smonwp' style={{ margin: 0, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '.14em', color: '#4E7A91' }}>{heading.kicker}</p>
                            <h1 className='smonwh1' style={{ margin: '2px 0 0', fontSize: '1.35rem', fontWeight: 800, color: '#0F2940' }}>{heading.title}</h1>
                        </div>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <button onClick={() => setDropdown(p => !p)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 14, border: '1px solid rgba(20,48,74,.08)', background: 'white', cursor: 'pointer', fontFamily: 'inherit' }}>
                            <div style={{ width: 32, height: 32, borderRadius: 10, background: '#564DDF', display: 'grid', placeItems: 'center', color: 'white', fontWeight: 700, fontSize: '0.8rem' }}>
                                {initials(`${admin?.firstName || ''} ${admin?.lastName || ''}`)}
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <p style={{ margin: 0, fontWeight: 600, color: '#0F2940', fontSize: '0.85rem' }}>{admin?.firstName} {admin?.lastName}</p>
                                <p style={{ margin: 0, fontSize: '0.72rem', color: '#6B7280', textTransform: 'capitalize' }} className='rmwindow'>{admin?.role === 'superAdmin' ? 'Super Admin' : 'Admin'}</p>
                            </div>
                            <FiChevronDown size={14} style={{ color: '#9CA3AF' }} />
                        </button>
                        {dropdown && (
                            <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: 'white', borderRadius: 16, border: '1px solid rgba(20,48,74,.08)', boxShadow: '0 16px 48px rgba(0,0,0,.12)', padding: 8, minWidth: 180, zIndex: 100 }}>
                                <button onClick={logout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: 'none', background: 'none', cursor: 'pointer', color: '#EF4444', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'inherit' }}>
                                    <FiLogOut size={14} /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {/* Content */}
                <main style={{ flex: 1, padding: '24px 24px 48px' }}>
                    {renderSection()}
                </main>
            </div>

            <Toast toast={toast.toast} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } } * { box-sizing: border-box; }`}</style>
        </div>
    );
}

// Lightweight consultations section (inline)
function ConsultationsSection({ toast }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTP] = useState(1);
    const [status, setStatus] = useState('');

    const fetch_ = useCallback(() => {
        setLoading(true);
        const q = new URLSearchParams({ page, limit: 20, ...(status && { status }) });
        apiFetch(`/api/admin/consultations?${q}`)
            .then(d => { setData(d.data?.consultations || []); setTP(d.totalPages || 1); })
            .catch(e => toast.show(e.message, 'error'))
            .finally(() => setLoading(false));
    }, [page, status]);

    useEffect(() => { fetch_(); }, [fetch_]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Card style={{ display: 'flex', gap: 12 }}>
                <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontSize: '0.85rem', fontFamily: 'inherit', outline: 'none' }}>
                    <option value="">All statuses</option>
                    {['pending', 'confirmed', 'ongoing', 'completed', 'cancelled', 'no_show'].map(s => <option key={s} value={s}>{cap(s)}</option>)}
                </select>
                <Btn outline small onClick={fetch_}><FiRefreshCw size={13} /> Refresh</Btn>
            </Card>
            <Card>
                {loading ? <Spinner /> : (
                    <>
                        <TableWrapper>
                            <thead><tr><Th>Patient</Th><Th>Doctor</Th><Th>Specialty</Th><Th>Status</Th><Th>Urgency</Th><Th>Fee</Th><Th>Scheduled</Th><Th>Paid</Th></tr></thead>
                            <tbody>
                                {data.length === 0 && <tr><Td colSpan={8} style={{ textAlign: 'center', color: '#9CA3AF' }}>No consultations found.</Td></tr>}
                                {data.map(c => (
                                    <tr key={c._id}>
                                        <Td style={{ fontWeight: 600 }}>{c.patient?.firstName} {c.patient?.lastName}<br /><span style={{ fontSize: '0.72rem', color: '#9CA3AF', fontWeight: 400 }}>+{c.patient?.whatsappNumber}</span></Td>
                                        <Td>Dr. {c.doctor?.firstName} {c.doctor?.lastName}</Td>
                                        <Td><Chip label={cap(c.doctor?.specialty)} status="confirmed" /></Td>
                                        <Td><Chip status={c.status} /></Td>
                                        <Td>{c.urgency ? <Chip label={cap(c.urgency)} status={c.urgency === 'high' ? 'suspended' : c.urgency === 'medium' ? 'pending' : 'verified'} /> : '—'}</Td>
                                        <Td style={{ fontWeight: 600 }}>{fmt(c.fee)}</Td>
                                        <Td style={{ fontSize: '0.78rem', color: '#6B7280' }}>{fmtDate(c.scheduledAt)}</Td>
                                        <Td>{c.isPaid ? <Chip label="Paid" status="verified" /> : <Chip label="Unpaid" status="suspended" />}</Td>
                                    </tr>
                                ))}
                            </tbody>
                        </TableWrapper>
                        <Pagination page={page} totalPages={totalPages} onPage={setPage} />
                    </>
                )}
            </Card>
        </div>
    );
}