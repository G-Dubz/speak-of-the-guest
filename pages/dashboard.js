import { useState, useRef } from "react";

const C = {
  espresso:"#2a2118", espressoDark:"#1a1410", espressoDeep:"#111009",
  gold:"#c9a97a", goldLight:"#e8d8c0",
  cream:"#faf8f4", creamMid:"#f2ead8", creamBorder:"#e0d4c4",
  text:"#1a1410", textMid:"#3d2e1e", textLight:"#6b5c4d", textFaint:"#8a7a6a",
  green:"#2e7d32", greenBg:"#e8f5e9",
  red:"#b91c1c", redBg:"#fce8e8",
  amber:"#92400e", amberBg:"#fef3c7",
};

function LogoMark({ size=32, dark=false }) {
  const bg=dark?C.gold:C.espresso, fg=dark?C.espressoDeep:C.cream, gld=dark?C.espressoDeep:C.gold;
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
      <path d="M36 2 L70 36 L36 70 L2 36 Z" fill={bg}/>
      <path d="M36 10 L62 36 L36 62 L10 36 Z" fill="none" stroke={gld} strokeWidth="1.5" opacity="0.3"/>
      <line x1="22" y1="24" x2="22" y2="48" stroke={fg} strokeWidth="3" strokeLinecap="round"/>
      <line x1="22" y1="24" x2="38" y2="24" stroke={fg} strokeWidth="3" strokeLinecap="round"/>
      <line x1="22" y1="34" x2="34" y2="34" stroke={fg} strokeWidth="3" strokeLinecap="round"/>
      <polyline points="32,40 39,49 52,30" fill="none" stroke={gld} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function StatusPill({ status }) {
  const map = { Confirmed:{bg:C.greenBg,color:C.green}, Declined:{bg:C.redBg,color:C.red}, Pending:{bg:C.amberBg,color:C.amber} };
  const s = map[status]||map.Pending;
  return <span style={{ display:"inline-block", padding:"3px 12px", borderRadius:10, fontSize:11, fontWeight:700, letterSpacing:"0.05em", background:s.bg, color:s.color, fontFamily:"'DM Sans',sans-serif", textTransform:"uppercase" }}>{status}</span>;
}

// ─── Auth ────────────────────────────────────────────────────────────────────
let pendingCode = null;

function LoginPage({ onLogin }) {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState("");
  const codeRef = useRef(null);

  async function sendCode(e) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r=>setTimeout(r,900));
    pendingCode = String(Math.floor(100000+Math.random()*900000));
    setSentTo(email); setStep("code"); setLoading(false);
    setTimeout(()=>codeRef.current?.focus(),100);
  }

  async function verifyCode(e) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r=>setTimeout(r,700));
    if (code===pendingCode) { pendingCode=null; onLogin(sentTo); }
    else { setError("That code doesn't match. Please try again."); setLoading(false); }
  }

  return (
    <div style={{ minHeight:"100vh", background:C.cream, fontFamily:"'Cormorant Garamond',Georgia,serif", display:"flex", flexDirection:"column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .li{width:100%;padding:14px 16px;border:1.5px solid ${C.creamBorder};border-radius:3px;font-family:'DM Sans',sans-serif;font-size:15px;background:white;color:${C.text};outline:none;transition:border-color .2s,box-shadow .2s}
        .li:focus{border-color:${C.gold};box-shadow:0 0 0 3px rgba(201,169,122,.15)}
        .lb{width:100%;padding:15px;border:none;border-radius:3px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;background:${C.espresso};color:${C.cream};transition:all .2s;box-shadow:0 2px 8px rgba(0,0,0,.14)}
        .lb:hover:not(:disabled){background:${C.espressoDark};transform:translateY(-1px)}
        .lb:disabled{opacity:.6;cursor:not-allowed}
        .ci{width:100%;padding:18px 16px;border:1.5px solid ${C.creamBorder};border-radius:3px;font-family:'DM Sans',sans-serif;font-size:28px;font-weight:600;letter-spacing:.35em;text-align:center;background:white;color:${C.text};outline:none;transition:border-color .2s,box-shadow .2s}
        .ci:focus{border-color:${C.gold};box-shadow:0 0 0 3px rgba(201,169,122,.15)}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
        .fu{animation:fadeUp .5s cubic-bezier(.16,1,.3,1) both}
      `}</style>
      <nav style={{ borderBottom:`1px solid ${C.creamBorder}`, padding:"0 40px" }}>
        <div style={{ maxWidth:1120, margin:"0 auto", display:"flex", alignItems:"center", height:64 }}>
          <a href="/" style={{ textDecoration:"none", display:"flex", alignItems:"center", gap:10 }}>
            <LogoMark size={32}/><span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:19, fontWeight:600, color:C.text }}>Final<span style={{ color:C.gold }}>Count</span></span>
          </a>
        </div>
      </nav>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 20px" }}>
        <div className="fu" style={{ width:"100%", maxWidth:440 }}>
          {step==="email" ? (
            <>
              <div style={{ textAlign:"center", marginBottom:36 }}>
                <LogoMark size={52}/>
                <h1 style={{ fontSize:32, fontWeight:400, color:C.text, marginTop:16, marginBottom:8 }}>Welcome back</h1>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14.5, color:C.textLight, lineHeight:1.6 }}>Enter your email to receive a sign-in code</p>
              </div>
              <div style={{ background:"white", border:`1.5px solid ${C.creamBorder}`, borderRadius:8, padding:"32px 28px" }}>
                <form onSubmit={sendCode} style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  <div>
                    <label style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11.5, fontWeight:600, color:C.textFaint, letterSpacing:"0.1em", textTransform:"uppercase", display:"block", marginBottom:8 }}>Email address</label>
                    <input className="li" type="email" required placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} disabled={loading}/>
                  </div>
                  <button className="lb" type="submit" disabled={loading||!email}>{loading?"Sending…":"Send sign-in code"}</button>
                </form>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:C.textFaint, textAlign:"center", marginTop:16, lineHeight:1.6 }}>We'll send a 6-digit code. No password needed.</p>
              </div>
            </>
          ) : (
            <>
              <div style={{ textAlign:"center", marginBottom:36 }}>
                <h1 style={{ fontSize:30, fontWeight:400, color:C.text, marginBottom:8 }}>Check your inbox</h1>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, color:C.textLight, lineHeight:1.6 }}>We sent a 6-digit code to<br/><strong style={{ color:C.text }}>{sentTo}</strong></p>
              </div>
              <div style={{ background:C.creamMid, border:`1.5px solid ${C.creamBorder}`, borderRadius:8, padding:"14px 20px", marginBottom:20, textAlign:"center" }}>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:C.textFaint, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:6 }}>Your code (test mode)</div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:32, fontWeight:700, color:C.espresso, letterSpacing:"0.3em" }}>{pendingCode}</div>
              </div>
              <div style={{ background:"white", border:`1.5px solid ${C.creamBorder}`, borderRadius:8, padding:"32px 28px" }}>
                <form onSubmit={verifyCode} style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  <div>
                    <label style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11.5, fontWeight:600, color:C.textFaint, letterSpacing:"0.1em", textTransform:"uppercase", display:"block", marginBottom:8 }}>6-digit code</label>
                    <input ref={codeRef} className="ci" type="text" inputMode="numeric" maxLength={6} placeholder="000000" value={code} onChange={e=>{setCode(e.target.value.replace(/\D/g,""));setError("");}} disabled={loading}/>
                    {error&&<p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12.5, color:C.red, marginTop:8 }}>{error}</p>}
                  </div>
                  <button className="lb" type="submit" disabled={loading||code.length<6}>{loading?"Verifying…":"Sign in"}</button>
                </form>
                <button onClick={()=>{setStep("email");setCode("");setError("");}} style={{ background:"none",border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:13,color:C.gold,textDecoration:"underline",display:"block",textAlign:"center",marginTop:16,width:"100%" }}>Use a different email</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── AI Conversation Simulator ───────────────────────────────────────────────
function ConvoSimulator({ guest, weddingCouple, onClose, onUpdateGuest }) {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [detectedStatus, setDetectedStatus] = useState(null);
  const msgsRef = useRef(null);
  const inputRef = useRef(null);

  function scrollBottom() { setTimeout(()=>{ if(msgsRef.current) msgsRef.current.scrollTop=9999; },60); }

  async function callClaude(conversationHistory) {
    const systemPrompt = `You are FinalCount, a warm and professional AI wedding RSVP assistant texting on behalf of ${weddingCouple}. You are texting their guest named ${guest.name}.

Your job:
1. Send a friendly personalized opening message asking if they can attend the wedding
2. Understand their natural reply — they may confirm, decline, mention plus-ones, dietary needs, or multi-day attendance
3. Confirm everything back clearly and warmly
4. After their reply, always end your message with a JSON block on the last line in this exact format (no markdown):
{"status":"Confirmed","events":"All events","dietary":"None","plusOne":"No"}

Use "Confirmed", "Declined", or "Pending" for status.
Keep messages warm, brief, and natural — like a real text. Never sound robotic.
Address the guest by their first name: ${guest.name.split(" ")[0]}.`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({
        model:"claude-sonnet-4-20250514",
        max_tokens:1000,
        system: systemPrompt,
        messages: conversationHistory
      })
    });
    const data = await res.json();
    const raw = data.content?.[0]?.text || "";

    // Extract JSON from last line if present
    const lines = raw.trim().split("\n");
    const lastLine = lines[lines.length-1].trim();
    let parsed = null;
    try { parsed = JSON.parse(lastLine); } catch(e) {}

    const displayText = parsed
      ? lines.slice(0,-1).join("\n").trim()
      : raw.trim();

    return { text: displayText, parsed };
  }

  async function startConversation() {
    setStarted(true);
    setLoading(true);
    const history = [{ role:"user", content:`Start the RSVP conversation — send the opening message to ${guest.name}.` }];
    const { text, parsed } = await callClaude(history);
    const botMsg = { role:"assistant", content:`${text}` };
    setMessages([{ side:"bot", text }, botMsg]);
    if (parsed) setDetectedStatus(parsed);
    setLoading(false);
    scrollBottom();
    setTimeout(()=>inputRef.current?.focus(),100);
  }

  async function sendReply() {
    if (!userInput.trim()||loading) return;
    const userText = userInput.trim();
    setUserInput("");
    setLoading(true);

    // Build history from current messages (alternating bot/user)
    const history = [];
    // Opening turn
    history.push({ role:"user", content:`Start the RSVP conversation — send the opening message to ${guest.name}.` });
    // All subsequent turns
    for (let i=0; i<messages.length; i++) {
      const m = messages[i];
      if (m.side==="bot" && i===0) {
        history.push({ role:"assistant", content: m.text });
      } else if (m.side==="user") {
        history.push({ role:"user", content: m.text });
      } else if (m.side==="bot") {
        history.push({ role:"assistant", content: m.text });
      }
    }
    history.push({ role:"user", content: userText });

    const newMsgs = [...messages, { side:"user", text:userText }];
    setMessages(newMsgs);
    scrollBottom();

    const { text, parsed } = await callClaude(history);
    setMessages([...newMsgs, { side:"bot", text }]);
    if (parsed) setDetectedStatus(parsed);
    setLoading(false);
    scrollBottom();
    setTimeout(()=>inputRef.current?.focus(),100);
  }

  function saveAndClose() {
    if (detectedStatus) {
      onUpdateGuest({
        ...guest,
        status: detectedStatus.status || guest.status,
        events: detectedStatus.events || guest.events,
        dietary: detectedStatus.dietary !== "None" ? detectedStatus.dietary : guest.dietary,
        notes: detectedStatus.plusOne !== "No" ? `Plus-one: ${detectedStatus.plusOne}` : guest.notes,
        log: messages.filter(m=>m.side).map(m=>({ side:m.side, text:m.text }))
      });
    } else {
      onUpdateGuest({ ...guest, log: messages.filter(m=>m.side).map(m=>({ side:m.side, text:m.text })) });
    }
    onClose();
  }

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(20,14,10,.55)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:300, padding:20, backdropFilter:"blur(4px)", animation:"fadeIn .2s ease both" }}>
      <div style={{ background:"white", borderRadius:16, width:"100%", maxWidth:560, boxShadow:"0 32px 80px rgba(0,0,0,.28)", display:"flex", flexDirection:"column", maxHeight:"90vh", animation:"slideUp .3s cubic-bezier(.16,1,.3,1) both" }}>

        {/* Header */}
        <div style={{ padding:"20px 24px", borderBottom:`1px solid ${C.creamBorder}`, display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
          <div>
            <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:20, fontWeight:500, color:C.text }}>
              Simulating: {guest.name}
            </div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12.5, color:C.textFaint, marginTop:2 }}>
              Type as the guest · FinalCount AI will respond · RSVP updates automatically
            </div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", fontSize:20, color:C.textFaint, padding:"4px 8px", borderRadius:4, lineHeight:1 }}>✕</button>
        </div>

        {/* Detected status bar */}
        {detectedStatus && (
          <div style={{ padding:"10px 24px", background:C.creamMid, borderBottom:`1px solid ${C.creamBorder}`, display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:C.textFaint, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase" }}>Detected:</span>
            <StatusPill status={detectedStatus.status}/>
            {detectedStatus.events !== "None" && <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:C.textLight }}>📅 {detectedStatus.events}</span>}
            {detectedStatus.dietary !== "None" && <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:C.textLight }}>🌿 {detectedStatus.dietary}</span>}
            {detectedStatus.plusOne !== "No" && <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:C.textLight }}>+1 {detectedStatus.plusOne}</span>}
          </div>
        )}

        {/* Messages */}
        <div ref={msgsRef} style={{ flex:1, overflowY:"auto", padding:"20px", background:"#f9f6f0", display:"flex", flexDirection:"column", gap:10, minHeight:300 }}>
          {!started ? (
            <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, padding:"40px 20px" }}>
              <LogoMark size={48}/>
              <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:20, color:C.text, textAlign:"center" }}>
                Ready to simulate the conversation
              </div>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13.5, color:C.textLight, textAlign:"center", lineHeight:1.6, maxWidth:320 }}>
                FinalCount will send the opening RSVP message to <strong>{guest.name}</strong>. You reply as the guest and watch it all work in real time.
              </p>
              <button
                onClick={startConversation}
                style={{ padding:"13px 28px", background:C.espresso, color:C.cream, border:"none", borderRadius:3, fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", cursor:"pointer", boxShadow:"0 2px 8px rgba(0,0,0,.14)", transition:"all .18s" }}
              >
                Start conversation
              </button>
            </div>
          ) : (
            <>
              {messages.filter(m=>m.side).map((m,i) => (
                <div key={i} style={{ display:"flex", flexDirection:"column" }}>
                  <div style={{ fontSize:10.5, fontFamily:"'DM Sans',sans-serif", color:C.textFaint, marginBottom:4, alignSelf:m.side==="bot"?"flex-start":"flex-end", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase" }}>
                    {m.side==="bot" ? "FinalCount" : "Guest (you)"}
                  </div>
                  <div style={{
                    background: m.side==="bot" ? "#E9E9EB" : "#007AFF",
                    color: m.side==="bot" ? "#000" : "white",
                    borderRadius: m.side==="bot" ? "18px 18px 18px 4px" : "18px 18px 4px 18px",
                    padding:"10px 14px", fontSize:14, lineHeight:1.5,
                    maxWidth:"80%", alignSelf:m.side==="bot"?"flex-start":"flex-end",
                    fontFamily:"-apple-system,'SF Pro Text',sans-serif",
                    animation:"dIn .35s ease both",
                    whiteSpace:"pre-wrap"
                  }}>{m.text}</div>
                </div>
              ))}
              {loading && (
                <div style={{ alignSelf:"flex-start" }}>
                  <div style={{ fontSize:10.5, fontFamily:"'DM Sans',sans-serif", color:C.textFaint, marginBottom:4, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase" }}>FinalCount</div>
                  <div style={{ background:"#E9E9EB", borderRadius:"18px 18px 18px 4px", padding:"13px 18px", display:"flex", gap:5, alignItems:"center" }}>
                    {[0,.22,.44].map(d=>(
                      <div key={d} style={{ width:7,height:7,borderRadius:"50%",background:"#8e8e93",animation:`blink 1.3s ${d}s infinite` }}/>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Input */}
        {started && (
          <div style={{ padding:"14px 20px", borderTop:`1px solid ${C.creamBorder}`, display:"flex", gap:10, flexShrink:0, background:"white" }}>
            <input
              ref={inputRef}
              value={userInput}
              onChange={e=>setUserInput(e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendReply();} }}
              placeholder="Reply as the guest…"
              disabled={loading}
              style={{ flex:1, padding:"10px 14px", border:`1.5px solid ${C.creamBorder}`, borderRadius:20, fontFamily:"'DM Sans',sans-serif", fontSize:14, color:C.text, background:"white", outline:"none" }}
            />
            <button
              onClick={sendReply}
              disabled={loading||!userInput.trim()}
              style={{ width:40,height:40,borderRadius:"50%",background:userInput.trim()&&!loading?C.espresso:"#d0c8be",border:"none",cursor:userInput.trim()&&!loading?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"background .18s" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 8H2M8 2l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        )}

        {/* Footer actions */}
        <div style={{ padding:"12px 20px", borderTop:`1px solid ${C.creamBorder}`, display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0, background:C.cream }}>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:C.textFaint }}>
            {detectedStatus ? "✓ RSVP status detected — ready to save" : "Complete the conversation to capture RSVP details"}
          </span>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={onClose} style={{ padding:"8px 16px", background:"transparent", border:`1.5px solid ${C.creamBorder}`, borderRadius:3, fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:500, color:C.textMid, cursor:"pointer" }}>Discard</button>
            <button
              onClick={saveAndClose}
              disabled={messages.filter(m=>m.side).length===0}
              style={{ padding:"8px 16px", background:messages.filter(m=>m.side).length>0?C.espresso:"#c8beb4", border:"none", borderRadius:3, fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:C.cream, cursor:messages.filter(m=>m.side).length>0?"pointer":"default", transition:"background .18s" }}
            >
              Save & update RSVP
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
        @keyframes dIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        @keyframes blink{0%,80%,100%{opacity:.25}40%{opacity:1}}
      `}</style>
    </div>
  );
}

