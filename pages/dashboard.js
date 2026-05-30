import { useState, useEffect, useRef, useCallback } from "react";

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  espresso:"#2a2118", espressoDark:"#1a1410", espressoDeep:"#111009",
  gold:"#c9a97a", goldLight:"#e8d8c0",
  cream:"#faf8f4", creamMid:"#f2ead8", creamBorder:"#e0d4c4",
  text:"#1a1410", textMid:"#3d2e1e", textLight:"#6b5c4d", textFaint:"#8a7a6a",
  green:"#2e7d32", greenBg:"#e8f5e9",
  red:"#b91c1c", redBg:"#fce8e8",
  amber:"#92400e", amberBg:"#fef3c7",
  blue:"#1565c0", blueBg:"#e3f2fd",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function storageKey(email, suffix="guests") {
  return `fc_${suffix}_${email.replace(/[^a-z0-9]/gi,"_")}`;
}
function load(email, suffix="guests", fallback=[]) {
  try { const r=localStorage.getItem(storageKey(email,suffix)); return r?JSON.parse(r):fallback; } catch { return fallback; }
}
function save(email, suffix, data) {
  try { localStorage.setItem(storageKey(email,suffix),JSON.stringify(data)); } catch {}
}

const DEFAULT_WEDDING = {
  bride:"", groom:"", date:"", venue:"", city:"",
  events:["Rehearsal Dinner","Ceremony","Reception"],
  tone:"warm", customOpening:""
};

