import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert2";
import "./onboardingStyle.css";

// ─── CONFIG ────

const TOTAL_STEPS = 8;

const STEP_META = [
    { label: "Account", desc: "Login credentials" },
    { label: "Personal", desc: "Your identity" },
    { label: "Professional", desc: "Specialty & background" },
    { label: "Qualifications", desc: "Degrees & training" },
    { label: "License", desc: "Medical licence details" },
    { label: "Availability", desc: "When you're reachable" },
    { label: "Pricing", desc: "Consultation fee" },
    { label: "Review", desc: "Confirm & submit" },
];

const SPECIALTIES = [
    { value: "general_practice", label: "General Practice" },
    { value: "cardiology", label: "Cardiology" },
    { value: "dermatology", label: "Dermatology" },
    { value: "pediatrics", label: "Pediatrics" },
    { value: "gynecology", label: "Gynecology" },
    { value: "orthopedics", label: "Orthopedics" },
    { value: "neurology", label: "Neurology" },
    { value: "psychiatry", label: "Psychiatry" },
    { value: "ophthalmology", label: "Ophthalmology" },
    { value: "ent", label: "ENT" },
    { value: "urology", label: "Urology" },
    { value: "oncology", label: "Oncology" },
    { value: "endocrinology", label: "Endocrinology" },
    { value: "gastroenterology", label: "Gastroenterology" },
    { value: "pulmonology", label: "Pulmonology" },
    { value: "nephrology", label: "Nephrology" },
    { value: "other", label: "Other" },
];

const LANGUAGE_OPTIONS = [
    "English", "Igbo", "Yoruba", "Hausa", "Pidgin", "French", "Arabic"
];

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

// ─── ICONS (inline SVG, no deps) ────

const Icon = {
    cross: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12" />
        </svg>
    ),
    check: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6 9 17l-5-5" />
        </svg>
    ),
    plus: (
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
        </svg>
    ),
    arrow_left: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
    ),
    arrow_right: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
    ),
    camera: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
        </svg>
    ),
    shield: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="white" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
        </svg>
    ),
    info: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
        </svg>
    ),
};

// ─── INITIAL STATE ─────

const INIT = {
    email: "", password: "", phone: "",
    firstName: "", lastName: "", photo: "", whatsappNumber: "",
    specialty: "", yearsOfExperience: "", bio: "", languages: ["English"],
    qualifications: [{ degree: "", institution: "", year: "" }],
    licenseNumber: "", licenseExpiry: "",
    availabilitySchedule: [],
    consultationFee: "", currency: "NGN",
    certificateUrl: "",
};


