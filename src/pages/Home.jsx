import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import {
  FiMessageSquare, FiUserCheck, FiFileText, FiShield,
  FiCheckCircle, FiCreditCard, FiGlobe, FiCpu,
  FiArrowRight, FiMenu, FiX,
  FiActivity, FiUser, FiPhone, FiMapPin, FiAlertCircle,
} from 'react-icons/fi';
import './Home.css';

const WA_NUMBER = '2349079430573'; // your business number
const WA_LINK   = `https://wa.me/${WA_NUMBER}?text=Hello`;

const RegField = ({ label, id, icon, value, onChange, placeholder, error, type = 'text', onSubmit }) => (
  <div className="rm-field">
    <label htmlFor={id} className="rm-label">{label}</label>
    <div className={`rm-input-wrap ${error ? 'has-error' : ''}`}>
      <span className="rm-input-icon">{icon}</span>
      <input
        id={id}
        type={type}
        className="rm-input"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onSubmit()}
      />
    </div>
    {error && <span className="rm-error"><FiAlertCircle size={12} />{error}</span>}
  </div>
);

// ── Floating pill network (Unchain Summer style) ──────────────────────────────
const Network = () => {
  // Centre of the 580×300 viewBox
  const cx = 290; const cy = 150;
  // Pill anchor points (match CSS positions)
  const anchors = [
    { x: 80,  y: 24  },  // top-left
    { x: 500, y: 24  },  // top-right
    { x: 30,  y: 150 },  // mid-left
    { x: 550, y: 150 },  // mid-right
    { x: 100, y: 276 },  // bottom-left
    { x: 480, y: 276 },  // bottom-right
  ];
  return (
    <div className="h-network h-anim-5">
      {/* SVG connecting lines */}
      <svg className="h-network-svg" viewBox="0 0 580 300" preserveAspectRatio="xMidYMid meet">
        {anchors.map((a, i) => (
          <line key={i} x1={cx} y1={cy} x2={a.x} y2={a.y}
            stroke="rgba(10,173,148,0.18)" strokeWidth="1"
            strokeDasharray="4 4" />
        ))}
      </svg>

      {/* Centre logo */}
      <div className="h-logo-center">
        <img src="/logo.png" alt="ABC Telemedica" />
      </div>

      {/* Floating pills */}
      <div className="h-pill navy   h-pill-1"><FiShield    size={12} /> NDPC Compliant</div>
      <div className="h-pill teal   h-pill-2"><FiUserCheck size={12} /> Verified Doctors</div>
      <div className="h-pill green  h-pill-3"><FiCpu       size={12} /> AI Triage</div>
      <div className="h-pill orange h-pill-4"><FiCreditCard size={12}/> Easy Payment</div>
      <div className="h-pill amber  h-pill-5"><FiFileText  size={12} /> Prescriptions</div>
      <div className="h-pill sky    h-pill-6"><FiActivity  size={12} /> Instant Match</div>
    </div>
  );
};

// ── Registration Modal ───────────────────────────────────────────────────────
const RegModal = ({ onClose }) => {
  const [form, setForm] = useState({ firstName: '', phone: '', country: '', state: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const upd = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = 'Please enter your first name.';
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 10) {
      errs.phone = 'Enter a valid WhatsApp number (with country code).';
    }
    if (!form.country.trim()) errs.country = 'Please enter your country.';
    if (!form.state.trim()) errs.state = 'Please enter your state or region.';
    return errs;
  };

  const submit = () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);

    const msg =
      `Hello, I would like to register on ABC Telemedica.\n\n` +
      `Name: ${form.firstName.trim()}\n` +
      `Phone: ${form.phone.trim()}\n` +
      `Location: ${form.state.trim()}, ${form.country.trim()}`;

    setTimeout(() => {
      window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
      onClose();
      setSubmitting(false);
    }, 400);
  };

  return (
    <div className="rm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="rm-box">
        <div className="rm-header">
          <div className="rm-header-logo">
            <img src="/logo.png" alt="ABC Telemedica" />
          </div>
          <div>
            <h2 className="rm-title">Create your patient profile</h2>
            <p className="rm-subtitle">Takes under 2 minutes. We'll open WhatsApp to complete setup.</p>
          </div>
          <button className="rm-close" onClick={onClose} aria-label="Close">
            <FiX />
          </button>
        </div>

        <div className="rm-notice">
          <FaWhatsapp size={15} />
          <span>After submitting, WhatsApp will open with your details pre-filled. The bot will walk you through the rest.</span>
        </div>

        <div className="rm-form">
          <RegField
            label="First name"
            id="rm-fname"
            icon={<FiUser size={15} />}
            placeholder="e.g. Chidi"
            value={form.firstName}
            onChange={v => upd('firstName', v)}
            error={errors.firstName}
            onSubmit={submit}
          />
          <RegField
            label="WhatsApp phone number"
            id="rm-phone"
            icon={<FiPhone size={15} />}
            placeholder="e.g. +2348012345678"
            value={form.phone}
            onChange={v => upd('phone', v)}
            error={errors.phone}
            type="tel"
            onSubmit={submit}
          />
          <div className="rm-row">
            <RegField
              label="Country"
              id="rm-country"
              icon={<FiGlobe size={15} />}
              placeholder="e.g. Nigeria"
              value={form.country}
              onChange={v => upd('country', v)}
              error={errors.country}
              onSubmit={submit}
            />
            <RegField
              label="State / Region"
              id="rm-state"
              icon={<FiMapPin size={15} />}
              placeholder="e.g. Lagos"
              value={form.state}
              onChange={v => upd('state', v)}
              error={errors.state}
              onSubmit={submit}
            />
          </div>
        </div>

        <button className="rm-submit" onClick={submit} disabled={submitting}>
          {submitting
            ? <><span className="rm-spinner" /> Opening WhatsApp…</>
            : <><FaWhatsapp size={17} /> Continue on WhatsApp</>
          }
        </button>

        <p className="rm-terms">
          By registering you agree to our <Link to="/privacy" onClick={onClose}>Privacy Policy</Link> and Terms of Use.
          Your data is protected under Nigeria&apos;s NDPA 2023.
        </p>
      </div>
    </div>
  );
};