// ── Logo ──────────────────────────────────────────────────────────────────────
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
  const s=map[status]||map.Pending;
  return <span style={{ display:"inline-block",padding:"3px 10px",borderRadius:10,fontSize:11,fontWeight:700,letterSpacing:"0.05em",background:s.bg,color:s.color,fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase",whiteSpace:"nowrap" }}>{status}</span>;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
let pendingCode=null;

function LoginPage({ onLogin }) {
  const [step,setStep]=useState("email");
  const [email,setEmail]=useState("");
  const [code,setCode]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);
  const [sentTo,setSentTo]=useState("");
  const codeRef=useRef(null);

  async function sendCode(e) {
    e.preventDefault(); setLoading(true);
    await new Promise(r=>setTimeout(r,800));
    pendingCode=String(Math.floor(100000+Math.random()*900000));
    setSentTo(email); setStep("code"); setLoading(false);
    setTimeout(()=>codeRef.current?.focus(),100);
  }
  async function verifyCode(e) {
    e.preventDefault(); setLoading(true);
    await new Promise(r=>setTimeout(r,600));
    if (code===pendingCode) { pendingCode=null; onLogin(sentTo); }
    else { setError("That code doesn't match."); setLoading(false); }
  }

  return (
    <div style={{ minHeight:"100vh",background:C.cream,fontFamily:"'Cormorant Garamond',Georgia,serif",display:"flex",flexDirection:"column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .li{width:100%;padding:13px 15px;border:1.5px solid ${C.creamBorder};border-radius:3px;font-family:'DM Sans',sans-serif;font-size:15px;background:white;color:${C.text};outline:none;transition:border-color .2s,box-shadow .2s}
        .li:focus{border-color:${C.gold};box-shadow:0 0 0 3px rgba(201,169,122,.15)}
        .lb{width:100%;padding:14px;border:none;border-radius:3px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;background:${C.espresso};color:${C.cream};transition:all .2s;box-shadow:0 2px 8px rgba(0,0,0,.14)}
        .lb:hover:not(:disabled){background:${C.espressoDark};transform:translateY(-1px)}
        .lb:disabled{opacity:.55;cursor:not-allowed}
        .ci{width:100%;padding:16px;border:1.5px solid ${C.creamBorder};border-radius:3px;font-family:'DM Sans',sans-serif;font-size:28px;font-weight:600;letter-spacing:.35em;text-align:center;background:white;color:${C.text};outline:none}
        .ci:focus{border-color:${C.gold};box-shadow:0 0 0 3px rgba(201,169,122,.15)}
        @keyframes fu{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
        .fu{animation:fu .5s cubic-bezier(.16,1,.3,1) both}
      `}</style>
      <nav style={{ borderBottom:`1px solid ${C.creamBorder}`,padding:"0 40px" }}>
        <div style={{ maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"center",height:64 }}>
          <a href="/" style={{ textDecoration:"none",display:"flex",alignItems:"center",gap:10 }}>
            <LogoMark size={30}/>
            <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:19,fontWeight:600,color:C.text }}>Final<span style={{ color:C.gold }}>Count</span></span>
          </a>
        </div>
      </nav>
      <div style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 20px" }}>
        <div className="fu" style={{ width:"100%",maxWidth:420 }}>
          {step==="email" ? (
            <>
              <div style={{ textAlign:"center",marginBottom:32 }}>
                <LogoMark size={48}/>
                <h1 style={{ fontSize:30,fontWeight:400,color:C.text,marginTop:14,marginBottom:6 }}>Welcome back</h1>
                <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:14,color:C.textLight }}>Enter your email to receive a sign-in code</p>
              </div>
              <div style={{ background:"white",border:`1.5px solid ${C.creamBorder}`,borderRadius:8,padding:"28px 24px" }}>
                <form onSubmit={sendCode} style={{ display:"flex",flexDirection:"column",gap:12 }}>
                  <div>
                    <label style={{ fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,color:C.textFaint,letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:7 }}>Email address</label>
                    <input className="li" type="email" required placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} disabled={loading}/>
                  </div>
                  <button className="lb" type="submit" disabled={loading||!email}>{loading?"Sending…":"Send sign-in code"}</button>
                </form>
              </div>
            </>
          ) : (
            <>
              <div style={{ textAlign:"center",marginBottom:32 }}>
                <h1 style={{ fontSize:28,fontWeight:400,color:C.text,marginBottom:6 }}>Check your inbox</h1>
                <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:13.5,color:C.textLight }}>Code sent to <strong style={{ color:C.text }}>{sentTo}</strong></p>
              </div>
              <div style={{ background:C.creamMid,border:`1.5px solid ${C.creamBorder}`,borderRadius:8,padding:"14px 20px",marginBottom:16,textAlign:"center" }}>
                <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:10.5,color:C.textFaint,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:5 }}>Your code (test mode)</div>
                <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:30,fontWeight:700,color:C.espresso,letterSpacing:"0.3em" }}>{pendingCode}</div>
              </div>
              <div style={{ background:"white",border:`1.5px solid ${C.creamBorder}`,borderRadius:8,padding:"28px 24px" }}>
                <form onSubmit={verifyCode} style={{ display:"flex",flexDirection:"column",gap:12 }}>
                  <div>
                    <label style={{ fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,color:C.textFaint,letterSpacing:"0.1em",textTransform:"uppercase",display:"block",marginBottom:7 }}>6-digit code</label>
                    <input ref={codeRef} className="ci" type="text" inputMode="numeric" maxLength={6} placeholder="000000" value={code} onChange={e=>{setCode(e.target.value.replace(/\D/g,""));setError("");}} disabled={loading}/>
                    {error&&<p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12.5,color:C.red,marginTop:7 }}>{error}</p>}
                  </div>
                  <button className="lb" type="submit" disabled={loading||code.length<6}>{loading?"Verifying…":"Sign in"}</button>
                </form>
                <button onClick={()=>{setStep("email");setCode("");setError("");}} style={{ background:"none",border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:13,color:C.gold,textDecoration:"underline",display:"block",textAlign:"center",marginTop:14,width:"100%" }}>Use a different email</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Conversation Simulator (full iMessage UI) ─────────────────────────────────
function ConvoSimulator({ guest, wedding, onClose, onUpdateGuest }) {
  const [messages,setMessages]=useState([]);
  const [userInput,setUserInput]=useState("");
  const [loading,setLoading]=useState(false);
  const [started,setStarted]=useState(false);
  const [detectedStatus,setDetectedStatus]=useState(null);
  const msgsRef=useRef(null);
  const inputRef=useRef(null);

  function scrollBottom() { setTimeout(()=>{ if(msgsRef.current) msgsRef.current.scrollTop=9999; },60); }

  const coupleNames = [wedding.bride,wedding.groom].filter(Boolean).join(" & ") || "the couple";
  const weddingDate = wedding.date ? new Date(wedding.date).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"}) : "";
  const eventsList  = (wedding.events||[]).join(", ");

  async function callAPI(conversationHistory) {
    const toneMap = { warm:"warm and friendly like a caring friend", formal:"professional and elegant", casual:"relaxed and conversational", fun:"playful and cheerful" };
    const toneDesc = toneMap[wedding.tone||"warm"];
    const systemPrompt = `You are FinalCount, a ${toneDesc} AI wedding RSVP assistant texting on behalf of ${coupleNames}${weddingDate?` whose wedding is on ${weddingDate}`:""}${wedding.venue?` at ${wedding.venue}`:""}. You are texting their guest: ${guest.name}.${eventsList?`\n\nThe wedding has these events: ${eventsList}.`:""}

Your job:
1. Send a warm personalized opening RSVP message mentioning the couple names and date if available
2. Ask which events they can attend if there are multiple events
3. Understand messy natural replies — confirm attendance, plus-ones, dietary needs, event-specific attendance
4. Confirm everything back warmly and clearly
5. At the end of EVERY reply (including your opening), append this JSON on the very last line with no backticks or markdown:
{"status":"Confirmed","events":"All events","dietary":"None","plusOne":"No"}

Status must be exactly: "Confirmed", "Declined", or "Pending"
Keep messages short, warm, natural — real SMS style. Never sound robotic. Use the guest's first name.`;

    const res = await fetch("/api/chat",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ system:systemPrompt, messages:conversationHistory })
    });
    if (!res.ok) { const e=await res.json().catch(()=>({})); throw new Error(e.error||`Error ${res.status}`); }
    const data = await res.json();
    const raw = data.content?.[0]?.text||"";
    const lines = raw.trim().split("\n");
    const lastLine = lines[lines.length-1].trim();
    let parsed=null;
    try { parsed=JSON.parse(lastLine); } catch {}
    const displayText = parsed ? lines.slice(0,-1).join("\n").trim() : raw.trim();
    return { text:displayText, parsed };
  }

  async function startConversation() {
    setStarted(true); setLoading(true);
    try {
      const history=[{ role:"user", content:`Send the opening RSVP message to ${guest.name}.` }];
      const { text,parsed } = await callAPI(history);
      setMessages([{ side:"bot",text }, { role:"assistant",content:text }]);
      if (parsed) setDetectedStatus(parsed);
    } catch { setMessages([{ side:"bot",text:"Sorry, something went wrong. Please check your API key and try again." }]); }
    setLoading(false); scrollBottom();
    setTimeout(()=>inputRef.current?.focus(),120);
  }

  async function sendReply() {
    if (!userInput.trim()||loading) return;
    const userText=userInput.trim(); setUserInput(""); setLoading(true);
    const history=[{ role:"user",content:`Send the opening RSVP message to ${guest.name}.` }];
    messages.forEach((m,i)=>{
      if (m.side==="bot"&&i===0) history.push({ role:"assistant",content:m.text });
      else if (m.side==="user") history.push({ role:"user",content:m.text });
      else if (m.side==="bot") history.push({ role:"assistant",content:m.text });
    });
    history.push({ role:"user",content:userText });
    const newMsgs=[...messages,{ side:"user",text:userText }];
    setMessages(newMsgs); scrollBottom();
    try {
      const { text,parsed } = await callAPI(history);
      setMessages([...newMsgs,{ side:"bot",text }]);
      if (parsed) setDetectedStatus(parsed);
    } catch { setMessages([...newMsgs,{ side:"bot",text:"Something went wrong. Please try again." }]); }
    setLoading(false); scrollBottom();
    setTimeout(()=>inputRef.current?.focus(),120);
  }

  function saveAndClose() {
    if (detectedStatus) {
      onUpdateGuest({ ...guest,
        status:detectedStatus.status||guest.status,
        events:detectedStatus.events!=="None"?detectedStatus.events:guest.events,
        dietary:detectedStatus.dietary!=="None"?(normalizeDietary(detectedStatus.dietary)||guest.dietary):guest.dietary,
        plusOne:detectedStatus.plusOne!=="No"?detectedStatus.plusOne:guest.plusOne,
        log:messages.filter(m=>m.side).map(m=>({side:m.side,text:m.text}))
      });
    } else {
      onUpdateGuest({ ...guest, log:messages.filter(m=>m.side).map(m=>({side:m.side,text:m.text})) });
    }
    onClose();
  }

  const hasMsgs = messages.filter(m=>m.side).length>0;
  const sigBar = (h) => <span style={{ display:"inline-block",width:3,height:h,background:"black",borderRadius:0.5,marginRight:1.5,verticalAlign:"bottom" }}/>;

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(20,14,10,.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:400,padding:20,backdropFilter:"blur(5px)" }}>
      <style>{`
        @keyframes simIn{from{opacity:0;transform:translateY(28px) scale(.97)}to{opacity:1;transform:none}}
        @keyframes bIn{from{opacity:0;transform:translateY(8px) scale(.96)}to{opacity:1;transform:none}}
        @keyframes blink{0%,80%,100%{opacity:.25}40%{opacity:1}}
        .sim-wrap{animation:simIn .35s cubic-bezier(.16,1,.3,1) both}
        .msg-bubble{animation:bIn .35s ease both}
      `}</style>
      <div className="sim-wrap" style={{ background:"white",borderRadius:20,width:"100%",maxWidth:480,maxHeight:"92vh",display:"flex",flexDirection:"column",boxShadow:"0 40px 100px rgba(0,0,0,.35),0 0 0 1px rgba(255,255,255,.1)" }}>

        {/* Sim header */}
        <div style={{ padding:"16px 20px",borderBottom:`1px solid ${C.creamBorder}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0 }}>
          <div>
            <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:19,fontWeight:500,color:C.text }}>Simulating · {guest.name}</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,color:C.textFaint,marginTop:2 }}>Type as the guest · AI responds · RSVP updates automatically</div>
          </div>
          <button onClick={onClose} style={{ background:"none",border:"none",cursor:"pointer",fontSize:18,color:C.textFaint,padding:"4px 8px",borderRadius:6,lineHeight:1 }}>✕</button>
        </div>

        {/* Detected status bar */}
        {detectedStatus&&(
          <div style={{ padding:"9px 20px",background:C.creamMid,borderBottom:`1px solid ${C.creamBorder}`,display:"flex",alignItems:"center",gap:10,flexShrink:0,flexWrap:"wrap" }}>
            <span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:11,color:C.textFaint,fontWeight:600,letterSpacing:"0.07em",textTransform:"uppercase" }}>Detected:</span>
            <StatusPill status={detectedStatus.status}/>
            {detectedStatus.events!=="None"&&<span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,color:C.textLight }}>📅 {detectedStatus.events}</span>}
            {detectedStatus.dietary!=="None"&&<span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,color:C.textLight }}>🌿 {detectedStatus.dietary}</span>}
            {detectedStatus.plusOne!=="No"&&<span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,color:C.textLight }}>+1</span>}
          </div>
        )}

        {/* iPhone shell */}
        <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:"#f5f5f7" }}>
          {/* iOS status bar */}
          <div style={{ background:"white",padding:"12px 20px 6px",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:13,fontWeight:600,color:"black",flexShrink:0,position:"relative" }}>
            <span style={{ fontFamily:"-apple-system,sans-serif" }}>9:41</span>
            <div style={{ position:"absolute",top:8,left:"50%",transform:"translateX(-50%)",width:80,height:22,background:"black",borderRadius:12 }}/>
            <span style={{ display:"flex",alignItems:"center",gap:5 }}>
              <span style={{ display:"inline-flex",alignItems:"flex-end",height:10,gap:1 }}>
                {sigBar(4)}{sigBar(6)}{sigBar(8)}{sigBar(10)}
              </span>
              <svg width="14" height="10" viewBox="0 0 16 11" fill="none"><path d="M8 .5C5 .5 2.2 1.8.4 3.6l1.1 1.3C3 3.3 5.4 2.3 8 2.3s5 1 6.5 2.6l1.1-1.3C13.8 1.8 11 .5 8 .5zm0 3C5.9 3.5 4 4.4 2.6 5.7l1.1 1.3c1.1-1 2.6-1.7 4.3-1.7s3.2.7 4.3 1.7l1.1-1.3C12 4.4 10.1 3.5 8 3.5zm0 3c-1.3 0-2.5.5-3.4 1.4L8 11l3.4-3.1c-.9-.9-2.1-1.4-3.4-1.4z" fill="black"/></svg>
              <span style={{ display:"inline-flex",alignItems:"center" }}>
                <span style={{ width:22,height:10,border:"1.5px solid rgba(0,0,0,.45)",borderRadius:2.5,padding:1.5,display:"inline-flex",alignItems:"center" }}>
                  <span style={{ display:"block",width:"78%",height:"100%",background:"black",borderRadius:1 }}/>
                </span>
                <span style={{ width:2,height:5,background:"rgba(0,0,0,.45)",borderRadius:"0 1px 1px 0",marginLeft:1 }}/>
              </span>
            </span>
          </div>
          {/* iOS contact bar */}
          <div style={{ background:"white",padding:"6px 16px 10px",borderBottom:"0.5px solid #d1d1d6",display:"grid",gridTemplateColumns:"36px 1fr 36px",alignItems:"center",flexShrink:0 }}>
            <div style={{ display:"flex",alignItems:"center",gap:2 }}>
              <svg width="9" height="16" viewBox="0 0 9 16" fill="none"><path d="M8 1L1 8l7 7" stroke="#007AFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span style={{ color:"#007AFF",fontSize:15,fontFamily:"-apple-system,sans-serif" }}>3</span>
            </div>
            <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:3 }}>
              <div style={{ width:38,height:38,borderRadius:"50%",background:"linear-gradient(135deg,#d4b787,#9a7840)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"white",fontFamily:"-apple-system,sans-serif" }}>FC</div>
              <span style={{ fontSize:11,fontWeight:500,color:"black",fontFamily:"-apple-system,sans-serif" }}>FinalCount</span>
            </div>
            <div style={{ display:"flex",justifyContent:"flex-end" }}>
              <svg width="20" height="14" viewBox="0 0 22 14" fill="none"><rect x="0.5" y="0.5" width="14" height="13" rx="2.5" stroke="#007AFF" strokeWidth="1.5"/><path d="M15 4.5l6.5-3v11l-6.5-3z" stroke="#007AFF" strokeWidth="1.5" strokeLinejoin="round"/></svg>
            </div>
          </div>

          {/* Messages */}
          <div ref={msgsRef} style={{ flex:1,overflowY:"auto",padding:"14px 12px",display:"flex",flexDirection:"column",gap:8,background:"white" }}>
            {!started?(
              <div style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14,padding:"32px 20px" }}>
                <LogoMark size={44}/>
                <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:20,color:C.text,textAlign:"center" }}>Ready to simulate</div>
                <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:13,color:C.textLight,textAlign:"center",lineHeight:1.6,maxWidth:280 }}>
                  FinalCount will open with a personalized RSVP message to <strong>{guest.name}</strong> on behalf of <strong>{coupleNames}</strong>.
                </p>
                <button onClick={startConversation} style={{ padding:"12px 28px",background:C.espresso,color:C.cream,border:"none",borderRadius:3,fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer",boxShadow:"0 2px 8px rgba(0,0,0,.14)",transition:"all .18s" }}>
                  Start conversation
                </button>
              </div>
            ):(
              <>
                {messages.filter(m=>m.side).map((m,i)=>(
                  <div key={i} className="msg-bubble" style={{ display:"flex",flexDirection:"column",alignSelf:m.side==="bot"?"flex-start":"flex-end" }}>
                    <div style={{ fontSize:10,fontFamily:"'DM Sans',sans-serif",color:"#8e8e93",marginBottom:3,fontWeight:500,alignSelf:m.side==="bot"?"flex-start":"flex-end" }}>
                      {m.side==="bot"?"FinalCount":"You (as guest)"}
                    </div>
                    <div style={{ background:m.side==="bot"?"#E9E9EB":"#007AFF",color:m.side==="bot"?"#000":"white",borderRadius:m.side==="bot"?"18px 18px 18px 4px":"18px 18px 4px 18px",padding:"9px 13px",fontSize:14,lineHeight:1.5,maxWidth:"78%",fontFamily:"-apple-system,'SF Pro Text',sans-serif",whiteSpace:"pre-wrap" }}>{m.text}</div>
                  </div>
                ))}
                {loading&&(
                  <div style={{ alignSelf:"flex-start" }}>
                    <div style={{ fontSize:10,fontFamily:"'DM Sans',sans-serif",color:"#8e8e93",marginBottom:3,fontWeight:500 }}>FinalCount</div>
                    <div style={{ background:"#E9E9EB",borderRadius:"18px 18px 18px 4px",padding:"12px 16px",display:"flex",gap:5,alignItems:"center" }}>
                      {[0,.22,.44].map(d=><div key={d} style={{ width:7,height:7,borderRadius:"50%",background:"#8e8e93",animation:`blink 1.3s ${d}s infinite` }}/>)}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* iOS input bar */}
          {started&&(
            <div style={{ background:"white",padding:"8px 12px 10px",borderTop:"0.5px solid #d1d1d6",display:"flex",alignItems:"center",gap:8,flexShrink:0 }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="13" stroke="#007AFF" strokeWidth="1.5"/><path d="M9 14h10M14 9v10" stroke="#007AFF" strokeWidth="1.8" strokeLinecap="round"/></svg>
              <input value={userInput} onChange={e=>setUserInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendReply();}}} placeholder="Reply as the guest…" disabled={loading} style={{ flex:1,padding:"8px 13px",border:"1px solid #c8c8cc",borderRadius:18,fontFamily:"-apple-system,sans-serif",fontSize:14,color:C.text,background:"white",outline:"none" }}/>
              <button onClick={sendReply} disabled={loading||!userInput.trim()} style={{ width:36,height:36,borderRadius:"50%",background:userInput.trim()&&!loading?"#007AFF":"#d0c8be",border:"none",cursor:userInput.trim()&&!loading?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"background .18s" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M12 7H2M7 2l5 5-5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          )}
          {started&&(
            <div style={{ background:"white",padding:"4px 0 8px",display:"flex",justifyContent:"center" }}>
              <div style={{ width:90,height:4,background:"black",borderRadius:3,opacity:.85 }}/>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding:"12px 18px",borderTop:`1px solid ${C.creamBorder}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0,background:C.cream }}>
          <span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,color:C.textFaint }}>
            {detectedStatus?"✓ Status detected — ready to save":"Finish the conversation then save"}
          </span>
          <div style={{ display:"flex",gap:8 }}>
            <button onClick={onClose} style={{ padding:"8px 16px",background:"transparent",border:`1.5px solid ${C.creamBorder}`,borderRadius:3,fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:500,color:C.textMid,cursor:"pointer" }}>Discard</button>
            <button onClick={saveAndClose} disabled={!hasMsgs} style={{ padding:"8px 16px",background:hasMsgs?C.espresso:"#c0b8b0",border:"none",borderRadius:3,fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:C.cream,cursor:hasMsgs?"pointer":"default",transition:"background .18s" }}>
              Save & update RSVP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Send Invites Modal (real SMS) ─────────────────────────────────────────────
