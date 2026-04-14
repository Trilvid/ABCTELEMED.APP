import React from 'react';
import { Link } from 'react-router-dom';
import {
    FiArrowLeft, FiShield, FiUser, FiDatabase, FiSettings,
    FiMessageSquare, FiLink, FiHeart, FiCalendar, FiLock,
    FiEye, FiTrash2, FiEdit, FiDownload, FiX, FiFlag,
    FiInfo, FiAlertCircle, FiCheckCircle, FiMail, FiPhone,
    FiFileText, FiList, FiGlobe, FiChevronRight,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import './Privacy.css';

// ── Small reusable sub-components ────────────────────────────────────────────
const SecIcon = ({ children }) => <div className="priv-sec-icon">{children}</div>;

const InfoBox = ({ highlight, children }) => (
    <div className={`p-info-box${highlight ? ' highlight' : ''}`}>
        <p>{children}</p>
    </div>
);

const Li = ({ children }) => (
    <li>
        <FiChevronRight size={13} className="priv-li-icon" />
        <span>{children}</span>
    </li>
);

const Table = ({ heads, rows }) => (
    <div className="p-table-wrap">
        <table className="p-table">
            <thead>
                <tr>{heads.map((h) => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
                {rows.map((row, i) => (
                    <tr key={i}>
                        {row.map((cell, j) => <td key={j}>{cell}</td>)}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

// ── TOC items ─────────────────────────────────────────────────────────────────
const TOC = [
    ['#overview', 'Overview'],
    ['#who-we-are', 'Who we are'],
    ['#data', 'Data we collect'],
    ['#how-we-use', 'How we use it'],
    ['#whatsapp', 'WhatsApp & Meta'],
    ['#third', 'Third-party services'],
    ['#health', 'Health data'],
    ['#retention', 'Retention & deletion'],
    ['#ndpc', 'NDPC compliance'],
    ['#rights', 'Your rights'],
    ['#security', 'Security'],
    ['#children', 'Children'],
    ['#terms', 'Terms of use'],
    ['#changes', 'Policy changes'],
    ['#contact', 'Contact us'],
];

// ── Main component ────────────────────────────────────────────────────────────
export default function Privacy() {
    return (
        <div className="priv-root">

            {/* ── NAV ── */}
            <nav className="priv-nav">
                <Link to="/" className="priv-logo">
                    <div className="priv-logo-mark">
                        <img src="/logo.png" alt="ABC Telemedica Logo" />  
                    </div>
                    <div className="priv-logo-text">ABC <span>Telemedica</span></div>
                </Link>
                <Link to="/" className="priv-back">
                    <FiArrowLeft size={14} /> Back to home
                </Link>
            </nav>

            {/* ── PAGE HEADER ── */}
            <div className="priv-header">
                <div className="p-tag">Legal document</div>
                <h1>Privacy Policy</h1>
                <p className="p-meta">
                    <strong>Effective date: 14 April 2025</strong> &nbsp;·&nbsp;
                    Last updated: 14 April 2025 &nbsp;·&nbsp;
                    Applies to the ABC Telemedica WhatsApp service and website
                </p>
            </div>

            <div className="priv-wrap">

                {/* ── TOC SIDEBAR ── */}
                <nav className="priv-toc" aria-label="Table of contents">
                    <h3>Contents</h3>
                    <ul>
                        {TOC.map(([href, label]) => (
                            <li key={href}>
                                <a href={href}>{label}</a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* ── ARTICLE ── */}
                <article className="priv-article">

                    {/* OVERVIEW */}
                    <div className="priv-sec" id="overview">
                        <h2><SecIcon><FiFileText size={16} /></SecIcon>Overview</h2>
                        <InfoBox highlight>
                            <strong>Plain language summary: </strong>
                            We collect the information you give us on WhatsApp (name, phone, symptoms, health details) so we can connect you with a doctor and provide consultations. We do not sell your data. We do not share it with advertisers. We use trusted third-party services to operate the platform and we are legally required to protect your health information under Nigerian law.
                        </InfoBox>
                        <p>
                            This Privacy Policy explains how <strong>ABC Telemedica</strong> ("we", "us", "our") collects, uses, stores, and protects personal information when you use our WhatsApp-based telemedicine service and website.
                        </p>
                        <p>
                            By using our service, you agree to the collection and use of information in accordance with this policy. If you do not agree, please discontinue use of the service.
                        </p>
                    </div>

                    {/* WHO WE ARE */}
                    <div className="priv-sec" id="who-we-are">
                        <h2><SecIcon><FiUser size={16} /></SecIcon>Who we are</h2>
                        <p>
                            <strong>ABC Telemedica</strong> is a telemedicine platform that connects patients in Nigeria with verified, licensed medical doctors via WhatsApp. Our service is operated from Nigeria.
                        </p>
                        <InfoBox>
                            <strong>Data Controller:</strong> ABC Telemedica<br />
                            <strong>Contact:</strong> <a href="mailto:privacy@abctelemedica.ng">privacy@abctelemedica.ng</a><br />
                            <strong>Address:</strong> Nigeria
                        </InfoBox>
                        <p>
                            As a data controller, we are responsible for deciding how and why your personal data is processed. We take this responsibility seriously and have designed our systems to handle health data with the highest standards of care.
                        </p>
                    </div>

                    {/* DATA COLLECTED */}
                    <div className="priv-sec" id="data">
                        <h2><SecIcon><FiDatabase size={16} /></SecIcon>Data we collect</h2>
                        <h3>Information you provide directly</h3>
                        <ul>
                            <Li><strong>Identity data:</strong> First name, last name, date of birth, gender</Li>
                            <Li><strong>Contact data:</strong> WhatsApp phone number (your primary identifier), email address (optional)</Li>
                            <Li><strong>Location data:</strong> Country and state/region</Li>
                            <Li><strong>Health data:</strong> Symptoms, medical history, diagnoses, prescriptions, consultation notes</Li>
                            <Li><strong>Payment data:</strong> Subscription plan and status; payment references (we do not store card numbers)</Li>
                        </ul>
                        <h3>Information collected automatically</h3>
                        <ul>
                            <Li><strong>Usage data:</strong> Message timestamps, session state, consultation history</Li>
                            <Li><strong>Technical data:</strong> IP address (logged in audit trails), access logs for security</Li>
                        </ul>
                        <Table
                            heads={['Category', 'Examples', 'Required?']}
                            rows={[
                                ['Identity', 'Name, date of birth, gender', 'Required to register'],
                                ['Contact', 'WhatsApp number, email', 'WhatsApp required; email optional'],
                                ['Health', 'Symptoms, diagnosis, prescriptions', 'Required for consultation'],
                                ['Location', 'Country, state', 'Required for doctor matching'],
                                ['Payment', 'Plan type, transaction reference', 'Required for paid features'],
                                ['Technical', 'IP address, logs', 'Automatic — for security'],
                            ]}
                        />
                    </div>

                    {/* HOW WE USE */}
                    <div className="priv-sec" id="how-we-use">
                        <h2><SecIcon><FiSettings size={16} /></SecIcon>How we use your data</h2>
                        <h3>Service delivery (Contractual necessity)</h3>
                        <ul>
                            <Li>Creating and maintaining your patient profile</Li>
                            <Li>Matching you with appropriate medical specialists</Li>
                            <Li>Enabling WhatsApp-based consultations with doctors</Li>
                            <Li>Processing payments for subscriptions and consultations</Li>
                            <Li>Storing your consultation history and medical records</Li>
                        </ul>
                        <h3>Safety and medical care (Vital interests)</h3>
                        <ul>
                            <Li>AI-powered symptom triage to assess urgency</Li>
                            <Li>Notifying doctors of new consultations</Li>
                            <Li>Emergency escalation if symptoms indicate a life-threatening condition</Li>
                        </ul>
                        <h3>Legal compliance (Legal obligation)</h3>
                        <ul>
                            <Li>Maintaining audit logs of all access to patient records per NDPC requirements</Li>
                            <Li>Responding to valid legal requests from Nigerian authorities</Li>
                            <Li>Verifying doctor credentials and license status</Li>
                        </ul>
                        <InfoBox>
                            <strong>We do not use your health data for marketing, profiling, or advertising. We do not sell, rent, or trade your personal data to any third party.</strong>
                        </InfoBox>
                    </div>

                    {/* WHATSAPP */}
                    <div className="priv-sec" id="whatsapp">
                        <h2><SecIcon><FiMessageSquare size={16} /></SecIcon>WhatsApp &amp; Meta</h2>
                        <InfoBox highlight>
                            <strong>Important: </strong>
                            ABC Telemedica operates using the WhatsApp Business API provided by Meta Platforms, Inc. By messaging our number, you are also subject to{' '}
                            <a href="https://www.whatsapp.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">WhatsApp&apos;s Privacy Policy</a>.
                        </InfoBox>
                        <p>When you send messages to our WhatsApp number:</p>
                        <ul>
                            <Li>Your message content is transmitted over WhatsApp&apos;s encrypted infrastructure and processed by our bot on our servers</Li>
                            <Li>We receive your WhatsApp phone number as your unique identifier</Li>
                            <Li>Message content is stored in our database to maintain conversation flow and your medical history</Li>
                            <Li>We send responses through the Meta Cloud API</Li>
                        </ul>
                        <p>
                            <strong>What Meta can see:</strong> Meta processes messages as part of delivering the WhatsApp service. Meta does not have access to the structured health records we store in our own system.
                        </p>
                        <p>
                            <strong>Opt-out:</strong> You can stop using our service at any time. You may also request deletion of your data — see &ldquo;Your Rights&rdquo; below.
                        </p>
                    </div>

                    {/* THIRD PARTIES */}
                    <div className="priv-sec" id="third">
                        <h2><SecIcon><FiLink size={16} /></SecIcon>Third-party services</h2>
                        <p>We use the following trusted third-party services. Each receives only the minimum data necessary for their function:</p>
                        <Table
                            heads={['Service', 'Purpose', 'Data shared', 'Privacy policy']}
                            rows={[
                                ['Meta (WhatsApp)', 'Message delivery, WhatsApp Business API', 'Phone number, message content', <a href="https://www.whatsapp.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">whatsapp.com/legal</a>],
                                ['Flutterwave', 'Payment processing', 'Email, phone, payment amount, transaction reference', <a href="https://flutterwave.com/ng/privacy-policy" target="_blank" rel="noopener noreferrer">flutterwave.com/privacy</a>],
                                ['Anthropic (Claude)', 'AI symptom triage', 'Symptom descriptions only — no name or phone number', <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer">anthropic.com/privacy</a>],
                                ['Cloudinary', 'Doctor photo and certificate storage', 'Doctor images and documents only (not patient data)', <a href="https://cloudinary.com/privacy" target="_blank" rel="noopener noreferrer">cloudinary.com/privacy</a>],
                                ['Resend', 'Transactional email', 'Email address, name', <a href="https://resend.com/privacy" target="_blank" rel="noopener noreferrer">resend.com/privacy</a>],
                                ['Railway', 'Cloud hosting', 'All data processed on our servers passes through Railway', <a href="https://railway.app/legal/privacy" target="_blank" rel="noopener noreferrer">railway.app/legal</a>],
                                ['MongoDB Atlas', 'Database storage', 'All structured patient and doctor data', <a href="https://www.mongodb.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">mongodb.com/legal</a>],
                            ]}
                        />
                    </div>

                    {/* HEALTH DATA */}
                    <div className="priv-sec" id="health">
                        <h2><SecIcon><FiHeart size={16} /></SecIcon>Health data — special protections</h2>
                        <InfoBox highlight>
                            Health data is a <strong>special category</strong> under the NDPA 2023 and requires explicit consent and heightened protection.
                        </InfoBox>
                        <p>
                            By using our consultation service and providing symptom information, you explicitly consent to the processing of your health data for the purpose of medical consultation and treatment.
                        </p>
                        <h3>How we protect your health data</h3>
                        <ul>
                            <Li><strong>Access control:</strong> Only the assigned doctor and authorised administrators can access your health records</Li>
                            <Li><strong>Audit logging:</strong> Every access to your medical record is automatically logged — who, when, what, from which IP address</Li>
                            <Li><strong>Encryption:</strong> All data in transit uses TLS. Data at rest is stored on encrypted MongoDB Atlas infrastructure</Li>
                            <Li><strong>Minimal sharing:</strong> Only symptom descriptions are sent to Claude — never your name, phone number, or other identifying information</Li>
                            <Li><strong>Doctor verification:</strong> Only MDCN-verified doctors can access patient data</Li>
                        </ul>
                    </div>

                    {/* RETENTION */}
                    <div className="priv-sec" id="retention">
                        <h2><SecIcon><FiCalendar size={16} /></SecIcon>Data retention &amp; deletion</h2>
                        <Table
                            heads={['Data type', 'How long we keep it', 'Why']}
                            rows={[
                                ['Patient profile', 'Until you request deletion', 'Required for ongoing service'],
                                ['Consultation records', '7 years after last consultation', 'Medical record-keeping requirements under Nigerian medical practice guidelines'],
                                ['WhatsApp session data', '30 days of inactivity', 'Conversation continuity; deleted when no longer needed'],
                                ['Payment records', '7 years', 'Financial and tax compliance obligations'],
                                ['Audit logs', '3 years', 'NDPC compliance and security review'],
                                ['Doctor profile photos', 'Until account deletion', 'Patient-facing identity verification'],
                            ]}
                        />
                    </div>

                    {/* NDPC */}
                    <div className="priv-sec" id="ndpc">
                        <h2><SecIcon><FiShield size={16} /></SecIcon>NDPC compliance</h2>
                        <p>
                            ABC Telemedica operates in full compliance with the <strong>Nigeria Data Protection Act (NDPA) 2023</strong> and regulations issued by the <strong>Nigeria Data Protection Commission (NDPC)</strong>.
                        </p>
                        <h3>Our compliance measures include:</h3>
                        <ul>
                            <Li>Appointment of a Data Protection Officer responsible for data governance</Li>
                            <Li>Conducting data protection impact assessments (DPIAs) for high-risk processing activities</Li>
                            <Li>Maintaining a Record of Processing Activities (ROPA)</Li>
                            <Li>Full audit trails of all access to sensitive health data</Li>
                            <Li>Data processing agreements with all third-party processors</Li>
                            <Li>Lawful basis documented for every processing activity</Li>
                            <Li>Breach notification procedures (72-hour notification to NDPC where required)</Li>
                        </ul>
                        <p>
                            Our Data Protection Officer can be reached at{' '}
                            <a href="mailto:dpo@abctelemedica.ng">dpo@abctelemedica.ng</a>.
                        </p>
                    </div>

                    {/* YOUR RIGHTS */}
                    <div className="priv-sec" id="rights">
                        <h2><SecIcon><FiCheckCircle size={16} /></SecIcon>Your rights</h2>
                        <p>
                            Under the NDPA 2023, you have the following rights. Contact us at{' '}
                            <a href="mailto:privacy@abctelemedica.ng">privacy@abctelemedica.ng</a> — we respond within <strong>30 days</strong>.
                        </p>

                        {[
                            { icon: <FiEye size={14} />, title: 'Right of access', body: 'Request a copy of all personal data we hold about you, including consultation history. We provide it in a readable format at no charge.' },
                            { icon: <FiEdit size={14} />, title: 'Right to rectification', body: 'If your information is inaccurate or incomplete, you have the right to request correction.' },
                            { icon: <FiTrash2 size={14} />, title: 'Right to erasure', body: 'Request deletion of your personal data. Certain data (consultation records, payment records) may be retained for legally required periods — we will inform you of any limitations.' },
                            { icon: <FiShield size={14} />, title: 'Right to restrict processing', body: 'Request that we limit how we use your data while a dispute is being resolved.' },
                            { icon: <FiDownload size={14} />, title: 'Right to data portability', body: 'Request your personal data in a structured, machine-readable format (JSON or CSV).' },
                            { icon: <FiX size={14} />, title: 'Right to withdraw consent', body: 'Where processing is based on consent, you may withdraw it at any time. Withdrawal does not affect the lawfulness of processing before withdrawal.' },
                            { icon: <FiAlertCircle size={14} />, title: 'Right to object', body: 'Object to processing based on legitimate interests. We will stop unless we can demonstrate compelling legitimate grounds.' },
                            { icon: <FiFlag size={14} />, title: 'Right to lodge a complaint', body: <span>If you believe we have violated your rights, lodge a complaint with the <strong>NDPC</strong> at <a href="https://ndpc.gov.ng" target="_blank" rel="noopener noreferrer">ndpc.gov.ng</a>.</span> },
                        ].map((r) => (
                            <div key={r.title} style={{ display: 'flex', gap: 12, marginBottom: 14, padding: '14px 16px', borderRadius: 12, background: 'var(--bg)', border: '1px solid var(--border)' }}>
                                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--teal-light)', border: '1px solid var(--border-teal)', display: 'grid', placeItems: 'center', color: 'var(--teal-dark)', flexShrink: 0, marginTop: 2 }}>
                                    {r.icon}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--navy)', marginBottom: 3 }}>{r.title}</div>
                                    <div style={{ fontSize: '0.86rem', color: 'var(--muted)', lineHeight: 1.6 }}>{r.body}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* SECURITY */}
                    <div className="priv-sec" id="security">
                        <h2><SecIcon><FiLock size={16} /></SecIcon>Security</h2>
                        <ul>
                            <Li><strong>Encryption in transit:</strong> All communication uses TLS 1.2 or higher</Li>
                            <Li><strong>Encryption at rest:</strong> Data stored in MongoDB Atlas uses AES-256 encryption</Li>
                            <Li><strong>Authentication:</strong> JWT-based auth with configurable expiry; bcrypt password hashing (cost factor 12)</Li>
                            <Li><strong>Access control:</strong> Role-based permissions; doctors can only see their own patients</Li>
                            <Li><strong>Audit logging:</strong> Every access to patient health records is logged immutably</Li>
                            <Li><strong>API security:</strong> Rate limiting, NoSQL injection protection, CORS restrictions</Li>
                            <Li><strong>Infrastructure:</strong> Hosted on Railway with automatic HTTPS; database on MongoDB Atlas</Li>
                        </ul>
                        <p>
                            In the event of a data breach likely to result in a risk to your rights and freedoms, we will notify you and the NDPC as required by law.
                        </p>
                    </div>

                    {/* CHILDREN */}
                    <div className="priv-sec" id="children">
                        <h2><SecIcon><FiUser size={16} /></SecIcon>Children&apos;s data</h2>
                        <p>Our service is designed for adults aged 18 and over. We do not knowingly collect personal data from children under 18 without explicit parental or guardian consent.</p>
                        <p>If a child requires medical consultation, a parent or guardian must register and manage the interaction. The parent&apos;s account will be used, and they take responsibility for the child&apos;s health information.</p>
                        <p>
                            If we become aware that we have collected data from a child under 18 without appropriate consent, we will delete it promptly. Contact us at{' '}
                            <a href="mailto:privacy@abctelemedica.ng">privacy@abctelemedica.ng</a>.
                        </p>
                    </div>

                    {/* TERMS */}
                    <div className="priv-sec" id="terms">
                        <h2><SecIcon><FiFileText size={16} /></SecIcon>Terms of use</h2>
                        <h3>Medical disclaimer</h3>
                        <InfoBox>
                            ABC Telemedica is a communication and matching platform. Medical advice, diagnoses, and prescriptions are provided by licensed, verified doctors and represent their professional opinion. <strong>In a medical emergency, always call an emergency service (112 in Nigeria) immediately.</strong>
                        </InfoBox>
                        <h3>Acceptable use</h3>
                        <ul>
                            <Li>You must provide accurate information about yourself and your symptoms</Li>
                            <Li>You must not misrepresent your identity or medical history</Li>
                            <Li>You must not use the service for any purpose other than genuine medical consultation</Li>
                            <Li>You must not abuse, harass, or make inappropriate requests of our doctors</Li>
                        </ul>
                        <h3>Payment terms</h3>
                        <p>
                            Subscription fees and consultation fees are non-refundable once a service has been rendered. Refund requests for technical failures should be directed to{' '}
                            <a href="mailto:support@abctelemedica.ng">support@abctelemedica.ng</a> within 48 hours.
                        </p>
                        <h3>Governing law</h3>
                        <p>These terms and your use of ABC Telemedica are governed by the laws of the Federal Republic of Nigeria. Disputes are subject to the jurisdiction of Nigerian courts.</p>
                    </div>

                    {/* CHANGES */}
                    <div className="priv-sec" id="changes">
                        <h2><SecIcon><FiEdit size={16} /></SecIcon>Policy changes</h2>
                        <p>When we make significant changes, we will:</p>
                        <ul>
                            <Li>Update the &ldquo;Last updated&rdquo; date at the top of this page</Li>
                            <Li>Send a WhatsApp notification to all active users summarising the key changes</Li>
                            <Li>For material changes affecting health data processing, we will seek fresh consent where required</Li>
                        </ul>
                        <p>Continued use of the service after any changes constitutes acceptance of the updated policy.</p>
                    </div>

                    {/* CONTACT */}
                    <div className="priv-sec" id="contact">
                        <h2><SecIcon><FiMail size={16} /></SecIcon>Contact us</h2>
                        <p>For questions about this policy, to exercise your data rights, or to report a concern:</p>
                        <div className="p-contact-card">
                            {[
                                { icon: <FiMail size={15} />, label: 'General & privacy enquiries', value: <a href="mailto:privacy@abctelemedica.ng">privacy@abctelemedica.ng</a> },
                                { icon: <FiShield size={15} />, label: 'Data Protection Officer', value: <a href="mailto:dpo@abctelemedica.ng">dpo@abctelemedica.ng</a> },
                                { icon: <FiAlertCircle size={15} />, label: 'Support issues', value: <a href="mailto:support@abctelemedica.ng">support@abctelemedica.ng</a> },
                                { icon: <FaWhatsapp size={15} />, label: 'WhatsApp', value: <a href="https://wa.me/2349079430573" target="_blank" rel="noopener noreferrer">+234 90 7943 0573</a> },
                                { icon: <FiGlobe size={15} />, label: 'Regulatory authority (NDPC)', value: <a href="https://ndpc.gov.ng" target="_blank" rel="noopener noreferrer">ndpc.gov.ng</a> },
                            ].map((c) => (
                                <div className="p-contact-item" key={c.label}>
                                    <div className="p-contact-icon">{c.icon}</div>
                                    <div>
                                        <span className="p-contact-label">{c.label}</span>
                                        {c.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </article>
            </div>

            {/* ── FOOTER ── */}
            <footer className="priv-footer">
                <p>© {new Date().getFullYear()} ABC Telemedica. Privacy Policy — last updated 14 April 2025.</p>
                <p style={{ marginTop: 6 }}>
                    <Link to="/">Back to home</Link> &nbsp;·&nbsp;{' '}
                    <a href="mailto:privacy@abctelemedica.ng">privacy@abctelemedica.ng</a>
                </p>
            </footer>

        </div>
    );
}