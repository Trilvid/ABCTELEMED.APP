import React, { useEffect, useMemo, useState } from 'react';
import './userdashboardhomepage.css';
import {
    FiArrowUpRight,
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiDollarSign,
    FiGlobe,
    FiHeart,
    FiMessageSquare,
    FiShield,
    FiStar,
    FiToggleLeft,
    FiToggleRight,
    FiUserCheck,
    FiUsers,
} from 'react-icons/fi';

const SPECIALTY_LABELS = {
    general_practice: 'General Practice',
    cardiology: 'Cardiology',
    dermatology: 'Dermatology',
    pediatrics: 'Pediatrics',
    gynecology: 'Gynecology',
    orthopedics: 'Orthopedics',
    neurology: 'Neurology',
    psychiatry: 'Psychiatry',
    ophthalmology: 'Ophthalmology',
    ent: 'ENT',
    urology: 'Urology',
    oncology: 'Oncology',
    endocrinology: 'Endocrinology',
    gastroenterology: 'Gastroenterology',
    pulmonology: 'Pulmonology',
    nephrology: 'Nephrology',
    other: 'Other',
};

const STATUS_META = {
    pending: {
        label: 'Pending verification',
        tone: 'pending',
        message: 'Your license is under review. You can complete your profile while we verify your credentials.',
    },
    verified: {
        label: 'Verified doctor',
        tone: 'verified',
        message: 'Your profile is live and ready for patient assignments.',
    },
    suspended: {
        label: 'Temporarily suspended',
        tone: 'warning',
        message: 'Your account needs attention before you can receive new consultations.',
    },
    rejected: {
        label: 'Verification needs attention',
        tone: 'warning',
        message: 'Please review your submitted details and update any missing verification items.',
    },
};

const SECTION_META = {
    overview: {
        tag: 'Today',
        title: 'Your care command center',
        description: 'A polished summary of profile strength, availability, and patient-facing readiness.',
    },
    schedule: {
        tag: 'Availability',
        title: 'Shape your consultation hours',
        description: 'Keep your shifts current so patient assignments and referrals land at the right time.',
    },
    consultations: {
        tag: 'Queue',
        title: 'Patient conversations and triage',
        description: 'This is where pending consultations and active care threads will appear as they come in.',
    },
    profile: {
        tag: 'Profile',
        title: 'How patients see you',
        description: 'Your profile should feel confident, clear, and trustworthy before a patient ever says hello.',
    },
    verification: {
        tag: 'Verification',
        title: 'Credential confidence',
        description: 'Track what is complete, what is pending review, and what still needs attention.',
    },
};

const formatCurrency = (amount = 0, currency = 'NGN') =>
    new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    }).format(Number(amount || 0));

const formatDay = (value = '') =>
    value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Day';

const readStoredDoctor = () => {
    try {
        const saved = localStorage.getItem('doctorProfile');
        return saved ? JSON.parse(saved) : null;
    } catch (error) {
        return null;
    }
};

const writeStoredDoctor = (nextDoctor) => {
    localStorage.setItem('doctorProfile', JSON.stringify(nextDoctor));
    window.dispatchEvent(new Event('doctor-profile-updated'));
};

const getInitials = (fullName = '') =>
    fullName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('') || 'DR';

