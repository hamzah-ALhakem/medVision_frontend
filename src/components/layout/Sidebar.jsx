// src/components/layout/Sidebar.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Stethoscope, Calendar, MessageSquare, LogOut, Settings, X } from 'lucide-react';

export default function Sidebar({ role, isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Removed 'History' from this list
  const patientLinks = [
    { name: 'Dashboard', path: '/patient-dashboard', icon: LayoutDashboard },
    { name: 'New Screening', path: '/screening', icon: Stethoscope },
    { name: 'Messages', path: '/messages', icon: MessageSquare },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const doctorLinks = [
    { name: 'Dashboard', path: '/doctor-dashboard', icon: LayoutDashboard },
    { name: 'Appointments', path: '/appointments', icon: Calendar },
    { name: 'Messages', path: '/messages', icon: MessageSquare },
    { name: 'Settings', path: '/settings', icon: Settings }, 
  ];

  const links = role === 'doctor' ? doctorLinks : patientLinks;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className={`
      fixed top-0 left-0 z-50 h-screen w-64 bg-primary text-white shadow-premium transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      md:translate-x-0
    `}>
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Stethoscope size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">MedVision</span>
        </div>
        <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
          <X size={24} />
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          const Icon = link.icon;
          return (
            <Link
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group
              ${isActive ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
              <span className="font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}