function SendInvitesModal({ guests, wedding, onClose }) {
  const pending = guests.filter(g=>g.status==="Pending");
  const [selected,setSelected]=useState(new Set(pending.map(g=>g.id)));
  const [sending,setSending]=useState(false);
  const [results,setResults]=useState(null);
  const [error,setError]=useState("");

  function toggle(id) { setSelected(prev=>{ const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; }); }
  function toggleAll() { setSelected(selected.size===guests.length?new Set():new Set(guests.map(g=>g.id))); }

  async function handleSend() {
    setSending(true); setError("");
    const toSend = guests.filter(g=>selected.has(g.id));
    try {
      const res = await fetch("/api/send-sms", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ guests:toSend, weddingContext:wedding }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error||"Send failed");
      setResults(data);
    } catch(e) {
      setError(e.message);
    }
    setSending(false);
  }

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(20,14,10,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,padding:20,backdropFilter:"blur(3px)" }}>
      <div style={{ background:"white",borderRadius:14,width:"100%",maxWidth:500,boxShadow:"0 28px 72px rgba(0,0,0,.22)",overflow:"hidden" }}>
        <div style={{ padding:"20px 24px",borderBottom:`1px solid ${C.creamBorder}` }}>
          <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:22,fontWeight:400,color:C.text,marginBottom:3 }}>Send RSVP invites</div>
          <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:13,color:C.textLight }}>Guests with a phone number will receive a personalized SMS. Pending guests are pre-selected.</p>
        </div>

        {results ? (
          <div style={{ padding:"36px 24px",textAlign:"center" }}>
            <div style={{ fontSize:32,marginBottom:10 }}>{results.failed===0?"✅":"⚠️"}</div>
            <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:22,color:C.text,marginBottom:10 }}>
              {results.sent} sent{results.failed>0?`, ${results.failed} failed`:""}
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:6,maxHeight:200,overflowY:"auto",marginBottom:16 }}>
              {results.results.map((r,i)=>(
                <div key={i} style={{ display:"flex",justifyContent:"space-between",fontSize:13,padding:"5px 0",borderBottom:`1px solid #f5f0ea`,fontFamily:"'DM Sans',sans-serif" }}>
                  <span style={{ color:C.text }}>{r.name}</span>
                  <span style={{ color:r.success?C.green:C.red,fontWeight:500 }}>{r.success?"✓ Sent":r.error}</span>
                </div>
              ))}
            </div>
            <button onClick={onClose} style={{ padding:"10px 28px",background:C.espresso,color:C.cream,border:"none",borderRadius:3,fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer" }}>Done</button>
          </div>
        ) : (
          <>
            {error&&<div style={{ padding:"10px 24px",background:"#fce8e8",borderBottom:`1px solid ${C.creamBorder}`,fontFamily:"'DM Sans',sans-serif",fontSize:13,color:C.red }}>{error}</div>}
            <div style={{ maxHeight:300,overflowY:"auto" }}>
              <div style={{ padding:"9px 24px",borderBottom:`1px solid ${C.creamBorder}`,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                <label style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12.5,fontWeight:600,color:C.textLight,display:"flex",alignItems:"center",gap:8,cursor:"pointer" }}>
                  <input type="checkbox" checked={selected.size===guests.length} onChange={toggleAll} style={{ width:14,height:14,accentColor:C.espresso }}/> Select all ({guests.length})
                </label>
                <span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,color:C.textFaint }}>{selected.size} selected</span>
              </div>
              {guests.map(g=>(
                <label key={g.id} style={{ display:"flex",alignItems:"center",gap:14,padding:"10px 24px",borderBottom:`1px solid #f5f0ea`,cursor:"pointer" }}
                  onMouseEnter={e=>e.currentTarget.style.background=C.creamMid}
                  onMouseLeave={e=>e.currentTarget.style.background="white"}>
                  <input type="checkbox" checked={selected.has(g.id)} onChange={()=>toggle(g.id)} style={{ width:14,height:14,accentColor:C.espresso,flexShrink:0 }}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:13.5,fontWeight:500,color:C.text }}>{g.name}</div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:11.5,color:g.phone?C.textFaint:C.red }}>
                      {g.phone||"⚠ No phone number — won't be sent"}
                    </div>
                  </div>
                  <StatusPill status={g.status}/>
                </label>
              ))}
            </div>
            <div style={{ padding:"14px 24px",display:"flex",justifyContent:"flex-end",gap:10,borderTop:`1px solid ${C.creamBorder}` }}>
              <button onClick={onClose} style={{ padding:"9px 18px",background:"transparent",border:`1.5px solid ${C.creamBorder}`,borderRadius:3,fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:500,color:C.textMid,cursor:"pointer" }}>Cancel</button>
              <button onClick={handleSend} disabled={selected.size===0||sending}
                style={{ padding:"9px 20px",background:selected.size>0&&!sending?C.espresso:"#c0b8b0",border:"none",borderRadius:3,fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:C.cream,cursor:selected.size>0&&!sending?"pointer":"default" }}>
                {sending?`Sending ${selected.size}…`:`Send ${selected.size} invite${selected.size!==1?"s":""}`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── CSV helpers ───────────────────────────────────────────────────────────────
function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map(h=>h.trim().toLowerCase().replace(/[^a-z0-9]/g,""));
  const nameIdx  = headers.findIndex(h=>h.includes("name"));
  const phoneIdx = headers.findIndex(h=>h.includes("phone")||h.includes("mobile"));
  const statusIdx= headers.findIndex(h=>h.includes("status")||h.includes("rsvp"));
  const eventIdx = headers.findIndex(h=>h.includes("event")||h.includes("attend"));
  const dietIdx  = headers.findIndex(h=>h.includes("diet")||h.includes("food")||h.includes("allerg"));
  const noteIdx  = headers.findIndex(h=>h.includes("note")||h.includes("comment"));
  if (nameIdx<0) return null; // no name column
  return lines.slice(1).filter(l=>l.trim()).map(line=>{
    const cols = line.split(",").map(c=>c.trim().replace(/^"|"$/g,""));
    const status = cols[statusIdx]||"";
    const normalizedStatus = ["confirmed","yes","attending"].includes(status.toLowerCase()) ? "Confirmed"
      : ["declined","no","not attending"].includes(status.toLowerCase()) ? "Declined" : "Pending";
    return {
      id: Date.now()+Math.random(),
      name:    cols[nameIdx]||"",
      phone:   phoneIdx>=0 ? cols[phoneIdx]||"" : "",
      status:  normalizedStatus,
      events:  eventIdx>=0  ? cols[eventIdx]||""  : "",
      dietary: dietIdx>=0   ? cols[dietIdx]||""   : "",
      notes:   noteIdx>=0   ? cols[noteIdx]||""   : "",
      plusOne: "",
      log:     [],
    };
  }).filter(g=>g.name);
}

