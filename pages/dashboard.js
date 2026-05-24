import { useState } from 'react';

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // Update this URL with your actual Make.com Webhook URL from Step 1
  const MAKE_WEBHOOK_URL = "https://hook.us2.make.com/8oekwkkbpv624rlwblyo23y2hl1i9tne"; 

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'password123') { // Your testing password
      setIsAuthenticated(true);
    } else {
      alert('Incorrect testing password.');
    }
  };

  const handleAddGuest = async (e) => {
    e.preventDefault();
    setStatusMessage('Adding test number...');

    try {
      const response = await fetch(MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestName, phone, action: 'add_test_guest' }),
      });

      if (response.ok) {
        setStatusMessage(`Successfully added ${guestName}! The AI will now begin outreach.`);
        setGuestName('');
        setPhone('');
      } else {
        setStatusMessage('Failed to send data to Make.com.');
      }
    } catch (error) {
      setStatusMessage('Error connecting to backend engine.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fcfaf7] flex items-center justify-center font-sans">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full border border-[#bfa88f]/30">
          <h1 className="text-2xl font-serif text-[#332a22] mb-2 text-center font-bold">FinalCount Simulator</h1>
          <p className="text-sm text-gray-500 mb-6 text-center">Enter your test password to access the couple dashboard.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Test Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#bfa88f]"
            />
            <button type="submit" className="w-full bg-[#332a22] text-white py-2 rounded-md hover:bg-[#4a3e33] transition">
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfaf7] p-8 font-sans text-[#332a22]">
      <div className="max-w-4xl mx-auto">
        <header className="border-b border-[#bfa88f]/30 pb-4 mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-serif font-bold">FinalCount Simulator</h1>
            <p className="text-sm text-gray-500">Welcome back, Sarah & Mike (Testing Mode)</p>
          </div>
          <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">System Live</span>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Guest Addition panel */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#bfa88f]/20 md:col-span-1 h-fit">
            <h2 className="text-lg font-serif font-bold mb-4">Add Simulator Guest</h2>
            <form onSubmit={handleAddGuest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Guest Name</label>
                <input
                  type="text"
                  placeholder="e.g., Uncle Dave"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#bfa88f]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g., +19195551234"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#bfa88f]"
                />
              </div>
              <button type="submit" className="w-full bg-[#bfa88f] text-white py-2 rounded-md hover:bg-[#ab937a] transition text-sm font-semibold">
                Inject & Run AI
              </button>
            </form>
            {statusMessage && <p className="text-xs mt-3 text-center text-gray-600 font-medium italic">{statusMessage}</p>}
          </div>

          {/* Master Google sheet Feed lookalike */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#bfa88f]/20 md:col-span-2">
            <h2 className="text-lg font-serif font-bold mb-4">Live Activity Console</h2>
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 p-4 min-h-[250px] flex items-center justify-center text-center text-gray-400 text-sm">
              <div>
                <p className="font-medium mb-1">No active logs yet.</p>
                <p className="text-xs max-w-md">Once you submit a test number above, it will trigger your Make scenario. Check your spreadsheet row to monitor data state transformations instantly!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
