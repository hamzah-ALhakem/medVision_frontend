// src/components/layout/Header.jsx
import React from 'react';
import { Bell, User, Menu } from 'lucide-react';

export default function Header({ user, onMenuClick }) {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">

      <div className="flex items-center gap-4">
        {/* Hamburger Menu (Visible only on Mobile) */}
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 text-primary hover:bg-surface-muted rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>

        <h2 className="text-lg md:text-xl font-bold text-primary truncate">
          Welcome, <span className="text-accent">{user?.firstName}</span>
        </h2>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <button className="relative p-2 text-slate-400 hover:text-accent transition-colors">
          <Bell size={24} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-primary">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
          </div>
          <div className="w-10 h-10 bg-surface-muted rounded-full flex items-center justify-center border-2 border-white shadow-sm text-primary">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}