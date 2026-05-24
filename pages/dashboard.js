import { useState, useEffect, useRef } from "react";

// ── Design tokens (match landing page exactly) ────────────────────────────────
const C = {
  espresso: "#2a2118",
  espressoDark: "#1a1410",
  espressoDeep: "#111009",
  gold: "#c9a97a",
  goldLight: "#e8d8c0",
  cream: "#faf8f4",
  creamMid: "#f2ead8",
  creamBorder: "#e0d4c4",
  text: "#1a1410",
  textMid: "#3d2e1e",
  textLight: "#6b5c4d",
  textFaint: "#8a7a6a",
  green: "#2e7d32",
  greenBg: "#e8f5e9",
  red: "#b91c1c",
  redBg: "#fce8e8",
  amber: "#92400e",
  amberBg: "#fef3c7",
};

// ── Logo mark ─────────────────────────────────────────────────────────────────
function LogoMark({ size = 32, dark = false }) {
  const bg = dark ? C.gold : C.espresso;
  const fg = dark ? C.espressoDeep : C.cream;
  const gold = dark ? C.espressoDeep : C.gold;
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
      <path d="M36 2 L70 36 L36 70 L2 36 Z" fill={bg}/>
      <path d="M36 10 L62 36 L36 62 L10 36 Z" fill="none" stroke={gold} strokeWidth="1.5" opacity="0.3"/>
      <line x1="22" y1="24" x2="22" y2="48" stroke={fg} strokeWidth="3" strokeLinecap="round"/>
      <line x1="22" y1="24" x2="38" y2="24" stroke={fg} strokeWidth="3" strokeLinecap="round"/>
      <line x1="22" y1="34" x2="34" y2="34" stroke={fg} strokeWidth="3" strokeLinecap="round"/>
      <polyline points="32,40 39,49 52,30" fill="none" stroke={gold} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ── Status pill ───────────────────────────────────────────────────────────────
function StatusPill({ status }) {
  const map = {
    Confirmed: { bg: C.greenBg, color: C.green },
    Declined:  { bg: C.redBg,   color: C.red   },
    Pending:   { bg: C.amberBg, color: C.amber  },
  };
  const s = map[status] || map.Pending;
  return (
    <span style={{
      display:"inline-block", padding:"3px 12px", borderRadius:10,
      fontSize:11.5, fontWeight:700, letterSpacing:"0.04em",
      background:s.bg, color:s.color, fontFamily:"'DM Sans',sans-serif",
      textTransform:"uppercase",
    }}>{status}</span>
  );
}

// ── Fake auth code store ──────────────────────────────────────────────────────
const AUTH_EMAIL = "garrett.warner@outlook.com";
let pendingCode = null;

// ── LOGIN PAGE ────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [step, setStep] = useState("email"); // email | code
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState("");
  const codeRef = useRef(null);

  async function sendCode(e) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    await new Promise(r => setTimeout(r, 900));
    // Generate 6-digit code and store it
    pendingCode = String(Math.floor(100000 + Math.random() * 900000));
    setSentTo(email);
    setStep("code");
    setLoading(false);
    // Show the code prominently for testing
    setTimeout(() => codeRef.current?.focus(), 100);
  }

  async function verifyCode(e) {
    e.preventDefault();
    if (!code) return;
    setLoading(true);
    setError("");
    await new Promise(r => setTimeout(r, 700));
    if (code === pendingCode) {
      pendingCode = null;
      onLogin(sentTo);
    } else {
      setError("That code doesn't match. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight:"100vh", background:C.cream,
      fontFamily:"'Cormorant Garamond',Georgia,serif",
      display:"flex", flexDirection:"column",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        .login-input {
          width:100%; padding:14px 16px; border:1.5px solid ${C.creamBorder};
          border-radius:3px; font-family:'DM Sans',sans-serif; font-size:15px;
          background:white; color:${C.text}; outline:none;
          transition:border-color .2s, box-shadow .2s;
        }
        .login-input:focus { border-color:${C.gold}; box-shadow:0 0 0 3px rgba(201,169,122,.15); }
        .login-btn {
          width:100%; padding:15px; border:none; border-radius:3px; cursor:pointer;
          font-family:'DM Sans',sans-serif; font-size:12px; font-weight:600;
          letter-spacing:.12em; text-transform:uppercase;
          background:${C.espresso}; color:${C.cream};
          transition:all .2s; box-shadow:0 2px 8px rgba(0,0,0,.14);
        }
        .login-btn:hover:not(:disabled) { background:${C.espressoDark}; transform:translateY(-1px); box-shadow:0 4px 14px rgba(0,0,0,.18); }
        .login-btn:disabled { opacity:.6; cursor:not-allowed; }
        .code-input {
          width:100%; padding:18px 16px; border:1.5px solid ${C.creamBorder};
          border-radius:3px; font-family:'DM Sans',sans-serif; font-size:28px;
          font-weight:600; letter-spacing:.35em; text-align:center;
          background:white; color:${C.text}; outline:none;
          transition:border-color .2s, box-shadow .2s;
        }
        .code-input:focus { border-color:${C.gold}; box-shadow:0 0 0 3px rgba(201,169,122,.15); }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        .fade-up { animation: fadeUp .5s cubic-bezier(.16,1,.3,1) both; }
      `}</style>

      {/* Nav */}
      <nav style={{ borderBottom:`1px solid ${C.creamBorder}`, padding:"0 40px", background:C.cream }}>
        <div style={{ maxWidth:1120, margin:"0 auto", display:"flex", alignItems:"center", height:64 }}>
          <a href="/" style={{ textDecoration:"none", display:"flex", alignItems:"center", gap:10 }}>
            <LogoMark size={32}/>
            <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:19, fontWeight:600, color:C.text }}>
              Final<span style={{ color:C.gold }}>Count</span>
            </span>
          </a>
        </div>
      </nav>

      {/* Login card */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 20px" }}>
        <div className="fade-up" style={{ width:"100%", maxWidth:440 }}>

          {step === "email" ? (
            <>
              <div style={{ textAlign:"center", marginBottom:36 }}>
                <LogoMark size={52}/>
                <h1 style={{ fontSize:32, fontWeight:400, color:C.text, marginTop:16, marginBottom:8 }}>
                  Welcome back
                </h1>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14.5, color:C.textLight, lineHeight:1.6 }}>
                  Enter your email to receive a sign-in code
                </p>
              </div>

              <div style={{ background:"white", border:`1.5px solid ${C.creamBorder}`, borderRadius:8, padding:"32px 28px" }}>
                <form onSubmit={sendCode} style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  <div>
                    <label style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11.5, fontWeight:600, color:C.textFaint, letterSpacing:"0.1em", textTransform:"uppercase", display:"block", marginBottom:8 }}>
                      Email address
                    </label>
                    <input
                      className="login-input"
                      type="email" required
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <button className="login-btn" type="submit" disabled={loading || !email}>
                    {loading ? "Sending…" : "Send sign-in code"}
                  </button>
                </form>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:C.textFaint, textAlign:"center", marginTop:16, lineHeight:1.6 }}>
                  We'll send a 6-digit code to your inbox. No password needed.
                </p>
              </div>
            </>
          ) : (
            <>
              <div style={{ textAlign:"center", marginBottom:36 }}>
                <div style={{ width:56, height:56, borderRadius:"50%", background:C.creamMid, border:`1.5px solid ${C.creamBorder}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 4h16v16H4z" rx="2" stroke={C.gold} strokeWidth="1.5"/><path d="M4 8l8 5 8-5" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round"/></svg>
                </div>
                <h1 style={{ fontSize:30, fontWeight:400, color:C.text, marginBottom:8 }}>Check your inbox</h1>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:C.textLight, lineHeight:1.6 }}>
                  We sent a 6-digit code to<br/>
                  <strong style={{ color:C.text }}>{sentTo}</strong>
                </p>
              </div>

              {/* For testing — show the code visibly */}
              <div style={{ background:C.creamMid, border:`1.5px solid ${C.creamBorder}`, borderRadius:8, padding:"14px 20px", marginBottom:20, textAlign:"center" }}>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:C.textFaint, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:6 }}>
                  Your sign-in code (test mode)
                </div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:32, fontWeight:700, color:C.espresso, letterSpacing:"0.3em" }}>
                  {pendingCode}
                </div>
              </div>

              <div style={{ background:"white", border:`1.5px solid ${C.creamBorder}`, borderRadius:8, padding:"32px 28px" }}>
                <form onSubmit={verifyCode} style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  <div>
                    <label style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11.5, fontWeight:600, color:C.textFaint, letterSpacing:"0.1em", textTransform:"uppercase", display:"block", marginBottom:8 }}>
                      6-digit code
                    </label>
                    <input
                      ref={codeRef}
                      className="code-input"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="000000"
                      value={code}
                      onChange={e => { setCode(e.target.value.replace(/\D/g,"")); setError(""); }}
                      disabled={loading}
                    />
                    {error && <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12.5, color:C.red, marginTop:8 }}>{error}</p>}
                  </div>
                  <button className="login-btn" type="submit" disabled={loading || code.length < 6}>
                    {loading ? "Verifying…" : "Sign in"}
                  </button>
                </form>
                <button
                  onClick={() => { setStep("email"); setCode(""); setError(""); }}
                  style={{ background:"none", border:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.gold, textDecoration:"underline", display:"block", textAlign:"center", marginTop:16, width:"100%" }}
                >
                  Use a different email
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
const TABS = ["Guest List", "Conversation Log"];

