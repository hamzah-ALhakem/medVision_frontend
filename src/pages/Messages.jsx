// src/pages/Messages.jsx
import React, { useState } from 'react';
import { Search, Send, Check, CheckCheck, ArrowRight } from 'lucide-react';

export default function Messages() {
  const [activeChatId, setActiveChatId] = useState(1);
  const [inputText, setInputText] = useState('');

  // Mock Conversations
  const conversations = [
    { 
      id: 1, name: 'Dr. Emily Carter', role: 'Oncologist', avatar: 'EC', color: 'bg-emerald-500',
      lastMessage: 'Your screening results look good.', time: '10:30 AM', unread: 2, online: true
    },
    { 
      id: 2, name: 'Dr. Michael Roberts', role: 'Radiologist', avatar: 'MR', color: 'bg-blue-500',
      lastMessage: 'Reschedule confirmed.', time: 'Yesterday', unread: 0, online: false
    },
  ];

  // Mock Messages State
  const [messages, setMessages] = useState([
    { id: 1, sender: 'them', text: 'Hello! How are you feeling today?', time: '10:00 AM' },
    { id: 2, sender: 'me', text: 'I am feeling much better, thank you Doctor.', time: '10:05 AM', status: 'read' },
    { id: 3, sender: 'them', text: 'Great to hear. I reviewed your latest screening.', time: '10:06 AM' },
  ]);

  const activeContact = conversations.find(c => c.id === activeChatId);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: 'me',
      text: inputText,
      time: 'Just now',
      status: 'sent'
    };

    setMessages([...messages, newMessage]);
    setInputText('');
    
    // Simulate Notification for Doctor (Visual only until backend)
    console.log("Message sent to doctor: ", inputText); 
  };

  return (
    <div className="h-[calc(100vh-140px)] bg-white rounded-3xl shadow-premium border border-slate-100 overflow-hidden flex animate-in fade-in zoom-in-95 duration-500">
      
      {/* Sidebar List */}
      <div className={`w-full md:w-80 border-r border-slate-100 flex flex-col ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-primary mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search chats..." className="w-full pl-10 pr-4 py-2 bg-surface-muted rounded-xl text-sm focus:ring-2 focus:ring-accent outline-none transition-all"/>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((chat) => (
            <div key={chat.id} onClick={() => setActiveChatId(chat.id)} className={`p-4 flex items-center gap-3 cursor-pointer transition-all hover:bg-slate-50 ${activeChatId === chat.id ? 'bg-slate-50 border-r-4 border-accent' : 'border-r-4 border-transparent'}`}>
              <div className="relative">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm ${chat.color}`}>{chat.avatar}</div>
                {chat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-primary text-sm truncate">{chat.name}</h4>
                  <span className="text-xs text-slate-400 whitespace-nowrap">{chat.time}</span>
                </div>
                <p className={`text-xs truncate ${chat.unread > 0 ? 'text-primary font-semibold' : 'text-slate-500'}`}>{chat.lastMessage}</p>
              </div>
              {chat.unread > 0 && <div className="w-5 h-5 bg-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full">{chat.unread}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`flex-1 flex flex-col bg-surface-muted/30 ${!activeChatId ? 'hidden md:flex' : 'flex'}`}>
        <div className="h-20 border-b border-slate-100 bg-white px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveChatId(null)} className="md:hidden p-2 -ml-2 text-slate-400"><ArrowRight className="rotate-180" size={20} /></button>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs ${activeContact.color}`}>{activeContact.avatar}</div>
            <div>
              <h3 className="font-bold text-primary">{activeContact.name}</h3>
              <p className="text-xs text-slate-500">{activeContact.role}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => {
            const isMe = msg.sender === 'me';
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl p-4 shadow-sm relative ${isMe ? 'bg-accent text-white rounded-br-none' : 'bg-white text-primary rounded-bl-none border border-slate-100'}`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 opacity-70 ${isMe ? 'text-blue-100' : 'text-slate-400'}`}>
                    {msg.time} {isMe && <span>{msg.status === 'read' ? <CheckCheck size={14} /> : <Check size={14} />}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100">
          <div className="flex items-center gap-3 bg-surface-muted p-2 rounded-2xl border border-transparent focus-within:border-accent/30 focus-within:bg-white transition-all">
            <input 
              type="text" 
              placeholder="Type your message..."
              className="flex-1 bg-transparent outline-none text-primary placeholder:text-slate-400 text-sm px-4"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button type="submit" className={`p-3 rounded-xl transition-all duration-300 transform ${inputText.trim() ? 'bg-accent text-white shadow-lg scale-100' : 'bg-slate-200 text-slate-400 scale-90'}`}>
              <Send size={18} fill="currentColor" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}