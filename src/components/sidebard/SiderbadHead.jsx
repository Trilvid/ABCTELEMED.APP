import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiChevronDown, FiLogOut, FiMenu, FiShield, FiSun } from 'react-icons/fi';
import './Sidebar.css';

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

const SECTION_TITLES = {
    overview: {
        kicker: 'Clinical command center',
        title: 'Doctor dashboard',
    },
    schedule: {
        kicker: 'Availability planning',
        title: 'Consultation schedule',
    },
    consultations: {
        kicker: 'Live operations',
        title: 'Consultation queue',
    },
    profile: {
        kicker: 'Patient-facing profile',
        title: 'Doctor profile',
    },
    verification: {
        kicker: 'Credential review',
        title: 'Verification status',
    },
};

const SiderbadHead = ({ onOpenMenu, activeSection }) => {
    const navigate = useNavigate();
    const [dropDown, setDropDown] = useState(false);
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

    const heading = SECTION_TITLES[activeSection] || SECTION_TITLES.overview;

    return (
        <header className="doctor-header">
            <div className="doctor-header-left">
                <button type="button" className="doctor-header-menu" aria-label="Open navigation" onClick={onOpenMenu}>
                    <FiMenu />
                </button>
                <div>
                    <p className="doctor-header-kicker">{heading.kicker}</p>
                    <h1>{heading.title}</h1>
                </div>
            </div>

            <div className="doctor-header-right">
                <div className="doctor-header-chip">
                    <FiSun />
                    <span>Good to see you</span>
                </div>

                {/* <button type="button" className="doctor-header-icon" aria-label="Notifications">
                    <FiBell />
                </button> */}

                <button
                    type="button"
                    className="doctor-header-profile"
                    onClick={() => setDropDown((prev) => !prev)}
                >
                    <div className="doctor-header-avatar">
                        {doctor?.photo ? (
                            <img src={doctor.photo} alt={doctor.fullName || 'Doctor'} />
                        ) : (
                            <span>{getInitials(doctor?.fullName)}</span>
                        )}
                    </div>
                    <div className="doctor-header-profile-copy">
                        <strong>{doctor?.fullName || 'Doctor profile'}</strong>
                        <span>{doctor?.status || 'pending'} status</span>
                    </div>
                    <FiChevronDown />
                </button>

                {dropDown && (
                    <div className="doctor-header-dropdown">
                        <div className="doctor-header-dropdown-item">
                            <FiShield />
                            <span>{doctor?.status === 'verified' ? 'Verified account' : 'Verification in progress'}</span>
                        </div>
                        <button type="button" className="doctor-header-dropdown-item action" onClick={logout}>
                            <FiLogOut />
                            <span>Logout</span>
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default SiderbadHead;