// Initial empty guest list for Garrett's test account
const INITIAL_GUESTS = [];

function Dashboard({ userEmail, onLogout }) {
  const [tab, setTab] = useState("Guest List");
  const [guests, setGuests] = useState(INITIAL_GUESTS);
  const [showAdd, setShowAdd] = useState(false);
  const [editGuest, setEditGuest] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [logGuest, setLogGuest] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const confirmed = guests.filter(g => g.status === "Confirmed").length;
  const declined  = guests.filter(g => g.status === "Declined").length;
  const pending   = guests.filter(g => g.status === "Pending").length;
  const total     = guests.length;

  const filtered = guests.filter(g => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase()) ||
      (g.phone || "").includes(search);
    const matchStatus = filterStatus === "All" || g.status === filterStatus;
    return matchSearch && matchStatus;
  });

  function saveGuest(data) {
    if (editGuest) {
      setGuests(prev => prev.map(g => g.id === editGuest.id ? { ...g, ...data } : g));
      setEditGuest(null);
    } else {
      setGuests(prev => [...prev, { ...data, id: Date.now(), status: data.status || "Pending", log: [] }]);
    }
    setShowAdd(false);
  }

  function deleteGuest(id) {
    if (confirm("Remove this guest?")) setGuests(prev => prev.filter(g => g.id !== id));
  }

  const weddingName = userEmail.split("@")[0].replace(/[._]/g," ").replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div style={{ minHeight:"100vh", background:"#f5f1eb", fontFamily:"'DM Sans',sans-serif", display:"flex", flexDirection:"column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        .db-card { background:white; border:1px solid ${C.creamBorder}; border-radius:10px; }
        .db-btn-primary {
          background:${C.espresso}; color:${C.cream}; border:none; padding:11px 22px;
          border-radius:3px; font-family:'DM Sans',sans-serif; font-size:12px; font-weight:600;
          letter-spacing:.1em; text-transform:uppercase; cursor:pointer;
          transition:all .18s; box-shadow:0 2px 6px rgba(0,0,0,.12);
        }
        .db-btn-primary:hover { background:${C.espressoDark}; transform:translateY(-1px); }
        .db-btn-ghost {
          background:transparent; color:${C.textMid}; border:1.5px solid ${C.creamBorder};
          padding:9px 18px; border-radius:3px; font-family:'DM Sans',sans-serif;
          font-size:12px; font-weight:500; cursor:pointer; transition:all .18s;
        }
        .db-btn-ghost:hover { border-color:${C.espresso}; color:${C.espresso}; background:${C.creamMid}; }
        .db-input {
          width:100%; padding:11px 14px; border:1.5px solid ${C.creamBorder}; border-radius:3px;
          font-family:'DM Sans',sans-serif; font-size:14px; color:${C.text};
          background:white; outline:none; transition:border-color .2s;
        }
        .db-input:focus { border-color:${C.gold}; }
        .db-select {
          padding:9px 14px; border:1.5px solid ${C.creamBorder}; border-radius:3px;
          font-family:'DM Sans',sans-serif; font-size:13px; color:${C.text};
          background:white; outline:none; cursor:pointer;
        }
        .db-tab {
          padding:10px 20px; border:none; background:none; cursor:pointer;
          font-family:'DM Sans',sans-serif; font-size:13.5px; font-weight:500;
          color:${C.textLight}; border-bottom:2px solid transparent;
          transition:all .18s; white-space:nowrap;
        }
        .db-tab.active { color:${C.espresso}; border-bottom-color:${C.gold}; font-weight:600; }
        .db-tab:hover:not(.active) { color:${C.text}; }
        .db-tr { border-bottom:1px solid #f0ead8; transition:background .15s; }
        .db-tr:hover { background:#faf7f2; }
        .db-tr:last-child { border-bottom:none; }
        .db-action { background:none; border:none; cursor:pointer; padding:5px 8px; border-radius:4px; font-size:13px; transition:all .15s; }
        .db-action:hover { background:${C.creamMid}; }
        .modal-overlay {
          position:fixed; inset:0; background:rgba(20,14,10,.45);
          display:flex; align-items:center; justify-content:center;
          z-index:200; padding:20px; backdrop-filter:blur(2px);
          animation:fadeIn .2s ease both;
        }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
        .modal-card { background:white; border-radius:12px; width:100%; max-width:480px; padding:32px; box-shadow:0 24px 64px rgba(0,0,0,.2); animation:slideUp .3s cubic-bezier(.16,1,.3,1) both; }
        .stat-card { background:white; border:1px solid ${C.creamBorder}; border-radius:10px; padding:22px 20px; }
        .log-bubble-bot { background:#E9E9EB; color:#000; border-radius:16px 16px 16px 4px; padding:9px 14px; font-size:13.5px; line-height:1.5; max-width:75%; align-self:flex-start; }
        .log-bubble-user { background:#007AFF; color:white; border-radius:16px 16px 4px 16px; padding:9px 14px; font-size:13.5px; line-height:1.5; max-width:75%; align-self:flex-end; }
        @keyframes dbFadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        .db-fade { animation: dbFadeUp .4s cubic-bezier(.16,1,.3,1) both; }
      `}</style>

      {/* ── Top nav ── */}
      <nav style={{ background:C.espresso, borderBottom:`1px solid rgba(255,255,255,.06)`, padding:"0 32px", flexShrink:0 }}>
        <div style={{ maxWidth:1280, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", height:60 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <LogoMark size={28} dark={true}/>
            <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:18, fontWeight:600, color:C.goldLight, letterSpacing:"0.02em" }}>
              Final<span style={{ color:C.gold }}>Count</span>
            </span>
            <span style={{ width:1, height:18, background:"rgba(255,255,255,.2)", margin:"0 4px" }}/>
            <span style={{ fontSize:12.5, color:"rgba(255,255,255,.55)", fontWeight:400, letterSpacing:"0.04em" }}>Couple Dashboard</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:28, height:28, borderRadius:"50%", background:"rgba(201,169,122,.25)", display:"flex", alignItems:"center", justifyContent:"center", border:`1px solid rgba(201,169,122,.4)` }}>
                <span style={{ fontSize:12, fontWeight:600, color:C.gold }}>
                  {userEmail[0].toUpperCase()}
                </span>
              </div>
              <span style={{ fontSize:12.5, color:"rgba(255,255,255,.65)" }}>{userEmail}</span>
            </div>
            <button
              onClick={onLogout}
              style={{ background:"rgba(255,255,255,.08)", border:"1px solid rgba(255,255,255,.14)", color:"rgba(255,255,255,.7)", padding:"6px 14px", borderRadius:3, fontSize:12, fontWeight:500, cursor:"pointer", transition:"all .18s" }}
              onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,.14)"}
              onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,.08)"}
            >Sign out</button>
          </div>
        </div>
      </nav>

      <div style={{ flex:1, maxWidth:1280, margin:"0 auto", width:"100%", padding:"32px" }}>

        {/* ── Wedding header ── */}
        <div className="db-fade" style={{ marginBottom:28 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:16 }}>
            <div>
              <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:34, fontWeight:400, color:C.text, marginBottom:4 }}>
                Your Wedding Dashboard
              </h1>
              <p style={{ fontSize:13.5, color:C.textLight, letterSpacing:"0.02em" }}>
                Manage guests, track RSVPs, and view conversations — all in one place.
              </p>
            </div>
            <button className="db-btn-primary" onClick={() => { setShowAdd(true); setEditGuest(null); }}>
              + Add guest
            </button>
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div className="db-fade" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:28 }}>
          {[
            { label:"Total Guests", value:total, icon:"👥", color:C.espresso },
            { label:"Confirmed",    value:confirmed, icon:"✓", color:C.green },
            { label:"Pending",      value:pending,   icon:"◷", color:C.amber },
            { label:"Declined",     value:declined,  icon:"✕", color:C.red   },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="stat-card" style={{ position:"relative", overflow:"hidden" }}>
              <div style={{ fontSize:11, fontWeight:600, color:C.textFaint, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>{label}</div>
              <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:44, fontWeight:300, color, lineHeight:1 }}>{value}</div>
              <div style={{ position:"absolute", top:16, right:16, fontSize:20, opacity:.18 }}>{icon}</div>
            </div>
          ))}
        </div>

        {/* ── Progress bar ── */}
        {total > 0 && (
          <div className="db-card db-fade" style={{ padding:"18px 22px", marginBottom:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <span style={{ fontSize:12.5, fontWeight:600, color:C.textLight, letterSpacing:"0.06em", textTransform:"uppercase" }}>Response progress</span>
              <span style={{ fontSize:13, color:C.textLight }}>{total > 0 ? Math.round(((confirmed + declined) / total) * 100) : 0}% responded</span>
            </div>
            <div style={{ height:7, background:C.creamMid, borderRadius:4, overflow:"hidden" }}>
              <div style={{ display:"flex", height:"100%", transition:"width .6s ease" }}>
                <div style={{ width:`${total > 0 ? (confirmed/total)*100 : 0}%`, background:C.green, transition:"width .6s" }}/>
                <div style={{ width:`${total > 0 ? (declined/total)*100 : 0}%`, background:C.red, transition:"width .6s" }}/>
              </div>
            </div>
            <div style={{ display:"flex", gap:20, marginTop:8 }}>
              {[["Confirmed",C.green],[`Declined`,C.red],["Pending",C.amber]].map(([l,c]) => (
                <div key={l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11.5, color:C.textFaint }}>
                  <span style={{ width:8, height:8, borderRadius:2, background:c, display:"inline-block" }}/>
                  {l}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tabs ── */}
        <div style={{ borderBottom:`1px solid ${C.creamBorder}`, marginBottom:20, display:"flex", gap:0 }}>
          {TABS.map(t => (
            <button key={t} className={`db-tab${tab===t?" active":""}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        {/* ── Guest List tab ── */}
        {tab === "Guest List" && (
          <div className="db-fade">
            {/* Filters */}
            <div style={{ display:"flex", gap:10, marginBottom:18, flexWrap:"wrap", alignItems:"center" }}>
              <input
                className="db-input" style={{ maxWidth:280 }}
                placeholder="Search guests…"
                value={search} onChange={e => setSearch(e.target.value)}
              />
              <select className="db-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                {["All","Confirmed","Pending","Declined"].map(s => <option key={s}>{s}</option>)}
              </select>
              <span style={{ fontSize:12.5, color:C.textFaint, marginLeft:"auto" }}>
                {filtered.length} guest{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Table */}
            <div className="db-card" style={{ overflow:"hidden" }}>
              {filtered.length === 0 ? (
                <div style={{ padding:"64px 32px", textAlign:"center" }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:22, color:C.textFaint, marginBottom:10 }}>
                    {guests.length === 0 ? "No guests yet" : "No guests match your search"}
                  </div>
                  <p style={{ fontSize:13.5, color:C.textFaint, marginBottom:20, lineHeight:1.6 }}>
                    {guests.length === 0 ? "Add your first guest to get started." : "Try a different search or filter."}
                  </p>
                  {guests.length === 0 && (
                    <button className="db-btn-primary" onClick={() => { setShowAdd(true); setEditGuest(null); }}>
                      + Add first guest
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead>
                      <tr style={{ background:C.creamMid, borderBottom:`1px solid ${C.creamBorder}` }}>
                        {["Guest Name","Phone","RSVP Status","Events","Dietary","Notes",""].map(h => (
                          <th key={h} style={{ padding:"11px 14px", textAlign:"left", fontSize:11, fontWeight:600, color:C.textFaint, letterSpacing:"0.08em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(g => (
                        <tr key={g.id} className="db-tr">
                          <td style={{ padding:"13px 14px", fontWeight:500, color:C.text, whiteSpace:"nowrap" }}>{g.name}</td>
                          <td style={{ padding:"13px 14px", color:C.textLight, fontSize:13 }}>{g.phone || "—"}</td>
                          <td style={{ padding:"13px 14px" }}><StatusPill status={g.status}/></td>
                          <td style={{ padding:"13px 14px", color:C.textLight, fontSize:13 }}>{g.events || "—"}</td>
                          <td style={{ padding:"13px 14px", color:C.textLight, fontSize:13 }}>{g.dietary || "—"}</td>
                          <td style={{ padding:"13px 14px", color:C.textLight, fontSize:13, maxWidth:180 }}>
                            <span style={{ display:"block", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{g.notes || "—"}</span>
                          </td>
                          <td style={{ padding:"13px 14px", whiteSpace:"nowrap" }}>
                            <button className="db-action" title="Edit" onClick={() => { setEditGuest(g); setShowAdd(true); }}>✎</button>
                            <button className="db-action" title="View log" style={{ color:C.gold }} onClick={() => { setLogGuest(g); setTab("Conversation Log"); }}>💬</button>
                            <button className="db-action" title="Delete" style={{ color:C.red }} onClick={() => deleteGuest(g.id)}>✕</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Conversation Log tab ── */}
        {tab === "Conversation Log" && (
          <div className="db-fade">
            {guests.length === 0 ? (
              <div className="db-card" style={{ padding:"64px 32px", textAlign:"center" }}>
                <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:22, color:C.textFaint, marginBottom:10 }}>No conversations yet</div>
                <p style={{ fontSize:13.5, color:C.textFaint }}>Add guests and send messages to see conversation logs here.</p>
              </div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:20, alignItems:"start" }}>
                {/* Guest sidebar */}
                <div className="db-card" style={{ overflow:"hidden" }}>
                  <div style={{ padding:"14px 16px", borderBottom:`1px solid ${C.creamBorder}`, fontSize:11, fontWeight:600, color:C.textFaint, letterSpacing:"0.08em", textTransform:"uppercase" }}>
                    Guests
                  </div>
                  {guests.map(g => (
                    <button
                      key={g.id}
                      onClick={() => setLogGuest(g)}
                      style={{ width:"100%", padding:"13px 16px", background:logGuest?.id===g.id ? C.creamMid : "transparent", border:"none", borderBottom:`1px solid ${C.creamBorder}`, cursor:"pointer", textAlign:"left", transition:"background .15s", display:"flex", justifyContent:"space-between", alignItems:"center" }}
                    >
                      <div>
                        <div style={{ fontSize:14, fontWeight:500, color:C.text }}>{g.name}</div>
                        <div style={{ fontSize:12, color:C.textFaint, marginTop:2 }}>{g.phone || "No phone"}</div>
                      </div>
                      <StatusPill status={g.status}/>
                    </button>
                  ))}
                </div>

                {/* Conversation panel */}
                <div className="db-card" style={{ padding:0, overflow:"hidden" }}>
                  {!logGuest ? (
                    <div style={{ padding:"64px 32px", textAlign:"center", color:C.textFaint }}>
                      <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:20, marginBottom:8 }}>Select a guest</div>
                      <p style={{ fontSize:13.5 }}>Click a guest on the left to view their conversation.</p>
                    </div>
                  ) : (
                    <>
                      <div style={{ padding:"16px 20px", borderBottom:`1px solid ${C.creamBorder}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <div>
                          <div style={{ fontSize:15, fontWeight:600, color:C.text }}>{logGuest.name}</div>
                          <div style={{ fontSize:12, color:C.textFaint }}>{logGuest.phone || "No phone on file"}</div>
                        </div>
                        <StatusPill status={logGuest.status}/>
                      </div>
                      <div style={{ padding:"20px", minHeight:320, display:"flex", flexDirection:"column", gap:12, background:"#f9f6f0" }}>
                        {(!logGuest.log || logGuest.log.length === 0) ? (
                          <div style={{ textAlign:"center", padding:"60px 20px", color:C.textFaint }}>
                            <div style={{ fontSize:14, marginBottom:6 }}>No messages yet</div>
                            <p style={{ fontSize:12.5, lineHeight:1.6 }}>Once FinalCount texts this guest, the full conversation will appear here.</p>
                          </div>
                        ) : (
                          logGuest.log.map((m, i) => (
                            <div key={i} className={m.side === "bot" ? "log-bubble-bot" : "log-bubble-user"}>{m.text}</div>
                          ))
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Add / Edit Guest Modal ── */}
      {showAdd && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) { setShowAdd(false); setEditGuest(null); } }}>
          <div className="modal-card">
            <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:26, fontWeight:400, color:C.text, marginBottom:6 }}>
              {editGuest ? "Edit guest" : "Add a guest"}
            </h2>
            <p style={{ fontSize:13.5, color:C.textLight, marginBottom:24 }}>
              {editGuest ? "Update the details for this guest." : "Add a guest to your list. You can update their RSVP status at any time."}
            </p>
            <GuestForm
              initial={editGuest}
              onSave={saveGuest}
              onCancel={() => { setShowAdd(false); setEditGuest(null); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Guest form ─────────────────────────────────────────────────────────────────
function GuestForm({ initial, onSave, onCancel }) {
  const [name, setName]     = useState(initial?.name     || "");
  const [phone, setPhone]   = useState(initial?.phone    || "");
  const [status, setStatus] = useState(initial?.status   || "Pending");
  const [events, setEvents] = useState(initial?.events   || "");
  const [dietary, setDietary] = useState(initial?.dietary || "");
  const [notes, setNotes]   = useState(initial?.notes    || "");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), phone, status, events, dietary, notes });
  }

  const fieldStyle = { display:"flex", flexDirection:"column", gap:6 };
  const labelStyle = { fontSize:11.5, fontWeight:600, color:C.textFaint, letterSpacing:"0.08em", textTransform:"uppercase" };

  return (
    <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Guest name *</label>
          <input className="db-input" value={name} onChange={e => setName(e.target.value)} placeholder="Sarah Johnson" required/>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Phone number</label>
          <input className="db-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 555 000 0000"/>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <div style={fieldStyle}>
          <label style={labelStyle}>RSVP status</label>
          <select className="db-input db-select" style={{ cursor:"pointer" }} value={status} onChange={e => setStatus(e.target.value)}>
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Declined</option>
          </select>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Events attending</label>
          <input className="db-input" value={events} onChange={e => setEvents(e.target.value)} placeholder="All events, Ceremony only…"/>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Dietary needs</label>
          <input className="db-input" value={dietary} onChange={e => setDietary(e.target.value)} placeholder="Vegan, Gluten-free…"/>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Notes</label>
          <input className="db-input" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Plus-one, accessibility…"/>
        </div>
      </div>
      <div style={{ display:"flex", gap:10, justifyContent:"flex-end", paddingTop:8 }}>
        <button type="button" className="db-btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="db-btn-primary">{initial ? "Save changes" : "Add guest"}</button>
      </div>
    </form>
  );
}

// ── Root: router between login and dashboard ──────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);

  function handleLogin(email) { setUser(email); }
  function handleLogout() { setUser(null); }

  if (!user) return <LoginPage onLogin={handleLogin}/>;
  return <Dashboard userEmail={user} onLogout={handleLogout}/>;
}