// ── Data ──────────────────────────────────────────────────────────────────────
const STEPS = [
  { num:'01', icon:<FiMessageSquare />, title:'Register on WhatsApp',
    body:'Click Register Now, fill in your quick profile, and WhatsApp opens with your details pre-filled. The bot walks you through the rest.' },
  { num:'02', icon:<FiCpu />, title:'AI symptom triage',
    body:'Describe your symptoms in plain language. Claude AI analyses them, determines urgency, and routes you to the right specialist.' },
  { num:'03', icon:<FiUserCheck />, title:'Match with a doctor',
    body:'Premium members get instantly auto-assigned. Basic members choose from verified available doctors and pay securely in-chat.' },
  { num:'04', icon:<FiFileText />, title:'Consult and get treated',
    body:'Your doctor contacts you directly on WhatsApp. Receive diagnosis, prescriptions, and follow-up dates — all saved in your history.' },
];

const PLANS = [
  {
    name:'Basic', price:'₦750', priceSub:'/ month',
    cycle:'or ₦6,000 / year — save 33%',
    features:['AI symptom analysis','Doctor matching and booking','Consultation history archive','Unlimited doctor access'],
    cta:'Get Basic', featured:false,
  },
  {
    name:'Premium', price:'₦1,500', priceSub:'/ month',
    cycle:'or ₦14,400 / year — save 20%',
    features:['Everything in Basic','Instant auto-assignment to a doctor','Priority consultation queue','On-call specialist access','Faster response times'],
    cta:'Go Premium', featured:true, badge:'Most popular',
  },
];

const FEATURES = [
  { icon:<FiShield   />, title:'NDPC compliant',     body:"Your health data is handled in full compliance with Nigeria's Data Protection Act. Every record is encrypted and access-logged." },
  { icon:<FiUserCheck/>, title:'Verified doctors',    body:'Every doctor is manually verified — MDCN license checked, credentials confirmed, identity validated before they see a single patient.' },
  { icon:<FiCreditCard/>,title:'Pay your way',        body:'Pay via USSD (dial a code), direct bank transfer, or card — all within your WhatsApp conversation. No third-party app needed.' },
  { icon:<FiFileText />, title:'Full medical history',body:'Every consultation is stored — symptoms, diagnosis, prescriptions, follow-up dates. Always accessible on WhatsApp.' },
  { icon:<FiGlobe    />, title:'Works anywhere',      body:'If you have WhatsApp, you have ABC Telemedica. Works on any device, any network, anywhere in Africa.' },
  { icon:<FiCpu      />, title:'AI-powered triage',   body:'Claude AI routes you to the right specialist so doctors spend more time treating and less time asking preliminary questions.' },
];

