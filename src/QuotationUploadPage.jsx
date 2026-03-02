import { useState, useRef, useEffect } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────
const ScanIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" y1="12" x2="17" y2="12"/></svg>;
const CheckIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const PencilIcon = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const TrashIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
const PlusIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const ZapIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const EyeIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const BackIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;

// ─── Mock OCR ─────────────────────────────────────────────────────────────────
const mockOCR = async () => {
  await new Promise(r => setTimeout(r, 2400));
  return [
    { id: 1, srNo: "1", productName: "LED Panel 40W", qty: "10", unit: "Pcs", rate: "850", discount: "10%", amount: "7650" },
    { id: 2, srNo: "2", productName: "MCB 32A DP", qty: "5", unit: "Nos", rate: "1200", discount: "8%", amount: "5520" },
    { id: 3, srNo: "3", productName: "PVC Conduit 25mm", qty: "30", unit: "Mtr", rate: "45", discount: "5%", amount: "1282" },
    { id: 4, srNo: "4", productName: "Cable 4mm 3C", qty: "100", unit: "Mtr", rate: "180", discount: "12%", amount: "15840" },
  ];
};

// ─── Step Indicator ───────────────────────────────────────────────────────────
const Steps = ({ current }) => {
  const steps = ["Verify", "Scan", "Review"];
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
      {steps.map((label, i) => {
        const done = i < current, active = i === current;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, transition: "all 0.3s",
                border: `2px solid ${done ? "#22d3ee" : active ? "#22d3ee" : "#374151"}`,
                background: done ? "#22d3ee" : active ? "rgba(34,211,238,0.1)" : "#111827",
                color: done ? "#030712" : active ? "#22d3ee" : "#4b5563",
                boxShadow: active ? "0 0 12px rgba(34,211,238,0.35)" : "none"
              }}>{done ? <CheckIcon /> : i + 1}</div>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: active ? "#22d3ee" : done ? "#0891b2" : "#4b5563" }}>{label}</span>
            </div>
            {i < steps.length - 1 && <div style={{ flex: 1, height: 1, margin: "0 6px", marginBottom: 18, background: done ? "#22d3ee" : "#1f2937", transition: "background 0.5s" }} />}
          </div>
        );
      })}
    </div>
  );
};

// ─── Labelled input ───────────────────────────────────────────────────────────
const Field = ({ label, ...p }) => (
  <div>
    <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{label}</label>
    <input style={{ width: "100%", background: "#0a0e14", border: "1px solid #2d3748", borderRadius: 10, padding: "13px 14px", fontSize: 15, color: "#f3f4f6", outline: "none", WebkitAppearance: "none", fontFamily: "inherit", boxSizing: "border-box" }}
      onFocus={e => e.target.style.borderColor = "#22d3ee"}
      onBlur={e => e.target.style.borderColor = "#2d3748"}
      {...p} />
  </div>
);

