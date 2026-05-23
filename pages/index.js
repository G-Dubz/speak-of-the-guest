import React, { useState, useEffect } from 'react';

const SCENARIOS = [
  {
    id: 1,
    buttonLabel: "They're both coming (with a dietary note)",
    botPrompt: "Hey Uncle Dave! Finalizing the headcount for Sarah & Mike's wedding. Will you and Aunt Clara make it to the Rehearsal Dinner and Reception?",
    userReply: "Yes we are coming to both, but Aunt Clara is strictly gluten-free now!",
    botConfirm: "Perfect, got you down for 2 guests for both events, and noted the gluten-free diet for Aunt Clara. Spreadsheet updated!",
    parsed: { name: "Uncle Dave & Aunt Clara", status: "Confirmed", events: "All events", plusOne: "Yes", dietary: "Gluten-Free" }
  },
  {
    id: 2,
    buttonLabel: "They changed their mind last minute",
    botPrompt: "Hi Emily! Checking in for Sarah & Mike's wedding. Are you still able to make the welcome dinner and the ceremony?",
    userReply: "Actually it's just going to be me now, sorry! My partner has to work. Can't wait for the ceremony though!",
    botConfirm: "No problem at all, I've updated your RSVP to just 1 guest for the ceremony. See you there!",
    parsed: { name: "Emily Jenkins", status: "Confirmed", events: "Ceremony Only", plusOne: "No", dietary: "None" }
  },
  {
    id: 3,
    buttonLabel: "They can't make it",
    botPrompt: "Hi Cousin Marcus! We are finalizing the numbers for the wedding this weekend. Will you be joining us?",
    userReply: "Oh no, I am so bummed but my flight got canceled and I won't be able to make it. Sending so much love!!",
    botConfirm: "Oh no, we will miss you! I've updated the list. Thank you for letting us know!",
    parsed: { name: "Cousin Marcus", status: "Declined", events: "None", plusOne: "N/A", dietary: "N/A" }
  },
  {
    id: 4,
    buttonLabel: "It's a multi-day wedding",
    botPrompt: "Hi David! We're finalizing counts for the weekend. Will you make it to the Welcome Party (Fri), Ceremony (Sat), and Farewell Brunch (Sun)?",
    userReply: "Hey! Yes to the Welcome Party and Ceremony, but we have to hit the road early Sunday so we'll skip the brunch.",
    botConfirm: "Got it! Logged you for Friday and Saturday, skipping Sunday. Safe travels!",
    parsed: { name: "David & Guest", status: "Confirmed", events: "Fri & Sat", plusOne: "Yes", dietary: "None" }
  }
];

export default function FinalCountLanding() {
  const [isRunning, setIsRunning] = useState(false);
  const [activeScenario, setActiveScenario] = useState(null);
  const [demoStep, setDemoStep] = useState(0); 
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: "Pick a scenario above to start the interactive walkthrough." }
  ]);
  const [spreadsheetData, setSpreadsheetData] = useState({
    name: "Uncle Dave & Aunt Clara", status: "Pending", events: "—", plusOne: "—", dietary: "—"
  });

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSimulate = (scenario) => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveScenario(scenario.id);
    
    // Step 1: Bot sends initial message
    setDemoStep(1);
    setChatMessages([{ sender: 'bot', text: scenario.botPrompt }]);
    
    // Step 2: Guest replies (Slowed down)
    setTimeout(() => {
      setDemoStep(2);
      setChatMessages(prev => [...prev, { sender: 'user', text: scenario.userReply }]);
      
      // Step 3: Bot understands context and replies (Slowed down)
      setTimeout(() => {
        setDemoStep(3);
        setChatMessages(prev => [...prev, { sender: 'bot', text: scenario.botConfirm }]);
        
        // Step 4: Spreadsheet updates (Slowed down)
        setTimeout(() => {
          setDemoStep(4);
          setSpreadsheetData(scenario.parsed);
          
          // Reset after showing the final result
          setTimeout(() => {
            setIsRunning(false);
            setDemoStep(0);
            setActiveScenario(null);
          }, 6000);
        }, 4500);
      }, 5000);
    }, 4500);
  };

  return (
    <div style={{ backgroundColor: '#faf7f2', color: '#332a22', fontFamily: 'sans-serif', minHeight: '100vh', paddingBottom: '80px' }}>
      <style>{`
        .wrapper { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
        .nav { display: flex; justify-content: space-between; align-items: center; padding: 32px 0; border-b: 1px solid #ebdccb; }
        .hero { text-align: center; padding: 80px 0; }
        .badge { background: #f2ebd9; color: #bfa88f; font-size: 12px; font-weight: bold; padding: 6px 16px; border-radius: 20px; display: inline-block; text-transform: uppercase; letter-spacing: 2px; }
        .title { font-family: serif; font-size: 48px; margin: 24px 0; color: #332a22; }
        .subtitle { color: #665a4e; font-size: 18px; font-weight: 300; max-width: 650px; margin: 0 auto; line-height: 1.6; }
        .demo-container { background: #f0eae1; border: 1px solid #ebdccb; border-radius: 16px; padding: 60px 24px; margin: 40px 0; position: relative; }
        
        .btn-preset { background: #ffffff; color: #332a22; border: 2px solid #bfa88f; padding: 12px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; margin: 6px; transition: all 0.2s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .btn-preset:hover:not(:disabled) { background: #332a22; color: #ffffff; border-color: #332a22; }
        .btn-preset.active { background: #332a22; color: #ffffff; border-color: #332a22; }
        .btn-preset:disabled:not(.active) { opacity: 0.6; background: #faf7f2; border-color: #ebdccb; color: #888; cursor: not-allowed; }

        .grid-layout { display: grid; grid-template-columns: 1fr; gap: 60px; margin-top: 60px; }
        @media (min-width: 768px) { .grid-layout { grid-template-columns: 1fr 1fr; } .title { font-size: 64px; } }
        
        .phone-mock { background-color: #ffffff; border: 12px solid #1a1a1a; border-radius: 40px; height: 620px; display: flex; flex-direction: column; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); position: relative; overflow: hidden; transition: all 0.4s ease; }
        .phone-mock.active-ring { box-shadow: 0 0 0 6px rgba(191, 168, 143, 0.4), 0 25px 50px -12px rgba(0,0,0,0.25); transform: scale(1.02); }
        
        .sheet-mock { background: white; border-radius: 12px; border: 1px solid #ebdccb; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); transition: all 0.4s ease; }
        .sheet-mock.active-ring { box-shadow: 0 0 0 6px rgba(191, 168, 143, 0.4), 0 20px 25px -5px rgba(0,0,0,0.1); transform: scale(1.02); }
        .sheet-header { background: #332a22; color: #faf7f2; padding: 16px; font-family: serif; font-size: 14px; display: flex; justify-content: space-between; }
        .table { width:
