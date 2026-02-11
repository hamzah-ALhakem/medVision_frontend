import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Send, ArrowRight, ArrowLeft, Loader2, User } from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext'; // 1. استيراد السياق

const translations = {
  ar: {
    title: 'الرسائل',
    search: 'ابحث في المحادثات...',
    noChats: 'لا توجد محادثات سابقة',
    typePlaceholder: 'اكتب رسالتك هنا...',
    startChat: 'اختر محادثة للبدء',
    online: 'متصل الآن',
    now: 'الآن'
  },
  en: {
    title: 'Messages',
    search: 'Search chats...',
    noChats: 'No previous conversations',
    typePlaceholder: 'Type your message...',
    startChat: 'Select a conversation to start',
    online: 'Online',
    now: 'Now'
  }
};

export default function Messages() {
  const { language } = useLanguage();
  const t = translations[language];
  const location = useLocation();
  const [contacts, setContacts] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const myId = currentUser.id;

  // 1. Fetch Contacts & Handle Auto-Open
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await api.get('/messages/contacts');
        setContacts(res.data);
        
        // A. From Doctor Card
        if (location.state?.startChatWith) {
            const newDoc = location.state.startChatWith;
            const exists = res.data.find(c => c.id === newDoc.id);
            const chatUser = exists || {
                id: newDoc.id, 
                firstName: newDoc.firstName, // تم تصحيح الأسماء لتتوافق مع ما يرسله PatientDashboard
                lastName: newDoc.lastName, 
                specialty: newDoc.specialty,
                role: 'doctor'
            };
            if (!exists) setContacts(prev => [chatUser, ...prev]);
            setActiveChat(chatUser);
        }

        // B. From Notification
        if (location.state?.openChatWithId) {
            const targetId = parseInt(location.state.openChatWithId);
            const targetContact = res.data.find(c => c.id === targetId);
            if (targetContact) {
                setActiveChat(targetContact);
                api.put(`/notifications/chat/${targetId}`).catch(console.error);
            }
        }

      } catch (err) { console.error(err); } 
      finally { setIsLoading(false); }
    };
    fetchContacts();
  }, [location.state]); 

  // 2. Fetch Messages loop
  useEffect(() => {
    if (!activeChat) return;
    const fetchMessages = async () => {
        try {
            const res = await api.get(`/messages/${activeChat.id}`);
            setMessages(res.data);
            api.put(`/notifications/chat/${activeChat.id}`).catch(() => {});
        } catch (err) { console.error(err); }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [activeChat]);

  // Scroll
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
            senderId: myId,
            content: inputText,
            createdAt: new Date().toISOString()
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
  const ArrowIcon = language === 'ar' ? ArrowRight : ArrowLeft; // زر الرجوع للموبايل

  return (
    <div className="h-[calc(100vh-120px)] bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex">
      
      {/* Sidebar (Contacts) */}
      <div className={`w-full md:w-96 border-gray-100 flex flex-col bg-white ${activeChat ? 'hidden md:flex' : 'flex'} ${language === 'ar' ? 'md:border-l' : 'md:border-r'}`}>
        <div className="p-5 border-b border-gray-50">
          <h2 className="text-xl font-bold text-dark mb-4">{t.title}</h2>
          <div className="relative">
            <input 
                type="text" 
                placeholder={t.search} 
                className={`w-full py-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-transparent focus:border-primary/30 ${language === 'ar' ? 'pl-4 pr-10' : 'pr-4 pl-10'}`}
            />
            <Search className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${language === 'ar' ? 'right-3' : 'left-3'}`} size={18} />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {isLoading ? (
             <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
          ) : contacts.length > 0 ? (
            contacts.map((contact) => (
                <div 
                    key={contact.id} 
                    onClick={() => setActiveChat(contact)} 
                    className={`p-4 flex items-center gap-3 cursor-pointer transition-all hover:bg-gray-50 border-b border-gray-50/50
                    ${activeChat?.id === contact.id 
                        ? `bg-blue-50/50 ${language === 'ar' ? 'border-r-4 border-r-primary' : 'border-l-4 border-l-primary'}` 
                        : `${language === 'ar' ? 'border-r-4' : 'border-l-4'} border-transparent`}`}
                >
                <div className="relative">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-primary font-bold text-sm bg-blue-100 border-2 border-white shadow-sm">
                        {getInitials(contact.firstName, contact.lastName)}
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-bold text-dark text-sm truncate">
                            {contact.firstName} {contact.lastName}
                        </h4>
                        <span className="text-[10px] text-gray-400">{t.now}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{contact.specialty || (contact.role === 'DOCTOR' ? 'Doctor' : 'Patient')}</p>
                </div>
                </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-400 text-sm flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                    <User size={24} className="opacity-50"/>
                </div>
                <p>{t.noChats}</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`flex-1 flex flex-col bg-[#F0F2F5] relative ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>

        {activeChat ? (
          <>
            {/* Header */}
            <div className="h-20 border-b border-gray-200 bg-white px-6 flex items-center justify-between shadow-sm z-10">
              <div className="flex items-center gap-4">
                <button onClick={() => setActiveChat(null)} className="md:hidden p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-full">
                    <ArrowIcon size={20} />
                </button>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-primary font-bold text-xs bg-blue-100">
                    {getInitials(activeChat.firstName, activeChat.lastName)}
                </div>
                <div>
                  <h3 className="font-bold text-dark text-sm">
                    {activeChat.role === 'DOCTOR' ? (language === 'ar' ? 'د.' : 'Dr.') : ''} {activeChat.firstName} {activeChat.lastName}
                  </h3>
                  <p className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> {t.online}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 z-0">
              {messages.map((msg, idx) => {
                const isMe = msg.senderId === myId;
                // ضبط المحاذاة حسب اللغة والرسالة
                const alignment = isMe ? 'justify-end' : 'justify-start';
                
                return (
                  <div key={idx} className={`flex ${alignment}`}>
                    <div className={`max-w-[75%] rounded-2xl p-3.5 shadow-sm relative text-sm
                        ${isMe 
                            ? `bg-primary text-white ${language === 'ar' ? 'rounded-tl-none' : 'rounded-tr-none'}` 
                            : `bg-white text-dark border border-gray-100 ${language === 'ar' ? 'rounded-tr-none' : 'rounded-tl-none'}`}`}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      <div className={`text-[9px] mt-1.5 flex items-center gap-1 opacity-80 
                        ${isMe ? 'text-blue-100 justify-end' : 'text-gray-400 justify-end'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute:'2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 z-10">
              <div className="flex items-center gap-3">
                <input 
                  type="text" 
                  placeholder={t.typePlaceholder}
                  className="flex-1 bg-gray-50 outline-none text-dark placeholder:text-gray-400 text-sm px-5 py-3.5 rounded-full focus:bg-white focus:ring-2 focus:ring-primary/20 border border-transparent transition-all"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <button 
                    type="submit" 
                    disabled={!inputText.trim()} 
                    className={`p-3.5 rounded-full transition-all duration-300 shadow-md flex items-center justify-center
                    ${inputText.trim() 
                        ? 'bg-primary text-white hover:scale-105 hover:bg-primary-hover' 
                        : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
                >
                  <Send size={18} className={language === 'ar' ? (inputText.trim() ? 'ml-0.5' : '') : (inputText.trim() ? 'mr-0.5' : '')} /> 
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-300 bg-gray-50/50">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                <Send size={40} className="opacity-20 text-dark ml-2" />
            </div>
            <p className="font-bold text-gray-400">{t.startChat}</p>
          </div>
        )}
      </div>
    </div>
  );
}