// ─── STEP 1: VERIFICATION ────────────────────────────────────────────────────
const VerificationStep = ({ onVerified }) => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [sending, setSending] = useState(false);
  const refs = useRef([]);

  const sendOTP = async () => {
    if (phone.length < 10) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 1100));
    setSending(false); setOtpSent(true);
  };
  const changeOtp = (val, i) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[i] = val; setOtp(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };
  const keyOtp = (e, i) => { if (e.key === "Backspace" && !otp[i] && i > 0) refs.current[i - 1]?.focus(); };
  const verify = async () => {
    setVerifying(true);
    await new Promise(r => setTimeout(r, 900));
    setVerified(true);
    setTimeout(onVerified, 600);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#f9fafb", marginBottom: 4 }}>Dealer Verification</h2>
        <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>Authenticate your account to proceed.</p>
      </div>
      <Field label="Distributor / Dealer Name" placeholder="e.g. Sharma Electricals Pvt. Ltd." />
      <Field label="City / State" placeholder="e.g. Mumbai, Maharashtra" />

      <div>
        <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Phone Number</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            style={{ flex: 1, background: "#0a0e14", border: "1px solid #2d3748", borderRadius: 10, padding: "13px 14px", fontSize: 15, color: "#f3f4f6", outline: "none", opacity: otpSent ? 0.4 : 1, fontFamily: "inherit", WebkitAppearance: "none", minWidth: 0 }}
            placeholder="+91 XXXXX XXXXX" value={phone} inputMode="numeric"
            onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
            disabled={otpSent}
            onFocus={e => e.target.style.borderColor = "#22d3ee"}
            onBlur={e => e.target.style.borderColor = "#2d3748"}
          />
          <button onClick={sendOTP} disabled={phone.length < 10 || otpSent || sending}
            style={{
              padding: "0 16px", borderRadius: 10, fontSize: 12, fontWeight: 700, border: "none",
              cursor: phone.length >= 10 && !otpSent && !sending ? "pointer" : "not-allowed",
              background: otpSent ? "#0e4f5c" : phone.length < 10 || sending ? "#1f2937" : "#22d3ee",
              color: otpSent ? "#22d3ee" : phone.length < 10 || sending ? "#4b5563" : "#030712",
              fontFamily: "inherit", whiteSpace: "nowrap", flexShrink: 0, minHeight: 48
            }}>{sending ? "Sending…" : otpSent ? "✓ Sent" : "Send OTP"}</button>
        </div>
      </div>

      {otpSent && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Enter OTP</label>
            <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
              {otp.map((d, i) => (
                <input key={i} ref={el => refs.current[i] = el}
                  style={{ flex: 1, minWidth: 0, height: 52, background: "#0a0e14", border: `2px solid ${d ? "#22d3ee" : "#2d3748"}`, borderRadius: 10, textAlign: "center", fontSize: 20, fontWeight: 700, color: "#22d3ee", outline: "none", fontFamily: "monospace", WebkitAppearance: "none" }}
                  maxLength={1} value={d} inputMode="numeric"
                  onChange={e => changeOtp(e.target.value, i)}
                  onKeyDown={e => keyOtp(e, i)}
                />
              ))}
            </div>
          </div>
          <button onClick={verify} disabled={otp.some(d => !d) || verifying || verified}
            style={{
              width: "100%", padding: "15px", borderRadius: 12, fontSize: 15, fontWeight: 700, border: "none",
              cursor: otp.some(d => !d) || verifying || verified ? "not-allowed" : "pointer",
              background: verified ? "#16a34a" : verifying ? "#0e7490" : otp.some(d => !d) ? "#1f2937" : "#22d3ee",
              color: verified || verifying || otp.some(d => !d) ? "#f3f4f6" : "#030712",
              fontFamily: "inherit", transition: "all 0.2s",
              boxShadow: !otp.some(d => !d) && !verifying && !verified ? "0 0 20px rgba(34,211,238,0.3)" : "none"
            }}>{verified ? "✓ Verified!" : verifying ? "Verifying…" : "Verify & Continue"}</button>
        </div>
      )}
    </div>
  );
};