// ─── Send Invites Modal ──────────────────────────────────────────────────────
function SendInvitesModal({ guests, onClose }) {
  const [selected, setSelected] = useState(new Set(guests.filter(g=>g.status==="Pending").map(g=>g.id)));
  const [sent, setSent] = useState(false);

  function toggle(id) {
    setSelected(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  function toggleAll() {
    if (selected.size===guests.length) setSelected(new Set());
    else setSelected(new Set(guests.map(g=>g.id)));
  }

  function handleSend() {
    setSent(true);
    setTimeout(onClose, 2200);
  }

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(20,14,10,.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:250, padding:20, backdropFilter:"blur(3px)", animation:"fadeIn .2s ease" }}>
      <div style={{ background:"white", borderRadius:14, width:"100%", maxWidth:520, boxShadow:"0 28px 72px rgba(0,0,0,.22)", animation:"slideUp .3s cubic-bezier(.16,1,.3,1)", overflow:"hidden" }}>
        <div style={{ padding:"22px 26px", borderBottom:`1px solid ${C.creamBorder}` }}>
          <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:24, fontWeight:400, color:C.text, marginBottom:4 }}>Send RSVP invites</div>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.textLight, lineHeight:1.5 }}>
            Select which guests to text. Pending guests are pre-selected.
          </p>
        </div>

        {sent ? (
          <div style={{ padding:"48px 26px", textAlign:"center" }}>
            <div style={{ fontSize:36, marginBottom:12 }}>✅</div>
            <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:22, color:C.text, marginBottom:8 }}>Invites queued!</div>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13.5, color:C.textLight, lineHeight:1.6 }}>
              {selected.size} message{selected.size!==1?"s":""} will be sent once the SMS engine is connected.<br/>
              <span style={{ color:C.textFaint, fontSize:12 }}>SMS via Twilio — coming in the next build.</span>
            </p>
          </div>
        ) : (
          <>
            <div style={{ maxHeight:320, overflowY:"auto" }}>
              <div style={{ padding:"10px 26px", borderBottom:`1px solid ${C.creamBorder}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <label style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12.5, fontWeight:600, color:C.textLight, display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
                  <input type="checkbox" checked={selected.size===guests.length} onChange={toggleAll} style={{ width:15, height:15, accentColor:C.espresso }}/> Select all ({guests.length})
                </label>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:C.textFaint }}>{selected.size} selected</span>
              </div>
              {guests.map(g => (
                <label key={g.id} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 26px", borderBottom:`1px solid #f5f0ea`, cursor:"pointer", transition:"background .12s" }} onMouseEnter={e=>e.currentTarget.style.background=C.creamMid} onMouseLeave={e=>e.currentTarget.style.background="white"}>
                  <input type="checkbox" checked={selected.has(g.id)} onChange={()=>toggle(g.id)} style={{ width:15, height:15, accentColor:C.espresso, flexShrink:0 }}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:500, color:C.text }}>{g.name}</div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:C.textFaint }}>{g.phone||"No phone on file"}</div>
                  </div>
                  <StatusPill status={g.status}/>
                </label>
              ))}
            </div>
            <div style={{ padding:"16px 26px", display:"flex", justifyContent:"flex-end", gap:10, borderTop:`1px solid ${C.creamBorder}` }}>
              <button onClick={onClose} style={{ padding:"10px 20px", background:"transparent", border:`1.5px solid ${C.creamBorder}`, borderRadius:3, fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:500, color:C.textMid, cursor:"pointer" }}>Cancel</button>
              <button
                onClick={handleSend}
                disabled={selected.size===0}
                style={{ padding:"10px 22px", background:selected.size>0?C.espresso:"#c0b8b0", border:"none", borderRadius:3, fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", color:C.cream, cursor:selected.size>0?"pointer":"default", transition:"background .18s" }}
              >
                Send {selected.size} invite{selected.size!==1?"s":""}
              </button>
            </div>
          </>
        )}
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
const TABS = ["Guest List", "Conversation Log"];

