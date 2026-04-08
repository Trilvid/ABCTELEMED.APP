import React, { useEffect, useMemo, useState } from 'react';
import './Sidebar.css';
import './test.css';
import { useNavigate } from 'react-router-dom';
import {
    FiActivity,
    FiBriefcase,
    FiCalendar,
    FiClipboard,
    FiX,
    FiLogOut,
    FiShield,
    FiUser,
} from 'react-icons/fi';

const readStoredDoctor = () => {
    try {
        const saved = localStorage.getItem('doctorProfile');
        return saved ? JSON.parse(saved) : null;
    } catch (error) {
        return null;
    }
};

const getInitials = (fullName = '') =>
    fullName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('') || 'DR';

const NAV_ITEMS = [
    { id: 'overview', label: 'Overview', icon: <FiActivity /> },
    { id: 'schedule', label: 'Schedule', icon: <FiCalendar /> },
    { id: 'consultations', label: 'Consultations', icon: <FiClipboard /> },
    { id: 'profile', label: 'Doctor profile', icon: <FiUser /> },
    { id: 'verification', label: 'Verification', icon: <FiShield /> },
];

const Sidebar = ({ activeSection, onSelectSection, onClose }) => {
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(readStoredDoctor);

    useEffect(() => {
        const syncDoctor = () => setDoctor(readStoredDoctor());
        window.addEventListener('storage', syncDoctor);
        window.addEventListener('doctor-profile-updated', syncDoctor);
        return () => {
            window.removeEventListener('storage', syncDoctor);
            window.removeEventListener('doctor-profile-updated', syncDoctor);
        };
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('doctorProfile');
        navigate('/login');
    };

    return (
        <aside className="doctor-sidebar">
            <div className="doctor-sidebar-brand">
                <button type="button" className="doctor-sidebar-close" onClick={onClose} aria-label="Close navigation">
                    <FiX />
                </button>
                {/* <div className="doctor-sidebar-mark">A</div> */}
                <div className="doctor-sidebar-mark">
                    <img src="/logo.png" alt="ABC Telemedica Logo" />
                </div>
                <div className='vbrand'>
                    <h2>ABC Telemedica</h2>
                    <p>Doctor workspace</p>
                </div>
            </div>

            <div className="doctor-sidebar-profile">
                <div className="doctor-sidebar-avatar">
                    {doctor?.photo ? <img src={doctor.photo} alt={doctor.fullName || 'Doctor'} /> : <span>{getInitials(doctor?.fullName)}</span>}
                </div>
                <div>
                    <h3>{doctor?.fullName || 'Doctor profile'}</h3>
                    <p>{doctor?.specialty ? doctor.specialty.replace(/_/g, ' ') : 'Clinical dashboard'}</p>
                </div>
            </div>

            <nav className="doctor-sidebar-nav">
                <div className="doctor-sidebar-section">
                    <span className="doctor-sidebar-label">Workspace</span>
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            className={`doctor-nav-link ${activeSection === item.id ? 'active' : ''}`}
                            onClick={() => onSelectSection(item.id)}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>
            </nav>

            <div className="doctor-sidebar-footer">
                <div className="doctor-sidebar-note">
                    <strong>Today&apos;s focus</strong>
                    <p>Keep your profile complete and your availability up to date for faster patient matching.</p>
                </div>

                <button type="button" className="doctor-secondary-btn" onClick={() => onSelectSection('consultations')}>
                    <FiBriefcase />
                    <span>Open queue</span>
                </button>

                <button type="button" className="doctor-logout-btn" onClick={logout}>
                    <FiLogOut />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