const STATS = [
  { num:'100%',  label:'Verified doctors' },
  { num:'<5 min',label:'Average match time' },
  { num:'15+',   label:'Medical specialties' },
  { num:'NDPC',  label:'Data protection compliant' },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="home-root">

      {/* ── NAV ── */}
      <nav className="hn" style={{ position:'fixed' }}>
        <Link to="/" className="hn-logo">
          <div className="hn-logo-mark">
            <img src="/logo.png" alt="ABC Telemedica" />
          </div>
          <div className="hn-logo-text">ABC <span>Telemedica</span></div>
        </Link>

        <div className="hn-links">
          <a href="#how">How it works</a>
          <a href="#plans">Plans</a>
          <a href="#features">Features</a>
          <Link to="/privacy">Privacy</Link>
        </div>

        <button className="hn-cta" onClick={() => setModalOpen(true)} type="button">
          <FaWhatsapp size={15} /> Register Now
        </button>

        <button className="hn-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          {menuOpen ? <><span/><span style={{opacity:0}}/><span/></> : <><span/><span/><span/></>}
        </button>
      </nav>

      {/* mobile menu */}
      <div className={`hn-mobile-menu ${menuOpen ? 'open' : ''}`} style={{ position:'fixed', zIndex:99 }}>
        <a href="#how"     onClick={() => setMenuOpen(false)}>How it works</a>
        <a href="#plans"   onClick={() => setMenuOpen(false)}>Plans</a>
        <a href="#features"onClick={() => setMenuOpen(false)}>Features</a>
        <Link to="/privacy"onClick={() => setMenuOpen(false)}>Privacy</Link>
        <button
          type="button"
          onClick={() => {
            setMenuOpen(false);
            setModalOpen(true);
          }}
          style={{
            color: 'var(--teal)',
            fontWeight: 700,
            background: 'none',
            border: 'none',
            padding: 0,
            textAlign: 'left',
            cursor: 'pointer',
          }}
        >
          <FaWhatsapp size={14} style={{ verticalAlign:'middle', marginRight:6 }} />Register Now
        </button>
      </div>

      {/* ── HERO ── */}
      <section className="h-hero">
        <div className="h-eyebrow h-anim-1">
          <span className="h-eyebrow-dot" /> Available across Africa
        </div>
        <h1 className="h-title h-anim-2">
          Quality healthcare,<br /><em>delivered on WhatsApp</em>
        </h1>
        <p className="h-sub h-anim-3">
          Describe your symptoms, get AI-powered triage, and connect with a verified doctor all without leaving your WhatsApp chat.
        </p>
        <div className="h-actions h-anim-4">
          <button className="h-btn-primary" type="button" onClick={() => setModalOpen(true)}>
            <FaWhatsapp size={17} /> Register Now
          </button>
          <button className="h-btn-ghost" type="button" onClick={() => window.location.href = '/login'}>
            Doctor signup <FiArrowRight size={14} />
            {/* <Link to="/login"><FaWhatsapp size={22} /> Doctor Signup</Link>  */}
          </button>
        </div>

        {/* Floating pill network */}
        <Network />
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="h-section" id="how">
        <div className="h-tag">Simple process</div>
        <h2 className="h-stitle">From symptom to consultation<br />in minutes</h2>
        <p className="h-ssub">No app to download. No queues. No unnecessary trips to the clinic.</p>
        <div className="h-steps">
          {STEPS.map(s => (
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
        <p className="h-ssub">All plans include AI symptom triage and your full consultation history.</p>
        <div className="h-plans-grid">
          {PLANS.map(p => (
            <div className={`h-plan ${p.featured ? 'featured' : ''}`} key={p.name}>
              {p.badge && <div className="h-plan-badge">{p.badge}</div>}
              <div className="h-plan-name">{p.name}</div>
              <div className="h-plan-price">{p.price} <span>{p.priceSub}</span></div>
              <div className="h-plan-cycle">{p.cycle}</div>
              <ul className="h-plan-feats">
                {p.features.map(f => (
                  <li key={f}><FiCheckCircle size={13} /> {f}</li>
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
      <section className="h-section" id="features">
        <div className="h-tag">Platform features</div>
        <h2 className="h-stitle">Built for Africa,<br />designed for everyone</h2>
        <div className="h-feats-grid">
          {FEATURES.map(f => (
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
          {STATS.map(s => (
            <div className="h-trust-stat" key={s.label}>
              <div className="h-stat-num">{s.num}</div>
              <div className="h-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA BAND ── */}
      <section className="h-cta-band">
        <div className="h-cta-copy">
          <div className="h-cta-kicker">Doctor signup</div>
          <h2>Stay connected, let&apos;s do something great together.</h2>
          <p>Sign up in under 2 minutes and start matching patients through WhatsApp.</p>
          <button className="h-wa-cta" type="button">
            <Link to="/login"><FaWhatsapp size={22} /> Doctor Signup</Link> 
          </button>
        </div>
        <div className="h-cta-art" aria-hidden="true">
          <div className="h-cta-orb">
            <div className="h-cta-orb-inner">
              <img src="/logo.png" alt="" />
            </div>
          </div>
          <div className="h-cta-chip h-chip-a">Verified doctors</div>
          <div className="h-cta-chip h-chip-b">Fast matching</div>
          <div className="h-cta-chip h-chip-c">Secure onboarding</div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="h-footer">
        <div className="h-footer-top">
          <div>
            <div className="h-footer-logo">
              <img src="/logo.png" alt="ABC Telemedica" />
              ABC <span>Telemedica</span>
            </div>
            <p className="h-footer-tagline">
              Quality healthcare, accessible to every African via WhatsApp. Verified doctors, AI triage, secure payments.
            </p>
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
            <Link to="/login">Doctor login</Link>
          </div>
        </div>
        <div className="h-footer-bottom">
          <span>© {new Date().getFullYear()} ABC InfoMed Tech. All rights reserved.</span>
          <div className="h-ndpc-badge"><FiShield size={10} /> NDPC Compliant</div>
          <span>Built with care in Africa</span>
        </div>
      </footer>

      {modalOpen && <RegModal onClose={() => setModalOpen(false)} />}

    </div>
  );
}