function Dashboard({ userEmail, onLogout }) {
  const [tab, setTab] = useState("Guest List");
  const [guests, setGuests] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editGuest, setEditGuest] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [logGuest, setLogGuest] = useState(null);
  const [simGuest, setSimGuest] = useState(null);
  const [showSendModal, setShowSendModal] = useState(false);

  const confirmed = guests.filter(g=>g.status==="Confirmed").length;
  const declined  = guests.filter(g=>g.status==="Declined").length;
  const pending   = guests.filter(g=>g.status==="Pending").length;
  const total     = guests.length;

  const filtered = guests.filter(g => {
    const ms = g.name.toLowerCase().includes(search.toLowerCase())||(g.phone||"").includes(search);
    const mf = filterStatus==="All"||g.status===filterStatus;
    return ms&&mf;
  });

  function saveGuest(data) {
    if (editGuest) { setGuests(prev=>prev.map(g=>g.id===editGuest.id?{...g,...data}:g)); setEditGuest(null); }
    else { setGuests(prev=>[...prev,{...data,id:Date.now(),status:data.status||"Pending",log:[]}]); }
    setShowAdd(false);
  }

  function deleteGuest(id) { if(confirm("Remove this guest?")) setGuests(prev=>prev.filter(g=>g.id!==id)); }

  function updateGuestFromSim(updated) {
    setGuests(prev=>prev.map(g=>g.id===updated.id?updated:g));
    if (logGuest?.id===updated.id) setLogGuest(updated);
  }

  const weddingCouple = userEmail.split("@")[0].replace(/[._]/g," ").split(" ").map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(" ");

  return (
    <div style={{ minHeight:"100vh", background:"#f5f1eb", fontFamily:"'DM Sans',sans-serif", display:"flex", flexDirection:"column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .db-card{background:white;border:1px solid ${C.creamBorder};border-radius:10px}
        .db-btn{background:${C.espresso};color:${C.cream};border:none;padding:10px 20px;border-radius:3px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;transition:all .18s;box-shadow:0 2px 6px rgba(0,0,0,.12)}
        .db-btn:hover{background:${C.espressoDark};transform:translateY(-1px)}
        .db-btn-ghost{background:transparent;color:${C.textMid};border:1.5px solid ${C.creamBorder};padding:9px 18px;border-radius:3px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;cursor:pointer;transition:all .18s}
        .db-btn-ghost:hover{border-color:${C.espresso};color:${C.espresso};background:${C.creamMid}}
        .db-btn-gold{background:${C.gold};color:${C.espressoDeep};border:none;padding:10px 20px;border-radius:3px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;transition:all .18s;box-shadow:0 2px 6px rgba(0,0,0,.1)}
        .db-btn-gold:hover{background:#b8975e;transform:translateY(-1px)}
        .db-input{width:100%;padding:10px 13px;border:1.5px solid ${C.creamBorder};border-radius:3px;font-family:'DM Sans',sans-serif;font-size:14px;color:${C.text};background:white;outline:none;transition:border-color .2s}
        .db-input:focus{border-color:${C.gold}}
        .db-select{padding:9px 13px;border:1.5px solid ${C.creamBorder};border-radius:3px;font-family:'DM Sans',sans-serif;font-size:13px;color:${C.text};background:white;outline:none;cursor:pointer}
        .db-tab{padding:10px 20px;border:none;background:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:13.5px;font-weight:500;color:${C.textLight};border-bottom:2px solid transparent;transition:all .18s;white-space:nowrap}
        .db-tab.active{color:${C.espresso};border-bottom-color:${C.gold};font-weight:600}
        .db-tab:hover:not(.active){color:${C.text}}
        .db-tr{border-bottom:1px solid #f0ead8;transition:background .15s}
        .db-tr:hover{background:#faf7f2}
        .db-tr:last-child{border-bottom:none}
        .db-action{background:none;border:none;cursor:pointer;padding:5px 8px;border-radius:4px;font-size:13px;transition:all .15s;font-family:'DM Sans',sans-serif}
        .db-action:hover{background:${C.creamMid}}
        .sim-btn{background:transparent;border:1.5px solid ${C.gold};color:${C.amber};padding:5px 10px;border-radius:20px;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;cursor:pointer;letter-spacing:.04em;transition:all .18s;white-space:nowrap}
        .sim-btn:hover{background:${C.gold};color:${C.espressoDeep}}
        .modal-overlay{position:fixed;inset:0;background:rgba(20,14,10,.45);display:flex;align-items:center;justify-content:center;z-index:200;padding:20px;backdrop-filter:blur(2px);animation:fadeIn .2s ease both}
        .modal-card{background:white;border-radius:12px;width:100%;max-width:500px;padding:32px;box-shadow:0 24px 64px rgba(0,0,0,.2);animation:slideUp .3s cubic-bezier(.16,1,.3,1) both;overflow-y:auto;max-height:90vh}
        .stat-card{background:white;border:1px solid ${C.creamBorder};border-radius:10px;padding:22px 20px}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
        @keyframes dbFadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
        .db-fade{animation:dbFadeUp .4s cubic-bezier(.16,1,.3,1) both}
        .log-bot{background:#E9E9EB;color:#000;border-radius:16px 16px 16px 4px;padding:9px 14px;font-size:14px;line-height:1.5;max-width:75%;align-self:flex-start;white-space:pre-wrap}
        .log-user{background:#007AFF;color:white;border-radius:16px 16px 4px 16px;padding:9px 14px;font-size:14px;line-height:1.5;max-width:75%;align-self:flex-end;white-space:pre-wrap}
      `}</style>

      {/* Nav */}
      <nav style={{ background:C.espresso, padding:"0 32px", flexShrink:0 }}>
        <div style={{ maxWidth:1280, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", height:60 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <LogoMark size={28} dark={true}/>
            <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:18, fontWeight:600, color:C.goldLight }}>Final<span style={{ color:C.gold }}>Count</span></span>
            <span style={{ width:1, height:18, background:"rgba(255,255,255,.2)", margin:"0 4px" }}/>
            <span style={{ fontSize:12, color:"rgba(255,255,255,.5)", letterSpacing:"0.04em" }}>Couple Dashboard</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:28, height:28, borderRadius:"50%", background:"rgba(201,169,122,.25)", display:"flex", alignItems:"center", justifyContent:"center", border:`1px solid rgba(201,169,122,.4)` }}>
              <span style={{ fontSize:12, fontWeight:600, color:C.gold }}>{userEmail[0].toUpperCase()}</span>
            </div>
            <span style={{ fontSize:12, color:"rgba(255,255,255,.6)" }}>{userEmail}</span>
            <button onClick={onLogout} style={{ background:"rgba(255,255,255,.08)", border:"1px solid rgba(255,255,255,.14)", color:"rgba(255,255,255,.7)", padding:"6px 14px", borderRadius:3, fontSize:12, fontWeight:500, cursor:"pointer" }}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.16)"}
              onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.08)"}
            >Sign out</button>
          </div>
        </div>
      </nav>

      <div style={{ flex:1, maxWidth:1280, margin:"0 auto", width:"100%", padding:"32px" }}>

        {/* Header */}
        <div className="db-fade" style={{ marginBottom:28, display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:16 }}>
          <div>
            <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:34, fontWeight:400, color:C.text, marginBottom:4 }}>Your Wedding Dashboard</h1>
            <p style={{ fontSize:13.5, color:C.textLight }}>Manage guests, simulate conversations, and track RSVPs in real time.</p>
          </div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {total>0 && (
              <button className="db-btn-gold" onClick={()=>setShowSendModal(true)}>
                📨 Send invites
              </button>
            )}
            <button className="db-btn" onClick={()=>{setShowAdd(true);setEditGuest(null);}}>+ Add guest</button>
          </div>
        </div>

        {/* Stats */}
        <div className="db-fade" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
          {[["Total Guests",total,"👥",C.espresso],["Confirmed",confirmed,"✓",C.green],["Pending",pending,"◷",C.amber],["Declined",declined,"✕",C.red]].map(([l,v,ic,col])=>(
            <div key={l} className="stat-card" style={{ position:"relative", overflow:"hidden" }}>
              <div style={{ fontSize:11, fontWeight:600, color:C.textFaint, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>{l}</div>
              <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:44, fontWeight:300, color:col, lineHeight:1 }}>{v}</div>
              <div style={{ position:"absolute", top:16, right:16, fontSize:20, opacity:.15 }}>{ic}</div>
            </div>
          ))}
        </div>

        {/* Progress */}
        {total>0&&(
          <div className="db-card db-fade" style={{ padding:"16px 22px", marginBottom:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ fontSize:12, fontWeight:600, color:C.textLight, letterSpacing:"0.06em", textTransform:"uppercase" }}>Response progress</span>
              <span style={{ fontSize:13, color:C.textLight }}>{Math.round(((confirmed+declined)/total)*100)}% responded</span>
            </div>
            <div style={{ height:6, background:C.creamMid, borderRadius:3, overflow:"hidden", display:"flex" }}>
              <div style={{ width:`${(confirmed/total)*100}%`, background:C.green, transition:"width .6s" }}/>
              <div style={{ width:`${(declined/total)*100}%`, background:C.red, transition:"width .6s" }}/>
            </div>
            <div style={{ display:"flex", gap:18, marginTop:8 }}>
              {[["Confirmed",C.green],["Declined",C.red],["Pending",C.amber]].map(([l,c])=>(
                <div key={l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11.5, color:C.textFaint }}>
                  <span style={{ width:8,height:8,borderRadius:2,background:c,display:"inline-block" }}/>{l}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ borderBottom:`1px solid ${C.creamBorder}`, marginBottom:20, display:"flex" }}>
          {TABS.map(t=>(
            <button key={t} className={`db-tab${tab===t?" active":""}`} onClick={()=>setTab(t)}>{t}</button>
          ))}
        </div>

        {/* Guest List */}
        {tab==="Guest List"&&(
          <div className="db-fade">
            <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
              <input className="db-input" style={{ maxWidth:260 }} placeholder="Search guests…" value={search} onChange={e=>setSearch(e.target.value)}/>
              <select className="db-select" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
                {["All","Confirmed","Pending","Declined"].map(s=><option key={s}>{s}</option>)}
              </select>
              <span style={{ fontSize:12.5, color:C.textFaint, marginLeft:"auto" }}>{filtered.length} guest{filtered.length!==1?"s":""}</span>
            </div>
            <div className="db-card" style={{ overflow:"hidden" }}>
              {filtered.length===0?(
                <div style={{ padding:"60px 32px", textAlign:"center" }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:22, color:C.textFaint, marginBottom:10 }}>
                    {guests.length===0?"No guests yet":"No guests match your filter"}
                  </div>
                  <p style={{ fontSize:13.5, color:C.textFaint, marginBottom:20, lineHeight:1.6 }}>
                    {guests.length===0?"Add your first guest to get started.":"Try a different search or filter."}
                  </p>
                  {guests.length===0&&<button className="db-btn" onClick={()=>{setShowAdd(true);setEditGuest(null);}}>+ Add first guest</button>}
                </div>
              ):(
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead>
                      <tr style={{ background:C.creamMid, borderBottom:`1px solid ${C.creamBorder}` }}>
                        {["Guest","Phone","Status","Events","Dietary","Notes","Actions"].map(h=>(
                          <th key={h} style={{ padding:"11px 14px", textAlign:"left", fontSize:11, fontWeight:600, color:C.textFaint, letterSpacing:"0.08em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(g=>(
                        <tr key={g.id} className="db-tr">
                          <td style={{ padding:"13px 14px", fontWeight:500, color:C.text, whiteSpace:"nowrap" }}>{g.name}</td>
                          <td style={{ padding:"13px 14px", color:C.textLight, fontSize:13 }}>{g.phone||"—"}</td>
                          <td style={{ padding:"13px 14px" }}><StatusPill status={g.status}/></td>
                          <td style={{ padding:"13px 14px", color:C.textLight, fontSize:13 }}>{g.events||"—"}</td>
                          <td style={{ padding:"13px 14px", color:C.textLight, fontSize:13 }}>{g.dietary||"—"}</td>
                          <td style={{ padding:"13px 14px", color:C.textLight, fontSize:13, maxWidth:160 }}>
                            <span style={{ display:"block", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{g.notes||"—"}</span>
                          </td>
                          <td style={{ padding:"13px 14px", whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:6 }}>
                            <button className="sim-btn" onClick={()=>setSimGuest(g)}>▶ Simulate</button>
                            <button className="db-action" title="Edit" onClick={()=>{setEditGuest(g);setShowAdd(true);}}>✎</button>
                            <button className="db-action" title="View log" style={{ color:C.gold }} onClick={()=>{setLogGuest(g);setTab("Conversation Log");}}>💬</button>
                            <button className="db-action" title="Delete" style={{ color:C.red }} onClick={()=>deleteGuest(g.id)}>✕</button>
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

        {/* Conversation Log */}
        {tab==="Conversation Log"&&(
          <div className="db-fade">
            {guests.length===0?(
              <div className="db-card" style={{ padding:"60px 32px", textAlign:"center" }}>
                <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:22, color:C.textFaint, marginBottom:8 }}>No conversations yet</div>
                <p style={{ fontSize:13.5, color:C.textFaint }}>Add guests and run simulations to build up conversation logs.</p>
              </div>
            ):(
              <div style={{ display:"grid", gridTemplateColumns:"260px 1fr", gap:20 }}>
                <div className="db-card" style={{ overflow:"hidden" }}>
                  <div style={{ padding:"12px 16px", borderBottom:`1px solid ${C.creamBorder}`, fontSize:11, fontWeight:600, color:C.textFaint, letterSpacing:"0.08em", textTransform:"uppercase" }}>Guests</div>
                  {guests.map(g=>(
                    <button key={g.id} onClick={()=>setLogGuest(g)} style={{ width:"100%", padding:"12px 16px", background:logGuest?.id===g.id?C.creamMid:"transparent", border:"none", borderBottom:`1px solid ${C.creamBorder}`, cursor:"pointer", textAlign:"left", transition:"background .12s", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div>
                        <div style={{ fontSize:14, fontWeight:500, color:C.text }}>{g.name}</div>
                        <div style={{ fontSize:11.5, color:C.textFaint, marginTop:1 }}>{(g.log||[]).length} messages</div>
                      </div>
                      <StatusPill status={g.status}/>
                    </button>
                  ))}
                </div>
                <div className="db-card" style={{ padding:0, overflow:"hidden" }}>
                  {!logGuest?(
                    <div style={{ padding:"60px 32px", textAlign:"center", color:C.textFaint }}>
                      <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:20, marginBottom:8 }}>Select a guest</div>
                      <p style={{ fontSize:13.5 }}>Click a guest to view their conversation log.</p>
                    </div>
                  ):(
                    <>
                      <div style={{ padding:"14px 20px", borderBottom:`1px solid ${C.creamBorder}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <div>
                          <div style={{ fontSize:15, fontWeight:600, color:C.text }}>{logGuest.name}</div>
                          <div style={{ fontSize:12, color:C.textFaint }}>{logGuest.phone||"No phone on file"}</div>
                        </div>
                        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                          <StatusPill status={logGuest.status}/>
                          <button className="sim-btn" onClick={()=>setSimGuest(logGuest)}>▶ Simulate</button>
                        </div>
                      </div>
                      <div style={{ padding:"20px", minHeight:320, display:"flex", flexDirection:"column", gap:10, background:"#f9f6f0" }}>
                        {(!logGuest.log||logGuest.log.length===0)?(
                          <div style={{ textAlign:"center", padding:"60px 20px", color:C.textFaint }}>
                            <p style={{ fontSize:14, marginBottom:8 }}>No messages yet</p>
                            <p style={{ fontSize:12.5, lineHeight:1.6 }}>Run a simulation to generate a real AI conversation with this guest.</p>
                            <button className="sim-btn" style={{ marginTop:16, padding:"8px 18px", fontSize:12.5 }} onClick={()=>setSimGuest(logGuest)}>▶ Start simulation</button>
                          </div>
                        ):(
                          logGuest.log.map((m,i)=>(
                            <div key={i} style={{ display:"flex", flexDirection:"column" }}>
                              <div style={{ fontSize:10.5, color:C.textFaint, marginBottom:3, alignSelf:m.side==="bot"?"flex-start":"flex-end", fontWeight:600, letterSpacing:"0.05em", textTransform:"uppercase" }}>
                                {m.side==="bot"?"FinalCount":"Guest"}
                              </div>
                              <div className={m.side==="bot"?"log-bot":"log-user"}>{m.text}</div>
                            </div>
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

      {/* Add/Edit guest modal */}
      {showAdd&&(
        <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget){setShowAdd(false);setEditGuest(null);}}}>
          <div className="modal-card">
            <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:26, fontWeight:400, color:C.text, marginBottom:6 }}>{editGuest?"Edit guest":"Add a guest"}</h2>
            <p style={{ fontSize:13.5, color:C.textLight, marginBottom:24 }}>{editGuest?"Update the details for this guest.":"Add a guest to your list."}</p>
            <GuestForm initial={editGuest} onSave={saveGuest} onCancel={()=>{setShowAdd(false);setEditGuest(null);}}/>
          </div>
        </div>
      )}

      {/* Conversation simulator */}
      {simGuest&&(
        <ConvoSimulator
          guest={guests.find(g=>g.id===simGuest.id)||simGuest}
          weddingCouple={weddingCouple}
          onClose={()=>setSimGuest(null)}
          onUpdateGuest={updated=>{updateGuestFromSim(updated);setSimGuest(null);}}
        />
      )}

      {/* Send invites modal */}
      {showSendModal&&<SendInvitesModal guests={guests} onClose={()=>setShowSendModal(false)}/>}
    </div>
  );
}

// ─── Guest form ──────────────────────────────────────────────────────────────
function GuestForm({ initial, onSave, onCancel }) {
  const [name,setName]=useState(initial?.name||"");
  const [phone,setPhone]=useState(initial?.phone||"");
  const [status,setStatus]=useState(initial?.status||"Pending");
  const [events,setEvents]=useState(initial?.events||"");
  const [dietary,setDietary]=useState(initial?.dietary||"");
  const [notes,setNotes]=useState(initial?.notes||"");
  const fs={display:"flex",flexDirection:"column",gap:6};
  const ls={fontSize:11.5,fontWeight:600,color:C.textFaint,letterSpacing:"0.08em",textTransform:"uppercase"};
  return (
    <form onSubmit={e=>{e.preventDefault();if(name.trim())onSave({name:name.trim(),phone,status,events,dietary,notes});}} style={{ display:"flex",flexDirection:"column",gap:16 }}>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
        <div style={fs}><label style={ls}>Name *</label><input className="db-input" value={name} onChange={e=>setName(e.target.value)} placeholder="Sarah Johnson" required/></div>
        <div style={fs}><label style={ls}>Phone</label><input className="db-input" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+1 555 000 0000"/></div>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
        <div style={fs}><label style={ls}>RSVP Status</label><select className="db-input" style={{ cursor:"pointer" }} value={status} onChange={e=>setStatus(e.target.value)}><option>Pending</option><option>Confirmed</option><option>Declined</option></select></div>
        <div style={fs}><label style={ls}>Events</label><input className="db-input" value={events} onChange={e=>setEvents(e.target.value)} placeholder="All events, Ceremony only…"/></div>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
        <div style={fs}><label style={ls}>Dietary needs</label><input className="db-input" value={dietary} onChange={e=>setDietary(e.target.value)} placeholder="Vegan, Gluten-free…"/></div>
        <div style={fs}><label style={ls}>Notes</label><input className="db-input" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Plus-one, accessibility…"/></div>
      </div>
      <div style={{ display:"flex",gap:10,justifyContent:"flex-end",paddingTop:8 }}>
        <button type="button" className="db-btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="db-btn">{initial?"Save changes":"Add guest"}</button>
      </div>
    </form>
  );
}

// ─── Root ────────────────────────────────────────────────────────────────────
export default function App() {
  const [user,setUser]=useState(null);
  if(!user) return <LoginPage onLogin={setUser}/>;
  return <Dashboard userEmail={user} onLogout={()=>setUser(null)}/>;
}
