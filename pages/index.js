import React, { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [simText, setSimText] = useState('');
  const [guestList, setGuestList] = useState([
    { name: 'Uncle Sunil & Auntie', rsvp: 'Pending', dietary: '-', events: 'All' },
    { name: 'Sarah Jenkins (Plus One)', rsvp: 'Pending', dietary: '-', events: 'All' },
    { name: 'Rohit Sharma', rsvp: 'Pending', dietary: '-', events: 'All' },
  ]);

  const handleDemoSubmit = (e) => {
    e.preventDefault();
    if (simText.toLowerCase().includes('yes') || simText.toLowerCase().includes('coming')) {
      setGuestList([
        { name: 'Uncle Sunil & Auntie', rsvp: 'Confirmed (2)', dietary: 'None', events: 'Sangeet & Reception' },
        { name: 'Sarah Jenkins (Plus One)', rsvp: 'Pending', dietary: '-', events: 'All' },
        { name: 'Rohit Sharma', rsvp: 'Pending', dietary: '-', events: 'All' },
      ]);
    } else if (simText.toLowerCase().includes('vegan') || simText.toLowerCase().includes('dairy')) {
      setGuestList([
        { name: 'Uncle Sunil & Auntie', rsvp: 'Pending', dietary: '-', events: 'All' },
        { name: 'Sarah Jenkins (Plus One)', rsvp: 'Confirmed (2)', dietary: 'Vegan (Sarah)', events: 'Ceremony Only' },
        { name: 'Rohit Sharma', rsvp: 'Pending', dietary: '-', events: 'All' },
      ]);
    }
    setSimText('');
  };

  const handleWaitlistSubmit = (e) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#fcfbfa] text-[#332a22] font-sans">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center border-b border-[#e6e1da]">
        <div className="text-2xl font-bold tracking-tight text-[#332a22]">
          Final<span className="text-[#bfa88f]">Count</span>
        </div>
        <a href="#waitlist" className="bg-[#332a22] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#4a3f35] transition">
          Join the Waitlist
        </a>
      </nav>

      {/* Hero Section */}
      <header className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <span className="text-xs font-bold tracking-widest uppercase text-[#bfa88f] bg-[#f5f1ec] px-4 py-2 rounded-full">
          The Ultimate Wedding RSVP Solution
        </span>
        <h1 className="text-5xl md:text-6xl font-serif text-[#332a22] mt-6 tracking-tight max-w-3xl mx-auto leading-tight">
          Stop chasing RSVPs. Let AI get your final numbers.
        </h1>
        <p className="text-xl text-[#665e56] mt-6 max-w-2xl mx-auto leading-relaxed">
          The automated text assistant that chats with your guests, tracks dietary restrictions, maps multi-day events, and updates your spreadsheet automatically.
        </p>
        <div className="mt-10">
          <a href="#waitlist" className="inline-block bg-[#bfa88f] text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-[#aa937a] transition shadow-md">
            Get Your Evenings Back
          </a>
        </div>
      </header>

      {/* Interactive Demo Section */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-[#f5f1ec] rounded-3xl p-8 md:p-12 grid md:grid-cols-2 gap-12 items-center shadow-sm">
          {/* Left: Phone Simulator */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-[#e6e1da] max-w-sm mx-auto w-full">
            <div className="flex items-center space-x-3 border-b border-[#f5f1ec] pb-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#bfa88f] flex items-center justify-center text-white font-bold">FC</div>
              <div>
                <h3 className="font-bold text-sm">FinalCount Assistant</h3>
                <p className="text-xs text-green-500">Active Wedding Coordinator</p>
              </div>
            </div>
            
            <div className="space-y-4 min-h-[250px] flex flex-col justify-end text-sm">
              <div className="bg-[#f5f1ec] p-3 rounded-2xl rounded-tl-none max-w-[85%]">
                "Hey Uncle Sunil! Finalizing the headcount for Priya & Arjun's wedding. Will you and Auntie make it to the Sangeet and Reception?"
              </div>
              <div className="bg-[#332a22] text-white p-3 rounded-2xl rounded-tr-none max-w-[85%] self-end">
                "Hey! Yes we are coming to both, but we can't make the welcome dinner."
              </div>
              <div className="bg-[#f5f1ec] p-3 rounded-2xl rounded-tl-none max-w-[85%]">
                "Perfect, got you down for 2 guests for the Sangeet and Reception. Spreadsheet updated!"
              </div>
            </div>

            <form onSubmit={handleDemoSubmit} className="mt-6 pt-4 border-t border-[#f5f1ec] flex space-x-2">
              <input 
                type="text" 
                placeholder="Type a test reply (e.g., 'Yes we are coming')" 
                value={simText}
                onChange={(e) => setSimText(e.target.value)}
                className="flex-1 bg-[#fcfbfa] border border-[#e6e1da] rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#bfa88f]"
              />
              <button type="submit" className="bg-[#bfa88f] text-white px-4 py-2 rounded-xl text-xs font-medium">Send</button>
            </form>
          </div>

          {/* Right: Live Spreadsheet Visual */}
          <div className="w-full overflow-hidden">
            <h3 className="font-serif text-2xl mb-4">Your Real-Time Guest List</h3>
            <p className="text-sm text-[#665e56] mb-6">Watch your spreadsheet update automatically as guests text back details in natural conversation.</p>
            
            <div className="bg-white rounded-2xl shadow-md border border-[#e6e1da] overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#332a22] text-white uppercase tracking-wider">
                    <th className="p-3">Guest Name</th>
                    <th className="p-3">RSVP Status</th>
                    <th className="p-3">Dietary</th>
                    <th className="p-3">Events Allowed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e6e1da]">
                  {guestList.map((g, i) => (
                    <tr key={i} className="hover:bg-[#fcfbfa] transition">
                      <td className="p-3 font-medium">{g.name}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full font-bold ${g.rsvp.includes('Confirmed') ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {g.rsvp}
                        </span>
                      </td>
                      <td className="p-3 text-[#665e56]">{g.dietary}</td>
                      <td className="p-3 text-[#665e56]">{g.events}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-[#e6e1da]">
        <h2 className="text-3xl font-serif text-center mb-12">Why FinalCount Wins</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 bg-[#fcfbfa] border border-[#e6e1da] rounded-2xl">
            <h4 className="font-bold text-red-700 mb-2">The Old Way (Website Links)</h4>
            <p className="text-sm text-[#665e56] leading-relaxed">Guests have to leave their text threads, open a browser, look up their names, and navigate clunky web forms. Older relatives get confused, links get lost, and you spend weeks chasing responses.</p>
          </div>
          <div className="p-6 bg-[#f5f1ec] border border-[#bfa88f] rounded-2xl">
            <h4 className="font-bold text-[#332a22] mb-2">The New Way (FinalCount)</h4>
            <p className="text-sm text-[#665e56] leading-relaxed">Conversations happen completely over native text and WhatsApp. If your guests know how to text a family member, they already know how to RSVP. Zero learning curve, flawless completion rates.</p>
          </div>
        </div>
      </section>

      {/* Lead Capture Footer */}
      <footer id="waitlist" className="bg-[#332a22] text-white py-20 text-center px-6">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-serif mb-4">Enjoy your engagement. Leave the count to us.</h2>
          <p className="text-[#b3a9a0] text-sm mb-8">We are currently accepting early beta testers for the upcoming wedding season. Drop your email below to save your spot.</p>
          
          {submitted ? (
            <div className="bg-[#4a3f35] border border-[#bfa88f] p-4 rounded-xl text-sm max-w-sm mx-auto text-[#e6e1da]">
              🎉 You're on the list! We'll reach out shortly to set up your assistant.
            </div>
          ) : (
            <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-2 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-5 py-3 rounded-full text-sm text-[#332a22] bg-white border-none focus:outline-none focus:ring-2 focus:ring-[#bfa88f]"
              />
              <button type="submit" className="bg-[#bfa88f] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-[#aa937a] transition whitespace-nowrap">
                Join the Waitlist
              </button>
            </form>
          )}
          <p className="text-xs text-[#8c8177] mt-8">© 2026 FinalCount Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