const uploadToCloudinary = async (file, type = 'photo') => {
    const formData = new FormData();
    formData.append(type === 'photo' ? 'photo' : 'document', file);
    const endpoint = type === 'photo'
        ? `${route}/api/upload/photo/public`
        : `${route}/api/upload/document/public`;
    const res = await fetch(endpoint, { method: 'POST', body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Upload failed');
    return data.url; // Cloudinary URL
};



// ─── MAIN COMPONENT ───────

const Onboarding = ({ route }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [formData, setFormData] = useState(INIT);
    const photoRef = useRef(null);

    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [uploadingCert, setUploadingCert] = useState(false);

    // ── Auto-save / restore ──────
    useEffect(() => {
        const saved = localStorage.getItem("doctorOnboarding");
        if (saved) {
            try { setFormData(JSON.parse(saved)); } catch (_) { }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("doctorOnboarding", JSON.stringify(formData));
    }, [formData]);

    // ── Helpers ──────
    const update = (field, value) =>
        setFormData(prev => ({ ...prev, [field]: value }));

    const progress = Math.round((step / TOTAL_STEPS) * 100);

    // ── Validation ────
    const RULES = {
        1: { email: "required|email", password: "required|min:6", phone: "required" },
        2: { firstName: "required", lastName: "required" },
        3: { specialty: "required", yearsOfExperience: "required|number" },
        5: { licenseNumber: "required", licenseExpiry: "required" },
    };

    const runValidation = () => {
        const rules = RULES[step];
        if (!rules) return {};
        const errs = {};
        Object.entries(rules).forEach(([field, rule]) => {
            const val = String(formData[field] ?? "").trim();
            const parts = rule.split("|");
            if (parts.includes("required") && !val)
                errs[field] = "This field is required";
            else if (parts.includes("email") && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
                errs[field] = "Enter a valid email address";
            else if (parts.find(p => p.startsWith("min:"))) {
                const min = parseInt(parts.find(p => p.startsWith("min:")).split(":")[1]);
                if (val.length < min) errs[field] = `Minimum ${min} characters required`;
            } else if (parts.includes("number") && isNaN(Number(val)))
                errs[field] = "Must be a valid number";
        });
        return errs;
    };

    const next = () => {
        const errs = runValidation();
        if (Object.keys(errs).length) {
            setErrors(errs);
            setTouched(Object.fromEntries(Object.keys(errs).map(k => [k, true])));
            return;
        }
        setErrors({});
        setTouched({});
        setStep(p => p + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const back = () => {
        setErrors({});
        setTouched({});
        setStep(p => p - 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // ── Field helpers ────
    const field = (name, label, opts = {}) => (
        <div className="ob-field" key={name}>
            <label htmlFor={name}>
                {label}
                {opts.required !== false && <span className="req">*</span>}
            </label>
            {opts.type === "select" ? (
                <select
                    id={name}
                    className="ob-input ob-select"
                    value={formData[name]}
                    onChange={e => { update(name, e.target.value); setErrors(p => ({ ...p, [name]: "" })); }}
                >
                    <option value="">Select {label}</option>
                    {opts.options.map(o =>
                        <option key={o.value} value={o.value}>{o.label}</option>
                    )}
                </select>
            ) : opts.type === "textarea" ? (
                <textarea
                    id={name}
                    className="ob-input ob-textarea"
                    placeholder={opts.placeholder || ""}
                    value={formData[name]}
                    rows={opts.rows || 3}
                    onChange={e => update(name, e.target.value)}
                />
            ) : (
                <input
                    id={name}
                    type={opts.type || "text"}
                    className="ob-input"
                    placeholder={opts.placeholder || ""}
                    value={formData[name]}
                    onChange={e => { update(name, e.target.value); setErrors(p => ({ ...p, [name]: "" })); }}
                />
            )}
            {errors[name] && <span className="ob-error-msg">{Icon.info} {errors[name]}</span>}
        </div>
    );

    // ── Photo upload ─────
    const handlePhoto = e => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => update("photo", ev.target.result);
        reader.readAsDataURL(file);
    };

    // ── Language toggle ────
    const toggleLang = lang => {
        const curr = formData.languages;
        if (curr.includes(lang))
            update("languages", curr.filter(l => l !== lang));
        else
            update("languages", [...curr, lang]);
    };

    // ── Qualification helpers ───
    const updateQual = (i, key, val) => {
        const copy = formData.qualifications.map((q, idx) =>
            idx === i ? { ...q, [key]: val } : q
        );
        update("qualifications", copy);
    };

    const addQual = () =>
        update("qualifications", [...formData.qualifications, { degree: "", institution: "", year: "" }]);

    const removeQual = i =>
        update("qualifications", formData.qualifications.filter((_, idx) => idx !== i));

    // ── Availability helpers ────
    const updateSlot = (i, key, val) => {
        const copy = formData.availabilitySchedule.map((s, idx) =>
            idx === i ? { ...s, [key]: val } : s
        );
        update("availabilitySchedule", copy);
    };

    const addSlot = () =>
        update("availabilitySchedule", [
            ...formData.availabilitySchedule,
            { day: "monday", startTime: "08:00", endTime: "17:00" }
        ]);

    const removeSlot = i =>
        update("availabilitySchedule", formData.availabilitySchedule.filter((_, idx) => idx !== i));


    // ── Submit ────
    const submit = async () => {
        setLoading(true);
        console.log("Submitting form data:", formData, "to endpoint:", `${route}/api/doctors/register`);
        try {
            const res = await fetch(`${route}/api/doctors/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // body: JSON.stringify(formData),
                body: JSON.stringify({
                    ...formData,
                    certificateUrl: formData.certificateUrl || undefined,
                    yearsOfExperience: Number(formData.yearsOfExperience),
                    consultationFee: Number(formData.consultationFee) || 0,
                }),
            });
            const data = await res.json();
            if (res.status === 201) {
                if (data.token) {
                    localStorage.setItem("token", data.token);
                }
                if (data.data?.doctor) {
                    localStorage.setItem("doctorProfile", JSON.stringify({
                        ...data.data.doctor,
                        email: formData.email,
                        status: data.data.doctor.status || "pending",
                    }));
                }
                localStorage.removeItem("doctorOnboarding");
                navigate("/login");
            } else {
                swal.fire({
                    icon: "error",
                    title: "Registration Failed",
                    text: data.message || "Please try again."
                });
            }
        } catch {
            swal.fire({
                icon: "error",
                title: "Network Error",
                text: "Please check your connection and try again."
            });
        }
        setLoading(false);
    };

    // ─── STEP PANELS ───

    const renderAccountStep = () => (
        <>
            {field("email", "Email Address", { type: "email", placeholder: "doctor@example.com", required: true })}
            {field("phone", "Phone Number", { type: "tel", placeholder: "+234 800 000 0000", required: true })}
            {field("password", "Password", { type: "password", placeholder: "Min. 6 characters", required: true })}
        </>
    );

    const renderPersonalStep = () => (
        <>
            {/* Photo */}
            <input
                ref={photoRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploadingPhoto(true);
                    try {
                        const url = await uploadToCloudinary(file, 'photo');
                        update('photo', url);
                    } catch (err) {
                        alert('Photo upload failed: ' + err.message);
                    } finally {
                        setUploadingPhoto(false);
                    }
                }}
            />

            {/* And update the photo preview area to show uploading state: */}
            <div className="ob-photo-upload" onClick={() => photoRef.current?.click()}>
                <div className="ob-photo-preview">
                    {formData.photo
                        ? <img src={formData.photo} alt="Preview" />
                        : Icon.camera}
                </div>
                <div className="ob-photo-meta">
                    <strong>{uploadingPhoto ? 'Uploading…' : formData.photo ? 'Photo uploaded ✓' : 'Upload profile photo'}</strong>
                    <span>JPG, PNG or WebP · max 5 MB</span>
                </div>
            </div>

            <div className="ob-row">
                {field("firstName", "First Name", { placeholder: "Chidi", required: true })}
                {field("lastName", "Last Name", { placeholder: "Okafor", required: true })}
            </div>
            {field("whatsappNumber", "WhatsApp Number", {
                type: "tel",
                placeholder: "+234 800 000 0000",
                required: false,
            })}
            <p style={{ fontSize: "0.75rem", color: "var(--soft)", marginTop: "-10px" }}>
                Leave blank if same as phone number
            </p>
        </>
    );

    const renderProfessionalStep = () => (
        <>
            {field("specialty", "Specialty", {
                type: "select",
                options: SPECIALTIES,
                required: true,
            })}

            <div className="ob-row">
                {field("yearsOfExperience", "Years of Experience", {
                    placeholder: "e.g. 5",
                    required: true,
                })}
                <div className="ob-field">
                    <label>Languages Spoken</label>
                    <div className="ob-lang-grid">
                        {LANGUAGE_OPTIONS.map(lang => (
                            <button
                                key={lang}
                                type="button"
                                className={`ob-lang-chip${formData.languages.includes(lang) ? " selected" : ""}`}
                                onClick={() => toggleLang(lang)}
                            >
                                {formData.languages.includes(lang) && Icon.check}
                                {lang}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {field("bio", "Professional Bio", {
                type: "textarea",
                placeholder: "Tell patients about your background, approach, and areas of focus…",
                required: false,
                rows: 4,
            })}
        </>
    );

    const renderQualificationsStep = () => (
        <>
            <div className="ob-notice">
                {Icon.info}
                <span>Add all relevant degrees and certifications. These will be reviewed during verification.</span>
            </div>

            {formData.qualifications.map((q, i) => (
                <div className="ob-qual-card" key={i}>
                    <div className="ob-qual-card-header">
                        <span className="ob-qual-label">Qualification {i + 1}</span>
                        {formData.qualifications.length > 1 && (
                            <button
                                type="button"
                                className="ob-remove-btn"
                                onClick={() => removeQual(i)}
                                title="Remove"
                            >
                                {Icon.cross}
                            </button>
                        )}
                    </div>

                    <div className="ob-field">
                        <label>Degree / Certificate</label>
                        <input
                            className="ob-input"
                            placeholder="e.g. MBBS, MD, FMCP"
                            value={q.degree}
                            onChange={e => updateQual(i, "degree", e.target.value)}
                        />
                    </div>

                    <div className="ob-row">
                        <div className="ob-field">
                            <label>Institution</label>
                            <input
                                className="ob-input"
                                placeholder="University / College"
                                value={q.institution}
                                onChange={e => updateQual(i, "institution", e.target.value)}
                            />
                        </div>
                        <div className="ob-field">
                            <label>Year</label>
                            <input
                                className="ob-input"
                                type="number"
                                placeholder="e.g. 2015"
                                min="1950"
                                max={new Date().getFullYear()}
                                value={q.year}
                                onChange={e => updateQual(i, "year", e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            ))}

            <button type="button" className="ob-add-btn" onClick={addQual}>
                {Icon.plus} Add Another Qualification
            </button>
        </>
    );

    const renderLicenseStep = () => (
        <>
            <div className="ob-notice">
                {Icon.info}
                <span>
                    Ensure your MDCN licence details are accurate. You may be asked to upload a copy
                    during the verification stage.
                </span>
            </div>
            {field("licenseNumber", "Licence Number", {
                placeholder: "e.g. MDCN/L/2024/00001",
                required: true,
            })}
            {field("licenseExpiry", "Licence Expiry Date", { type: "date", required: true })}


            {/* Certificate upload */}
            <div className="ob-field">
                <label>
                    Medical certificate / MDCN license scan
                    <span style={{ fontSize: '0.72rem', color: '#9CA3AF', marginLeft: 6 }}>(optional but recommended)</span>
                </label>
                <div
                    className="ob-photo-upload"
                    onClick={() => document.getElementById('cert-upload')?.click()}
                    style={{ cursor: uploadingCert ? 'not-allowed' : 'pointer' }}
                >
                    <div className="ob-photo-preview">
                        {formData.certificateUrl ? (
                            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#10B981" strokeWidth="2">
                                <path d="M20 6 9 17l-5-5" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                            </svg>
                        )}
                    </div>
                    <div className="ob-photo-meta">
                        <strong>
                            {uploadingCert ? 'Uploading…' : formData.certificateUrl ? 'Document uploaded ✓' : 'Upload certificate or license scan'}
                        </strong>
                        <span>PDF, JPG or PNG · max 10 MB</span>
                    </div>
                </div>
                <input
                    id="cert-upload"
                    type="file"
                    accept="image/*,application/pdf"
                    style={{ display: 'none' }}
                    onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploadingCert(true);
                        try {
                            const url = await uploadToCloudinary(file, 'document');
                            update('certificateUrl', url);
                        } catch (err) {
                            alert('Certificate upload failed: ' + err.message);
                        } finally {
                            setUploadingCert(false);
                        }
                    }}
                />
            </div>
        </>
    );

    const renderAvailabilityStep = () => (
        <>
            {formData.availabilitySchedule.length === 0 && (
                <p style={{ fontSize: "0.85rem", color: "var(--soft)", marginBottom: "16px" }}>
                    Add the days and hours you are typically available for consultations.
                </p>
            )}

            {formData.availabilitySchedule.map((slot, i) => (
                <div className="ob-slot-card" key={i}>
                    <div className="ob-field" style={{ margin: 0 }}>
                        <label>Day</label>
                        <select
                            className="ob-input ob-select"
                            value={slot.day}
                            onChange={e => updateSlot(i, "day", e.target.value)}
                        >
                            {DAYS.map(d => (
                                <option key={d} value={d}>
                                    {d.charAt(0).toUpperCase() + d.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="ob-field" style={{ margin: 0 }}>
                        <label>Start Time</label>
                        <input
                            type="time"
                            className="ob-input"
                            value={slot.startTime}
                            onChange={e => updateSlot(i, "startTime", e.target.value)}
                        />
                    </div>

                    <div className="ob-field" style={{ margin: 0 }}>
                        <label>End Time</label>
                        <input
                            type="time"
                            className="ob-input"
                            value={slot.endTime}
                            onChange={e => updateSlot(i, "endTime", e.target.value)}
                        />
                    </div>

                    <button
                        type="button"
                        className="ob-remove-btn"
                        onClick={() => removeSlot(i)}
                        style={{ alignSelf: "center", marginTop: "18px" }}
                    >
                        {Icon.cross}
                    </button>
                </div>
            ))}

            <button type="button" className="ob-add-btn" onClick={addSlot}>
                {Icon.plus} Add Availability Slot
            </button>
        </>
    );

    const renderPricingStep = () => (
        <>
            <div className="ob-field">
                <label htmlFor="consultationFee">
                    Consultation Fee <span className="req">*</span>
                </label>
                <div className="ob-fee-wrap">
                    <span className="ob-currency">₦</span>
                    <input
                        id="consultationFee"
                        type="number"
                        className="ob-input"
                        placeholder="0.00"
                        min="0"
                        value={formData.consultationFee}
                        onChange={e => update("consultationFee", e.target.value)}
                    />
                </div>
                <p style={{ fontSize: "0.75rem", color: "var(--soft)", marginTop: "4px" }}>
                    Set to 0 for free consultations. You can update this anytime from your dashboard.
                </p>
            </div>
        </>
    );

    const RenderReviewItem = ({ label, value }) => (
        <div className="ob-review-item">
            <label>{label}</label>
            <span>{value || <span style={{ color: "var(--soft)" }}>—</span>}</span>
        </div>
    );

    const renderReviewStep = () => (
        <>
            <div className="ob-notice">
                {Icon.info}
                <span>
                    Please review your information before submitting. Your account will be in
                    <strong> pending</strong> status until our team verifies your licence.
                </span>
            </div>

            <div className="ob-review-section">
                <p className="ob-review-section-title">Account</p>
                <div className="ob-review-grid">
                    <RenderReviewItem label="Email" value={formData.email} />
                    <RenderReviewItem label="Phone" value={formData.phone} />
                    <RenderReviewItem label="WhatsApp" value={formData.whatsappNumber || formData.phone} />
                </div>
            </div>

            <div className="ob-review-section">
                <p className="ob-review-section-title">Personal</p>
                <div className="ob-review-grid">
                    <RenderReviewItem label="First Name" value={formData.firstName} />
                    <RenderReviewItem label="Last Name" value={formData.lastName} />
                </div>
            </div>

            <div className="ob-review-section">
                <p className="ob-review-section-title">Professional</p>
                <div className="ob-review-grid">
                    <RenderReviewItem
                        label="Specialty"
                        value={SPECIALTIES.find(s => s.value === formData.specialty)?.label}
                    />
                    <RenderReviewItem label="Years of Exp." value={formData.yearsOfExperience} />
                    <RenderReviewItem label="Languages" value={formData.languages.join(", ")} />
                    <RenderReviewItem label="Licence No." value={formData.licenseNumber} />
                    <RenderReviewItem
                        label="Licence Expiry"
                        value={formData.licenseExpiry
                            ? new Date(formData.licenseExpiry).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })
                            : ""}
                    />
                    <RenderReviewItem
                        label="Consultation Fee"
                        value={formData.consultationFee ? `₦${Number(formData.consultationFee).toLocaleString()}` : "Free"}
                    />
                </div>
            </div>

            {formData.qualifications.length > 0 && formData.qualifications[0].degree && (
                <div className="ob-review-section">
                    <p className="ob-review-section-title">Qualifications</p>
                    {formData.qualifications.map((q, i) => (
                        <div key={i} style={{ marginBottom: 6 }}>
                            <div className="ob-review-grid">
                                <RenderReviewItem label="Degree" value={q.degree} />
                                <RenderReviewItem label="Institution" value={q.institution} />
                                <RenderReviewItem label="Year" value={q.year} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {formData.availabilitySchedule.length > 0 && (
                <div className="ob-review-section">
                    <p className="ob-review-section-title">Availability</p>
                    {formData.availabilitySchedule.map((s, i) => (
                        <div key={i} style={{ display: "flex", gap: 16, marginBottom: 6 }}>
                            <div className="ob-review-item">
                                <label>Day</label>
                                <span style={{ textTransform: "capitalize" }}>{s.day}</span>
                            </div>
                            <div className="ob-review-item">
                                <label>Start</label>
                                <span>{s.startTime}</span>
                            </div>
                            <div className="ob-review-item">
                                <label>End</label>
                                <span>{s.endTime}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="ob-review-section">
                <p className="ob-review-section-title">Account Status</p>
                <span className="ob-review-badge pending">⏳ Pending Verification</span>
            </div>
        </>
    );

    const STEP_SUBTITLES = [
        "Set up your login credentials to get started.",
        "Help patients know who they're consulting with.",
        "Share your area of expertise and background.",
        "List the degrees and certifications you hold.",
        "Provide your MDCN licence details for verification.",
        "Let patients know when you're typically available.",
        "Set your per-consultation fee in Naira.",
        "Everything looks good? Go ahead and submit.",
    ];

    const renderStep = () => {
        switch (step) {
            case 1: return renderAccountStep();
            case 2: return renderPersonalStep();
            case 3: return renderProfessionalStep();
            case 4: return renderQualificationsStep();
            case 5: return renderLicenseStep();
            case 6: return renderAvailabilityStep();
            case 7: return renderPricingStep();
            case 8: return renderReviewStep();
            default: return null;
        }
    };

    // ─── RENDER ──────────────────────────────────────────────────────────────────

    return (
        <div className="ob-page">

            {/* ── Main ── */}
            <main className="ob-main">
                <div className="ob-content">

                    {/* Progress */}
                    <div className="ob-progress">
                        <div className="ob-progress-bar">
                            <div className="ob-progress-fill" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="ob-progress-meta">
                            <span>Step {step} of {TOTAL_STEPS}</span>
                            <span>{progress}% complete</span>
                        </div>
                    </div>

                    {/* Step Panel */}
                    <div className="ob-panel" key={step}>
                        <div className="ob-step-head">
                            <div className="ob-step-tag">
                                Step {step}: {STEP_META[step - 1].label}
                            </div>
                            <h1 className="ob-step-title">
                                {STEP_META[step - 1].label === "Review"
                                    ? "Almost there!"
                                    : STEP_META[step - 1].label}
                            </h1>
                            <p className="ob-step-subtitle">
                                {STEP_SUBTITLES[step - 1]}
                            </p>
                        </div>

                        {renderStep()}
                    </div>

                    {/* Navigation */}
                    <div className="ob-nav">
                        <div className="ob-nav-left">
                            {step > 1 && (
                                <button className="ob-btn-back" onClick={back} type="button">
                                    {Icon.arrow_left} Back
                                </button>
                            )}
                        </div>

                        {step < TOTAL_STEPS ? (
                            <button className="ob-btn-next" onClick={next} type="button">
                                Continue {Icon.arrow_right}
                            </button>
                        ) : (
                            <button
                                className="ob-btn-next ob-btn-submit"
                                onClick={submit}
                                disabled={loading}
                                type="button"
                            >
                                {loading ? (
                                    <>
                                        <span style={{
                                            width: 14, height: 14, border: "2px solid rgba(255,255,255,.4)",
                                            borderTopColor: "white", borderRadius: "50%",
                                            animation: "ob-spin .7s linear infinite",
                                            display: "inline-block"
                                        }} />
                                        Submitting…
                                    </>
                                ) : (
                                    // <>{Icon.check} Submit Application</>
                                    <>{Icon.check} Submit </>
                                )}
                            </button>
                        )}
                    </div>

                    {/* Login link */}
                    <p style={{
                        textAlign: 'center',
                        marginTop: '24px',
                        fontSize: '0.85rem',
                        color: 'var(--soft)',
                    }}>
                        Already have an account?{' '}
                        <span
                            onClick={() => navigate('/login')}
                            style={{ color: 'var(--teal)', fontWeight: 600, cursor: 'pointer' }}
                        >
                            Log in
                        </span>
                    </p>

                </div>
            </main>

            <style>{`
        @keyframes ob-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default Onboarding;
