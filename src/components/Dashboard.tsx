'use client';
import React, { useState } from 'react';

const Dashboard = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages((prev:any) => [...prev, userMessage]);


    setTimeout(() => {
      const botResponse = { role: 'bot', text: `You said: "${input}"` };
      setMessages((prev:any) => [...prev, botResponse]);
    }, 1000);

    setInput('');
  };

  return (
    <div className="flex flex-col bg-[#151723] w-full h-full p-4 text-white">
      <div className="flex-grow overflow-y-auto p-5 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[75%] p-3 rounded-lg ${
                message.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-gray-700 bg-[#1d1f2b]">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-grow p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