function exportToCSV(guests, weddingName) {
  const headers = ["Name","Phone","RSVP Status","Events","Plus One","Dietary","Notes"];
  const rows = guests.map(g=>[g.name,g.phone||"",g.status,g.events||"",g.plusOne||"",g.dietary||"",g.notes||""].map(v=>`"${v}"`).join(","));
  const csv = [headers.join(","),...rows].join("\n");
  const blob = new Blob([csv],{type:"text/csv"});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href=url; a.download=`${(weddingName||"FinalCount").replace(/\s+/g,"-")}-Guests.csv`;
  a.click(); URL.revokeObjectURL(url);
}

// ── Analytics chart (pure SVG) ────────────────────────────────────────────────
function AnalyticsChart({ guests }) {
  const total     = guests.length;
  const confirmed = guests.filter(g=>g.status==="Confirmed").length;
  const declined  = guests.filter(g=>g.status==="Declined").length;
  const pending   = guests.filter(g=>g.status==="Pending").length;
  const responded = confirmed+declined;
  const responseRate = total>0 ? Math.round((responded/total)*100) : 0;

  const bars = [
    { label:"Confirmed", value:confirmed, color:C.green },
    { label:"Pending",   value:pending,   color:C.amber },
    { label:"Declined",  value:declined,  color:C.red   },
  ];
  const maxVal = Math.max(...bars.map(b=>b.value),1);
  const W=320, H=140, padL=32, padB=28, barW=56, gap=28;

  return (
    <div style={{ display:"flex",gap:32,alignItems:"flex-start",flexWrap:"wrap" }}>
      <div>
        <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,color:C.textFaint,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:12 }}>RSVP Breakdown</div>
        <svg width={W} height={H+padB} viewBox={`0 0 ${W} ${H+padB}`}>
          {[0,.25,.5,.75,1].map(t=>{
            const y=H-(t*(H-20));
            return <g key={t}><line x1={padL} y1={y} x2={W} y2={y} stroke={C.creamBorder} strokeWidth="1"/><text x={padL-6} y={y+4} textAnchor="end" fontSize="10" fill={C.textFaint} fontFamily="DM Sans,sans-serif">{Math.round(t*maxVal)}</text></g>;
          })}
          {bars.map((b,i)=>{
            const bH=maxVal>0?((b.value/maxVal)*(H-20)):0;
            const x=padL+i*(barW+gap);
            const y=H-bH;
            return (
              <g key={b.label}>
                <rect x={x} y={y} width={barW} height={bH} fill={b.color} opacity="0.85" rx="3"/>
                <text x={x+barW/2} y={H+16} textAnchor="middle" fontSize="11" fill={C.textLight} fontFamily="DM Sans,sans-serif">{b.label}</text>
                {b.value>0&&<text x={x+barW/2} y={y-5} textAnchor="middle" fontSize="11" fill={b.color} fontWeight="600" fontFamily="DM Sans,sans-serif">{b.value}</text>}
              </g>
            );
          })}
        </svg>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:16,justifyContent:"center" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:52,fontWeight:300,color:C.espresso,lineHeight:1 }}>{responseRate}%</div>
          <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,color:C.textFaint,marginTop:4 }}>response rate</div>
        </div>
        <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:13,color:C.textLight,lineHeight:1.8 }}>
          <div><span style={{ color:C.green,fontWeight:600 }}>{confirmed}</span> confirmed</div>
          <div><span style={{ color:C.amber,fontWeight:600 }}>{pending}</span> pending</div>
          <div><span style={{ color:C.red,fontWeight:600 }}>{declined}</span> declined</div>
          <div style={{ borderTop:`1px solid ${C.creamBorder}`,paddingTop:6,marginTop:4 }}><span style={{ color:C.text,fontWeight:600 }}>{total}</span> total guests</div>
        </div>
      </div>
    </div>
  );
}

