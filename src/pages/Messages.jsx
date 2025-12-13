// src/pages/Messages.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Send, Check, CheckCheck, ArrowRight, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function Messages() {
  const location = useLocation();
  const [contacts, setContacts] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // 1. Fetch Contacts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await api.get('/messages/contacts');
        setContacts(res.data);
        
        // Scenario A: "Chat Now" from Dashboard (Object with ID)
        if (location.state?.startChatWith) {
            const newDoc = location.state.startChatWith;
            const exists = res.data.find(c => c.id === newDoc.id);
            if (!exists) {
                setContacts(prev => [{
                    id: newDoc.id, 
                    first_name: newDoc.name.split(' ')[1], 
                    last_name: newDoc.name.split(' ')[2] || '', 
                    specialty: newDoc.specialty,
                    role: 'doctor'
                }, ...prev]);
            }
            setActiveChat({
                id: newDoc.id,
                first_name: newDoc.name.replace('Dr. ', ''),
                specialty: newDoc.specialty
            });
        }

        // Scenario B: Clicked Notification (String Name)
        if (location.state?.openChatWithName) {
            const nameToFind = location.state.openChatWithName.toLowerCase();
            // Try to find a contact whose first or last name matches the notification
            const foundContact = res.data.find(c => 
                c.first_name.toLowerCase().includes(nameToFind) || 
                c.last_name.toLowerCase().includes(nameToFind) ||
                `${c.first_name} ${c.last_name}`.toLowerCase().includes(nameToFind)
            );

            if (foundContact) {
                setActiveChat(foundContact);
            }
        }

      } catch (err) { console.error(err); } 
      finally { setIsLoading(false); }
    };
    fetchContacts();
  }, [location.state]);

  // 2. Fetch Messages when Active Chat changes
  useEffect(() => {
    if (!activeChat) return;

    const fetchMessages = async () => {
        try {
            const res = await api.get(`/messages/${activeChat.id}`);
            setMessages(res.data);
        } catch (err) { console.error(err); }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [activeChat]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 3. Send Message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat) return;

    try {
        const tempMsg = {
            id: Date.now(),
            sender_id: 'me',
            content: inputText,
            created_at: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, tempMsg]);
        const textToSend = inputText;
        setInputText('');

        await api.post('/messages', {
            receiverId: activeChat.id,
            content: textToSend
        });
        
        const res = await api.get(`/messages/${activeChat.id}`);
        setMessages(res.data);

    } catch (err) {
        console.error("Failed to send", err);
    }
  };

  const getInitials = (first, last) => `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase();
  const myId = JSON.parse(localStorage.getItem('user'))?.id;

  return (
    <div className="h-[calc(100vh-140px)] bg-white rounded-3xl shadow-premium border border-slate-100 overflow-hidden flex animate-in fade-in zoom-in-95 duration-500">
      
      {/* Sidebar List */}
      <div className={`w-full md:w-80 border-r border-slate-100 flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-primary mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search chats..." className="w-full pl-10 pr-4 py-2 bg-surface-muted rounded-xl text-sm focus:ring-2 focus:ring-accent outline-none transition-all"/>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
             <div className="flex justify-center p-8"><Loader2 className="animate-spin text-accent" /></div>
          ) : contacts.length > 0 ? (
            contacts.map((contact) => (
                <div key={contact.id} onClick={() => setActiveChat(contact)} className={`p-4 flex items-center gap-3 cursor-pointer transition-all hover:bg-slate-50 ${activeChat?.id === contact.id ? 'bg-slate-50 border-r-4 border-accent' : 'border-r-4 border-transparent'}`}>
                <div className="relative">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm bg-accent">
                        {getInitials(contact.first_name, contact.last_name)}
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-primary text-sm truncate">
                        {contact.first_name} {contact.last_name}
                    </h4>
                    <p className="text-xs text-slate-500">{contact.specialty || contact.role}</p>
                </div>
                </div>
            ))
          ) : (
            <div className="p-6 text-center text-slate-400 text-sm">No conversations yet.</div>
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`flex-1 flex flex-col bg-surface-muted/30 ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        {activeChat ? (
          <>
            <div className="h-20 border-b border-slate-100 bg-white px-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => setActiveChat(null)} className="md:hidden p-2 -ml-2 text-slate-400"><ArrowRight className="rotate-180" size={20} /></button>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs bg-accent">
                    {getInitials(activeChat.first_name, activeChat.last_name)}
                </div>
                <div>
                  <h3 className="font-bold text-primary">Dr. {activeChat.first_name} {activeChat.last_name || ''}</h3>
                  <p className="text-xs text-slate-500">{activeChat.specialty}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg, idx) => {
                const isMe = msg.sender_id === myId || msg.sender_id === 'me';
                return (
                  <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl p-4 shadow-sm relative ${isMe ? 'bg-accent text-white rounded-br-none' : 'bg-white text-primary rounded-bl-none border border-slate-100'}`}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 opacity-70 ${isMe ? 'text-blue-100' : 'text-slate-400'}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
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
                <button type="submit" disabled={!inputText.trim()} className={`p-3 rounded-xl transition-all duration-300 transform ${inputText.trim() ? 'bg-accent text-white shadow-lg scale-100' : 'bg-slate-200 text-slate-400 scale-90'}`}>
                  <Send size={18} fill="currentColor" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}