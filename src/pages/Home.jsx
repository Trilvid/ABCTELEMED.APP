import React from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import {
    FiMessageSquare, FiZap, FiUserCheck, FiFileText,
    FiShield, FiCheckCircle, FiCreditCard, FiGlobe,
    FiCpu, FiActivity, FiCalendar, FiArrowRight,
    FiSend, FiLock, FiBriefcase, FiList,
} from 'react-icons/fi';
import './Home.css';

const WA_NUMBER = '2349079430573'; // ← replace with your WhatsApp Business number
const WA_LINK = `https://wa.me/${WA_NUMBER}`;

// ── Hero WhatsApp chat mockup ─────────────────────────────────────────────────
const WaMockup = () => (
    <div className="h-phone">
        <div className="h-phone-notch" />
        <div className="h-wa-header">
            <div className="h-wa-avatar">
                A
            </div>
            <div>
                <div className="h-wa-name">ABC Telemedica</div>
                <div className="h-wa-status">● Online</div>
            </div>
        </div>
        <div className="h-wa-chat">
            <div className="h-wa-msg bot">
                Welcome to <strong>ABC Telemedica!</strong> Let&apos;s set up your profile quickly.
                <br /><br />What is your first name?
                <div className="h-wa-time">10:22 AM</div>
            </div>
            <div className="h-wa-msg user">
                Chidi
                <div className="h-wa-time">10:22 AM</div>
            </div>
            <div className="h-wa-msg bot">
                Nice to meet you, <strong>Chidi!</strong> Describe your symptoms in as much detail as you can.
                <div className="h-wa-time">10:22 AM</div>
            </div>
            <div className="h-wa-msg user">
                I have a headache and slight fever since yesterday
                <div className="h-wa-time">10:23 AM</div>
            </div>
            <div className="h-wa-msg bot">
                Based on your symptoms, this may indicate a viral infection. A GP can help confirm and prescribe treatment.
                <div className="h-wa-time">10:23 AM</div>
            </div>
            <div className="h-wa-btn-col">
                <div className="h-wa-btn"><FiUserCheck size={11} /> See a doctor now</div>
                <div className="h-wa-btn"><FiList size={11} /> View my history</div>
            </div>
        </div>
        <div className="h-wa-input">
            <div className="h-wa-input-field">Type a message…</div>
            <div className="h-wa-send"><FiSend size={11} /></div>
        </div>
    </div>
);

// ── Data ──────────────────────────────────────────────────────────────────────
const STEPS = [
    {
        num: '01', icon: <FiMessageSquare />,
        title: 'Message the bot',
        body: 'Send a WhatsApp message to our number. Our bot collects your details and symptoms through a simple conversational flow.',
    },
    {
        num: '02', icon: <FiCpu />,
        title: 'AI triage',
        body: 'Our Claude-powered AI analyses your symptoms, determines urgency, and routes you to the right specialist.',
    },
    {
        num: '03', icon: <FiUserCheck />,
        title: 'Match with a doctor',
        body: 'Premium users get instantly connected. Others choose from verified available doctors and pay by USSD, bank transfer, or card.',
    },
    {
        num: '04', icon: <FiFileText />,
        title: 'Consult and get treated',
        body: 'Your doctor contacts you on WhatsApp. Receive diagnosis, prescriptions, and follow-up dates — all in your history.',
    },
];

const PLANS = [
    {
        name: 'Free',
        price: '₦0',
        priceSub: 'forever',
        cycle: 'No subscription required',
        features: ['AI symptom analysis', 'Consultation history', 'Basic health guidance'],
        cta: 'Get started',
        featured: false,
    },
    {
        name: 'Basic',
        price: '₦750',
        priceSub: '/ month',
        cycle: 'or ₦6,000 / year — save 33%',
        features: ['Everything in Free', 'Unlimited doctor access', 'Consultation history archive', 'Doctor matching and booking'],
        cta: 'Subscribe',
        featured: false,
    },
    {
        name: 'Premium',
        price: '₦1,500',
        priceSub: '/ month',
        cycle: 'or ₦14,400 / year — save 20%',
        features: ['Everything in Basic', 'Instant doctor auto-assignment', 'Priority queue', 'On-call specialist access', 'Faster response times'],
        cta: 'Go Premium',
        featured: false,
        badge: 'Most popular',
    },
];