const Userdashboardhomepage = ({ activeSection = 'overview', onSelectSection }) => {
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

    const dashboardData = useMemo(() => {
        const profile = doctor || {};
        const statusKey = profile.status || (profile.isVerified ? 'verified' : 'pending');
        const statusMeta = STATUS_META[statusKey] || STATUS_META.pending;
        const qualifications = Array.isArray(profile.qualifications) ? profile.qualifications : [];
        const schedule = Array.isArray(profile.availabilitySchedule) ? profile.availabilitySchedule : [];
        const languages = Array.isArray(profile.languages) ? profile.languages : [];
        const specialty = SPECIALTY_LABELS[profile.specialty] || profile.specialty || 'Specialty not set';
        const completionChecks = [
            profile.photo,
            profile.bio,
            profile.specialty,
            profile.consultationFee !== undefined && profile.consultationFee !== '',
            qualifications.length > 0 && qualifications.some((item) => item.degree),
            schedule.length > 0,
            languages.length > 0,
        ];
        const completionScore = Math.round(
            (completionChecks.filter(Boolean).length / completionChecks.length) * 100
        );
        const order = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const sortedSchedule = [...schedule].sort((a, b) => order.indexOf(a.day) - order.indexOf(b.day));
        const topQualification =
            qualifications.find((item) => item.degree)?.degree || 'Add your main qualification';

        return {
            doctor: profile,
            specialty,
            statusMeta,
            completionScore,
            sortedSchedule,
            languages,
            topQualification,
            fee: formatCurrency(profile.consultationFee, profile.currency || 'NGN'),
            rating: Number(profile.rating || 0).toFixed(1),
            totalReviews: profile.totalReviews || 0,
            totalConsultations: profile.totalConsultations || 0,
            nextAvailability:
                sortedSchedule.length > 0
                    ? `${formatDay(sortedSchedule[0].day)} ${sortedSchedule[0].startTime} - ${sortedSchedule[0].endTime}`
                    : 'Add your consultation hours',
        };
    }, [doctor]);

    if (!doctor) {
        return (
            <div className="doctor-home">
                <section className="doctor-empty-state">
                    <div className="doctor-empty-badge">Doctor workspace</div>
                    <h1>Finish sign in to open your dashboard</h1>
                    <p>
                        We could not find a saved doctor profile in this browser yet. Sign in again or
                        complete onboarding to load your workspace.
                    </p>
                </section>
            </div>
        );
    }

    const {
        doctor: profile,
        specialty,
        statusMeta,
        completionScore,
        sortedSchedule,
        languages,
        topQualification,
        fee,
        rating,
        totalReviews,
        totalConsultations,
        nextAvailability,
    } = dashboardData;

    const setAvailability = () => {
        const nextDoctor = {
            ...doctor,
            isAvailableNow: !doctor?.isAvailableNow,
        };
        writeStoredDoctor(nextDoctor);
        setDoctor(nextDoctor);
    };

    const insightCards = [
        {
            label: 'Profile completion',
            value: `${completionScore}%`,
            description: 'Keep this above 85% for stronger patient trust.',
            icon: <FiUserCheck />,
            tone: 'sea',
        },
        {
            label: 'Consultation fee',
            value: fee,
            description: 'Patients see this before requesting a consultation.',
            icon: <FiDollarSign />,
            tone: 'gold',
        },
        {
            label: 'Patient rating',
            value: `${rating} / 5`,
            description: `${totalReviews} review${totalReviews === 1 ? '' : 's'} recorded so far.`,
            icon: <FiStar />,
            tone: 'rose',
        },
        {
            label: 'Availability',
            value: profile.isAvailableNow ? 'Online now' : 'Offline',
            description: nextAvailability,
            icon: <FiClock />,
            tone: 'sky',
        },
    ];

    const quickActions = [
        { id: 'schedule', label: 'Manage schedule', icon: <FiCalendar /> },
        { id: 'profile', label: 'Polish profile', icon: <FiArrowUpRight /> },
        { id: 'verification', label: 'Check verification', icon: <FiShield /> },
    ];

    const renderOverview = () => {
        const focusItems = [
            {
                title: 'Verification status',
                text: statusMeta.message,
                icon: <FiShield />,
            },
            {
                title: 'Consultation readiness',
                text:
                    sortedSchedule.length > 0
                        ? `${sortedSchedule.length} availability slot${sortedSchedule.length === 1 ? '' : 's'} configured.`
                        : 'No consultation slots yet. Add at least one time window.',
                icon: <FiMessageSquare />,
            },
            {
                title: 'Patient-facing profile',
                text: profile.bio
                    ? 'Your bio is ready and helps patients understand your care approach.'
                    : 'Add a short professional bio so patients know your approach and expertise.',
                icon: <FiHeart />,
            },
        ];

        return (
            <>
                <section className="doctor-hero">
                    <div className="doctor-hero-copy">
                        <div className={`doctor-status-pill ${statusMeta.tone}`}>{statusMeta.label}</div>
                        <p className="doctor-eyebrow">{SECTION_META.overview.tag}</p>
                        <h1>{profile.fullName || 'Doctor profile'}</h1>
                        <p className="doctor-subtitle">
                            {specialty} • {profile.yearsOfExperience || 0} year
                            {Number(profile.yearsOfExperience || 0) === 1 ? '' : 's'} experience
                        </p>
                        <p className="doctor-hero-text">{statusMeta.message}</p>

                        <div className="doctor-hero-actions">
                            <button type="button" className="doctor-primary-btn" onClick={setAvailability}>
                                {profile.isAvailableNow ? <FiToggleRight /> : <FiToggleLeft />}
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
                                {profile.photo ? (
                                    <img src={profile.photo} alt={profile.fullName || 'Doctor'} />
                                ) : (
                                    <span>{getInitials(profile.fullName)}</span>
                                )}
                            </div>

                            <div>
                                <h3>{profile.fullName || 'Doctor profile'}</h3>
                                <p>{specialty}</p>
                            </div>
                        </div>

                        <div className="doctor-mini-grid">
                            <article>
                                <span>Qualification</span>
                                <strong>{topQualification}</strong>
                            </article>
                            <article>
                                <span>Languages</span>
                                <strong>{languages.length ? languages.join(', ') : 'Not set'}</strong>
                            </article>
                            <article>
                                <span>Experience</span>
                                <strong>{profile.yearsOfExperience || 0} years</strong>
                            </article>
                            <article>
                                <span>Consultations</span>
                                <strong>{totalConsultations}</strong>
                            </article>
                        </div>
                    </div>
                </section>

                <section className="doctor-insights-grid">
                    {insightCards.map((card) => (
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
                            <div>
                                <p className="doctor-section-tag">This week</p>
                                <h2>Consultation schedule</h2>
                            </div>
                            <button type="button" className="doctor-panel-chip action" onClick={() => onSelectSection('schedule')}>
                                <FiCalendar />
                                <span>Open schedule</span>
                            </button>
                        </div>

                        {sortedSchedule.length > 0 ? (
                            <div className="doctor-schedule-list">
                                {sortedSchedule.map((slot, index) => (
                                    <article key={`${slot.day}-${slot.startTime}-${index}`} className="doctor-schedule-item">
                                        <div className="doctor-schedule-day">
                                            <span>{formatDay(slot.day)}</span>
                                            <strong>{slot.startTime} - {slot.endTime}</strong>
                                        </div>
                                        <div className="doctor-schedule-badge">
                                            <FiUsers />
                                            <span>Open for bookings</span>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="doctor-empty-card">
                                <h3>No availability yet</h3>
                                <p>Add consultation windows so patients and coordinators know when to reach you.</p>
                            </div>
                        )}
                    </div>

                    <div className="doctor-stack">
                        <div className="doctor-panel">
                            <div className="doctor-panel-head">
                                <div>
                                    <p className="doctor-section-tag">Quick actions</p>
                                    <h2>Move faster</h2>
                                </div>
                            </div>

                            <div className="doctor-action-list">
                                {quickActions.map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        className="doctor-action-card"
                                        onClick={() => onSelectSection(item.id)}
                                    >
                                        <span>{item.icon}</span>
                                        <strong>{item.label}</strong>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="doctor-panel">
                            <div className="doctor-panel-head">
                                <div>
                                    <p className="doctor-section-tag">Priority focus</p>
                                    <h2>What to improve next</h2>
                                </div>
                            </div>

                            <div className="doctor-focus-list">
                                {focusItems.map((item) => (
                                    <article key={item.title}>
                                        <div className="doctor-focus-icon">{item.icon}</div>
                                        <div>
                                            <h3>{item.title}</h3>
                                            <p>{item.text}</p>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </>
        );
    };

    const renderSchedule = () => (
        <section className="doctor-panel doctor-section-panel">
            <div className="doctor-panel-head">
                <div>
                    <p className="doctor-section-tag">{SECTION_META.schedule.tag}</p>
                    <h2>{SECTION_META.schedule.title}</h2>
                    <p className="doctor-panel-copy">{SECTION_META.schedule.description}</p>
                </div>
                <button type="button" className="doctor-primary-btn subtle" onClick={setAvailability}>
                    {profile.isAvailableNow ? <FiToggleRight /> : <FiToggleLeft />}
                    {profile.isAvailableNow ? 'Online for instant consults' : 'Currently offline'}
                </button>
            </div>

            {sortedSchedule.length > 0 ? (
                <div className="doctor-schedule-board">
                    {sortedSchedule.map((slot, index) => (
                        <article key={`${slot.day}-${slot.startTime}-${index}`} className="doctor-schedule-board-card">
                            <span>{formatDay(slot.day)}</span>
                            <strong>{slot.startTime} - {slot.endTime}</strong>
                            <small>Consultation window</small>
                        </article>
                    ))}
                </div>
            ) : (
                <div className="doctor-empty-card">
                    <h3>No consultation windows yet</h3>
                    <p>Once availability slots are added during onboarding or settings, they will appear here.</p>
                </div>
            )}
        </section>
    );

    const renderConsultations = () => (
        <section className="doctor-panel doctor-section-panel">
            <div className="doctor-panel-head">
                <div>
                    <p className="doctor-section-tag">{SECTION_META.consultations.tag}</p>
                    <h2>{SECTION_META.consultations.title}</h2>
                    <p className="doctor-panel-copy">{SECTION_META.consultations.description}</p>
                </div>
            </div>

            <div className="doctor-placeholder-grid">
                <article className="doctor-placeholder-card emphasis">
                    <strong>0 active consultations</strong>
                    <p>When patients are routed to you, active sessions will surface here with triage context.</p>
                </article>
                <article className="doctor-placeholder-card">
                    <strong>Smart queue ready</strong>
                    <p>This area is prepared for consult state, urgency, and patient summaries from your current backend flow.</p>
                </article>
            </div>
        </section>
    );

    const renderProfile = () => (
        <section className="doctor-bottom-grid">
            <div className="doctor-panel doctor-section-panel">
                <div className="doctor-panel-head">
                    <div>
                        <p className="doctor-section-tag">{SECTION_META.profile.tag}</p>
                        <h2>{SECTION_META.profile.title}</h2>
                        <p className="doctor-panel-copy">{SECTION_META.profile.description}</p>
                    </div>
                </div>

                <div className="doctor-profile-list">
                    <article>
                        <span>Email</span>
                        <strong>{profile.email || 'Stored after next login'}</strong>
                    </article>
                    <article>
                        <span>Consultation fee</span>
                        <strong>{fee}</strong>
                    </article>
                    <article>
                        <span>Languages</span>
                        <strong>{languages.length ? languages.join(', ') : 'Not set'}</strong>
                    </article>
                    <article>
                        <span>Reviews</span>
                        <strong>{totalReviews}</strong>
                    </article>
                </div>
            </div>

            <div className="doctor-panel doctor-section-panel">
                <div className="doctor-panel-head">
                    <div>
                        <p className="doctor-section-tag">Bio</p>
                        <h2>Patient-facing summary</h2>
                    </div>
                </div>

                <div className="doctor-bio-card">
                    <p>
                        {profile.bio ||
                            'Add a professional summary that explains your expertise, bedside style, and the cases you handle best.'}
                    </p>
                    <div className="doctor-bio-meta">
                        <span><FiGlobe /> {languages.length ? languages.join(', ') : 'Languages pending'}</span>
                        <span><FiStar /> {rating} average rating</span>
                    </div>
                </div>
            </div>
        </section>
    );

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
                        <div>
                            <h3>Current review state</h3>
                            <p>{statusMeta.message}</p>
                        </div>
                    </article>
                    <article>
                        <div className="doctor-focus-icon"><FiCheckCircle /></div>
                        <div>
                            <h3>License details</h3>
                            <p>{profile.licenseNumber ? 'License details submitted from onboarding.' : 'License number not available in saved profile yet.'}</p>
                        </div>
                    </article>
                </div>
            </div>

            <div className="doctor-panel doctor-section-panel">
                <div className="doctor-panel-head">
                    <div>
                        <p className="doctor-section-tag">Qualifications</p>
                        <h2>Submitted credentials</h2>
                    </div>
                </div>

                {Array.isArray(profile.qualifications) && profile.qualifications.length > 0 ? (
                    <div className="doctor-qualifications-grid">
                        {profile.qualifications.map((qualification, index) => (
                            <article key={`${qualification.degree}-${index}`}>
                                <strong>{qualification.degree || 'Qualification'}</strong>
                                <span>{qualification.institution || 'Institution not set'}</span>
                                <small>{qualification.year || 'Year pending'}</small>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="doctor-empty-card compact">
                        <h3>No qualifications added</h3>
                        <p>Your professional credentials will appear here once they are saved.</p>
                    </div>
                )}
            </div>
        </section>
    );

    const renderSection = () => {
        switch (activeSection) {
            case 'schedule':
                return renderSchedule();
            case 'consultations':
                return renderConsultations();
            case 'profile':
                return renderProfile();
            case 'verification':
                return renderVerification();
            case 'overview':
            default:
                return renderOverview();
        }
    };

    return (
        <div className="doctor-home">
            <section className="doctor-mobile-intro">
                <span>{SECTION_META[activeSection]?.tag || SECTION_META.overview.tag}</span>
                <h2>{SECTION_META[activeSection]?.title || SECTION_META.overview.title}</h2>
                <p>{SECTION_META[activeSection]?.description || SECTION_META.overview.description}</p>
            </section>

            {renderSection()}
        </div>
    );
};

export default Userdashboardhomepage;