// ─── STEP 2: SCAN ─────────────────────────────────────────────────────────────
const ScanStep = ({ onExtracted, onBack }) => {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cameraOn, setCameraOn] = useState(false);
  const [camError, setCamError] = useState(null);
  const fileRef = useRef();
  const cameraInputRef = useRef();
  const videoRef = useRef();
  const streamRef = useRef(null);

  const handleFile = (f) => {
    if (!f || !f.type.startsWith("image/")) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target.result);
    reader.readAsDataURL(f);
  };

  const openCamera = async () => {
    setCamError(null);
    if (!navigator.mediaDevices?.getUserMedia) { cameraInputRef.current?.click(); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 960 } } });
      streamRef.current = stream;
      setCameraOn(true);
      setTimeout(() => { if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play().catch(() => {}); } }, 50);
    } catch (err) {
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") setCamError("permission");
      else cameraInputRef.current?.click();
    }
  };

  const stopStream = () => { streamRef.current?.getTracks().forEach(t => t.stop()); streamRef.current = null; };
  const closeCamera = () => { stopStream(); setCameraOn(false); };

  const capture = () => {
    const v = videoRef.current; if (!v) return;
    const c = document.createElement("canvas");
    c.width = v.videoWidth || 1280; c.height = v.videoHeight || 960;
    c.getContext("2d").drawImage(v, 0, 0);
    setPreview(c.toDataURL("image/jpeg", 0.92));
    c.toBlob(blob => setFile(new File([blob], "capture.jpg", { type: "image/jpeg" })), "image/jpeg", 0.92);
    stopStream(); setCameraOn(false);
  };

  const scan = async () => {
    if (!file) return;
    setScanning(true); setProgress(0);
    const t = setInterval(() => setProgress(p => Math.min(p + Math.random() * 14, 88)), 170);
    const result = await mockOCR();
    clearInterval(t); setProgress(100);
    await new Promise(r => setTimeout(r, 300));
    setScanning(false);
    onExtracted(result, preview);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 13, fontWeight: 600, fontFamily: "inherit", padding: 0, WebkitTapHighlightColor: "transparent" }}
        onTouchStart={e => e.currentTarget.style.color = "#22d3ee"}
        onTouchEnd={e => e.currentTarget.style.color = "#6b7280"}
      ><BackIcon /> Back to Verify</button>

      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#f9fafb", marginBottom: 4 }}>Scan Handwritten Table</h2>
        <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>Capture your quotation sheet to extract data.</p>
      </div>

      {/* Hidden inputs */}
      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />

      {/* Option cards */}
      {!preview && !cameraOn && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {camError === "permission" && (
            <div style={{ padding: "12px 14px", borderRadius: 12, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 16 }}>⚠️</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fca5a5", marginBottom: 2 }}>Camera permission denied</div>
                <div style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.5 }}>Allow camera in browser settings or use Upload below.</div>
              </div>
              <button onClick={() => setCamError(null)} style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: 16, padding: 0 }}>✕</button>
            </div>
          )}

          {/* Camera */}
          <button onClick={openCamera} style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 16px", borderRadius: 14, border: "1px solid #2d3748", background: "#0a0e14", cursor: "pointer", fontFamily: "inherit", textAlign: "left", WebkitTapHighlightColor: "transparent", width: "100%" }}
            onTouchStart={e => e.currentTarget.style.background = "rgba(34,211,238,0.06)"}
            onTouchEnd={e => e.currentTarget.style.background = "#0a0e14"}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, flexShrink: 0, background: "linear-gradient(135deg,#0e4f5c,#0891b2)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 16px rgba(34,211,238,0.2)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#f3f4f6", marginBottom: 2 }}>Open Camera</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>Live viewfinder — rear camera</div>
            </div>
            <span style={{ color: "#4b5563", fontSize: 22 }}>›</span>
          </button>

          {/* Upload */}
          <button onClick={() => fileRef.current?.click()} style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 16px", borderRadius: 14, border: "1px solid #2d3748", background: "#0a0e14", cursor: "pointer", fontFamily: "inherit", textAlign: "left", WebkitTapHighlightColor: "transparent", width: "100%" }}
            onTouchStart={e => e.currentTarget.style.background = "rgba(74,222,128,0.05)"}
            onTouchEnd={e => e.currentTarget.style.background = "#0a0e14"}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, flexShrink: 0, background: "linear-gradient(135deg,#1a2f1a,#166534)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 16px rgba(34,197,94,0.15)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#f3f4f6", marginBottom: 2 }}>Upload from Files</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>Gallery or files — JPG, PNG, HEIC</div>
            </div>
            <span style={{ color: "#4b5563", fontSize: 22 }}>›</span>
          </button>
        </div>
      )}

      {/* Live camera viewfinder */}
      {cameraOn && !preview && (
        <div style={{ position: "relative", width: "100%", paddingBottom: "133.33%", borderRadius: 18, overflow: "hidden", background: "#000" }}>
          <video ref={videoRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} autoPlay muted playsInline />
          {[
            { top: 14, left: 14, borderTop: "3px solid #22d3ee", borderLeft: "3px solid #22d3ee", borderRadius: "6px 0 0 0" },
            { top: 14, right: 14, borderTop: "3px solid #22d3ee", borderRight: "3px solid #22d3ee", borderRadius: "0 6px 0 0" },
            { bottom: 96, left: 14, borderBottom: "3px solid #22d3ee", borderLeft: "3px solid #22d3ee", borderRadius: "0 0 0 6px" },
            { bottom: 96, right: 14, borderBottom: "3px solid #22d3ee", borderRight: "3px solid #22d3ee", borderRadius: "0 0 6px 0" },
          ].map((s, i) => <div key={i} style={{ position: "absolute", width: 28, height: 28, ...s }} />)}
          <div style={{ position: "absolute", left: 14, right: 14, top: 14, bottom: 96, overflow: "hidden", pointerEvents: "none" }}>
            <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,#22d3ee,transparent)", animation: "scanLine 2s ease-in-out infinite" }} />
          </div>
          <div style={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", background: "rgba(3,7,18,0.8)", padding: "5px 12px", borderRadius: 99 }}>
            <span style={{ fontSize: 10, color: "#9ca3af", fontFamily: "monospace", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>ALIGN TABLE WITHIN FRAME</span>
          </div>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 96, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", background: "linear-gradient(to top,rgba(3,7,18,0.97) 60%,transparent)" }}>
            <button onClick={closeCamera} style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "#9ca3af", fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            <button onClick={capture}
              onTouchStart={e => e.currentTarget.style.transform = "scale(0.88)"}
              onTouchEnd={e => { e.currentTarget.style.transform = "scale(1)"; capture(); }}
              onMouseDown={e => e.currentTarget.style.transform = "scale(0.88)"}
              onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
              style={{ width: 72, height: 72, borderRadius: "50%", border: "4px solid #22d3ee", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 28px rgba(34,211,238,0.5)", cursor: "pointer", transition: "transform 0.12s" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#22d3ee" }} />
            </button>
            <div style={{ width: 48 }} />
          </div>
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div style={{ position: "relative", width: "100%", paddingBottom: "133.33%", borderRadius: 18, overflow: "hidden", background: "#0a0e14", border: "1px solid #2d3748" }}>
          <img src={preview} alt="Scanned" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }} />
          {!scanning && <button onClick={() => { setPreview(null); setFile(null); }} style={{ position: "absolute", top: 12, right: 12, width: 36, height: 36, borderRadius: "50%", background: "rgba(17,24,39,0.92)", color: "#9ca3af", border: "1px solid #374151", cursor: "pointer", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>}
          {scanning && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(3,7,18,0.88)", backdropFilter: "blur(6px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
              <div style={{ width: 44, height: 44, border: "2px solid #22d3ee", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              <div style={{ width: "60%", height: 4, background: "#1f2937", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: "#22d3ee", borderRadius: 99, transition: "width 0.2s" }} />
              </div>
              <span style={{ fontSize: 12, color: "#22d3ee", fontFamily: "monospace", letterSpacing: "0.1em" }}>EXTRACTING… {Math.round(progress)}%</span>
            </div>
          )}
        </div>
      )}

      {preview && !scanning && (
        <button onClick={scan} style={{ width: "100%", padding: "16px", borderRadius: 14, fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#22d3ee", color: "#030712", boxShadow: "0 0 24px rgba(34,211,238,0.3)", fontFamily: "inherit", WebkitTapHighlightColor: "transparent" }}>
          <ScanIcon /> Extract with OCR
        </button>
      )}
    </div>
  );
};

// ─── Editable Table Cell ──────────────────────────────────────────────────────
const EditCell = ({ value, onChange, numeric, placeholder = "" }) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  if (editing) return (
    <input ref={inputRef} value={value} placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      onBlur={() => setEditing(false)}
      onKeyDown={e => e.key === "Enter" && setEditing(false)}
      inputMode={numeric ? "decimal" : "text"}
      style={{ width: "100%", background: "rgba(34,211,238,0.08)", border: "1px solid #22d3ee", borderRadius: 6, padding: "6px 6px", fontSize: 12, color: "#a5f3fc", outline: "none", textAlign: numeric ? "right" : "left", fontFamily: numeric ? "monospace" : "inherit", boxSizing: "border-box" }}
    />
  );
  return (
    <div onClick={() => setEditing(true)} style={{ display: "flex", alignItems: "center", gap: 3, padding: "6px", borderRadius: 6, cursor: "text", minHeight: 32, justifyContent: numeric ? "flex-end" : "flex-start" }}>
      <span style={{ fontSize: 12, color: value ? "#e5e7eb" : "#4b5563", fontStyle: value ? "normal" : "italic", fontFamily: numeric ? "monospace" : "inherit", wordBreak: "break-word" }}>{value || placeholder}</span>
      <span style={{ color: "#22d3ee", opacity: 0.5, flexShrink: 0 }}><PencilIcon /></span>
    </div>
  );
};

// ─── Row item ─────────────────────────────────────────────────────────────────
const RowItem = ({ row, ri, cols, onUpdate, onDelete }) => {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ borderBottom: "1px solid #111827", background: hover ? "rgba(255,255,255,0.02)" : "transparent" }}>
      {/* Mobile: stacked card layout */}
      <div style={{ padding: "10px 12px 4px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.08em" }}>#{row.srNo || ri + 1}</span>
          <button onClick={() => onDelete(row.id)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#ef4444", padding: 4, display: "flex", alignItems: "center" }}><TrashIcon /></button>
        </div>
        {/* Product name — full width */}
        <div style={{ marginBottom: 6 }}>
          <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>Product</div>
          <EditCell value={row.productName} onChange={v => onUpdate(row.id, "productName", v)} placeholder="Product name" />
        </div>
        {/* 3-col row: qty, unit, discount */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 6 }}>
          {[["qty", "Qty", true], ["unit", "Unit", false], ["discount", "Disc %", false]].map(([key, label, num]) => (
            <div key={key}>
              <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
              <EditCell value={row[key]} onChange={v => onUpdate(row.id, key, v)} numeric={num} placeholder="—" />
            </div>
          ))}
        </div>
        {/* 2-col row: rate, amount */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, paddingBottom: 6 }}>
          {[["rate", "Rate ₹", true], ["amount", "Amount ₹", true]].map(([key, label, num]) => (
            <div key={key}>
              <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
              <EditCell value={row[key]} onChange={v => onUpdate(row.id, key, v)} numeric={num} placeholder="—" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── STEP 3: REVIEW ───────────────────────────────────────────────────────────
const ReviewStep = ({ data, imagePreview, onSubmit, onBack }) => {
  const [rows, setRows] = useState(data);
  const [submitted, setSubmitted] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  const cols = []; // kept for RowItem compat (unused now — stacked layout)
  const updateCell = (id, key, val) => setRows(r => r.map(row => row.id === id ? { ...row, [key]: val } : row));
  const addRow = () => setRows(r => [...r, { id: Date.now(), srNo: String(r.length + 1), productName: "", qty: "", unit: "Pcs", rate: "", discount: "", amount: "" }]);
  const deleteRow = (id) => setRows(r => r.filter(row => row.id !== id));
  const total = rows.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);

  const handleSubmit = async () => {
    setSubmitted(true);
    await new Promise(r => setTimeout(r, 700));
    onSubmit(rows);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Back */}
      <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 13, fontWeight: 600, fontFamily: "inherit", padding: 0, WebkitTapHighlightColor: "transparent" }}
        onTouchStart={e => e.currentTarget.style.color = "#22d3ee"}
        onTouchEnd={e => e.currentTarget.style.color = "#6b7280"}
      ><BackIcon /> Back to Scan</button>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#f9fafb", marginBottom: 3 }}>Review Table</h2>
          <p style={{ fontSize: 12, color: "#6b7280" }}>Tap any field to edit OCR results.</p>
        </div>
        {imagePreview && (
          <button onClick={() => setShowOriginal(v => !v)} style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: "#22d3ee", border: "1px solid rgba(34,211,238,0.3)", padding: "8px 12px", borderRadius: 8, background: "rgba(34,211,238,0.06)", cursor: "pointer", fontFamily: "inherit", WebkitTapHighlightColor: "transparent" }}>
            <EyeIcon /> {showOriginal ? "Hide" : "Original"}
          </button>
        )}
      </div>

      {showOriginal && imagePreview && (
        <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #2d3748" }}>
          <div style={{ padding: "7px 12px", background: "#161b22", borderBottom: "1px solid #2d3748" }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em" }}>Original Scan</span>
          </div>
          <img src={imagePreview} alt="Original" style={{ width: "100%", objectFit: "contain", maxHeight: 260, display: "block" }} />
        </div>
      )}

      {/* Stacked card rows */}
      <div style={{ borderRadius: 14, border: "1px solid #1f2937", overflow: "hidden" }}>
        <div style={{ padding: "8px 12px", background: "#161b22", borderBottom: "1px solid #1f2937", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em" }}>{rows.length} Items — tap any field to edit</span>
        </div>

        {rows.map((row, ri) => (
          <RowItem key={row.id} row={row} ri={ri} cols={cols} onUpdate={updateCell} onDelete={deleteRow} />
        ))}

        <div style={{ padding: "10px 14px", borderTop: "1px solid #111827" }}>
          <button onClick={addRow} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#6b7280", background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit", padding: "4px 0", WebkitTapHighlightColor: "transparent" }}>
            <PlusIcon /> Add Row
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderTop: "1px solid #1f2937", background: "#0a0e14" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.08em" }}>Total</span>
          <span style={{ fontSize: 20, fontWeight: 700, color: "#22d3ee", fontFamily: "monospace" }}>₹ {total.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <button onClick={handleSubmit} disabled={submitted || rows.length === 0}
        style={{
          width: "100%", padding: "16px", borderRadius: 14, fontSize: 15, fontWeight: 700, border: "none",
          cursor: submitted || rows.length === 0 ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          background: submitted ? "#16a34a" : rows.length === 0 ? "#1f2937" : "#22d3ee",
          color: submitted ? "#fff" : rows.length === 0 ? "#4b5563" : "#030712",
          boxShadow: !submitted && rows.length > 0 ? "0 0 24px rgba(34,211,238,0.3)" : "none",
          fontFamily: "inherit", letterSpacing: "0.05em", WebkitTapHighlightColor: "transparent", transition: "all 0.2s"
        }}>
        {submitted ? "✓ Quotation Generated!" : <><ZapIcon /> Generate Quotation</>}
      </button>
    </div>
  );
};

// ─── Success ──────────────────────────────────────────────────────────────────
const Success = ({ onReset }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 0", gap: 20, textAlign: "center" }}>
    <div style={{ width: 80, height: 80, borderRadius: "50%", fontSize: 36, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(22,163,74,0.1)", border: "2px solid rgba(22,163,74,0.4)", boxShadow: "0 0 32px rgba(34,197,94,0.2)" }}>🎉</div>
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f9fafb", marginBottom: 8 }}>Quotation Submitted!</h2>
      <p style={{ fontSize: 13, color: "#6b7280", maxWidth: 260, margin: "0 auto", lineHeight: 1.6 }}>Your quotation has been generated. The dealer will receive a confirmation shortly.</p>
    </div>
    <button onClick={onReset} style={{ padding: "12px 28px", borderRadius: 12, border: "1px solid #2d3748", background: "transparent", fontSize: 14, fontWeight: 600, color: "#9ca3af", cursor: "pointer", fontFamily: "inherit", WebkitTapHighlightColor: "transparent" }}>
      ↩ Start New
    </button>
  </div>
);

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState(0);
  const [ocrData, setOcrData] = useState(null);
  const [imagePrev, setImagePrev] = useState(null);
  const [done, setDone] = useState(false);
  const reset = () => { setStep(0); setOcrData(null); setImagePrev(null); setDone(false); };

  return (
    <div style={{ minHeight: "100vh", minHeight: "100dvh", background: "linear-gradient(160deg,#030712 0%,#0a0d14 60%,#020a08 100%)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        *, *::before, *::after { font-family: 'IBM Plex Sans', sans-serif; box-sizing: border-box; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        body { overscroll-behavior: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes scanLine { 0%,100% { top: 0; } 50% { top: calc(100% - 2px); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }
        .fade { animation: fadeIn 0.25s ease; }
        input { -webkit-appearance: none; appearance: none; }
        button { -webkit-tap-highlight-color: transparent; }
      `}</style>

      {/* Safe-area aware wrapper */}
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "env(safe-area-inset-top, 16px) 16px env(safe-area-inset-bottom, 24px)" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 16, paddingBottom: 24 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg,#22d3ee,#0891b2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#030712", flexShrink: 0, boxShadow: "0 0 20px rgba(34,211,238,0.35)" }}><ScanIcon /></div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#f9fafb", lineHeight: 1.2 }}>QuotaSnap <span style={{ fontSize: 9, color: "#4b5563", fontFamily: "monospace" }}>v2</span></div>
            <div style={{ fontSize: 9, color: "#4b5563", fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase" }}>Handwritten → Digital</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
            <span style={{ fontSize: 9, color: "#4b5563", fontFamily: "monospace", letterSpacing: "0.08em" }}>LIVE</span>
          </div>
        </div>

        {/* Card */}
        <div style={{ background: "rgba(10,14,20,0.97)", borderRadius: 20, border: "1px solid #1a2030", padding: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.02)" }}>
          {!done && <Steps current={step} />}
          <div className="fade" key={step + (done ? "-done" : "")}>
            {done ? <Success onReset={reset} />
              : step === 0 ? <VerificationStep onVerified={() => setStep(1)} />
              : step === 1 ? <ScanStep onExtracted={(d, p) => { setOcrData(d); setImagePrev(p); setStep(2); }} onBack={() => setStep(0)} />
              : <ReviewStep data={ocrData} imagePreview={imagePrev} onSubmit={() => setDone(true)} onBack={() => { setOcrData(null); setImagePrev(null); setStep(1); }} />
            }
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 9, color: "#1f2937", fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 20, paddingBottom: 8 }}>
          Secured · OCR Powered · Encrypted
        </p>
      </div>
    </div>
  );
}
