import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiArrowRight, FiMessageSquare, FiHeart } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import './404.css';

const WA_LINK = 'https://wa.me/2349079430573?text=Hello';

export default function NotFound() {
  return (
    <div className="nf-root">

      {/* minimal nav */}
      <nav className="nf-nav">
        <Link to="/" className="nf-nav-logo">
          <div className="nf-nav-mark">
            <img src="/logo.png" alt="ABC Telemedica" />
          </div>
          <span className="nf-nav-text">ABC <em>Telemedica</em></span>
        </Link>
      </nav>

      <main className="nf-main">

        {/* Big 404 number */}
        <div className="nf-number" aria-hidden="true">
          <span>4</span>
          <div className="nf-pulse-wrap">
            <div className="nf-pulse-ring" />
            <div className="nf-pulse-ring nf-pulse-ring-2" />
            <div className="nf-pulse-icon"><FiHeart size={28} /></div>
          </div>
          <span>4</span>
        </div>

        <h1 className="nf-title">Page not found</h1>
        <p className="nf-sub">
          The page you are looking for does not exist or may have been moved.
          Let us help you get back on track.
        </p>

        <div className="nf-actions">
          <Link to="/" className="nf-btn-primary">
            <FiHome size={16} /> Back to home
          </Link>
          <a href={WA_LINK} className="nf-btn-wa" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp size={16} /> Chat a doctor
          </a>
        </div>

        {/* Quick links */}
        <div className="nf-links">
          <p className="nf-links-label">Quick links</p>
          <div className="nf-links-grid">
            {[
              { to:'/login',     label:'Doctor login' },
              { to:'/auth-signup', label:'Register as a doctor' },
              { to:'/privacy',   label:'Privacy policy' },
              { href: WA_LINK,   label:'WhatsApp us', external: true },
            ].map(l => (
              l.external
                ? <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="nf-link-card">
                    {l.label} <FiArrowRight size={13} />
                  </a>
                : <Link key={l.label} to={l.to} className="nf-link-card">
                    {l.label} <FiArrowRight size={13} />
                  </Link>
            ))}
          </div>
        </div>
      </main>

      <footer className="nf-footer">
        <span>© {new Date().getFullYear()} ABC InfoMed Tech</span>
        <Link to="/privacy">Privacy policy</Link>
      </footer>
    </div>
  );
}