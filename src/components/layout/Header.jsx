import React, { useState, useEffect, useRef } from 'react';
import { Bell, Menu, Search, X, Check, MessageSquare, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function Header({ user, onMenuClick }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null); 
  
  const firstName = user?.firstName || 'Guest';

  // 1. Polling
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        const unreadOnly = res.data.filter(n => !n.isRead);
        setNotifications(unreadOnly);
      } catch (err) { console.error("Notif Error", err); }
    };

    fetchNotifications(); 
    const interval = setInterval(fetchNotifications, 2000); 
    return () => clearInterval(interval);
  }, []);

  // 2. Click Outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  // 3. Handle Click (Correct Logic) ✅
  const handleNotificationClick = async (notif) => {
    // A. Hide immediately
    setNotifications(prev => prev.filter(n => n.id !== notif.id));
    setShowDropdown(false);

    // B. Navigate using relatedId directly
    if (notif.type === 'message' && notif.relatedId) {
        // ✅ استخدام relatedId مباشرة
        navigate('/messages', { 
            state: { openChatWithId: notif.relatedId } 
        });
    } 
    else if (notif.type === 'appointment') {
        navigate('/appointments');
    }

    // C. Mark Read
    try {
        await api.put(`/notifications/${notif.id}/read`);
    } catch (e) { console.error(e); }
  };

  // 4. Mark All Read
  const handleMarkAllRead = async () => {
      setNotifications([]);
      setShowDropdown(false);
      try { await api.put('/notifications/read'); } catch (e) {}
  };

  return (
    <header className="bg-white sticky top-0 z-30 px-6 py-4 flex items-center justify-between border-b border-gray-100 shadow-sm h-20">
      
      {/* Left */}
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="md:hidden text-gray-500 hover:text-primary transition-colors p-2 bg-gray-50 rounded-xl">
          <Menu size={24} />
        </button>
        <div className="hidden md:block">
          <h2 className="text-lg font-bold text-dark flex items-center gap-2">
            مرحباً، <span className="text-primary">{firstName}</span> 👋
          </h2>
          <p className="text-xs text-gray-400 font-medium">
            {new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className={`relative w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300
            ${showDropdown ? 'bg-primary text-white border-primary shadow-lg scale-110' : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'}`}
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                {notifications.length}
              </span>
            )}
          </button>

          {showDropdown && (
            <div className="absolute end-0 mt-4 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 origin-top-right z-50">
              <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-dark text-sm">الإشعارات ({notifications.length})</h3>
                {notifications.length > 0 && (
                    <button onClick={handleMarkAllRead} className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
                        <Check size={14}/> تحديد الكل كمقروء
                    </button>
                )}
              </div>
              
              <div className="max-h-80 overflow-y-auto custom-scrollbar">
                 {notifications.length > 0 ? (
                    notifications.map((notif) => (
                        <div 
                            key={notif.id} 
                            onClick={() => handleNotificationClick(notif)}
                            className="p-4 border-b border-gray-50 cursor-pointer transition-all hover:bg-blue-50/50 flex gap-3 items-start bg-white"
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-gray-100
                                ${notif.type === 'message' ? 'bg-purple-50 text-purple-600' : 'bg-green-50 text-green-600'}`}>
                                {notif.type === 'message' ? <MessageSquare size={18}/> : <Calendar size={18}/>}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-dark leading-snug">
                                    {notif.message}
                                </p>
                                <p className="text-[10px] text-gray-400 mt-1.5 flex justify-between items-center">
                                    <span>{new Date(notif.created_at).toLocaleTimeString('ar-EG', {hour:'2-digit', minute:'2-digit'})}</span>
                                    <span className="text-primary font-bold text-[9px] bg-primary/5 px-2 py-0.5 rounded-full">جديد</span>
                                </p>
                            </div>
                        </div>
                    ))
                 ) : (
                    <div className="p-12 text-center text-gray-400 flex flex-col items-center">
                        <Bell size={24} className="opacity-30 mb-2"/>
                        <p className="text-sm font-medium">لا توجد إشعارات جديدة</p>
                    </div>
                 )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 ps-4 border-s border-gray-100 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/settings')}>
           <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary font-bold border-2 border-white shadow-sm">
             {firstName[0]}
           </div>
           <div className="hidden lg:block text-start">
              <p className="text-xs font-bold text-dark">{firstName}</p>
              <p className="text-[10px] text-gray-400 font-medium capitalize">{user?.role === 'patient' ? 'مريض' : user?.role === 'doctor' ? 'طبيب' : 'مسؤول'}</p>
           </div>
        </div>
      </div>
    </header>
  );
}