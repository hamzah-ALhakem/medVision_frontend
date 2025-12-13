// src/components/layout/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Bell, Menu, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function Header({ user, onMenuClick }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null); 
  
  // 1. Fetch Notifications (Poll every 3s)
  useEffect(() => {
    const fetchNotifs = async () => {
      // Only fetch if dropdown is CLOSED (to prevent list vanishing while reading)
      if (!showDropdown) {
          try {
            const res = await api.get('/notifications');
            setNotifications(res.data);
          } catch (err) { console.error(err); }
      }
    };
    
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 3000); 
    return () => clearInterval(interval);
  }, [showDropdown]); // Depend on showDropdown

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

  // 3. Toggle Logic
  const handleToggle = () => {
    const willOpen = !showDropdown;
    setShowDropdown(willOpen);

    if (willOpen && notifications.length > 0) {
       // Mark as read in Backend ONLY
       // We do NOT clear local state yet, so you can still see and click them
       api.put('/notifications/read').catch(err => console.error(err));
    } else {
        // When closing, clear the list immediately locally
        setNotifications([]);
    }
  };

  const handleNotificationClick = (notif) => {
    setShowDropdown(false); 
    setNotifications([]); // Clear immediately upon click

    if (notif.message.includes("New message from")) {
        try {
            const namePart = notif.message.split('from ')[1].split(':')[0].trim();
            navigate('/messages', { state: { openChatWithName: namePart } });
        } catch (e) {
            navigate('/messages'); 
        }
    } else if (notif.message.includes("Appointment")) {
        navigate('/appointments');
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 px-8 py-4 flex items-center justify-between">
      
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="md:hidden text-slate-500 hover:text-primary">
          <Menu size={24} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-primary">
            Welcome, {user.firstName || 'User'}
          </h2>
          <p className="text-xs text-slate-400 hidden md:block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="hidden md:flex items-center bg-surface-muted px-4 py-2.5 rounded-xl w-64 border border-transparent focus-within:border-accent/50 focus-within:bg-white transition-all">
          <Search size={18} className="text-slate-400" />
          <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm ml-2 w-full text-primary placeholder:text-slate-400" />
        </div>

        {/* Bell Icon */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={handleToggle}
            className="relative p-2.5 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-accent transition-all"
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            )}
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-primary text-sm">Notifications</h3>
                <button onClick={() => setShowDropdown(false)}><X size={16} className="text-slate-400" /></button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div 
                        key={notif.id} 
                        onClick={() => handleNotificationClick(notif)}
                        className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer bg-blue-50/30"
                    >
                      <p className="text-sm leading-snug text-primary font-semibold pointer-events-none">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-2 font-medium pointer-events-none">
                        {new Date(notif.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400 text-sm">No new notifications</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold border-2 border-white shadow-sm cursor-pointer">
          {user.firstName ? user.firstName[0] : 'U'}
        </div>
      </div>
    </header>
  );
}