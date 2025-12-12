// src/pages/Settings.jsx
import React, { useState } from 'react';
import { User, Lock, Bell, Camera, Save, Mail, Phone, MapPin, Shield } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);

  const [profile, setProfile] = useState({
    firstName: 'Hamzah',
    lastName: 'Developer',
    email: 'hamzah@medvision.com',
    phone: '+967 771 234 567',
    address: 'Sana\'a, Yemen',
  });

  const handleSave = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Profile Header (Single Color Design) */}
      <div className="bg-white rounded-3xl shadow-premium border border-slate-100 p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
        
        {/* Avatar */}
        <div className="relative group shrink-0">
          <div className="w-28 h-28 rounded-full bg-surface-muted border-4 border-white shadow-md flex items-center justify-center text-4xl font-bold text-accent">
            {profile.firstName[0]}
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary-light transition-transform hover:scale-110">
            <Camera size={16} />
          </button>
        </div>

        {/* Info & Tabs */}
        <div className="flex-1 w-full flex flex-col gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold text-primary">{profile.firstName} {profile.lastName}</h1>
            <p className="text-slate-500 font-medium">{profile.email}</p>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-sm text-slate-400">
              <MapPin size={14} /> {profile.address}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-surface-muted p-1.5 rounded-xl w-full md:w-fit self-center md:self-start">
            <button
              onClick={() => setActiveTab('general')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'general' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-primary'
              }`}
            >
              General Info
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'security' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-primary'
              }`}
            >
              Security
            </button>
          </div>
        </div>
      </div>

      {/* 2. Content Area */}
      <div className="bg-white rounded-3xl shadow-premium border border-slate-100 p-8">
        
        {/* --- GENERAL TAB --- */}
        {activeTab === 'general' && (
          <form onSubmit={handleSave} className="space-y-6 animate-in fade-in">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
              <User className="text-accent" size={20} />
              <h3 className="text-lg font-bold text-primary">Personal Information</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input 
                label="First Name" 
                value={profile.firstName} 
                onChange={(e) => setProfile({...profile, firstName: e.target.value})}
              />
              <Input 
                label="Last Name" 
                value={profile.lastName} 
                onChange={(e) => setProfile({...profile, lastName: e.target.value})}
              />
              <Input 
                label="Email Address" 
                icon={Mail}
                value={profile.email} 
                onChange={(e) => setProfile({...profile, email: e.target.value})}
              />
              <Input 
                label="Phone Number" 
                icon={Phone}
                value={profile.phone} 
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
              />
            </div>
            
            <Input 
              label="Address" 
              icon={MapPin}
              value={profile.address} 
              onChange={(e) => setProfile({...profile, address: e.target.value})}
            />

            <div className="flex justify-end pt-4">
              <Button type="submit" isLoading={isLoading} className="w-auto px-8">
                <Save size={18} /> Save Changes
              </Button>
            </div>
          </form>
        )}

        {/* --- SECURITY TAB --- */}
        {activeTab === 'security' && (
          <form onSubmit={handleSave} className="space-y-6 animate-in fade-in">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
              <Shield className="text-accent" size={20} />
              <h3 className="text-lg font-bold text-primary">Security & Password</h3>
            </div>

            <div className="space-y-4 max-w-lg">
              <Input 
                label="Current Password" 
                type="password"
                icon={Lock}
                placeholder="••••••••"
              />
              <div className="h-4"></div>
              <Input 
                label="New Password" 
                type="password"
                icon={Lock}
                placeholder="••••••••"
              />
              <Input 
                label="Confirm New Password" 
                type="password"
                icon={Lock}
                placeholder="••••••••"
              />
            </div>

            <div className="pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-primary flex items-center gap-2">
                    <Bell size={18} className="text-slate-400" /> Notifications
                  </h4>
                  <p className="text-sm text-slate-500">Receive updates about your screening results.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" isLoading={isLoading} className="w-auto px-8">
                Update Security
              </Button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}