const FEATURES = [
    { icon: <FiShield />, title: 'NDPC compliant', body: 'Your health data is handled in strict compliance with Africa\'s Data Protection Act. All records are encrypted and access-logged.' },
    { icon: <FiUserCheck />, title: 'Verified doctors', body: 'Every doctor is manually verified — MDCN license checked, credentials confirmed, identity validated before they see a single patient.' },
    { icon: <FiCreditCard />, title: 'Pay your way', body: 'Pay in Nigerian Naira or any other African currency via USSD (dial a code), direct bank transfer, or card — all within your WhatsApp conversation. No third-party app needed.' },
    { icon: <FiFileText />, title: 'Full medical history', body: 'Every consultation is stored — symptoms, diagnosis, prescriptions, follow-up dates. Always available on WhatsApp.' },
    { icon: <FiGlobe />, title: 'Works anywhere', body: 'No smartphone required for the basics. If you have WhatsApp, you have ABC Telemedica. Any device, any network.' },
    { icon: <FiCpu />, title: 'AI-powered triage', body: 'Claude AI routes you to the right specialist immediately — so doctors spend more time treating, less time asking questions.' },
];

const STATS = [
    { num: '100%', label: 'Verified doctors' },
    { num: '<5 min', label: 'Average match time' },
    { num: '15+', label: 'Medical specialties' },
    { num: 'NDPC', label: 'Data protection compliant' },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function Home() {
    return (
        <div className="home-root">

            {/* ── NAV ── */}
            <nav className="hn">
                <Link to="/" className="hn-logo">
                    <div className="hn-logo-mark">
                        {/* A */}
                        <img src="/logo.png" alt="ABC Telemedica Logo" />  

                    </div>
                    <div className="hn-logo-text">ABC <span>Telemedica</span></div>
                </Link>
                <div className="hn-links">
                    <a href="#how">How it works</a>
                    <a href="#plans">Plans</a>
                    <a href="#features">Features</a>
                    <Link to="/privacy">Privacy</Link>
                </div>
                <a href={WA_LINK} className="hn-cta" target="_blank" rel="noopener noreferrer">
                    <FaWhatsapp size={16} /> Chat a doctor
                </a>
            </nav>

            {/* ── HERO ── */}
            <section className="h-hero">
                <div>
                    <div className="h-eyebrow h-anim-1">
                        <span className="h-eyebrow-dot" />
                        Available across Africa
                    </div>
                    <h1 className="h-title h-anim-2">
                        Quality healthcare,{' '}
                        <em>delivered on WhatsApp</em>
                    </h1>
                    <p className="h-sub h-anim-3">
                        Describe your symptoms, get AI-powered triage, and connect with a verified doctor all without leaving your WhatsApp chat.
                    </p>
                    <div className="h-actions h-anim-4">
                        <a href={WA_LINK} className="h-btn-primary" target="_blank" rel="noopener noreferrer">
                            <FaWhatsapp size={18} /> Chat a doctor now
                        </a>
                        <a href="#how" className="h-btn-ghost">
                            See how it works <FiArrowRight size={15} />
                        </a>
                    </div>
                    <div className="h-trust h-anim-4">
                        <div className="h-trust-dots">
                            <div className="h-trust-dot" />
                            <div className="h-trust-dot" />
                            <div className="h-trust-dot" />
                            <div className="h-trust-dot" />
                        </div>
                        <span>Trusted by patients across Africa</span>
                    </div>
                </div>

                <div className="h-visual h-anim-5">
                    <WaMockup />
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="h-section" id="how" style={{ background: 'var(--surface-alt, #eef3f8)' }}>
                <div className="h-tag">Simple process</div>
                <h2 className="h-stitle">From symptom to consultation<br />in minutes</h2>
                <p className="h-ssub">No apps to download. No queues. No unnecessary trips to the clinic.</p>
                <div className="h-steps">
                    {STEPS.map((s) => (
                        <div className="h-step" key={s.num}>
                            <div className="h-step-num">{s.num}</div>
                            <div className="h-step-icon">{s.icon}</div>
                            <h3>{s.title}</h3>
                            <p>{s.body}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── PLANS ── */}
            <section className="h-section-surface" id="plans">
                <div className="h-tag">Subscription plans</div>
                <h2 className="h-stitle">Healthcare that fits your budget</h2>
                <p className="h-ssub">Start free, upgrade anytime. All plans include AI symptom analysis.</p>
                <div className="h-plans-grid">
                    {PLANS.map((p) => (
                        <div className={`h-plan ${p.featured ? 'featured' : ''}`} key={p.name}>
                            {p.badge && <div className="h-plan-badge">{p.badge}</div>}
                            <div className="h-plan-name">{p.name}</div>
                            <div className="h-plan-price">
                                {p.price} <span>{p.priceSub}</span>
                            </div>
                            <div className="h-plan-cycle">{p.cycle}</div>
                            <ul className="h-plan-feats">
                                {p.features.map((f) => (
                                    <li key={f}>
                                        <FiCheckCircle size={14} className="h-feat-icon" style={{ color: 'var(--teal)', flexShrink: 0, marginTop: 2 }} />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <a href={WA_LINK} className="h-plan-cta" target="_blank" rel="noopener noreferrer">
                                {p.cta}
                            </a>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section className="h-section" id="features" style={{ background: 'var(--surface-alt, #eef3f8)' }}>
                <div className="h-tag">Platform features</div>
                <h2 className="h-stitle">Built for Africa,<br />designed for everyone</h2>
                <div className="h-feats-grid">
                    {FEATURES.map((f) => (
                        <div className="h-feat-card" key={f.title}>
                            <div className="h-feat-card-icon">{f.icon}</div>
                            <h3>{f.title}</h3>
                            <p>{f.body}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── TRUST STATS ── */}
            <div className="h-trust-strip">
                <div className="h-trust-grid">
                    {STATS.map((s) => (
                        <div className="h-trust-stat" key={s.label}>
                            <div className="h-stat-num">{s.num}</div>
                            <div className="h-stat-label">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── CTA BAND ── */}
            <section className="h-cta-band">
                <h2>Your doctor is one WhatsApp message away</h2>
                <p>No app to download, no account to create. Open WhatsApp and say hello.</p>
                <a href={WA_LINK} className="h-wa-cta" target="_blank" rel="noopener noreferrer">
                    <FaWhatsapp size={22} /> Message us on WhatsApp
                </a>
            </section>

            {/* ── FOOTER ── */}
            <footer className="h-footer">
                <div className="h-footer-grid">
                    <div>
                        <div className="h-footer-logo">ABC <span>Telemedica</span></div>
                        <p className="h-footer-tagline">Quality healthcare, accessible to every African via WhatsApp.</p>
                    </div>
                    <div className="h-footer-col">
                        <h4>Platform</h4>
                        <a href="#how">How it works</a>
                        <a href="#plans">Pricing</a>
                        <a href="#features">Features</a>
                    </div>
                    <div className="h-footer-col">
                        <h4>Legal</h4>
                        <Link to="/privacy">Privacy policy</Link>
                        <Link to="/privacy#terms">Terms of use</Link>
                        <Link to="/privacy#ndpc">NDPC compliance</Link>
                    </div>
                    <div className="h-footer-col">
                        <h4>Contact</h4>
                        <a href="mailto:support@abctelemedica.com">support@abctelemedica.com</a>
                        <a href={WA_LINK} target="_blank" rel="noopener noreferrer">WhatsApp us</a>
                    </div>
                </div>
                <div className="h-footer-bottom">
                    <span>© {new Date().getFullYear()} ABC InfoMed Tech. All rights reserved.</span>
                    <div className="h-ndpc-badge"><FiShield size={11} /> NDPC Compliant</div>
                    <span>Built with care in Africa</span>
                </div>
            </footer>

        </div>
    );
}