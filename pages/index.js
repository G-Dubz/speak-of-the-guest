import React, { useState, useEffect } from 'react';

const SIMULATOR_PRESETS = [
  {
    buttonLabel: "Messy RSVP Paragraph",
    text: "Hey! Yes we're both coming but Jan is gluten-free now. Skipping the Friday welcome dinner, see you Saturday!",
    parsed: { status: "Confirmed", events: "Saturday Only", plusOne: "Yes (Jan)", dietary: "Gluten-Free" }
  },
  {
    buttonLabel: "Last-Minute Change",
    text: "Actually it's just going to be me, sorry! My partner has to work. Can't wait for the ceremony though!",
    parsed: { status: "Confirmed", events: "All Events", plusOne: "No", dietary: "None" }
  },
  {
    buttonLabel: "Polite Decline",
    text: "Oh no, we are so bummed but we will be out of town that weekend. Sending you guys so much love!!",
    parsed: { status: "Declined", events: "None", plusOne: "N/A", dietary: "N/A" }
  }
];

export default function FinalCountLanding() {
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: "Hey Uncle Sunil! Finalizing the headcount for Priya & Arjun's wedding. Will you and Auntie make it to the Sangeet and Reception?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [highlightCell, setHighlightCell] = useState(false);
  const [spreadsheetData, setSpreadsheetData] = useState({
    name: "Uncle Sunil & Auntie", status: "Pending", events: "All", plusOne: "Pending", dietary: "-"
  });

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSimulate = (presetText, parsedData) => {
    setChatMessages([
      { sender: 'bot', text: "Hey Uncle Sunil! Finalizing the headcount for Priya & Arjun's wedding. Will you and Auntie make it to the Sangeet and Reception?" }, 
      { sender: 'user', text: presetText }
    ]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setChatMessages(prev => [
        ...prev, 
        { sender: 'bot', text: `Perfect, got you down for 2 guests. Spreadsheet updated!` }
      ]);
      setSpreadsheetData({
        name: "Uncle Sunil & Auntie",
        status: parsedData.status,
        events: parsedData.events,
        plusOne: parsedData.plusOne,
        dietary: parsedData.dietary
      });
      setHighlightCell(true);
    }, 1100);
  };

  return (
    <div style={{ backgroundColor: '#faf7f2', color: '#332a22', fontFamily: 'sans-serif', minHeight: 'screen', paddingBottom: '80px' }}>
      {/* Fallback layout styles injected cleanly */}
      <style>{`
        .wrapper { max-w: 1100px; margin: 0 auto; padding: 0 24px; }
        .nav { display: flex; justify-content: space-between; align-items: center; padding: 32px 0; border-b: 1px solid #ebdccb; }
        .hero { text-align: center; padding: 80px 0; }
        .badge { background: #f2ebd9; color: #bfa88f; font-size: 12px; font-weight: bold; padding: 6px 16px; border-radius: 20px; display: inline-block; text-transform: uppercase; letter-spacing: 2px; }
        .title { font-family: serif; font-size: 48px; margin: 24px 0; color: #332a22; }
        .subtitle { color: #665a4e; font-size: 18px; font-weight: 300; max-width: 650px; margin: 0 auto; line-height: 1.6; }
        .demo-container { background: #f0eae1; border: 1px solid #ebdccb; border-radius: 16px; padding: 40px 24px; margin: 40px 0; }
        .grid { display: grid; grid-template-columns: 1fr; gap: 40px; margin-top: 40px; }
        @media (min-width: 768px) { .grid { grid-template-columns: 5fr 7fr; } .title { font-size: 64px; } }
        .btn-preset { background: white; border: 1px solid #d1c2b0; padding: 10px 18px; border-radius: 6px; font-size: 13px; cursor: pointer; font-weight: 500; margin: 4px; transition: 0.2s; }
        .btn-preset:hover { background: #332a22; color: white; }
        .phone-mock { bg: #09090b; background-color: #09090b; border: 6px solid #332a22; border-radius: 36px; padding: 16px; height: 480px; display: flex; flex-direction: column; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3); }
        .sheet-mock { background: white; border-radius: 12px; border: 1px solid #ebdccb; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
        .sheet-header { background: #332a22; color: #faf7f2; padding: 16px; font-family: serif; font-size: 14px; display: flex; justify-content: space-between; }
        .table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; }
        .table th { background: #faf7f2; color: #665a4e; font-size: 11px; text-transform: uppercase; padding: 12px; border-bottom: 1px solid #ebdccb; }
        .table td { padding: 14px 12px; border-bottom: 1px solid #f0eae1; color: #444; }
        .msg-bubble { max-width: 85%; padding: 12px; border-radius: 12px; margin-bottom: 12px; font-size: 12px; line-height: 1.4; }
        .msg-bot { background: #1c1c1e; color: #f5f5f7; align-self: flex-start; }
        .msg-user { background: #bfa88f; color: white; align-self: flex-end; margin-left: auto; }
        .card-pricing { background: #332a22; color: white; border-radius: 16px; padding: 48px; text-align: center; max-width: 450px; margin: 60px auto 0 auto; }
        .btn-cta { background: #332a22; color: white; border: none; padding: 14px 28px; border-radius: 6px; font-weight: bold; cursor: pointer; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; }
        .input-text { width: 100%; padding: 12px; border-radius: 6px; border: 1px solid #ccc; margin: 12px 0; box-sizing: border-box; }
      `}</style>

      <div className="wrapper">
        {/* Navigation */}
        <div className="nav">
          <div style={{ fontSize: '22px', fontFamily: 'serif', fontWeight: 'bold' }}>
            FinalCount<span style={{ color: '#bfa88f' }}>.</span>
          </div>
          <a href="#waitlist"><button className="btn-cta" style={{ padding: '10px 20px' }}>Join Waitlist</button></a>
        </div>

        {/* Hero */}
        <div className="hero">
          <div className="badge">The Ultimate Wedding RSVP Solution</div>
          <h1 className="title">Stop chasing RSVPs. Let AI get your final numbers.</h1>
          <p className="subtitle">
            The automated text assistant that chats with your guests, tracks dietary restrictions, maps multi-day events, and updates your spreadsheet automatically.
          </p>
          <div style={{ marginTop: '32px' }}>
            <a href="#demo"><button className="btn-cta">Get Your Evenings Back</button></a>
          </div>
        </div>

        {/* Live Demo Console */}
        <div id="demo" className="demo-container">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'serif', fontSize: '28px', margin: '0' }}>Test the Interactive Tracker</h2>
            <p style={{ fontSize: '14px', color: '#665a4e', marginTop: '8px' }}>Click a sample reply to simulate how the text intelligence registers messy updates instantly:</p>
            <div style={{ marginTop: '16px' }}>
              {SIMULATOR_PRESETS.map((p, idx) => (
                <button key={idx} onClick={() => handleSimulate(p.text, p.parsed)} className="btn-preset">
                  ⚡ {p.buttonLabel}
                </button>
              ))}
            </div>
          </div>

          <div className="grid">
            {/* Simulator Window */}
            <div>
              <h4 style={{ margin: '0 0 12px 4px', fontFamily: 'serif', color: '#665a4e' }}>FinalCount Assistant Chat</h4>
              <div className="phone-mock">
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflowY: 'auto' }}>
                  {chatMessages.map((m, i) => (
                    <div key={i} className={`msg-bubble ${m.sender === 'bot' ? 'msg-bot' : 'msg-user'}`}>
                      {m.text}
                    </div>
                  ))}
                  {isTyping && <div style={{ color: '#665a4e', fontSize: '11px', fontStyle: 'italic', paddingLeft: '4px' }}>Reading message entries...</div>}
                </div>
              </div>
            </div>

            {/* Tracker Window */}
            <div>
              <h4 style={{ margin: '0 0 12px 4px', fontFamily: 'serif', color: '#665a4e' }}>Your Real-Time Guest List</h4>
              <div className="sheet-mock">
                <div className="sheet-header">
                  <span>📊 Master Workbook Log</span>
                  <span style={{ color: '#bfa88f', fontSize: '11px' }}>● Connected Live</span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Guest Name</th>
                        <th>RSVP Status</th>
                        <th>Dietary</th>
                        <th>Events Allowed</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ color: '#aaa' }}>
                        <td style={{ fontWeight: 'bold', color: '#888' }}>Aunt Clara</td>
                        <td><span style={{ color: '#15803d', background: '#f0fdf4', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>Confirmed</span></td>
                        <td>Vegan</td>
                        <td>All Events</td>
                      </tr>
                      <tr style={{ background: highlightCell ? '#fefcbf' : 'transparent', transition: '0.6s' }}>
                        <td style={{ fontWeight: 'bold', color: '#332a22' }}>{spreadsheetData.name}</td>
                        <td>
                          <span style={{ 
                            padding: '2px 8px', 
                            borderRadius: '4px', 
                            fontWeight: 'bold',
                            color: spreadsheetData.status === 'Confirmed' ? '#15803d' : spreadsheetData.status === 'Declined' ? '#b91c1c' : '#b45309',
                            background: spreadsheetData.status === 'Confirmed' ? '#f0fdf4' : spreadsheetData.status === 'Declined' ? '#fef2f2' : '#fffbeb'
                          }}>
                            {spreadsheetData.status}
                          </span>
                        </td>
                        <td>{spreadsheetData.dietary}</td>
                        <td>{spreadsheetData.events}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Explainer */}
        <div style={{ padding: '60px 0', textAlign: 'center', borderTop: '1px solid #ebdccb', marginTop: '60px' }}>
          <h3 style={{ fontFamily: 'serif', fontSize: '28px' }}>Designed to pass the "Grandmother Test"</h3>
          <p style={{ color: '#665a4e', maxWidth: '600px', margin: '12px auto 0 auto', fontSize: '15px', fontHeight: '1.6', fontWeight: 300 }}>
            Wedding links get lost or confuse family. FinalCount sends a gentle text invitation directly to their native SMS window. If they can reply to a friend, they can successfully log their attendance details.
          </p>
        </div>

        {/* Lead Form Box */}
        <div id="waitlist" className="card-pricing">
          <span style={{ textTransform: 'uppercase', fontSize: '11px', letterSpacing: '2px', color: '#bfa88f', fontWeight: 'bold' }}>Limited Launch Allocation</span>
          <h3 style={{ fontFamily: 'serif', fontSize: '32px', margin: '12px 0' }}>Join the Private Beta</h3>
          <p style={{ color: '#dfd3c3', fontSize: '13px', fontHeight: '1.6', fontWeight: '300' }}>
            We're letting a select group of couples lock in standard concierge features for a single, low fixed flat fee before regular commercial licensing starts.
          </p>
          
          <div style={{ background: 'white', padding: '24px', borderRadius: '8px', color: '#332a22', textAlign: 'left', marginTop: '32px' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <span style={{ fontSize: '24px' }}>✨</span>
                <h4 style={{ fontFamily: 'serif', margin: '8px 0 4px 0' }}>Reservation Secured</h4>
                <p style={{ fontSize: '12px', color: '#665a4e' }}>We will email you access credentials shortly.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#665a4e' }}>Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-text" 
                  placeholder="Enter your email address..."
                />
                <button type="submit" className="btn-cta" style={{ width: '100%', marginTop: '8px' }}>Request Invitation</button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
