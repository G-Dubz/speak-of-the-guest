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

export default function PremiumLandingPage() {
  // Simulator State
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: "Hey Uncle Dave! We're finalizing counts for Sarah & Mike's wedding. Will you and Aunt Jan make it to the welcome dinner Friday and reception Saturday?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [highlightCell, setHighlightCell] = useState(false);
  const [spreadsheetData, setSpreadsheetData] = useState({
    name: "Uncle Dave & Jan", status: "Pending", events: "Pending", plusOne: "Pending", dietary: "Pending"
  });

  // Waitlist State
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  const handleSimulate = (presetText, parsedData) => {
    setChatMessages([
      { sender: 'bot', text: "Hey Uncle Dave! We're finalizing counts for Sarah & Mike's wedding. Will you and Aunt Jan make it to the welcome dinner Friday and reception Saturday?" }, 
      { sender: 'user', text: presetText }
    ]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setChatMessages(prev => [
        ...prev, 
        { sender: 'bot', text: `Got it, thanks Uncle Dave! I've updated your details: ${parsedData.status === 'Declined' ? 'We will miss you!' : 'Can\'t wait to see you Saturday!'}` }
      ]);
      setSpreadsheetData(parsedData);
      setHighlightCell(true);
    }, 1100);
  };

  const handleWaitlistSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#332a22] font-sans antialiased selection:bg-[#f0e6da]">
      {/* Tailwind Engine Injector */}
      <script src="https://cdn.tailwindcss.com"></script>

      {/* Decorative Top Border */}
      <div className="h-2 bg-[#332a22]"></div>

      {/* Navigation */}
      <nav className="max-w-6xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="text-xl font-serif tracking-tight font-bold text-[#332a22]">
          Speak of the Guest<span className="text-[#bfa88f]">.</span>
        </div>
        <div className="hidden md:flex space-x-8 text-xs uppercase tracking-widest font-semibold text-[#665a4e]">
          <a href="#features" className="hover:text-[#332a22] transition">The Concept</a>
          <a href="#demo" className="hover:text-[#332a22] transition">Live Demo</a>
          <a href="#pricing" className="hover:text-[#332a22] transition">Pricing</a>
        </div>
        <a href="#waitlist" className="bg-[#332a22] hover:bg-[#4a3e33] text-[#faf7f2] text-xs font-semibold uppercase tracking-widest px-5 py-3 rounded transition shadow-sm">
          Join Waitlist
        </a>
      </nav>

      {/* Hero Section */}
      <header className="max-w-4xl mx-auto text-center px-6 pt-16 pb-24">
        <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#bfa88f] bg-[#f2ebd9] px-3 py-1 rounded-full inline-block mb-4">
          The New Standard for RSVPs
        </span>
        <h1 className="text-4xl md:text-6xl font-serif text-[#332a22] leading-[1.15] font-normal tracking-tight">
          The wedding assistant that texts your guests and fills your spreadsheet.
        </h1>
        <p className="mt-6 text-base md:text-xl text-[#665a4e] max-w-2xl mx-auto font-light leading-relaxed">
          Skip the clunky wedding websites. Your guests don't want to log into a portal. Our autonomous assistant has polite text conversations to lock in headcounts beautifully.
        </p>
        <div className="mt-10">
          <a href="#demo" className="bg-[#332a22] hover:bg-[#4a3e33] text-white font-medium px-8 py-4 rounded-lg shadow-md transition-all inline-block text-sm">
            See the Live Demo
          </a>
        </div>
      </header>

      {/* Value Pillars Section */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-16 border-t border-[#ebdccb]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-3">
            <div className="text-2xl text-[#bfa88f] font-serif">01.</div>
            <h3 className="text-lg font-serif font-medium text-[#332a22]">Passes the 'Grandmother Test'</h3>
            <p className="text-sm text-[#665a4e] font-light leading-relaxed">No links to click, no interface to learn. If your guests can reply to a text message from a friend, they can instantly RSVP to your wedding.</p>
          </div>
          <div className="space-y-3">
            <div className="text-2xl text-[#bfa88f] font-serif">02.</div>
            <h3 className="text-lg font-serif font-medium text-[#332a22]">Handles Complex Plans</h3>
            <p className="text-sm text-[#665a4e] font-light leading-relaxed">Multi-day schedules, rehearsal dinners, sudden plus-one adjustments, and strict food allergies are all organized seamlessly into separate categories.</p>
          </div>
          <div className="space-y-3">
            <div className="text-2xl text-[#bfa88f] font-serif">03.</div>
            <h3 className="text-lg font-serif font-medium text-[#332a22]">Polite Automated Nudging</h3>
            <p className="text-sm text-[#665a4e] font-light leading-relaxed">Never send an awkward 'reminder' text again. The assistant coordinates polite, timed follow-ups to lingering guests without you ever lifting a finger.</p>
          </div>
        </div>
      </section>

      {/* Interactive Feature Demo */}
      <section id="demo" className="bg-[#f0eae1] py-20 px-6 border-y border-[#ebdccb]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-serif text-[#332a22]">Watch it process data in real time</h2>
            <p className="text-sm text-[#665a4e] mt-2 font-light">Click a sample guest message below to simulate how the AI engine extracts raw, chaotic conversational paragraphs into structured tracker rows instantly.</p>
            
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {SIMULATOR_PRESETS.map((p, idx) => (
                <button key={idx} onClick={() => handleSimulate(p.text, p.parsed)} className="bg-white hover:bg-[#332a22] hover:text-white text-[#332a22] border border-[#d1c2b0] text-xs px-4 py-2 rounded-md transition shadow-sm font-medium">
                  ⚡ {p.buttonLabel}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Phone Frame */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[310px] bg-zinc-950 p-3 rounded-[40px] shadow-2xl border-[6px] border-[#332a22] flex flex-col aspect-[9/18]">
                <div className="text-center text-zinc-400 text-[10px] uppercase tracking-wider pb-2 pt-1 border-b border-zinc-800 font-semibold">Sarah & Mike's Concierge</div>
                <div className="flex-1 overflow-y-auto p-2 space-y-3 flex flex-col justify-end text-[11px] leading-normal">
                  {chatMessages.map((m, i) => (
                    <div key={i} className={`max-w-[85%] rounded-xl p-3 shadow-sm ${m.sender === 'bot' ? 'bg-zinc-900 text-zinc-100 self-start' : 'bg-[#bfa88f] text-white self-end'}`}>{m.text}</div>
                  ))}
                  {isTyping && <div className="text-zinc-500 italic animate-pulse self-start px-2">Assistant reading message...</div>}
                </div>
              </div>
            </div>

            {/* Right Column: Spreadsheet Preview */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-xl shadow-xl border border-[#ebdccb] overflow-hidden">
                <div className="bg-[#332a22] text-[#faf7f2] px-5 py-4 text-xs font-serif tracking-wide flex justify-between items-center">
                  <span>📋 Live Spreadsheet Connection (Automated)</span>
                  <span className="text-[10px] bg-[#4a3e33] text-[#dfd3c3] px-2 py-0.5 rounded">Active</span>
                </div>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#faf7f2] text-[#665a4e] uppercase text-[10px] tracking-wider border-b border-[#ebdccb]">
                        <th className="p-4 border-r border-[#ebdccb]">Party Name</th>
                        <th className="p-4 border-r border-[#ebdccb]">RSVP Status</th>
                        <th className="p-4 border-r border-[#ebdccb]">Events Attending</th>
                        <th className="p-4 border-r border-[#ebdccb]">Plus One Log</th>
                        <th className="p-4">Dietary Needs</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[#faf7f2] text-zinc-400">
                        <td className="p-4 text-zinc-700 font-medium border-r border-[#faf7f2]">Aunt Clara</td>
                        <td className="p-4 border-r border-[#faf7f2]"><span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-medium">Confirmed</span></td>
                        <td className="p-4 border-r border-[#faf7f2]">All Events</td>
                        <td className="p-4 border-r border-[#faf7f2]">No</td>
                        <td className="p-4">None</td>
                      </tr>
                      <tr className={`transition-all duration-700 ${highlightCell ? 'bg-amber-50 font-medium' : ''}`}>
                        <td className="p-4 text-zinc-800 font-medium border-r border-zinc-100">{spreadsheetData.name}</td>
                        <td className="p-4 border-r border-zinc-100">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${spreadsheetData.status === 'Confirmed' ? 'text-emerald-700 bg-emerald-50' : spreadsheetData.status === 'Declined' ? 'text-rose-700 bg-rose-50' : 'text-amber-700 bg-amber-50'}`}>
                            {spreadsheetData.status}
                          </span>
                        </td>
                        <td className="p-4 border-r border-zinc-100">{spreadsheetData.events}</td>
                        <td className="p-4 border-r border-zinc-100">{spreadsheetData.plusOne}</td>
                        <td className="p-4">{spreadsheetData.dietary}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Quote Block */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center italic font-serif text-lg md:text-2xl text-[#4a3e33] leading-relaxed">
        “We were spending literally three hours every evening calling people to confirm plus-ones and food needs. We set this up, and it confirmed 85% of our 300-person guest list within 4 days. Absolute lifesaver.”
        <span className="block font-sans not-italic text-xs uppercase tracking-widest font-bold text-[#bfa88f] mt-4">— Michael & Sarah, Married Nov 2025</span>
      </section>

      {/* Frequently Asked Questions Accordion */}
      <section className="bg-white border-t border-[#ebdccb] py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-serif text-center text-[#332a22] mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Does it support international phone numbers?", a: "Yes. The assistant communicates globally via standard text or WhatsApp, adjusting smoothly for varying timezones and network styles." },
              { q: "What happens if a guest types something totally confusing?", a: "Our AI model understands natural context, slang, and common typos perfectly. If an input is entirely ambiguous, it will politely ask the guest to clarify without escalating the issue to you." },
              { q: "Can we review the conversations?", a: "Absolutely. Every automated chat thread is fully visible in your private master dashboard alongside your synchronized Google Sheet, updated continuously." }
            ].map((item, index) => (
              <div key={index} className="border-b border-zinc-200 pb-4">
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full text-left font-serif font-medium text-base text-[#332a22] flex justify-between items-center py-2"
                >
                  <span>{item.q}</span>
                  <span className="text-[#bfa88f] font-sans text-xl">{openFaq === index ? '−' : '+'}</span>
                </button>
                {openFaq === index && (
                  <p className="text-sm text-[#665a4e] font-light mt-2 leading-relaxed animate-fadeIn">{item.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / Call To Action Waitlist Area */}
      <section id="pricing" className="bg-[#332a22] text-white py-24 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#bfa88f]">Exclusive Launch Access</span>
          <h2 className="text-3xl md:text-4xl font-serif mt-2 mb-6 text-[#faf7f2]">Take your evenings back.</h2>
          <p className="text-zinc-300 font-light text-sm mb-10 leading-relaxed">
            We are currently accepting a limited selection of upcoming weddings for our beta tier at a flat price of <strong className="text-white font-medium">$199</strong>. Drop your email below to reserve your slot and receive full onboarding access when we launch.
          </p>

          <div id="waitlist" className="bg-[#faf7f2] text-[#332a22] p-8 rounded-xl shadow-2xl text-left border border-[#ebdccb]">
            {submitted ? (
              <div className="text-center py-6">
                <span className="text-2xl">✨</span>
                <h4 className="text-lg font-serif font-medium mt-2">You're officially on the list!</h4>
                <p className="text-xs text-[#665a4e] mt-1 font-light">We will review your registration and follow up with booking access details shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-[#665a4e] mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email to secure early pricing..." 
                    className="w-full p-3 rounded border border-zinc-300 bg-white text-sm focus:outline-none focus:border-[#bfa88f]"
                  />
                </div>
                <button type="submit" className="w-full bg-[#332a22] hover:bg-[#4a3e33] text-white font-medium py-3 rounded text-xs uppercase tracking-widest font-semibold transition-all">
                  Join Beta Waitlist
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-[#faf7f2] text-[#9c8d7e] text-xs py-12 border-t border-[#ebdccb] text-center font-light">
        <p>© 2026 Speak of the Guest. Built for perfection, designed to pass the Grandmother Test.</p>
      </footer>
    </div>
  );
}
