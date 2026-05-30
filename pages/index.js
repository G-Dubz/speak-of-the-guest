import { useState, useEffect, useRef } from "react";
import Head from "next/head";

// ─── Logo mark as inline SVG component ───────────────────────────────────────
function LogoMark({ size = 36, dark = false }) {
  const bg = dark ? "#c9a97a" : "#2a2118";
  const fg = dark ? "#1e1a14" : "#faf8f4";
  const gold = dark ? "#1e1a14" : "#c9a97a";
  const s = size;
  const h = s / 2;
  return (
    <svg width={s} height={s} viewBox="0 0 72 72" fill="none">
      <path d={`M36 2 L70 36 L36 70 L2 36 Z`} fill={bg}/>
      <path d={`M36 10 L62 36 L36 62 L10 36 Z`} fill="none" stroke={gold} strokeWidth="1.5" opacity="0.3"/>
      <line x1="22" y1="24" x2="22" y2="48" stroke={fg} strokeWidth="3" strokeLinecap="round"/>
      <line x1="22" y1="24" x2="38" y2="24" stroke={fg} strokeWidth="3" strokeLinecap="round"/>
      <line x1="22" y1="34" x2="34" y2="34" stroke={fg} strokeWidth="3" strokeLinecap="round"/>
      <polyline points="32,40 39,49 52,30" fill="none" stroke={gold} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ─── Scenarios ────────────────────────────────────────────────────────────────
const SCENARIOS = [
  {
    id: 1,
    btn: "They're both coming (with a dietary note)",
    botPrompt: "Hey Uncle Dave! Finalizing the headcount for Sarah & Mike's wedding. Will you and Aunt Clara make it to the Rehearsal Dinner and Reception?",
    userReply: "Yes we are coming to both, but Aunt Clara is strictly gluten-free now!",
    botConfirm: "Perfect! Got you both down for all events, and Aunt Clara's gluten-free diet is flagged for the caterer. You're all set! 🎉",
    parsed: { name: "Uncle Dave & Aunt Clara", status: "Confirmed", events: "All events", plusOne: "Yes", dietary: "Gluten-Free" }
  },
  {
    id: 2,
    btn: "They changed their mind last minute",
    botPrompt: "Hi Emily! Checking in for Sarah & Mike's wedding. Are you still able to make the welcome dinner and the ceremony?",
    userReply: "Actually it's just going to be me now, sorry! My partner has to work. Can't wait for the ceremony though!",
    botConfirm: "No problem at all! Updated your RSVP — just 1 guest for the ceremony. Can't wait to celebrate with you! 💍",
    parsed: { name: "Emily Jenkins", status: "Confirmed", events: "Ceremony Only", plusOne: "No", dietary: "None" }
  },
  {
    id: 3,
    btn: "They can't make it",
    botPrompt: "Hi Cousin Marcus! We're finalizing the numbers for the wedding this weekend. Will you be joining us?",
    userReply: "Oh no, I'm so bummed but my flight got canceled and I won't be able to make it. Sending so much love!!",
    botConfirm: "We'll miss you so much! I've updated the list — thank you for letting us know. Sending love right back! 🤍",
    parsed: { name: "Cousin Marcus", status: "Declined", events: "None", plusOne: "N/A", dietary: "N/A" }
  },
  {
    id: 4,
    btn: "It's a multi-day wedding",
    botPrompt: "Hi David! We're finalizing counts for the weekend. Will you make it to the Welcome Party (Fri), Ceremony (Sat), and Farewell Brunch (Sun)?",
    userReply: "Hey! Yes to the Welcome Party and Ceremony, but we have to hit the road early Sunday so we'll skip the brunch.",
    botConfirm: "Perfect! Logged you for Friday and Saturday, skipping Sunday brunch. Safe travels! 🌿",
    parsed: { name: "David & Guest", status: "Confirmed", events: "Fri & Sat", plusOne: "Yes", dietary: "None" }
  }
];

const FAQS = [
  { q: "Do guests need to download an app?", a: "Not at all. Everything happens over native SMS or WhatsApp — no links, no portals, no passwords. If they can text a friend, they can RSVP." },
  { q: "What if a guest replies with something confusing?", a: "Our AI handles typos, run-on sentences, and mid-conversation changes of heart. If something is truly ambiguous, it politely asks one clarifying question." },
  { q: "Can I track multi-day events like a rehearsal dinner?", a: "Yes. You define your events during setup, and the assistant maps each guest's attendance per day automatically into your spreadsheet." },
  { q: "When do I get access?", a: "Beta couples receive onboarding within 48 hours of joining the waitlist. We're opening slots on a rolling basis — early signups get priority." }
];

// ─── Demo component ───────────────────────────────────────────────────────────
function LiveDemo() {
  const [isRunning, setIsRunning] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [demoStep, setDemoStep] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [showTyping, setShowTyping] = useState(false);
  const [sheet, setSheet] = useState({ name: "Uncle Dave & Aunt Clara", status: "Pending", events: "—", plusOne: "—", dietary: "—" });
  const [sheetHighlight, setSheetHighlight] = useState(false);
  const [stats, setStats] = useState({ conf: 1, pend: 2, decl: 0 });
  const timers = useRef([]);
  const msgsRef = useRef(null);
  const phoneRef = useRef(null);
  const sheetRef = useRef(null);

  function clr() { timers.current.forEach(clearTimeout); timers.current = []; }
  function after(fn, ms) { timers.current.push(setTimeout(fn, ms)); }

  function scrollMsgs() { setTimeout(() => { if (msgsRef.current) msgsRef.current.scrollTop = 9999; }, 60); }

  // Scroll the page so the target element is comfortably visible
  function scrollToEl(ref) {
    if (!ref?.current) return;
    const rect = ref.current.getBoundingClientRect();
    const navHeight = 80;
    const alreadyVisible = rect.top >= navHeight && rect.bottom <= window.innerHeight;
    if (!alreadyVisible) {
      const targetY = window.scrollY + rect.top - navHeight - 16;
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  }

  function run(scenario) {
    if (isRunning) return;
    clr();
    setIsRunning(true);
    setActiveId(scenario.id);
    setDemoStep(1);
    setChatMessages([]);
    setShowTyping(false);
    setSheet({ name: scenario.parsed.name, status: "Pending", events: "—", plusOne: "—", dietary: "—" });
    setSheetHighlight(false);
    setStats({ conf: 1, pend: 2, decl: 0 });

    // Scroll to phone immediately so user can see the demo start
    after(() => { scrollToEl(phoneRef); }, 200);

    // Step 1 — bot sends message
    after(() => {
      setChatMessages([{ sender: "bot", text: scenario.botPrompt }]);
      scrollMsgs();
    }, 600);

    // Step 2 — guest replies
    after(() => {
      setDemoStep(2);
      setChatMessages(p => [...p, { sender: "user", text: scenario.userReply }]);
      scrollMsgs();
    }, 4800);

    // Step 3 — AI typing
    after(() => {
      setDemoStep(3);
      setShowTyping(true);
      scrollMsgs();
    }, 9000);

    // Step 3 — AI responds
    after(() => {
      setShowTyping(false);
      setChatMessages(p => [...p, { sender: "bot", text: scenario.botConfirm, delivered: true }]);
      scrollMsgs();
    }, 12000);

    // Step 4 — spreadsheet updates
    after(() => {
      setDemoStep(4);
      setSheet(scenario.parsed);
      setSheetHighlight(true);
      setStats({
        conf: scenario.parsed.status === "Confirmed" ? 2 : 1,
        pend: scenario.parsed.status === "Pending" ? 2 : 1,
        decl: scenario.parsed.status === "Declined" ? 1 : 0
      });
      // Scroll to spreadsheet so user sees it update
      after(() => { scrollToEl(sheetRef); }, 300);
    }, 14500);

    // Cooldown
    after(() => {
      setSheetHighlight(false);
      setIsRunning(false);
      setActiveId(null);
      setDemoStep(0);
    }, 22000);
  }

  const stepLabels = [
    null,
    { num: 1, title: "FinalCount texts the guest", body: "A friendly, personalized message goes out automatically. You don't lift a finger.", side: "phone" },
    { num: 2, title: "The guest replies naturally", body: "No link to click, no portal to log into — they just text back like they would a friend.", side: "phone" },
    { num: 3, title: "The AI reads the message", body: "It picks out every detail — attendance, plus-ones, dietary needs — from plain conversational text.", side: "phone" },
    { num: 4, title: "Your spreadsheet updates itself", body: "Every detail lands in the right column automatically. Look to the right.", side: "sheet" },
  ];

  const currentStep = demoStep > 0 ? stepLabels[demoStep] : null;
  const phoneFocused = currentStep?.side === "phone";
  const sheetFocused = currentStep?.side === "sheet";

  return (
    <div>
      <style>{`
        .d-btn {
          padding: 12px 22px; border-radius: 24px; font-size: 13.5px; font-weight: 600;
          border: none; cursor: pointer; background: #2a2118; color: #fff;
          transition: all 0.2s; font-family: 'DM Sans', sans-serif;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .d-btn:hover:not(:disabled) { background: #3d3125; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
        .d-btn.d-active { background: #c9a97a; color: #1a1410; }
        .d-btn:disabled:not(.d-active) { background: #5a4a3a; opacity: 0.55; cursor: not-allowed; }
        .d-imsg-bot { background: #E9E9EB; color: #000; border-radius: 20px; padding: 10px 14px; font-size: 14px; line-height: 1.45; max-width: 78%; align-self: flex-start; animation: dIn .4s ease both; word-wrap: break-word; font-family: -apple-system,'SF Pro Text',sans-serif; }
        .d-imsg-user { background: #007AFF; color: #fff; border-radius: 20px; padding: 10px 14px; font-size: 14px; line-height: 1.45; max-width: 78%; align-self: flex-end; animation: dIn .4s ease both; word-wrap: break-word; font-family: -apple-system,'SF Pro Text',sans-serif; }
        @keyframes dIn { from{opacity:0;transform:translateY(10px) scale(.96)} to{opacity:1;transform:none} }
        .d-typing { background: #E9E9EB; border-radius: 20px; padding: 13px 16px; align-self: flex-start; display:flex; gap:5px; align-items:center; animation: dIn .4s ease both; }
        .d-dot { width:7px; height:7px; border-radius:50%; background:#8e8e93; animation: dBlink 1.3s infinite; }
        .d-dot:nth-child(2){animation-delay:.22s} .d-dot:nth-child(3){animation-delay:.44s}
        @keyframes dBlink{0%,80%,100%{opacity:.25}40%{opacity:1}}
        .d-delivered { font-size:11px; color:#8e8e93; align-self:flex-end; margin:2px 4px 0 0; font-family:-apple-system,sans-serif; }
        .d-pill { display:inline-block; font-size:11px; font-weight:600; padding:3px 10px; border-radius:10px; }
        .d-confirmed { background:#d4edd0; color:#1f5a18; }
        .d-declined  { background:#f5d0d0; color:#6b1f1f; }
        .d-pending   { background:#ebe0c8; color:#6b4d1f; }
        .d-hl td { background:#fffce0 !important; transition:background .3s; }
        .d-hl-off td { background:white; transition:background 2.5s; }
        .d-replay { display:inline-flex; align-items:center; gap:8px; font-size:13.5px; font-weight:600; color:#fff; background:#2a2118; border:none; border-radius:24px; padding:12px 24px; cursor:pointer; transition:all .18s; box-shadow:0 2px 8px rgba(0,0,0,0.15); font-family:'DM Sans',sans-serif; }
        .d-replay:hover { background:#3d3125; transform:translateY(-1px); }
        .callout-box {
          background: #2a2118; color: #faf8f4; border-radius: 10px;
          padding: 14px 18px; font-family: 'DM Sans', sans-serif;
          box-shadow: 0 12px 32px rgba(0,0,0,0.25);
          animation: calloutIn .4s cubic-bezier(.16,1,.3,1) both;
          position: relative;
          max-width: 260px;
          min-width: 200px;
        }
        @keyframes calloutIn { from{opacity:0;transform:translateY(6px) scale(.96)} to{opacity:1;transform:none} }
        .callout-num { display:inline-flex; align-items:center; justify-content:center; width:24px; height:24px; border-radius:50%; background:#c9a97a; color:#1a1410; font-size:12px; font-weight:700; flex-shrink:0; }
        .callout-title { font-size:14px; font-weight:600; color:#faf8f4; }
        .callout-body  { font-size:12.5px; color:#c8b89a; margin-top:4px; line-height:1.5; }
        .arrow-right::after { content:''; position:absolute; right:-10px; top:50%; transform:translateY(-50%); border:10px solid transparent; border-left-color:#2a2118; border-right:none; }
        .arrow-left::after  { content:''; position:absolute; left:-10px; top:50%; transform:translateY(-50%); border:10px solid transparent; border-right-color:#2a2118; border-left:none; }
        .arrow-down::after  { content:''; position:absolute; bottom:-10px; left:50%; transform:translateX(-50%); border:10px solid transparent; border-top-color:#2a2118; border-bottom:none; }
        .arrow-up-left::before  { content:''; position:absolute; top:-10px; left:22px; border:10px solid transparent; border-bottom-color:#2a2118; border-top:none; }
        .arrow-up-right::before { content:''; position:absolute; top:-10px; right:22px; border:10px solid transparent; border-bottom-color:#2a2118; border-top:none; }
        .d-spotlight-dim { opacity:.3; filter:blur(1px); transform:scale(.99); transition:all .5s ease; }
        .d-spotlight-on  { opacity:1; filter:none; transform:scale(1.005); transition:all .5s ease; box-shadow:0 0 0 4px rgba(201,169,122,.45), 0 20px 50px rgba(0,0,0,.18); border-radius:16px; }
        .d-spotlight-idle { opacity:1; transition:all .5s ease; }
        .sig-bar { display:inline-block; width:3px; background:black; vertical-align:bottom; margin-right:2px; border-radius:.5px; }
      `}</style>

      {/* Scenario buttons */}
      <div className="demo-btns" style={{ display:"flex", flexWrap:"wrap", gap:10, justifyContent:"center", marginBottom:32 }}>
        {SCENARIOS.map(s => (
          <button key={s.id} className={`d-btn${activeId===s.id?" d-active":""}`} onClick={()=>run(s)} disabled={isRunning}>
            {s.btn}
          </button>
        ))}
      </div>

      {/* Main demo grid — phone constrained to iPhone width, sheet fills remaining space */}
      <div className="demo-grid" style={{ display:"grid", gridTemplateColumns:"320px minmax(0,1fr)", gap:48, alignItems:"start" }}>

        {/* ── Phone column ── */}
        <div className="demo-phone-col" ref={phoneRef} style={{ position:"relative" }}>
          <div
            className={isRunning ? phoneFocused ? "d-spotlight-on" : "d-spotlight-dim" : "d-spotlight-idle"}
            style={{ borderRadius:36 }}
          >
            {/* iPhone outer shell */}
            <div style={{ background:"#1a1a1c", borderRadius:50, padding:8, boxShadow:"0 24px 48px rgba(0,0,0,.35), inset 0 0 0 1px rgba(255,255,255,.08)" }}>
              {/* iPhone inner screen */}
              <div style={{ background:"white", borderRadius:42, overflow:"hidden", display:"flex", flexDirection:"column" }}>

                {/* ── Status bar ── */}
                <div style={{ background:"white", height:52, padding:"14px 20px 0", display:"flex", justifyContent:"space-between", alignItems:"flex-start", position:"relative" }}>
                  {/* Time */}
                  <span style={{ fontFamily:"-apple-system,'SF Pro Text',sans-serif", fontSize:15, fontWeight:600, color:"black", lineHeight:1 }}>9:41</span>
                  {/* Dynamic Island */}
                  <div style={{ position:"absolute", top:10, left:"50%", transform:"translateX(-50%)", width:88, height:26, background:"black", borderRadius:14 }}/>
                  {/* Status icons */}
                  <span style={{ display:"flex", alignItems:"center", gap:5 }}>
                    {/* Signal bars */}
                    <span style={{ display:"inline-flex", alignItems:"flex-end", height:10, gap:1.5 }}>
                      <span className="sig-bar" style={{ height:4 }}/><span className="sig-bar" style={{ height:6 }}/><span className="sig-bar" style={{ height:8 }}/><span className="sig-bar" style={{ height:10 }}/>
                    </span>
                    {/* WiFi */}
                    <svg width="14" height="10" viewBox="0 0 16 11" fill="none"><path d="M8 0.5C5 0.5 2.2 1.8.4 3.6l1.1 1.3C3 3.3 5.4 2.3 8 2.3s5 1 6.5 2.6l1.1-1.3C13.8 1.8 11 .5 8 .5zm0 3C5.9 3.5 4 4.4 2.6 5.7l1.1 1.3c1.1-1 2.6-1.7 4.3-1.7s3.2.7 4.3 1.7l1.1-1.3C12 4.4 10.1 3.5 8 3.5zm0 3c-1.3 0-2.5.5-3.4 1.4L8 11l3.4-3.1c-.9-.9-2.1-1.4-3.4-1.4z" fill="black"/></svg>
                    {/* Battery */}
                    <span style={{ display:"inline-flex", alignItems:"center" }}>
                      <span style={{ width:22, height:10, border:"1.5px solid rgba(0,0,0,.5)", borderRadius:2.5, padding:1.5, display:"inline-flex", alignItems:"center" }}>
                        <span style={{ display:"block", width:"78%", height:"100%", background:"black", borderRadius:1 }}/>
                      </span>
                      <span style={{ width:2, height:5, background:"rgba(0,0,0,.45)", borderRadius:"0 1px 1px 0", marginLeft:1 }}/>
                    </span>
                  </span>
                </div>

                {/* ── iMessage nav bar — exact iOS layout ── */}
                <div style={{ background:"white", padding:"4px 16px 10px", display:"grid", gridTemplateColumns:"40px 1fr 40px", alignItems:"center" }}>
                  {/* Back chevron + unread count */}
                  <div style={{ display:"flex", alignItems:"center", gap:2 }}>
                    <svg width="10" height="17" viewBox="0 0 10 17" fill="none"><path d="M8.5 1.5L1.5 8.5L8.5 15.5" stroke="#007AFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span style={{ color:"#007AFF", fontSize:16, fontFamily:"-apple-system,sans-serif", fontWeight:400, lineHeight:1 }}>3</span>
                  </div>
                  {/* Center: avatar + name — perfectly centered */}
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                    <div style={{ width:40, height:40, borderRadius:"50%", background:"linear-gradient(145deg,#d4b787,#9a7840)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"white", letterSpacing:"-0.5px", fontFamily:"-apple-system,sans-serif" }}>FC</div>
                    <span style={{ fontSize:12, fontWeight:500, color:"#1c1c1e", fontFamily:"-apple-system,sans-serif", letterSpacing:"-0.1px" }}>FinalCount</span>
                  </div>
                  {/* Video icon */}
                  <div style={{ display:"flex", justifyContent:"flex-end" }}>
                    <svg width="22" height="14" viewBox="0 0 22 14" fill="none"><rect x="0.5" y="0.5" width="14" height="13" rx="2.5" stroke="#007AFF" strokeWidth="1.5"/><path d="M15 4l6.5-3v12L15 10z" stroke="#007AFF" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                  </div>
                </div>

                {/* ── Messages area ── */}
                <div ref={msgsRef} style={{ background:"#f5f5f7", padding:"12px 12px", display:"flex", flexDirection:"column", gap:8, minHeight:340, maxHeight:340, overflowY:"auto" }}>
                  {chatMessages.length === 0 && !showTyping && (
                    <div style={{ textAlign:"center", padding:"100px 12px 0", color:"#8e8e93", fontSize:12.5, fontFamily:"-apple-system,sans-serif" }}>Pick a scenario above</div>
                  )}
                  {chatMessages.map((m, i) => (
                    <div key={i} style={{ display:"flex", flexDirection:"column" }}>
                      <div className={m.sender==="bot" ? "d-imsg-bot" : "d-imsg-user"}>{m.text}</div>
                      {m.delivered && <span className="d-delivered">Delivered</span>}
                    </div>
                  ))}
                  {showTyping && (
                    <div className="d-typing"><div className="d-dot"/><div className="d-dot"/><div className="d-dot"/></div>
                  )}
                </div>

                {/* ── iMessage input bar ── */}
                <div style={{ background:"white", padding:"8px 12px 10px", borderTop:"0.5px solid #d1d1d6", display:"flex", alignItems:"center", gap:8 }}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="13" stroke="#007AFF" strokeWidth="1.5"/><path d="M9 14h10M14 9v10" stroke="#007AFF" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  <div style={{ flex:1, background:"white", borderRadius:18, padding:"7px 12px", fontSize:13, color:"#8e8e93", border:"1px solid #c8c8cc", fontFamily:"-apple-system,sans-serif" }}>iMessage</div>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="13" fill="#007AFF"/><path d="M14 8v8M10 12l4-4 4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>

                {/* Home indicator */}
                <div style={{ background:"white", padding:"6px 0 10px", display:"flex", justifyContent:"center" }}>
                  <div style={{ width:100, height:4, background:"black", borderRadius:3, opacity:.85 }}/>
                </div>

              </div>
            </div>
          </div>

          {/* Callout: below the phone, arrow pointing UP at the messages */}
          {currentStep && phoneFocused && (
            <div className="callout-box arrow-up-left" style={{ marginTop:20, marginLeft:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                <span className="callout-num">{currentStep.num}</span>
                <span className="callout-title">{currentStep.title}</span>
              </div>
              <span className="callout-body">{currentStep.body}</span>
            </div>
          )}
        </div>

        {/* ── Sheet column ── */}
        <div className="demo-sheet-col" ref={sheetRef} style={{ position:"relative" }}>
          <div
            className={isRunning ? sheetFocused ? "d-spotlight-on" : "d-spotlight-dim" : "d-spotlight-idle"}
            style={{ borderRadius:16 }}
          >
            {/* Spreadsheet */}
            <div style={{ background:"white", borderRadius:10, border:"1.5px solid #c4b8a8", overflow:"hidden", boxShadow:"0 4px 20px rgba(0,0,0,.06)" }}>
              <div style={{ background:"#2a2118", color:"#f0ece6", padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:13, fontFamily:"'DM Sans',sans-serif", fontWeight:500 }}>Sarah & Mike — Guest list</span>
                <span style={{ fontSize:11, display:"flex", alignItems:"center", gap:5, fontFamily:"'DM Sans',sans-serif" }}>
                  <span id="sdot" style={{ width:6, height:6, borderRadius:"50%", background:"#c9a97a", display:"inline-block" }}/>
                  <span style={{ color:"#c9a97a", fontWeight:500 }}>Connected</span>
                </span>
              </div>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", tableLayout:"fixed", fontSize:12.5 }}>
                  <thead>
                    <tr style={{ background:"#f7f3ec" }}>
                      {["Guest","RSVP","Attending","+1","Dietary"].map(h => (
                        <th key={h} style={{ padding:"10px 11px", textAlign:"left", fontSize:10.5, fontWeight:600, color:"#5a4a3a", letterSpacing:"0.06em", textTransform:"uppercase", borderBottom:"1px solid #c4b8a8", fontFamily:"'DM Sans',sans-serif" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom:"1px solid #ece5d8" }}>
                      <td style={{ padding:"11px", fontWeight:500, color:"#2a2118", fontFamily:"'DM Sans',sans-serif" }}>Aunt Lisa</td>
                      <td style={{ padding:"11px" }}><span className="d-pill d-confirmed">Confirmed</span></td>
                      <td style={{ padding:"11px", color:"#4d3e2e", fontFamily:"'DM Sans',sans-serif" }}>All events</td>
                      <td style={{ padding:"11px", color:"#4d3e2e", fontFamily:"'DM Sans',sans-serif" }}>No</td>
                      <td style={{ padding:"11px", color:"#4d3e2e", fontFamily:"'DM Sans',sans-serif" }}>Vegan</td>
                    </tr>
                    <tr className={sheetHighlight ? "d-hl" : "d-hl-off"} style={{ borderBottom:"1px solid #ece5d8" }}>
                      <td style={{ padding:"11px", fontWeight:500, color:"#2a2118", fontFamily:"'DM Sans',sans-serif" }}>{sheet.name}</td>
                      <td style={{ padding:"11px" }}><span className={`d-pill d-${sheet.status.toLowerCase()}`}>{sheet.status}</span></td>
                      <td style={{ padding:"11px", color:"#4d3e2e", fontFamily:"'DM Sans',sans-serif" }}>{sheet.events}</td>
                      <td style={{ padding:"11px", color:"#4d3e2e", fontFamily:"'DM Sans',sans-serif" }}>{sheet.plusOne}</td>
                      <td style={{ padding:"11px", color:"#4d3e2e", fontFamily:"'DM Sans',sans-serif" }}>{sheet.dietary}</td>
                    </tr>
                    <tr>
                      <td style={{ padding:"11px", fontWeight:500, color:"#857363", fontFamily:"'DM Sans',sans-serif" }}>Cousin Marcus</td>
                      <td style={{ padding:"11px" }}><span className="d-pill d-pending">Pending</span></td>
                      <td style={{ padding:"11px", color:"#a89880", fontFamily:"'DM Sans',sans-serif" }}>—</td>
                      <td style={{ padding:"11px", color:"#a89880", fontFamily:"'DM Sans',sans-serif" }}>—</td>
                      <td style={{ padding:"11px", color:"#a89880", fontFamily:"'DM Sans',sans-serif" }}>—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginTop:12 }}>
              {[["Confirmed", stats.conf], ["Pending", stats.pend], ["Declined", stats.decl]].map(([label, val]) => (
                <div key={label} style={{ background:"white", border:"1.5px solid #c4b8a8", borderRadius:8, padding:"12px 8px", textAlign:"center" }}>
                  <div style={{ fontSize:10.5, color:"#5a4a3a", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:4, fontWeight:600, fontFamily:"'DM Sans',sans-serif" }}>{label}</div>
                  <div style={{ fontSize:26, fontWeight:500, color:"#1a1410", fontFamily:"'Cormorant Garamond',Georgia,serif", transition:"all .4s" }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
          {/* end spotlight wrapper */}

          {/* Callout: below the stats, arrow pointing UP at the spreadsheet */}
          {currentStep && sheetFocused && (
            <div className="callout-box arrow-up-right" style={{ marginTop:20, marginLeft:"auto", marginRight:8, maxWidth:260 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                <span className="callout-num">{currentStep.num}</span>
                <span className="callout-title">{currentStep.title}</span>
              </div>
              <span className="callout-body">{currentStep.body}</span>
            </div>
          )}

          {!isRunning && activeId && (
            <div style={{ textAlign:"center", marginTop:16 }}>
              <button className="d-replay" onClick={()=>{ setActiveId(null); setDemoStep(0); setChatMessages([]); setShowTyping(false); setSheet({ name:"Uncle Dave & Aunt Clara", status:"Pending", events:"—", plusOne:"—", dietary:"—" }); setStats({conf:1,pend:2,decl:0}); }}>
                ↺ Reset
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function App() {
  const [openFaq, setOpenFaq] = useState(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ── Real Formspree submission ──────────────────────────────────────────────
  // Replace the URL below with your own Formspree endpoint after signing up
  // at formspree.io — it will look like: https://formspree.io/f/xabcdefg
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/mvzybaez";

  async function handleWaitlistSubmit(e) {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    setSubmitError(false);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ email, source: "FinalCount Waitlist" }),
      });
      if (res.ok) {
        setSubmitted(true);
        setEmail("");
      } else {
        setSubmitError(true);
      }
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  }
  const [visible, setVisible] = useState({});
  const [activeSection, setActiveSection] = useState("hero");
  const refs = useRef({});

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setVisible(v => ({ ...v, [e.target.dataset.id]: true })); });
    }, { threshold: 0.12 });
    Object.values(refs.current).forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Track which section is currently in view to highlight nav links
  useEffect(() => {
    const sectionIds = ["how", "demo", "pricing", "waitlist"];
    const observers = sectionIds.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: "-20% 0px -70% 0px" }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(obs => obs && obs.disconnect());
  }, []);

  const addRef = id => el => { refs.current[id] = el; };
  const fade = (id, delay = "0ms") =>
    `transition: opacity .8s ${delay} ease, transform .8s ${delay} cubic-bezier(.16,1,.3,1); opacity: ${visible[id] ? 1 : 0}; transform: ${visible[id] ? "translateY(0)" : "translateY(28px)"}`;

  return (
    <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", background:"#faf8f4", color:"#1a1410", minHeight:"100vh", overflowX:"hidden" }}>
      <Head>
        <title>FinalCount — Wedding RSVP Intelligence</title>
        <meta name="description" content="The AI-powered wedding RSVP assistant that texts your guests, tracks responses, and updates your spreadsheet automatically."/>
        <meta property="og:title" content="FinalCount — Wedding RSVP Intelligence"/>
        <meta property="og:description" content="Stop chasing RSVPs. Let AI get the final count."/>
        <meta property="og:url" content="https://getfinalcount.com"/>
        <link rel="icon" href="/favicon.ico"/>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png"/>
      </Head>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .sans { font-family: 'DM Sans', sans-serif; }
        .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .btn-dark { background:#2a2118; color:#faf8f4; padding:13px 30px; border-radius:2px; font-family:'DM Sans',sans-serif; font-size:12px; font-weight:600; letter-spacing:.12em; text-transform:uppercase; border:none; cursor:pointer; transition:all .2s; display:inline-block; text-decoration:none; box-shadow:0 2px 8px rgba(0,0,0,.15); }
        .btn-dark:hover { background:#3d3125; transform:translateY(-1px); box-shadow:0 4px 16px rgba(0,0,0,.2); }
        .btn-outline { background:transparent; color:#2a2118; padding:12px 30px; border-radius:2px; font-family:'DM Sans',sans-serif; font-size:12px; font-weight:600; letter-spacing:.12em; text-transform:uppercase; border:1.5px solid #2a2118; cursor:pointer; transition:all .2s; display:inline-block; text-decoration:none; }
        .btn-outline:hover { background:#2a2118; color:#faf8f4; }
        .divider { width:48px; height:1.5px; background:#c9a97a; margin:0 auto 20px; }
        .tag { display:inline-block; font-family:'DM Sans',sans-serif; font-size:11px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; padding:5px 14px; border-radius:1px; background:#f2ead8; color:#6b4d1f; }
        input[type="email"] { width:100%; padding:14px 16px; border:1.5px solid #c4b8a8; border-radius:2px; font-family:'DM Sans',sans-serif; font-size:14px; background:white; color:#1a1410; outline:none; transition:border-color .2s; }
        input:focus { border-color:#c9a97a; }
        .faq-btn { width:100%; text-align:left; background:none; border:none; padding:18px 0; cursor:pointer; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #d8cebf; font-family:'Cormorant Garamond',Georgia,serif; font-size:18px; color:#1a1410; }
        .faq-btn:first-of-type { border-top:1px solid #d8cebf; }
        .step-num { width:48px; height:48px; border-radius:50%; background:#f2ead8; color:#6b4d1f; display:flex; align-items:center; justify-content:center; font-family:'Cormorant Garamond'; font-size:22px; font-weight:600; flex-shrink:0; }
        .feature-card { background:white; border:1.5px solid #e0d4c4; border-radius:8px; padding:28px 24px; transition:all .3s; }
        .feature-card:hover { transform:translateY(-3px); box-shadow:0 12px 32px rgba(0,0,0,.08); border-color:#c9a97a; }

        @keyframes heroFadeUp { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:none} }
        @keyframes floatPhone { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes shimmer { 0%,100%{opacity:.6} 50%{opacity:1} }
        @keyframes countUp { from{opacity:0;transform:scale(.8)} to{opacity:1;transform:scale(1)} }

        .hero-text { animation: heroFadeUp .9s cubic-bezier(.16,1,.3,1) .1s both; }
        .hero-phone { animation: heroFadeUp .9s cubic-bezier(.16,1,.3,1) .3s both, floatPhone 6s ease-in-out 1.2s infinite; }
        .stat-num { animation: countUp .6s cubic-bezier(.16,1,.3,1) both; }

        .gold-line { position:relative; }
        .gold-line::after { content:''; position:absolute; bottom:-4px; left:0; width:100%; height:2px; background:linear-gradient(90deg,#c9a97a,transparent); }

        /* ── Smooth scroll ── */
        html { scroll-behavior: smooth; }

        /* ── Scroll offset for sticky nav (68px tall) ── */
        section[id], div[id="waitlist"] {
          scroll-margin-top: 80px;
        }

        /* ── Nav link hover + active states ── */
        .nav-link {
          color: #3d2e1e;
          text-decoration: none;
          position: relative;
          padding-bottom: 2px;
          transition: color .2s;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1.5px;
          background: #c9a97a;
          transition: width .25s ease;
        }
        .nav-link:hover { color: #1a1410; }
        .nav-link:hover::after { width: 100%; }
        .nav-link.active { color: #1a1410; }
        .nav-link.active::after { width: 100%; }

        /* Hide mobile brand block on desktop — no longer used but kept for safety */
        .hero-mobile-brand { display: none; }

        @media (max-width: 768px) {
          /* Nav — hide text links, keep logo + CTA */
          .nav-links { display: none !important; }
          .nav-inner { padding: 0 20px !important; }

          /* Hero — full bleed photo, text stacks at bottom, phone hidden */
          .hero-outer { min-height: 520px !important; }
          .hero-grid { grid-template-columns: 1fr !important; gap: 0 !important; padding: 48px 24px 52px !important; min-height: 520px !important; align-items: flex-end !important; }
          .hero-phone-wrap { display: none !important; }
          .hero-text h1 { font-size: 34px !important; }
          .hero-text p { font-size: 15px !important; max-width: 100% !important; }
          .hero-stats-desktop { display: none !important; }
          .hero-mobile-brand { display: none !important; }

          /* Stat bar */
          .stat-grid { grid-template-columns: 1fr !important; gap: 20px !important; padding: 28px 20px !important; }

          /* How it works */
          .how-section { padding: 60px 20px !important; }

          /* Features grid — single column */
          .features-grid { grid-template-columns: 1fr !important; }
          .features-section { padding: 60px 20px !important; }

          /* Demo section */
          .demo-section { padding: 60px 20px !important; }
          .demo-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .demo-phone-col { max-width: 340px !important; margin: 0 auto !important; width: 100% !important; }
          .demo-sheet-col { width: 100% !important; }

          /* Demo buttons — wrap nicely */
          .demo-btns { justify-content: center !important; }
          .d-btn { font-size: 12px !important; padding: 10px 16px !important; }

          /* Callout boxes — reposition for mobile */
          .callout-box { position: static !important; transform: none !important; margin-top: 14px !important;
            width: 100% !important; max-width: 100% !important; }
          .callout-box::before, .callout-box::after { display: none !important; }

          /* Comparison — stack */
          .compare-grid { grid-template-columns: 1fr !important; }
          .compare-section { padding: 60px 20px !important; }

          /* Testimonial */
          .testimonial-section { padding: 48px 20px !important; }

          /* Pricing — single column, remove scale */
          .pricing-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
          .pricing-featured { transform: none !important; }
          .pricing-section { padding: 60px 20px !important; }

          /* FAQ */
          .faq-section { padding: 60px 20px !important; }
          .faq-btn { font-size: 16px !important; }

          /* Waitlist */
          .waitlist-section { padding: 60px 20px !important; }

          /* Footer */
          .footer-inner { flex-direction: column !important; gap: 12px !important; text-align: center !important; padding: 24px 20px !important; }
        }

        @media (max-width: 480px) {
          .hero-text h1 { font-size: 32px !important; }
          .btn-dark, .btn-outline { padding: 12px 20px !important; font-size: 11px !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ borderBottom:"1px solid #e0d4c4", padding:"0 40px", position:"sticky", top:0, background:"rgba(250,248,244,.96)", backdropFilter:"blur(8px)", zIndex:100 }}>
        <div className="nav-inner" style={{ maxWidth:1120, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", height:68 }}>
          <a
            href="#"
            onClick={e => { e.preventDefault(); window.scrollTo({ top:0, behavior:"smooth" }); }}
            style={{ textDecoration:"none", display:"flex", alignItems:"center", gap:10 }}
          >
            <LogoMark size={38}/>
            <span className="serif" style={{ fontSize:21, fontWeight:600, color:"#1a1410", letterSpacing:"0.01em" }}>
              Final<span style={{ color:"#c9a97a" }}>Count</span>
            </span>
          </a>
          <div className="nav-links sans" style={{ display:"flex", gap:32, fontSize:13, fontWeight:500, letterSpacing:"0.05em" }}>
            {[["how","How it works"],["demo","Live demo"],["pricing","Pricing"]].map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className={`nav-link${activeSection === id ? " active" : ""}`}
                onClick={e => {
                  e.preventDefault();
                  document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
                }}
              >
                {label}
              </a>
            ))}
          </div>
          <a
            href="#waitlist"
            className="btn-dark"
            style={{ padding:"10px 22px", fontSize:11 }}
            onClick={e => {
              e.preventDefault();
              document.getElementById("waitlist")?.scrollIntoView({ behavior:"smooth" });
            }}
          >
            Join Waitlist
          </a>
          <a
            href="/dashboard"
            style={{ padding:"10px 22px", fontSize:11, fontFamily:"'DM Sans',sans-serif", fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", color:"#2a2118", textDecoration:"none", border:"1.5px solid #2a2118", borderRadius:2, transition:"all .2s" }}
            onMouseEnter={e => { e.currentTarget.style.background="#2a2118"; e.currentTarget.style.color="#faf8f4"; }}
            onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#2a2118"; }}
          >
            Log in
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      {/* Full-bleed cinematic hero — photo background with content overlay */}
      <section className="hero-outer" style={{ position:"relative", width:"100%", overflow:"hidden", minHeight:620 }}>

        {/* Wedding photo */}
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=85&auto=format&fit=crop"
          alt="A couple celebrating their wedding"
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", objectPosition:"center 25%" }}
        />

        {/* Gradient overlay — left side darker for text readability, right stays lighter */}
        <div style={{
          position:"absolute", inset:0,
          background:"linear-gradient(105deg, rgba(20,14,10,0.82) 0%, rgba(20,14,10,0.60) 45%, rgba(20,14,10,0.25) 100%)"
        }}/>

        {/* Content layer */}
        <div className="hero-grid" style={{
          position:"relative", zIndex:2,
          maxWidth:1120, margin:"0 auto",
          padding:"80px 40px 72px",
          display:"grid",
          gridTemplateColumns:"1fr 1fr",
          gap:64,
          alignItems:"center",
          minHeight:620
        }}>

          {/* Left — logo mark + text + CTAs */}
          <div className="hero-text">
            {/* Logo mark + wordmark inline */}
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:32 }}>
              <LogoMark size={44} dark={true}/>
              <div style={{ width:1, height:36, background:"rgba(201,169,122,0.4)" }}/>
              <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:15, fontWeight:500, color:"rgba(255,255,255,0.75)", letterSpacing:"0.18em", textTransform:"uppercase" }}>
                Wedding RSVP Intelligence
              </span>
            </div>

            <h1 className="serif" style={{ fontSize:"clamp(38px,4.5vw,60px)", fontWeight:400, lineHeight:1.1, marginBottom:20, color:"#faf8f4" }}>
              Stop chasing RSVPs.<br/>
              <em style={{ color:"#c9a97a", fontStyle:"italic" }}>Let AI get<br/>the final count.</em>
            </h1>

            <p className="sans" style={{ fontSize:16, color:"rgba(255,255,255,0.78)", lineHeight:1.75, maxWidth:400, marginBottom:36 }}>
              An intelligent text assistant that has real conversations with your guests, organizes every detail, and syncs everything to a Google Sheet — while you enjoy being engaged.
            </p>

            <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
              <a
                href="#demo"
                className="btn-dark"
                style={{ background:"#c9a97a", color:"#1a1410", borderColor:"#c9a97a" }}
                onClick={e => { e.preventDefault(); document.getElementById("demo")?.scrollIntoView({ behavior:"smooth" }); }}
              >See it in action</a>
              <a
                href="#waitlist"
                style={{ background:"transparent", color:"#faf8f4", padding:"13px 30px", borderRadius:2, fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", border:"1.5px solid rgba(255,255,255,0.55)", cursor:"pointer", textDecoration:"none", transition:"all .2s", display:"inline-block" }}
                onClick={e => { e.preventDefault(); document.getElementById("waitlist")?.scrollIntoView({ behavior:"smooth" }); }}
                onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.12)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.8)"; }}
                onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor="rgba(255,255,255,0.55)"; }}
              >Join the waitlist</a>
            </div>
          </div>

          {/* Right — floating phone */}
          <div className="hero-phone-wrap" style={{ display:"flex", justifyContent:"center", alignItems:"center" }}>
            <div style={{
              width:275, background:"#1a1a1c", borderRadius:44, padding:6,
              boxShadow:"0 32px 72px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,0.06)"
            }}>
              <div style={{ background:"black", borderRadius:38, overflow:"hidden", position:"relative" }}>
                <div style={{ position:"absolute", top:10, left:"50%", transform:"translateX(-50%)", width:88, height:24, background:"black", borderRadius:14, zIndex:10 }}/>
                <div style={{ background:"#f5f5f7", padding:"30px 14px 8px", display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:13, fontWeight:600, color:"black", fontFamily:"-apple-system,sans-serif" }}>
                  <span>9:41</span>
                  <span style={{ fontSize:11 }}>●●●● 📶 87%</span>
                </div>
                <div style={{ background:"#f5f5f7", padding:"8px 14px 12px", borderBottom:"0.5px solid #d1d1d6", display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:18, color:"#007aff" }}>‹</span>
                  <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center" }}>
                    <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#d4b787,#a88860)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:600, color:"white" }}>FC</div>
                    <div style={{ fontSize:10.5, fontWeight:500, color:"black", marginTop:2, fontFamily:"-apple-system,sans-serif" }}>FinalCount ›</div>
                  </div>
                  <span style={{ fontSize:15, color:"#007aff" }}>📞</span>
                </div>
                <div style={{ background:"white", padding:"14px 12px", display:"flex", flexDirection:"column", gap:9, minHeight:210 }}>
                  <div style={{ background:"#E9E9EB", color:"#000", borderRadius:18, padding:"9px 13px", fontSize:12.5, lineHeight:1.45, maxWidth:"78%", fontFamily:"-apple-system,sans-serif" }}>Hey! 👋 I'm helping Sarah & Mike finalize their guest list. Will you and Jan be able to join for the wedding on Saturday?</div>
                  <div style={{ background:"#007AFF", color:"white", borderRadius:18, padding:"9px 13px", fontSize:12.5, lineHeight:1.45, maxWidth:"78%", marginLeft:"auto", fontFamily:"-apple-system,sans-serif" }}>Yes!! We'll be there for both! Jan is vegan btw!</div>
                  <div style={{ background:"#E9E9EB", color:"#000", borderRadius:18, padding:"9px 13px", fontSize:12.5, lineHeight:1.45, maxWidth:"78%", fontFamily:"-apple-system,sans-serif" }}>Wonderful! Confirmed you both. Jan's vegan preference is flagged for the caterer. 🌿</div>
                </div>
                <div style={{ background:"white", padding:"8px 0 10px", display:"flex", justifyContent:"center" }}>
                  <div style={{ width:100, height:4, background:"black", borderRadius:3 }}/>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── STAT BAR ── */}
      <div style={{ background:"#2a2118", padding:"32px 40px" }}>
        <div className="sans stat-grid" style={{ maxWidth:1120, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, textAlign:"center" }}>
          {[["85%","avg. response rate in 4 days"],["0 hrs","manual data entry required"],["100%","guests can use it — no app needed"]].map(([num,label]) => (
            <div key={num}>
              <div className="serif stat-num" style={{ fontSize:42, fontWeight:300, color:"#e8d8c0", lineHeight:1 }}>{num}</div>
              <div style={{ fontSize:13, color:"#b0a090", marginTop:6, letterSpacing:"0.04em" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="how-section" style={{ maxWidth:880, margin:"0 auto", padding:"88px 40px" }}>
        <div ref={addRef("how")} data-id="how" style={{ opacity: visible["how"] ? 1 : 0, transform: visible["how"] ? "translateY(0)" : "translateY(28px)", transition:"opacity .8s ease, transform .8s cubic-bezier(.16,1,.3,1)" }}>
          <div style={{ textAlign:"center", marginBottom:60 }}>
            <div className="divider"/>
            <span className="tag" style={{ marginBottom:16, display:"inline-block" }}>The experience</span>
            <h2 className="serif" style={{ fontSize:40, fontWeight:400, marginTop:14, color:"#1a1410" }}>Designed to pass the<br/><em>"Grandmother Test"</em></h2>
            <p className="sans" style={{ color:"#3d2e1e", marginTop:16, fontSize:15, maxWidth:500, margin:"16px auto 0", lineHeight:1.75 }}>
              No links to click. No portals to log into. If your guests can send a text to a friend, they can RSVP perfectly.
            </p>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:36 }}>
            {[
              ["01","You upload your guest list","A simple spreadsheet with names and phone numbers. We handle everything from there — no complex setup needed."],
              ["02","The assistant reaches out","Each guest gets a warm, personalized text from a dedicated number asking about attendance, plus-ones, and dietary needs."],
              ["03","Natural conversation happens","Guests reply however they like — messy paragraphs, quick one-liners, sudden changes of plan. The AI understands all of it."],
              ["04","Your spreadsheet fills itself","Every reply is parsed and synced to your Google Sheet in real time. Wake up each morning to a guest list that updated itself overnight."],
            ].map(([num,title,desc]) => (
              <div key={num} style={{ display:"flex", gap:24, alignItems:"flex-start" }}>
                <div className="step-num">{num}</div>
                <div>
                  <h3 className="serif" style={{ fontSize:22, fontWeight:500, marginBottom:8, color:"#1a1410" }}>{title}</h3>
                  <p className="sans" style={{ fontSize:14.5, color:"#3d2e1e", lineHeight:1.7 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features-section" style={{ background:"#f7f3ec", borderTop:"1px solid #d8cebf", borderBottom:"1px solid #d8cebf", padding:"80px 40px" }}>
        <div style={{ maxWidth:1120, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <div className="divider"/>
            <h2 className="serif" style={{ fontSize:38, fontWeight:400, color:"#1a1410" }}>Everything you need.<br/><em>Nothing you don't.</em></h2>
          </div>
          <div className="features-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
            {[
              ["Grandmother-proof","Works over native SMS — no apps, no links, no logins. If they can text a friend, they can RSVP."],
              ["Multi-day events","Rehearsal dinner, ceremony, farewell brunch — each event tracked separately in its own column."],
              ["Dietary & plus-ones","Every allergy, every extra guest, every last-minute change — captured automatically."],
              ["Automated follow-ups","Guests who haven't replied get a polite nudge. You never have to send an awkward reminder again."],
              ["Live Google Sheets sync","Your spreadsheet updates in real time. Share it with your planner, venue, or caterer instantly."],
              ["Full conversation log","Read every exchange. Override any entry. You're always in control."],
            ].map(([title, desc]) => (
              <div key={title} className="feature-card">
                <div style={{ width:36, height:36, marginBottom:14 }}>
                  <LogoMark size={36}/>
                </div>
                <h3 className="serif" style={{ fontSize:20, fontWeight:500, marginBottom:8, color:"#1a1410" }}>{title}</h3>
                <p className="sans" style={{ fontSize:13.5, color:"#3d2e1e", lineHeight:1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEMO ── */}
      <section id="demo" className="demo-section" style={{ background:"#f2ead8", borderBottom:"1px solid #d8cebf", padding:"80px 40px" }}>
        <div style={{ maxWidth:1120, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:44 }}>
            <div className="divider"/>
            <h2 className="serif" style={{ fontSize:38, fontWeight:400, color:"#1a1410" }}>Watch it work — live</h2>
            <p className="sans" style={{ color:"#3d2e1e", marginTop:12, fontSize:15, maxWidth:540, margin:"12px auto 0", lineHeight:1.7 }}>
              Pick a real scenario. Each step is explained as it happens — callouts point to exactly what to watch.
            </p>
          </div>
          <LiveDemo/>
        </div>
      </section>

      {/* ── COMPARISON ── */}
      <section className="compare-section" style={{ maxWidth:900, margin:"0 auto", padding:"88px 40px" }}>
        <div style={{ textAlign:"center", marginBottom:52 }}>
          <div className="divider"/>
          <h2 className="serif" style={{ fontSize:38, fontWeight:400, color:"#1a1410" }}>Why couples choose us<br/><em>over traditional RSVP tools</em></h2>
        </div>
        <div className="compare-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:22 }}>
          {[
            ["The old way (website links)", false, ["Guests must click a link and navigate a portal","Older guests get confused or forget to go back","You spend weeks chasing non-responses","Messy group chats with scattered updates","Manual data entry into your spreadsheet"]],
            ["FinalCount", true, ["Conversation happens in native SMS / WhatsApp","Zero learning curve — works for every generation","Polite automated follow-ups run themselves","All replies captured and organized centrally","Google Sheet updates automatically in real time"]]
          ].map(([title, good, items]) => (
            <div key={title} style={{ background: good ? "#2a2118" : "white", border:`1.5px solid ${good ? "#3d3125" : "#c4b8a8"}`, borderRadius:6, padding:"30px 26px" }}>
              <h3 className="serif" style={{ fontSize:20, fontWeight:500, marginBottom:22, color: good ? "#f0ddc0" : "#1a1410" }}>{title}</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
                {items.map((item, i) => (
                  <div key={i} className="sans" style={{ display:"flex", gap:11, alignItems:"flex-start", fontSize:13.5 }}>
                    <span style={{ flexShrink:0, fontSize:15, marginTop:1, color: good ? "#7aba6a" : "#c05050", fontWeight:600 }}>{good ? "✓" : "✗"}</span>
                    <span style={{ color: good ? "#d8c8b0" : "#3d2e1e", lineHeight:1.55 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <div className="testimonial-section" style={{ background:"#f7f3ec", borderTop:"1px solid #d8cebf", borderBottom:"1px solid #d8cebf", padding:"60px 40px", textAlign:"center" }}>
        <div style={{ maxWidth:660, margin:"0 auto" }}>
          <div style={{ color:"#c9a97a", fontSize:40, lineHeight:1, display:"block", marginBottom:8, fontFamily:"Georgia,serif" }}>❝</div>
          <blockquote className="serif" style={{ fontSize:"clamp(20px,3vw,27px)", fontWeight:300, fontStyle:"italic", lineHeight:1.55, color:"#2a1f14" }}>
            We were spending three hours every evening calling people to confirm plus-ones and food preferences. We set this up, and it confirmed 85% of our 300-person guest list within four days. An absolute lifesaver.
          </blockquote>
          <div className="sans" style={{ marginTop:22, fontSize:12, color:"#5a4a3a", letterSpacing:"0.1em", textTransform:"uppercase", fontWeight:600 }}>
            — Michael & Sarah R. &nbsp;·&nbsp; Married Nov. 2025
          </div>
        </div>
      </div>

      {/* ── PRICING ── */}
      <section id="pricing" className="pricing-section" style={{ maxWidth:1100, margin:"0 auto", padding:"88px 40px", textAlign:"center" }}>
        <div className="divider"/>
        <span className="tag" style={{ marginBottom:16, display:"inline-block" }}>Transparent pricing</span>
        <h2 className="serif" style={{ fontSize:40, fontWeight:400, marginTop:14, marginBottom:8, color:"#1a1410" }}>One flat fee.<br/><em>Infinite hours saved.</em></h2>
        <p className="sans" style={{ color:"#3d2e1e", fontSize:15, marginBottom:52, lineHeight:1.7 }}>No subscriptions. No per-guest fees. Pay once, use it for your whole wedding.</p>

        <div className="pricing-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:20, alignItems:"stretch" }}>

          {/* Tier 1 — Intimate */}
          <div style={{ border:"1.5px solid #c4b8a8", borderRadius:8, overflow:"hidden", display:"flex", flexDirection:"column" }}>
            <div style={{ background:"#f7f3ec", padding:"28px 32px", textAlign:"left" }}>
              <div className="sans" style={{ fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:"#8a7a6a", marginBottom:10, fontWeight:600 }}>The Intimate Wedding</div>
              <div style={{ display:"flex", alignItems:"baseline", gap:6 }}>
                <span className="serif" style={{ fontSize:52, fontWeight:300, lineHeight:1, color:"#2a2118" }}>$99</span>
                <span className="sans" style={{ fontSize:12, color:"#8a7a6a" }}>one-time</span>
              </div>
              <div className="sans" style={{ fontSize:12.5, color:"#6b5c4d", marginTop:8, lineHeight:1.5 }}>Perfect for smaller, single-day weddings.</div>
            </div>
            <div style={{ background:"white", padding:"28px 32px", flex:1, display:"flex", flexDirection:"column" }}>
              <div className="sans" style={{ display:"flex", flexDirection:"column", gap:12, flex:1 }}>
                {["Up to 75 guests","Single-day RSVP tracking","Dietary & plus-one capture","Real-time Google Sheets sync","Automated follow-up texts"].map(f => (
                  <div key={f} style={{ display:"flex", gap:10, alignItems:"center", fontSize:13.5, color:"#1a1410" }}>
                    <span style={{ color:"#3d8a2e", fontSize:15, fontWeight:600, flexShrink:0 }}>✓</span> {f}
                  </div>
                ))}
              </div>
              <a href="#waitlist" className="btn-outline" style={{ display:"block", textAlign:"center", marginTop:24, padding:"13px 16px" }} onClick={e => { e.preventDefault(); document.getElementById("waitlist")?.scrollIntoView({ behavior:"smooth" }); }}>Get started</a>
            </div>
          </div>

          {/* Tier 2 — The Grand Affair (featured) */}
          <div className="pricing-featured" style={{ border:"2px solid #2a2118", borderRadius:8, overflow:"hidden", display:"flex", flexDirection:"column", position:"relative", transform:"scale(1.03)", boxShadow:"0 12px 40px rgba(0,0,0,.14)" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, background:"#c9a97a", padding:"6px 0", textAlign:"center" }}>
              <span className="sans" style={{ fontSize:10.5, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#1a1410" }}>Most Popular</span>
            </div>
            <div style={{ background:"#2a2118", padding:"40px 32px 28px", textAlign:"left" }}>
              <div className="sans" style={{ fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:"#c9a97a", marginBottom:10, fontWeight:600 }}>The Grand Affair</div>
              <div style={{ display:"flex", alignItems:"baseline", gap:6 }}>
                <span className="serif" style={{ fontSize:52, fontWeight:300, lineHeight:1, color:"white" }}>$199</span>
                <span className="sans" style={{ fontSize:12, color:"#c8b89a" }}>one-time</span>
              </div>
              <div className="sans" style={{ fontSize:12.5, color:"#c8b89a", marginTop:8, lineHeight:1.5 }}>The most popular choice for 100–250 guest weddings.</div>
            </div>
            <div style={{ background:"white", padding:"28px 32px", flex:1, display:"flex", flexDirection:"column" }}>
              <div className="sans" style={{ display:"flex", flexDirection:"column", gap:12, flex:1 }}>
                {["Up to 250 guests","Multi-day event tracking","Dietary & plus-one capture","Real-time Google Sheets sync","Automated follow-up texts","Full conversation log access","Custom assistant persona"].map(f => (
                  <div key={f} style={{ display:"flex", gap:10, alignItems:"center", fontSize:13.5, color:"#1a1410" }}>
                    <span style={{ color:"#3d8a2e", fontSize:15, fontWeight:600, flexShrink:0 }}>✓</span> {f}
                  </div>
                ))}
              </div>
              <a href="#waitlist" className="btn-dark" style={{ display:"block", textAlign:"center", marginTop:24, padding:"14px 16px" }} onClick={e => { e.preventDefault(); document.getElementById("waitlist")?.scrollIntoView({ behavior:"smooth" }); }}>Secure your spot</a>
              <div className="sans" style={{ textAlign:"center", fontSize:11.5, color:"#5a4a3a", marginTop:10, fontWeight:500 }}>Beta pricing — locked in before public launch</div>
            </div>
          </div>

          {/* Tier 3 — The Extravaganza */}
          <div style={{ border:"1.5px solid #c4b8a8", borderRadius:8, overflow:"hidden", display:"flex", flexDirection:"column" }}>
            <div style={{ background:"#f7f3ec", padding:"28px 32px", textAlign:"left" }}>
              <div className="sans" style={{ fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:"#8a7a6a", marginBottom:10, fontWeight:600 }}>The Extravaganza</div>
              <div style={{ display:"flex", alignItems:"baseline", gap:6 }}>
                <span className="serif" style={{ fontSize:52, fontWeight:300, lineHeight:1, color:"#2a2118" }}>$399</span>
                <span className="sans" style={{ fontSize:12, color:"#8a7a6a" }}>one-time</span>
              </div>
              <div className="sans" style={{ fontSize:12.5, color:"#6b5c4d", marginTop:8, lineHeight:1.5 }}>Large multi-day celebrations, 250–600 guests.</div>
            </div>
            <div style={{ background:"white", padding:"28px 32px", flex:1, display:"flex", flexDirection:"column" }}>
              <div className="sans" style={{ display:"flex", flexDirection:"column", gap:12, flex:1 }}>
                {["Up to 600 guests","Unlimited multi-day events","Dietary & plus-one capture","Real-time Google Sheets sync","Automated follow-up texts","Full conversation log access","Custom assistant persona","Multilingual support","Priority onboarding"].map(f => (
                  <div key={f} style={{ display:"flex", gap:10, alignItems:"center", fontSize:13.5, color:"#1a1410" }}>
                    <span style={{ color:"#3d8a2e", fontSize:15, fontWeight:600, flexShrink:0 }}>✓</span> {f}
                  </div>
                ))}
              </div>
              <a href="#waitlist" className="btn-outline" style={{ display:"block", textAlign:"center", marginTop:24, padding:"13px 16px" }} onClick={e => { e.preventDefault(); document.getElementById("waitlist")?.scrollIntoView({ behavior:"smooth" }); }}>Get started</a>
            </div>
          </div>

        </div>

        <p className="sans" style={{ fontSize:13, color:"#8a7a6a", marginTop:32, lineHeight:1.6 }}>
          Not sure which tier? <a href="#waitlist" style={{ color:"#2a2118", fontWeight:600, textDecoration:"underline" }} onClick={e => { e.preventDefault(); document.getElementById("waitlist")?.scrollIntoView({ behavior:"smooth" }); }}>Join the waitlist</a> and we'll recommend the right fit based on your guest count.
        </p>
      </section>

      {/* ── FAQ ── */}
      <section className="faq-section" style={{ background:"#f7f3ec", borderTop:"1px solid #d8cebf", padding:"78px 40px" }}>
        <div style={{ maxWidth:700, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <div className="divider"/>
            <h2 className="serif" style={{ fontSize:36, fontWeight:400, color:"#1a1410" }}>Common questions</h2>
          </div>
          {FAQS.map((f, i) => (
            <div key={i}>
              <button className="faq-btn" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{f.q}</span>
                <span style={{ color:"#6b4d1f", fontSize:24, fontWeight:300, marginLeft:16, flexShrink:0 }}>{openFaq === i ? "−" : "+"}</span>
              </button>
              {openFaq === i && (
                <div className="sans" style={{ padding:"0 0 18px", fontSize:14.5, color:"#3d2e1e", lineHeight:1.75, borderBottom:"1px solid #d8cebf" }}>{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── WAITLIST ── */}
      <section id="waitlist" className="waitlist-section" style={{ background:"#2a2118", padding:"88px 40px" }}>
        <div style={{ maxWidth:520, margin:"0 auto", textAlign:"center" }}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:20 }}>
            <LogoMark size={52} dark={true}/>
          </div>
          <div style={{ width:48, height:1.5, background:"#c9a97a", margin:"0 auto 26px" }}/>
          <span className="tag" style={{ background:"rgba(232,216,192,.12)", color:"#e8d8c0", marginBottom:18, display:"inline-block" }}>Limited Beta Access</span>
          <h2 className="serif" style={{ fontSize:44, fontWeight:400, marginTop:14, marginBottom:14, lineHeight:1.15, color:"#faf8f4" }}>Take your evenings back.</h2>
          <p className="sans" style={{ color:"#c8b89a", fontSize:15, lineHeight:1.7, marginBottom:38 }}>
            We're onboarding a select group of couples for our private beta at flat launch pricing. Drop your email to reserve your spot.
          </p>
          <div style={{ background:"#1a1410", borderRadius:4, padding:34 }}>
            {submitted ? (
              <div style={{ textAlign:"center", padding:"12px 0" }}>
                <div className="serif" style={{ fontSize:30, color:"#c9a97a", marginBottom:8 }}>✨</div>
                <h3 className="serif" style={{ fontSize:26, fontWeight:400, color:"#f0ddc0", marginBottom:8 }}>You're on the list!</h3>
                <p className="sans" style={{ fontSize:13.5, color:"#b8a890", lineHeight:1.6 }}>We'll be in touch within 48 hours with onboarding details.</p>
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} style={{ display:"flex", flexDirection:"column", gap:13 }}>
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setSubmitError(false); }}
                  disabled={submitting}
                  style={{ background:"#2a2118", border:`1.5px solid ${submitError ? "#e05050" : "#4a3a2a"}`, color:"#f0ece6", borderRadius:2, opacity: submitting ? 0.7 : 1 }}
                />
                {submitError && (
                  <div className="sans" style={{ fontSize:12.5, color:"#e08080", textAlign:"center" }}>
                    Something went wrong — please try again or email us directly.
                  </div>
                )}
                <button
                  type="submit"
                  disabled={submitting || !email}
                  className="btn-dark"
                  style={{ width:"100%", textAlign:"center", padding:15, background: submitting ? "#a08060" : "#c9a97a", color:"#1a1410", fontWeight:600, cursor: submitting ? "not-allowed" : "pointer", transition:"background .2s" }}
                >
                  {submitting ? "Submitting…" : "Request early access"}
                </button>
                <div className="sans" style={{ fontSize:12, color:"#665a50", textAlign:"center" }}>No spam. Just your access link when we're ready.</div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:"#1a1410", borderTop:"1px solid #2e2822", padding:"28px 40px" }}>
        <div className="sans footer-inner" style={{ maxWidth:1120, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:12.5, color:"#b8a890" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <LogoMark size={28}/>
            <span className="serif" style={{ fontSize:17, color:"#e8d8c0" }}>FinalCount<span style={{ color:"#c9a97a" }}>.</span></span>
          </div>
          <span>© 2026 · Built for perfection · Passes the Grandmother Test</span>
        </div>
      </footer>
    </div>
  );
}