// ── Settings Page ─────────────────────────────────────────────────────────────
function SettingsPage({ wedding, onSave }) {
  const [w,setW]=useState({...DEFAULT_WEDDING,...wedding});
  const [evtInput,setEvtInput]=useState("");
  const [saved,setSaved]=useState(false);
  function addEvent() { if(!evtInput.trim()) return; setW(p=>({...p,events:[...p.events,evtInput.trim()]})); setEvtInput(""); }
  function removeEvent(i) { setW(p=>({...p,events:p.events.filter((_,idx)=>idx!==i)})); }
  function handleSave(e) { e.preventDefault(); onSave(w); setSaved(true); setTimeout(()=>setSaved(false),2000); }

  const F=({label,children})=>(
    <div style={{ display:"flex",flexDirection:"column",gap:7 }}>
      <label style={{ fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,color:C.textFaint,letterSpacing:"0.09em",textTransform:"uppercase" }}>{label}</label>
      {children}
    </div>
  );

  return (
    <div className="db-fade">
      <div style={{ maxWidth:640 }}>
        <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:26,fontWeight:400,color:C.text,marginBottom:6 }}>Wedding Settings</h2>
        <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:13.5,color:C.textLight,marginBottom:28 }}>This information personalizes every message FinalCount sends to your guests.</p>
        <form onSubmit={handleSave}>
          <div style={{ background:"white",border:`1px solid ${C.creamBorder}`,borderRadius:10,padding:"24px",display:"flex",flexDirection:"column",gap:20 }}>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
              <F label="Partner 1 name"><input className="db-input" value={w.bride} onChange={e=>setW(p=>({...p,bride:e.target.value}))} placeholder="Sarah"/></F>
              <F label="Partner 2 name"><input className="db-input" value={w.groom} onChange={e=>setW(p=>({...p,groom:e.target.value}))} placeholder="Michael"/></F>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
              <F label="Wedding date"><input className="db-input" type="date" value={w.date} onChange={e=>setW(p=>({...p,date:e.target.value}))}/></F>
              <F label="Venue name"><input className="db-input" value={w.venue} onChange={e=>setW(p=>({...p,venue:e.target.value}))} placeholder="The Grand Pavilion"/></F>
            </div>
            <F label="City / Location"><input className="db-input" value={w.city} onChange={e=>setW(p=>({...p,city:e.target.value}))} placeholder="Charleston, SC"/></F>
            <F label="Events (guests will be asked about each)">
              <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginBottom:8 }}>
                {w.events.map((ev,i)=>(
                  <div key={i} style={{ display:"flex",alignItems:"center",gap:6,background:C.creamMid,border:`1px solid ${C.creamBorder}`,borderRadius:20,padding:"4px 12px 4px 14px" }}>
                    <span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:13,color:C.text }}>{ev}</span>
                    <button type="button" onClick={()=>removeEvent(i)} style={{ background:"none",border:"none",cursor:"pointer",fontSize:13,color:C.textFaint,lineHeight:1,padding:"0 2px" }}>✕</button>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex",gap:8 }}>
                <input className="db-input" style={{ flex:1 }} value={evtInput} onChange={e=>setEvtInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();addEvent();}}} placeholder="Add event (e.g. Rehearsal Dinner)"/>
                <button type="button" onClick={addEvent} style={{ padding:"10px 18px",background:C.espresso,color:C.cream,border:"none",borderRadius:3,fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap" }}>+ Add</button>
              </div>
            </F>
            <F label="Message tone">
              <select className="db-input" style={{ cursor:"pointer" }} value={w.tone} onChange={e=>setW(p=>({...p,tone:e.target.value}))}>
                <option value="warm">Warm & friendly (recommended)</option>
                <option value="formal">Formal & elegant</option>
                <option value="casual">Casual & relaxed</option>
                <option value="fun">Playful & fun</option>
              </select>
            </F>
            <F label="Custom opening message (optional)">
              <textarea className="db-input" style={{ minHeight:80,resize:"vertical",lineHeight:1.5 }} value={w.customOpening} onChange={e=>setW(p=>({...p,customOpening:e.target.value}))} placeholder="Leave blank to use the AI-generated default. Or write your own opening text that FinalCount will use verbatim."/>
            </F>
          </div>
          <div style={{ display:"flex",justifyContent:"flex-end",marginTop:16 }}>
            <button type="submit" className="db-btn" style={{ minWidth:140 }}>{saved?"✓ Saved!":"Save settings"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Guest form modal ──────────────────────────────────────────────────────────
function GuestModal({ initial, events, onSave, onCancel }) {
  const [d,setD]=useState({ name:"",phone:"",status:"Pending",events:"",dietary:"",plusOne:"",notes:"", ...initial });
  const F=({label,children,half})=>(<div style={{ display:"flex",flexDirection:"column",gap:6,gridColumn:half?"span 1":"span 2" }}><label style={{ fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,color:C.textFaint,letterSpacing:"0.08em",textTransform:"uppercase" }}>{label}</label>{children}</div>);
  return (
    <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget){onCancel();}}}>
      <div className="modal-card">
        <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:24,fontWeight:400,color:C.text,marginBottom:4 }}>{initial?"Edit guest":"Add a guest"}</h2>
        <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:13,color:C.textLight,marginBottom:22 }}>{initial?"Update details for this guest.":"Add them to your list and simulate their RSVP conversation."}</p>
        <form onSubmit={e=>{e.preventDefault();if(!d.name.trim())return;onSave(d);}} style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
          <F label="Guest name *"><input className="db-input" value={d.name} onChange={e=>setD(p=>({...p,name:e.target.value}))} placeholder="Jane Smith" required/></F>
          <F label="Phone number" half><input className="db-input" value={d.phone} onChange={e=>setD(p=>({...p,phone:e.target.value}))} placeholder="+1 555 000 0000"/></F>
          <F label="RSVP status" half>
            <select className="db-input" style={{ cursor:"pointer" }} value={d.status} onChange={e=>setD(p=>({...p,status:e.target.value}))}>
              <option>Pending</option><option>Confirmed</option><option>Declined</option>
            </select>
          </F>
          <F label="Events attending" half>
            <select className="db-input" style={{ cursor:"pointer" }} value={d.events} onChange={e=>setD(p=>({...p,events:e.target.value}))}>
              <option value="">—</option>
              <option>All events</option>
              {(events||[]).map(ev=><option key={ev}>{ev}</option>)}
            </select>
          </F>
          <F label="Plus-one" half><input className="db-input" value={d.plusOne} onChange={e=>setD(p=>({...p,plusOne:e.target.value}))} placeholder="Name or 'Yes'"/></F>
          <F label="Dietary needs" half><input className="db-input" value={d.dietary} onChange={e=>setD(p=>({...p,dietary:e.target.value}))} placeholder="Vegan, gluten-free…"/></F>
          <F label="Notes" half><input className="db-input" value={d.notes} onChange={e=>setD(p=>({...p,notes:e.target.value}))} placeholder="Accessibility, preferences…"/></F>
          <div style={{ gridColumn:"span 2",display:"flex",gap:10,justifyContent:"flex-end",paddingTop:6 }}>
            <button type="button" className="db-btn-ghost" onClick={onCancel}>Cancel</button>
            <button type="submit" className="db-btn">{initial?"Save changes":"Add guest"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Dietary normalization ─────────────────────────────────────────────────────
// Maps common variations to a single canonical label
const DIETARY_ALIASES = {
  // Dairy
  "dairy-free":       "Dairy-Free",
  "dairy free":       "Dairy-Free",
  "no dairy":         "Dairy-Free",
  "lactose free":     "Dairy-Free",
  "lactose-free":     "Dairy-Free",
  "no milk":          "Dairy-Free",
  // Gluten
  "gluten-free":      "Gluten-Free",
  "gluten free":      "Gluten-Free",
  "no gluten":        "Gluten-Free",
  "celiac":           "Gluten-Free",
  "coeliac":          "Gluten-Free",
  // Vegan
  "vegan":            "Vegan",
  "plant-based":      "Vegan",
  "plant based":      "Vegan",
  // Vegetarian
  "vegetarian":       "Vegetarian",
  "veggie":           "Vegetarian",
  "no meat":          "Vegetarian",
  // Nut
  "nut allergy":      "Nut Allergy",
  "nut-free":         "Nut Allergy",
  "nut free":         "Nut Allergy",
  "peanut allergy":   "Nut Allergy",
  "tree nut allergy": "Nut Allergy",
  // Pork
  "no pork":          "No Pork",
  "pork-free":        "No Pork",
  "pork free":        "No Pork",
  "halal":            "Halal",
  "kosher":           "Kosher",
  // None
  "none":             null,
  "n/a":              null,
  "—":                null,
  "-":                null,
};

function normalizeDietary(raw) {
  if (!raw) return null;
  const key = raw.trim().toLowerCase();
  if (key in DIETARY_ALIASES) return DIETARY_ALIASES[key];
  // Capitalize first letter of each word for anything unrecognized
  return raw.trim().replace(/\b\w/g, c => c.toUpperCase());
}

// Groups guests by normalized dietary label and returns sorted entries
function getDietaryGroups(guests) {
  const map = {};
  guests.forEach(g => {
    const label = normalizeDietary(g.dietary);
    if (!label) return;
    map[label] = (map[label] || 0) + 1;
  });
  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}
const TABS = ["Guest List","Live Conversations","Analytics","Settings"];

function Dashboard({ userEmail, onLogout }) {
  const [tab,setTab]=useState("Guest List");
  const [guestsRaw,setGuestsRaw]=useState(()=>load(userEmail,"guests",[]));
  const [wedding,setWeddingRaw]=useState(()=>load(userEmail,"wedding",DEFAULT_WEDDING));
  const [showAdd,setShowAdd]=useState(false);
  const [editGuest,setEditGuest]=useState(null);
  const [simGuest,setSimGuest]=useState(null);
  const [showSend,setShowSend]=useState(false);
  const [logGuest,setLogGuest]=useState(null);
  const [search,setSearch]=useState("");
  const [filterStatus,setFilterStatus]=useState("All");
  const [filterEvent,setFilterEvent]=useState("All");
  const [sortBy,setSortBy]=useState("name");
  const [sortDir,setSortDir]=useState("asc");
  const [csvError,setCsvError]=useState("");
  const [importSuccess,setImportSuccess]=useState("");
  const [inboxMessages,setInboxMessages]=useState([]);
  const [inboxConfigured,setInboxConfigured]=useState(false);
  const [lastPoll,setLastPoll]=useState(null);
  const [sendingInvites,setSendingInvites]=useState(false);
  const [sendResults,setSendResults]=useState(null);
  const [selectedThread,setSelectedThread]=useState(null);
  const fileRef=useRef(null);
  const threadEndRef=useRef(null);

  // Sync phonebook on mount so existing guests' names are available to the webhook
  useEffect(()=>{
    if (guestsRaw.length>0) {
      fetch("/api/sync-guests",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ guests:guestsRaw, userEmail }),
      }).catch(()=>{});
    }
  },[]);
  useEffect(()=>{
    if (tab!=="Live Conversations") return;
    function poll() {
      fetch(`/api/inbox${lastPoll?`?since=${encodeURIComponent(lastPoll)}`:""}`)
        .then(r=>r.json())
        .then(data=>{
          if (data.configured) setInboxConfigured(true);
          if (data.messages?.length>0) {
            setInboxMessages(prev=>{
              const existing=new Set(prev.map(m=>m.timestamp));
              const newMsgs=data.messages.filter(m=>!existing.has(m.timestamp));
              if (newMsgs.length===0) return prev;
              const merged=[...newMsgs,...prev].slice(0,200);
              setLastPoll(merged[0].timestamp);
              // Update guest statuses from incoming messages
              newMsgs.forEach(m=>{
                if (m.parsedStatus?.status&&m.parsedStatus.status!=="Pending") {
                  setGuestsRaw(prev=>prev.map(g=>{
                    const phone=g.phone?.replace(/\D/g,"");
                    const from=m.from?.replace(/\D/g,"");
                    if (!phone||!from||!phone.endsWith(from.slice(-10))&&!from.endsWith(phone.slice(-10))) return g;
                    return {
                      ...g,
                      status:m.parsedStatus.status||g.status,
                      events:m.parsedStatus.events!=="None"?m.parsedStatus.events:g.events,
                      dietary:m.parsedStatus.dietary!=="None"?(normalizeDietary(m.parsedStatus.dietary)||g.dietary):g.dietary,
                      plusOne:m.parsedStatus.plusOne!=="No"?m.parsedStatus.plusOne:g.plusOne,
                    };
                  }));
                }
              });
              return merged;
            });
          }
        })
        .catch(()=>{});
    }
    poll();
    const id=setInterval(poll,5000);
    return ()=>clearInterval(id);
  },[tab,lastPoll]);

  function setGuests(upd) {
    setGuestsRaw(prev=>{
      const n=typeof upd==="function"?upd(prev):upd;
      save(userEmail,"guests",n);
      // Sync phone→name lookup to KV so the SMS webhook can resolve names
      fetch("/api/sync-guests",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ guests:n, userEmail }),
      }).catch(()=>{});
      return n;
    });
  }
  function setWedding(upd) { setWeddingRaw(prev=>{ const n=typeof upd==="function"?upd(prev):upd; save(userEmail,"wedding",n); return n; }); }

  const confirmed=guestsRaw.filter(g=>g.status==="Confirmed").length;
  const declined =guestsRaw.filter(g=>g.status==="Declined").length;
  const pending  =guestsRaw.filter(g=>g.status==="Pending").length;
  const total    =guestsRaw.length;

  function toggleSort(col) {
    if (sortBy===col) setSortDir(d=>d==="asc"?"desc":"asc");
    else { setSortBy(col); setSortDir("asc"); }
  }
  const SortIcon=({col})=><span style={{ fontSize:10,color:sortBy===col?C.gold:C.textFaint,marginLeft:4 }}>{sortBy===col?(sortDir==="asc"?"▲":"▼"):"⇅"}</span>;

  const filtered = [...guestsRaw]
    .filter(g=>{
      const ms=g.name.toLowerCase().includes(search.toLowerCase())||(g.phone||"").includes(search);
      const mf=filterStatus==="All"||g.status===filterStatus;
      const me=filterEvent==="All"||!filterEvent||(g.events||"").toLowerCase().includes(filterEvent.toLowerCase());
      return ms&&mf&&me;
    })
    .sort((a,b)=>{
      const v=(x)=>({ name:x.name, status:x.status, events:x.events||"" }[sortBy]||"").toLowerCase();
      return sortDir==="asc"?v(a).localeCompare(v(b)):v(b).localeCompare(v(a));
    });

  function saveGuest(data) {
    if (editGuest) { setGuests(prev=>prev.map(g=>g.id===editGuest.id?{...g,...data}:g)); setEditGuest(null); }
    else { setGuests(prev=>[...prev,{...data,id:Date.now()+(Math.random()*1000|0),log:[]}]); }
    setShowAdd(false);
  }
  function deleteGuest(id) { if(confirm("Remove this guest?")) setGuests(prev=>prev.filter(g=>g.id!==id)); }
  function updateGuestFromSim(updated) { setGuests(prev=>prev.map(g=>g.id===updated.id?updated:g)); if(logGuest?.id===updated.id) setLogGuest(updated); }

  function handleCSVImport(e) {
    setCsvError(""); setImportSuccess("");
    const file=e.target.files?.[0]; if (!file) return;
    const reader=new FileReader();
    reader.onload=ev=>{
      const result=parseCSV(ev.target.result);
      if (!result) { setCsvError("Could not find a 'Name' column. Make sure your file has a header row."); return; }
      if (result.length===0) { setCsvError("No guests found in the file."); return; }
      setGuests(prev=>[...prev,...result]);
      setImportSuccess(`✓ Imported ${result.length} guest${result.length!==1?"s":""} successfully.`);
      setTimeout(()=>setImportSuccess(""),4000);
    };
    reader.readAsText(file);
    e.target.value="";
  }

  const coupleNames=[wedding.bride,wedding.groom].filter(Boolean).join(" & ")||"Your Wedding";
  const weddingDate=wedding.date?new Date(wedding.date+`T12:00:00`).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"}):"";

  // Group inbox messages by phone number into threaded conversations
  const threads = {};
  inboxMessages.forEach(m=>{
    const key=m.from;
    if (!threads[key]) threads[key]={from:m.from,guestName:m.guestName||m.from,messages:[],latestStatus:null,lastTime:m.timestamp};
    threads[key].messages.push({side:"user",text:m.message,time:m.timestamp});
    threads[key].messages.push({side:"bot", text:m.reply,  time:m.timestamp});
    if (m.parsedStatus) threads[key].latestStatus=m.parsedStatus;
  });
  Object.values(threads).forEach(t=>{ t.messages.sort((a,b)=>new Date(a.time)-new Date(b.time)); });
  const threadList=Object.values(threads).sort((a,b)=>new Date(b.lastTime)-new Date(a.lastTime));
  const activeThread=selectedThread?threads[selectedThread]:(threadList[0]||null);

  // Auto-scroll thread to bottom when new messages arrive
  useEffect(()=>{
    if (threadEndRef.current) threadEndRef.current.scrollIntoView({behavior:"smooth"});
  },[activeThread?.messages?.length]);
  return (
    <div style={{ minHeight:"100vh",background:"#f5f1eb",fontFamily:"'DM Sans',sans-serif",display:"flex",flexDirection:"column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .db-card{background:white;border:1px solid ${C.creamBorder};border-radius:10px}
        .db-btn{background:${C.espresso};color:${C.cream};border:none;padding:10px 20px;border-radius:3px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;transition:all .18s;box-shadow:0 2px 6px rgba(0,0,0,.1)}
        .db-btn:hover{background:${C.espressoDark};transform:translateY(-1px)}
        .db-btn-ghost{background:transparent;color:${C.textMid};border:1.5px solid ${C.creamBorder};padding:9px 18px;border-radius:3px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;cursor:pointer;transition:all .18s}
        .db-btn-ghost:hover{border-color:${C.espresso};color:${C.espresso};background:${C.creamMid}}
        .db-btn-gold{background:${C.gold};color:${C.espressoDeep};border:none;padding:10px 20px;border-radius:3px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;transition:all .18s}
        .db-btn-gold:hover{background:#b8975e;transform:translateY(-1px)}
        .db-input{width:100%;padding:10px 13px;border:1.5px solid ${C.creamBorder};border-radius:3px;font-family:'DM Sans',sans-serif;font-size:13.5px;color:${C.text};background:white;outline:none;transition:border-color .2s}
        .db-input:focus{border-color:${C.gold}}
        .db-select{padding:9px 13px;border:1.5px solid ${C.creamBorder};border-radius:3px;font-family:'DM Sans',sans-serif;font-size:13px;color:${C.text};background:white;outline:none;cursor:pointer}
        .db-tab{padding:10px 22px;border:none;background:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:13.5px;font-weight:500;color:${C.textLight};border-bottom:2.5px solid transparent;transition:all .18s;white-space:nowrap}
        .db-tab.active{color:${C.espresso};border-bottom-color:${C.gold};font-weight:600}
        .db-tab:hover:not(.active){color:${C.text}}
        .db-tr{border-bottom:1px solid #f0ead8;transition:background .15s}
        .db-tr:hover{background:#faf7f2}
        .db-tr:last-child{border-bottom:none}
        .db-action{background:none;border:none;cursor:pointer;padding:5px 7px;border-radius:4px;font-size:13px;transition:all .15s}
        .db-action:hover{background:${C.creamMid}}
        .sim-btn{background:transparent;border:1.5px solid ${C.gold};color:${C.amber};padding:5px 11px;border-radius:20px;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;cursor:pointer;letter-spacing:.04em;transition:all .18s;white-space:nowrap}
        .sim-btn:hover{background:${C.gold};color:${C.espressoDeep}}
        .th-btn{background:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;color:${C.textFaint};letter-spacing:.08em;text-transform:uppercase;padding:0;white-space:nowrap;display:flex;align-items:center}
        .th-btn:hover{color:${C.text}}
        .modal-overlay{position:fixed;inset:0;background:rgba(20,14,10,.45);display:flex;align-items:center;justify-content:center;z-index:200;padding:20px;backdrop-filter:blur(2px);animation:fadeIn .2s ease both}
        .modal-card{background:white;border-radius:12px;width:100%;max-width:520px;padding:30px;box-shadow:0 24px 64px rgba(0,0,0,.2);animation:slideUp .3s cubic-bezier(.16,1,.3,1) both;overflow-y:auto;max-height:92vh}
        .stat-card{background:white;border:1px solid ${C.creamBorder};border-radius:10px;padding:20px 18px;position:relative;overflow:hidden}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
        @keyframes simIn{from{opacity:0;transform:translateY(28px) scale(.97)}to{opacity:1;transform:none}}
        @keyframes dbFadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
        .db-fade{animation:dbFadeUp .4s cubic-bezier(.16,1,.3,1) both}
        .log-bot{background:#E9E9EB;color:#000;border-radius:16px 16px 16px 4px;padding:9px 13px;font-size:13.5px;line-height:1.5;max-width:75%;align-self:flex-start;white-space:pre-wrap}
        .log-user{background:#007AFF;color:white;border-radius:16px 16px 4px 16px;padding:9px 13px;font-size:13.5px;line-height:1.5;max-width:75%;align-self:flex-end;white-space:pre-wrap}
      `}</style>

      {/* Nav */}
      <nav style={{ background:C.espresso,padding:"0 28px",flexShrink:0 }}>
        <div style={{ maxWidth:1300,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",height:58 }}>
          <div style={{ display:"flex",alignItems:"center",gap:12 }}>
            <LogoMark size={26} dark={true}/>
            <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:17,fontWeight:600,color:C.goldLight }}>Final<span style={{ color:C.gold }}>Count</span></span>
            <span style={{ width:1,height:16,background:"rgba(255,255,255,.2)",margin:"0 4px" }}/>
            <span style={{ fontSize:11.5,color:"rgba(255,255,255,.5)",letterSpacing:"0.05em" }}>Couple Dashboard</span>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:14 }}>
            {(wedding.bride||wedding.groom)&&(
              <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:14,color:"rgba(255,255,255,.6)",fontStyle:"italic" }}>
                {coupleNames}{weddingDate?` · ${weddingDate}`:""}
              </span>
            )}
            <div style={{ width:26,height:26,borderRadius:"50%",background:"rgba(201,169,122,.22)",display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid rgba(201,169,122,.35)" }}>
              <span style={{ fontSize:11,fontWeight:600,color:C.gold }}>{userEmail[0].toUpperCase()}</span>
            </div>
            <span style={{ fontSize:12,color:"rgba(255,255,255,.55)" }}>{userEmail}</span>
            <button onClick={onLogout} style={{ background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.14)",color:"rgba(255,255,255,.7)",padding:"5px 13px",borderRadius:3,fontSize:11.5,fontWeight:500,cursor:"pointer",transition:"all .18s" }}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.16)"}
              onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.08)"}
            >Sign out</button>
          </div>
        </div>
      </nav>

      <div style={{ flex:1,maxWidth:1300,margin:"0 auto",width:"100%",padding:"28px 28px" }}>

        {/* Header row */}
        <div className="db-fade" style={{ marginBottom:24,display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:14 }}>
          <div>
            <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:32,fontWeight:400,color:C.text,marginBottom:3 }}>Your Wedding Dashboard</h1>
            <p style={{ fontSize:13,color:C.textLight }}>
              {(!wedding.bride&&!wedding.groom)
                ? <span>Add your wedding details in <button onClick={()=>setTab("Settings")} style={{ background:"none",border:"none",cursor:"pointer",color:C.gold,fontFamily:"'DM Sans',sans-serif",fontSize:13,textDecoration:"underline",padding:0 }}>Settings</button> to personalize every message.</span>
                : `${coupleNames}${weddingDate?` · ${weddingDate}`:""}${wedding.venue?` · ${wedding.venue}`:""}`
              }
            </p>
          </div>
          <div style={{ display:"flex",gap:10,flexWrap:"wrap",alignItems:"center" }}>
            {importSuccess&&<span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12.5,color:C.green,fontWeight:500 }}>{importSuccess}</span>}
            {csvError&&<span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12.5,color:C.red }}>{csvError}</span>}
            <button className="db-btn-ghost" onClick={()=>fileRef.current?.click()} style={{ fontSize:11.5 }}>📥 Import CSV</button>
            <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" style={{ display:"none" }} onChange={handleCSVImport}/>
            {total>0&&<button className="db-btn-ghost" onClick={()=>exportToCSV(guestsRaw,coupleNames)} style={{ fontSize:11.5 }}>📤 Export CSV</button>}
            {total>0&&<button className="db-btn-gold" onClick={()=>setShowSend(true)}>📨 Send invites</button>}
            <button className="db-btn" onClick={()=>{setShowAdd(true);setEditGuest(null);}}>+ Add guest</button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="db-fade" style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20 }}>
          {[["Total Guests",total,"👥",C.espresso],["Confirmed",confirmed,"✓",C.green],["Pending",pending,"◷",C.amber],["Declined",declined,"✕",C.red]].map(([l,v,ic,col])=>(
            <div key={l} className="stat-card">
              <div style={{ fontSize:10.5,fontWeight:600,color:C.textFaint,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8 }}>{l}</div>
              <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:42,fontWeight:300,color:col,lineHeight:1 }}>{v}</div>
              <div style={{ position:"absolute",top:14,right:14,fontSize:18,opacity:.14 }}>{ic}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        {total>0&&(
          <div className="db-card db-fade" style={{ padding:"14px 20px",marginBottom:18 }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:7 }}>
              <span style={{ fontSize:11.5,fontWeight:600,color:C.textLight,letterSpacing:"0.06em",textTransform:"uppercase" }}>Response progress</span>
              <span style={{ fontSize:13,color:C.textLight }}>{total>0?Math.round(((confirmed+declined)/total)*100):0}% responded</span>
            </div>
            <div style={{ height:6,background:C.creamMid,borderRadius:3,overflow:"hidden",display:"flex" }}>
              <div style={{ width:`${(confirmed/total)*100}%`,background:C.green,transition:"width .7s" }}/>
              <div style={{ width:`${(declined/total)*100}%`,background:C.red,transition:"width .7s" }}/>
            </div>
            <div style={{ display:"flex",gap:16,marginTop:7 }}>
              {[["Confirmed",C.green],["Declined",C.red],["Pending",C.amber]].map(([l,c])=>(
                <div key={l} style={{ display:"flex",alignItems:"center",gap:5,fontSize:11,color:C.textFaint }}>
                  <span style={{ width:7,height:7,borderRadius:2,background:c,display:"inline-block" }}/>{l}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ borderBottom:`1px solid ${C.creamBorder}`,marginBottom:20,display:"flex" }}>
          {TABS.map(t=>(
            <button key={t} className={`db-tab${tab===t?" active":""}`} onClick={()=>setTab(t)}>{t}</button>
          ))}
        </div>

        {/* ── Guest List Tab ── */}
        {tab==="Guest List"&&(
          <div className="db-fade">
            <div style={{ display:"flex",gap:10,marginBottom:14,flexWrap:"wrap",alignItems:"center" }}>
              <input className="db-input" style={{ maxWidth:240 }} placeholder="Search by name or phone…" value={search} onChange={e=>setSearch(e.target.value)}/>
              <select className="db-select" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
                {["All","Confirmed","Pending","Declined"].map(s=><option key={s}>{s}</option>)}
              </select>
              <select className="db-select" value={filterEvent} onChange={e=>setFilterEvent(e.target.value)}>
                <option value="All">All events</option>
                {(wedding.events||[]).map(ev=><option key={ev} value={ev}>{ev}</option>)}
              </select>
              <span style={{ fontSize:12,color:C.textFaint,marginLeft:"auto" }}>{filtered.length} of {total} guest{total!==1?"s":""}</span>
            </div>

            <div className="db-card" style={{ overflow:"hidden" }}>
              {filtered.length===0?(
                <div style={{ padding:"56px 32px",textAlign:"center" }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:22,color:C.textFaint,marginBottom:10 }}>
                    {total===0?"No guests yet":"No guests match your filter"}
                  </div>
                  <p style={{ fontSize:13,color:C.textFaint,marginBottom:18,lineHeight:1.6 }}>
                    {total===0?"Add your first guest or import a CSV file to get started.":"Try a different search or filter."}
                  </p>
                  {total===0&&(
                    <div style={{ display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap" }}>
                      <button className="db-btn" onClick={()=>{setShowAdd(true);setEditGuest(null);}}>+ Add first guest</button>
                      <button className="db-btn-ghost" onClick={()=>fileRef.current?.click()}>📥 Import CSV</button>
                    </div>
                  )}
                </div>
              ):(
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%",borderCollapse:"collapse" }}>
                    <thead>
                      <tr style={{ background:C.creamMid,borderBottom:`1px solid ${C.creamBorder}` }}>
                        {[["name","Guest"],["status","Status"],["events","Events"]].map(([col,lbl])=>(
                          <th key={col} style={{ padding:"11px 14px",textAlign:"left" }}>
                            <button className="th-btn" onClick={()=>toggleSort(col)}>{lbl}<SortIcon col={col}/></button>
                          </th>
                        ))}
                        {["Phone","+1","Dietary","Notes",""].map(h=>(
                          <th key={h} style={{ padding:"11px 14px",textAlign:"left",fontSize:11,fontWeight:600,color:C.textFaint,letterSpacing:"0.08em",textTransform:"uppercase",whiteSpace:"nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(g=>(
                        <tr key={g.id} className="db-tr">
                          <td style={{ padding:"12px 14px",fontWeight:500,color:C.text,whiteSpace:"nowrap" }}>{g.name}</td>
                          <td style={{ padding:"12px 14px" }}>
                            <select className="db-select" style={{ fontSize:11,padding:"3px 8px",minWidth:100 }} value={g.status}
                              onChange={e=>setGuests(prev=>prev.map(x=>x.id===g.id?{...x,status:e.target.value}:x))}>
                              <option>Pending</option><option>Confirmed</option><option>Declined</option>
                            </select>
                          </td>
                          <td style={{ padding:"12px 14px",color:C.textLight,fontSize:13 }}>{g.events||"—"}</td>
                          <td style={{ padding:"12px 14px",color:C.textLight,fontSize:13 }}>{g.phone||"—"}</td>
                          <td style={{ padding:"12px 14px",color:C.textLight,fontSize:13 }}>
                            <input style={{ width:80,padding:"4px 8px",border:`1px solid ${C.creamBorder}`,borderRadius:3,fontFamily:"'DM Sans',sans-serif",fontSize:12,color:C.text,background:"white",outline:"none" }}
                              value={g.plusOne||""} placeholder="—"
                              onChange={e=>setGuests(prev=>prev.map(x=>x.id===g.id?{...x,plusOne:e.target.value}:x))}/>
                          </td>
                          <td style={{ padding:"12px 14px",color:C.textLight,fontSize:13 }}>{g.dietary||"—"}</td>
                          <td style={{ padding:"12px 14px",color:C.textLight,fontSize:13,maxWidth:140 }}>
                            <span style={{ display:"block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{g.notes||"—"}</span>
                          </td>
                          <td style={{ padding:"12px 14px",whiteSpace:"nowrap" }}>
                            <div style={{ display:"flex",alignItems:"center",gap:5 }}>
                              <button className="sim-btn" onClick={()=>setSimGuest(g)}>▶ Simulate</button>
                              <button className="db-action" title="Edit" onClick={()=>{setEditGuest(g);setShowAdd(true);}}>✎</button>
                              <button className="db-action" title="View log" style={{ color:g.log?.length>0?C.gold:C.textFaint }} onClick={()=>setLogGuest(g)}>💬</button>
                              <button className="db-action" title="Delete" style={{ color:C.red }} onClick={()=>deleteGuest(g.id)}>✕</button>
                            </div>
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

        {/* ── Live Conversations Tab ── */}
        {tab==="Live Conversations"&&(
          <div className="db-fade">
            {!inboxConfigured ? (
              <div className="db-card" style={{ padding:"48px 32px",textAlign:"center" }}>
                <div style={{ fontSize:32,marginBottom:14 }}>📡</div>
                <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:24,color:C.text,marginBottom:10 }}>Twilio not connected yet</div>
                <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:14,color:C.textLight,lineHeight:1.7,maxWidth:520,margin:"0 auto 24px" }}>
                  To receive real guest replies here, add your Twilio credentials to Vercel and point your Twilio webhook at <code style={{ background:C.creamMid,padding:"2px 8px",borderRadius:3,fontSize:13 }}>https://getfinalcount.com/api/sms-webhook</code>.
                </p>
              </div>
            ) : inboxMessages.length===0 ? (
              <div className="db-card" style={{ padding:"56px 32px",textAlign:"center" }}>
                <div style={{ fontSize:28,marginBottom:12 }}>🟢</div>
                <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:22,color:C.text,marginBottom:8 }}>Connected — waiting for replies</div>
                <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:13.5,color:C.textLight,lineHeight:1.65 }}>
                  When a guest replies to an RSVP text, their full conversation thread will appear here automatically.
                </p>
                <div style={{ display:"inline-flex",alignItems:"center",gap:8,marginTop:16,fontFamily:"'DM Sans',sans-serif",fontSize:12.5,color:C.textFaint }}>
                  <div style={{ width:8,height:8,borderRadius:"50%",background:C.green,animation:"pulse 1.5s infinite" }}/>
                  Live · checking every 5 seconds
                </div>
              </div>
            ) : (
              <div style={{ display:"flex",height:620,background:"white",border:`1px solid ${C.creamBorder}`,borderRadius:12,overflow:"hidden",boxShadow:"0 4px 20px rgba(0,0,0,.06)" }}>

                {/* ── Contact sidebar ── */}
                <div style={{ width:280,borderRight:`1px solid ${C.creamBorder}`,display:"flex",flexDirection:"column",flexShrink:0 }}>
                  {/* Sidebar header */}
                  <div style={{ padding:"16px 18px",borderBottom:`1px solid ${C.creamBorder}`,background:C.creamMid }}>
                    <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,color:C.textFaint,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:2 }}>Conversations</div>
                    <div style={{ display:"flex",alignItems:"center",gap:6,marginTop:4 }}>
                      <div style={{ width:6,height:6,borderRadius:"50%",background:C.green }}/>
                      <span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:11.5,color:C.green,fontWeight:500 }}>Live · auto-updating</span>
                    </div>
                  </div>
                  {/* Thread list */}
                  <div style={{ flex:1,overflowY:"auto" }}>
                    {threadList.map(t=>{
                      const isActive = (selectedThread||threadList[0]?.from)===t.from;
                      const lastMsg  = t.messages[t.messages.length-1];
                      const initials = t.guestName.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
                      return (
                        <button
                          key={t.from}
                          onClick={()=>setSelectedThread(t.from)}
                          style={{ width:"100%",padding:"14px 16px",border:"none",borderBottom:`1px solid ${C.creamBorder}`,cursor:"pointer",textAlign:"left",transition:"background .15s",background:isActive?"#f0ead8":"white",display:"flex",gap:12,alignItems:"flex-start" }}
                          onMouseEnter={e=>{ if(!isActive) e.currentTarget.style.background=C.creamMid; }}
                          onMouseLeave={e=>{ if(!isActive) e.currentTarget.style.background="white"; }}
                        >
                          {/* Avatar */}
                          <div style={{ width:40,height:40,borderRadius:"50%",background:isActive?C.espresso:C.creamMid,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:`1.5px solid ${isActive?C.gold:C.creamBorder}` }}>
                            <span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:700,color:isActive?C.gold:C.textLight }}>{initials}</span>
                          </div>
                          <div style={{ flex:1,minWidth:0 }}>
                            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3 }}>
                              <span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:13.5,fontWeight:600,color:isActive?C.espresso:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:120 }}>{t.guestName}</span>
                              <span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:10.5,color:C.textFaint,flexShrink:0 }}>
                                {new Date(t.lastTime).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}
                              </span>
                            </div>
                            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",gap:4 }}>
                              <span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,color:C.textFaint,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1 }}>
                                {lastMsg?.side==="bot"?"FC: ":""}{lastMsg?.text?.slice(0,40)}{lastMsg?.text?.length>40?"…":""}
                              </span>
                              {t.latestStatus&&<StatusPill status={t.latestStatus.status}/>}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ── Message thread panel ── */}
                <div style={{ flex:1,display:"flex",flexDirection:"column",minWidth:0 }}>
                  {activeThread ? (
                    <>
                      {/* Thread header — iMessage contact style */}
                      <div style={{ padding:"12px 20px",borderBottom:`1px solid ${C.creamBorder}`,background:"white",display:"flex",alignItems:"center",gap:14 }}>
                        <div style={{ width:44,height:44,borderRadius:"50%",background:`linear-gradient(135deg,${C.gold},#a88860)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                          <span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:700,color:"white" }}>
                            {activeThread.guestName.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
                          </span>
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:15,fontWeight:600,color:C.text }}>{activeThread.guestName}</div>
                          <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,color:C.textFaint }}>{activeThread.from}</div>
                        </div>
                        {activeThread.latestStatus&&(
                          <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4 }}>
                            <StatusPill status={activeThread.latestStatus.status}/>
                            {activeThread.latestStatus.dietary!=="None"&&<span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:11.5,color:C.textFaint }}>🌿 {activeThread.latestStatus.dietary}</span>}
                            {activeThread.latestStatus.plusOne!=="No"&&<span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:11.5,color:C.textFaint }}>+1 confirmed</span>}
                          </div>
                        )}
                      </div>

                      {/* Messages — full thread */}
                      <div style={{ flex:1,overflowY:"auto",padding:"20px 20px 12px",display:"flex",flexDirection:"column",gap:4,background:"#f5f5f7" }}>
                        {/* Date stamp at top */}
                        <div style={{ textAlign:"center",marginBottom:12 }}>
                          <span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#8e8e93",background:"rgba(0,0,0,.06)",padding:"3px 10px",borderRadius:10 }}>
                            {new Date(activeThread.messages[0]?.time).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}
                          </span>
                        </div>

                        {activeThread.messages.map((m,i)=>{
                          const isUser = m.side==="user";
                          const prevSide = i>0?activeThread.messages[i-1].side:null;
                          const nextSide = i<activeThread.messages.length-1?activeThread.messages[i+1].side:null;
                          const isLast = nextSide!==m.side;
                          // Show time only when side changes or at end
                          const showTime = isLast;

                          return (
                            <div key={i} style={{ display:"flex",flexDirection:"column",alignItems:isUser?"flex-end":"flex-start",marginBottom:prevSide!==m.side?10:2 }}>
                              {/* Sender label on first message of group */}
                              {prevSide!==m.side&&(
                                <span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:10.5,color:"#8e8e93",marginBottom:3,marginLeft:isUser?0:4,marginRight:isUser?4:0 }}>
                                  {isUser?activeThread.guestName:"FinalCount"}
                                </span>
                              )}
                              <div style={{
                                background: isUser?"#007AFF":"#E9E9EB",
                                color: isUser?"white":"#000",
                                borderRadius: isUser
                                  ? (prevSide===m.side?"18px 18px 4px 18px":"18px 18px 4px 18px")
                                  : (prevSide===m.side?"18px 18px 18px 4px":"18px 18px 18px 4px"),
                                padding:"9px 14px",
                                fontSize:14.5,
                                lineHeight:1.45,
                                maxWidth:"72%",
                                fontFamily:"-apple-system,'SF Pro Text',sans-serif",
                                whiteSpace:"pre-wrap",
                                wordBreak:"break-word",
                              }}>{m.text}</div>
                              {showTime&&(
                                <span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:10.5,color:"#8e8e93",marginTop:3,marginLeft:isUser?0:4,marginRight:isUser?4:0 }}>
                                  {new Date(m.time).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}
                                </span>
                              )}
                            </div>
                          );
                        })}
                        <div ref={threadEndRef}/>
                      </div>

                      {/* Read-only input bar — shows it's a real conversation but managed by FinalCount */}
                      <div style={{ padding:"10px 16px",borderTop:"0.5px solid #d1d1d6",background:"white",display:"flex",alignItems:"center",gap:10 }}>
                        <div style={{ flex:1,background:"#f5f5f7",borderRadius:20,padding:"9px 16px",fontSize:13.5,color:"#8e8e93",fontFamily:"-apple-system,sans-serif",border:"1px solid #e0e0e0" }}>
                          FinalCount replies automatically via SMS…
                        </div>
                      </div>
                    </>
                  ):(
                    <div style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:C.textFaint,fontFamily:"'DM Sans',sans-serif",fontSize:14 }}>
                      Select a conversation
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Analytics Tab ── */}
        {tab==="Analytics"&&(
          <div className="db-fade">
            {total===0?(
              <div className="db-card" style={{ padding:"56px 32px",textAlign:"center" }}>
                <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:22,color:C.textFaint,marginBottom:8 }}>No data yet</div>
                <p style={{ fontSize:13,color:C.textFaint }}>Add guests and run simulations to see analytics here.</p>
              </div>
            ):(
              <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
                <div className="db-card" style={{ padding:"24px 28px" }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:20,fontWeight:400,color:C.text,marginBottom:20 }}>RSVP Summary</div>
                  <AnalyticsChart guests={guestsRaw}/>
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16 }}>
                  <div className="db-card" style={{ padding:"20px" }}>
                    <div style={{ fontSize:11,fontWeight:600,color:C.textFaint,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8 }}>Dietary restrictions</div>
                    {getDietaryGroups(guestsRaw).length===0
                      ? <p style={{ fontSize:13,color:C.textFaint }}>None recorded yet.</p>
                      : getDietaryGroups(guestsRaw).map(([label,count])=>(
                          <div key={label} style={{ display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid #f5f0ea`,fontSize:13,color:C.text }}>
                            <span>{label}</span>
                            <span style={{ color:C.gold,fontWeight:600 }}>{count}</span>
                          </div>
                        ))}
                  </div>
                  <div className="db-card" style={{ padding:"20px" }}>
                    <div style={{ fontSize:11,fontWeight:600,color:C.textFaint,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8 }}>Plus-ones</div>
                    <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:40,fontWeight:300,color:C.espresso,lineHeight:1,marginBottom:4 }}>
                      {guestsRaw.filter(g=>g.plusOne&&g.plusOne!=="No"&&g.plusOne!=="—").length}
                    </div>
                    <p style={{ fontSize:12.5,color:C.textFaint }}>guests bringing a plus-one</p>
                  </div>
                  <div className="db-card" style={{ padding:"20px" }}>
                    <div style={{ fontSize:11,fontWeight:600,color:C.textFaint,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8 }}>Conversations run</div>
                    <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:40,fontWeight:300,color:C.espresso,lineHeight:1,marginBottom:4 }}>
                      {guestsRaw.filter(g=>g.log&&g.log.length>0).length}
                    </div>
                    <p style={{ fontSize:12.5,color:C.textFaint }}>guests with a simulated convo</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Settings Tab ── */}
        {tab==="Settings"&&(
          <SettingsPage wedding={wedding} onSave={w=>{ setWedding(w); }}/>
        )}
      </div>

      {/* Modals */}
      {showAdd&&<GuestModal initial={editGuest} events={wedding.events||[]} onSave={saveGuest} onCancel={()=>{setShowAdd(false);setEditGuest(null);}}/>}
      {simGuest&&<ConvoSimulator guest={simGuest} wedding={wedding} onClose={()=>setSimGuest(null)} onUpdateGuest={updated=>{updateGuestFromSim(updated);setSimGuest(null);}}/>}
      {showSend&&<SendInvitesModal guests={guestsRaw} wedding={wedding} onClose={()=>setShowSend(false)}/>}

      {/* Conversation log drawer */}
      {logGuest&&(
        <div style={{ position:"fixed",inset:0,background:"rgba(20,14,10,.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:20,backdropFilter:"blur(2px)" }} onClick={e=>{if(e.target===e.currentTarget)setLogGuest(null);}}>
          <div style={{ background:"white",borderRadius:14,width:"100%",maxWidth:540,maxHeight:"85vh",display:"flex",flexDirection:"column",boxShadow:"0 28px 72px rgba(0,0,0,.22)",animation:"slideUp .3s cubic-bezier(.16,1,.3,1)" }}>
            <div style={{ padding:"18px 22px",borderBottom:`1px solid ${C.creamBorder}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0 }}>
              <div>
                <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:20,fontWeight:500,color:C.text }}>{logGuest.name}</div>
                <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,color:C.textFaint,marginTop:2 }}>{logGuest.phone||"No phone"} · <StatusPill status={logGuest.status}/></div>
              </div>
              <button onClick={()=>setLogGuest(null)} style={{ background:"none",border:"none",cursor:"pointer",fontSize:18,color:C.textFaint,padding:"4px 8px" }}>✕</button>
            </div>
            <div style={{ flex:1,overflowY:"auto",padding:"16px 18px",background:"#f9f6f0",display:"flex",flexDirection:"column",gap:10 }}>
              {(!logGuest.log||logGuest.log.length===0)?(
                <div style={{ textAlign:"center",padding:"48px 20px",color:C.textFaint }}>
                  <div style={{ fontSize:14,marginBottom:6 }}>No messages yet</div>
                  <p style={{ fontSize:12.5,lineHeight:1.6 }}>Run a simulation for this guest to see the conversation here.</p>
                </div>
              ):logGuest.log.map((m,i)=>(
                <div key={i} className={m.side==="bot"?"log-bot":"log-user"} style={{ alignSelf:m.side==="bot"?"flex-start":"flex-end" }}>{m.text}</div>
              ))}
            </div>
            <div style={{ padding:"12px 18px",borderTop:`1px solid ${C.creamBorder}`,display:"flex",justifyContent:"flex-end" }}>
              <button onClick={()=>setLogGuest(null)} className="db-btn-ghost" style={{ fontSize:12 }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [user,setUser]=useState(null);
  return user
    ? <Dashboard userEmail={user} onLogout={()=>setUser(null)}/>
    : <LoginPage onLogin={setUser}/>;
}
