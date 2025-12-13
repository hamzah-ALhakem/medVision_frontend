// src/pages/Settings.jsx
import React, { useState, useEffect } from 'react';
import { User, Lock, Bell, Camera, Save, Mail, Phone, MapPin, Shield, Clock } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import api from '../services/api';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState('patient');

  // Profile State (Changed firstName/lastName to fullName)
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    role: ''
  });

  // Security State
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Schedule State (For Doctors Only)
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [schedule, setSchedule] = useState(
    daysOfWeek.map(day => ({ day, startTime: '09:00', endTime: '17:00', isActive: false }))
  );

  // --- 1. Load Data on Mount ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Profile
        const profileRes = await api.get('/users/profile');
        setProfile({
            // Combine First and Last name from DB into one field for display
            fullName: `${profileRes.data.first_name} ${profileRes.data.last_name}`.trim(),
            email: profileRes.data.email,
            phone: profileRes.data.phone,
            address: profileRes.data.clinic_address || '', 
            role: profileRes.data.role
        });
        setUserRole(profileRes.data.role);

        // Fetch Schedule (If Doctor)
        if (profileRes.data.role === 'doctor') {
            const scheduleRes = await api.get('/schedule/my-schedule');
            if (scheduleRes.data.length > 0) {
                setSchedule(prev => prev.map(item => {
                    const dbItem = scheduleRes.data.find(d => d.day === item.day);
                    return dbItem ? { 
                        ...item, 
                        startTime: dbItem.start_time.slice(0,5), 
                        endTime: dbItem.end_time.slice(0,5), 
                        isActive: dbItem.is_active 
                    } : item;
                }));
            }
        }
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, []);

  // --- 2. Handlers ---
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // In a real app, you would split fullName back into first/last before sending to API
    setTimeout(() => {
        alert("Profile updated locally (API pending)");
        setIsLoading(false);
    }, 1000);
  };

  const handleSaveSchedule = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      try {
          await api.post('/schedule', { schedule });
          alert('Schedule Updated Successfully!');
      } catch (err) { 
          console.error(err);
          alert('Failed to update schedule');
      }
      finally { setIsLoading(false); }
  };

  const toggleDay = (index) => {
      const newSchedule = [...schedule];
      newSchedule[index].isActive = !newSchedule[index].isActive;
      setSchedule(newSchedule);
  };

  const updateTime = (index, field, value) => {
      const newSchedule = [...schedule];
      newSchedule[index][field] = value;
      setSchedule(newSchedule);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Header Section */}
      <div className="bg-white rounded-3xl shadow-premium border border-slate-100 p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="relative group shrink-0">
          <div className="w-28 h-28 rounded-full bg-surface-muted border-4 border-white shadow-md flex items-center justify-center text-4xl font-bold text-accent uppercase">
            {profile.fullName ? profile.fullName[0] : <User />}
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary-light transition-transform hover:scale-110">
            <Camera size={16} />
          </button>
        </div>
        <div className="flex-1 w-full flex flex-col gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold text-primary">{profile.fullName}</h1>
            <p className="text-slate-500 font-medium capitalize">{profile.role}</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <button onClick={() => setActiveTab('general')} className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'general' ? 'bg-primary text-white shadow-lg' : 'bg-surface-muted text-slate-500 hover:bg-slate-200'}`}>General</button>
            <button onClick={() => setActiveTab('security')} className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'security' ? 'bg-primary text-white shadow-lg' : 'bg-surface-muted text-slate-500 hover:bg-slate-200'}`}>Security</button>
            {userRole === 'doctor' && (
                <button onClick={() => setActiveTab('schedule')} className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'schedule' ? 'bg-primary text-white shadow-lg' : 'bg-surface-muted text-slate-500 hover:bg-slate-200'}`}>Clinic Hours</button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Content Area */}
      <div className="bg-white rounded-3xl shadow-premium border border-slate-100 p-8">
        
        {/* --- GENERAL TAB --- */}
        {activeTab === 'general' && (
          <form onSubmit={handleSaveProfile} className="space-y-6 animate-in fade-in">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
              <User className="text-accent" size={20} />
              <h3 className="text-lg font-bold text-primary">Personal Information</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* MERGED NAME FIELD */}
              <Input 
                label="Full Name" 
                value={profile.fullName} 
                onChange={(e) => setProfile({...profile, fullName: e.target.value})}
              />
              
              <Input 
                label="Phone Number" 
                icon={Phone}
                value={profile.phone} 
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
              />
            </div>
            
            <Input 
              label="Email Address" 
              icon={Mail}
              value={profile.email} 
              disabled 
            />

            <Input 
              label={userRole === 'doctor' ? "Clinic Address" : "Home Address"}
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
          <form onSubmit={handleSaveProfile} className="space-y-6 animate-in fade-in">
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
                value={security.currentPassword}
                onChange={(e) => setSecurity({...security, currentPassword: e.target.value})}
              />
              <div className="h-4"></div>
              <Input 
                label="New Password" 
                type="password"
                icon={Lock}
                placeholder="••••••••"
                value={security.newPassword}
                onChange={(e) => setSecurity({...security, newPassword: e.target.value})}
              />
              <Input 
                label="Confirm New Password" 
                type="password"
                icon={Lock}
                placeholder="••••••••"
                value={security.confirmPassword}
                onChange={(e) => setSecurity({...security, confirmPassword: e.target.value})}
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

        {/* --- SCHEDULE TAB (Doctors Only) --- */}
        {activeTab === 'schedule' && (
            <form onSubmit={handleSaveSchedule} className="space-y-6 animate-in fade-in">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                    <Clock className="text-accent" size={20} />
                    <h3 className="text-lg font-bold text-primary">Weekly Availability</h3>
                </div>
                <div className="space-y-4">
                    {schedule.map((day, index) => (
                        <div key={day.day} className={`flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border transition-all ${day.isActive ? 'border-accent/30 bg-accent/5' : 'border-slate-100 opacity-60'}`}>
                            <div className="flex items-center gap-3 w-40">
                                <input 
                                    type="checkbox" 
                                    checked={day.isActive} 
                                    onChange={() => toggleDay(index)}
                                    className="w-5 h-5 accent-accent cursor-pointer"
                                />
                                <span className={`font-semibold ${day.isActive ? 'text-primary' : 'text-slate-400'}`}>{day.day}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 flex-1">
                                <input 
                                    type="time" 
                                    value={day.startTime} 
                                    onChange={(e) => updateTime(index, 'startTime', e.target.value)}
                                    disabled={!day.isActive}
                                    className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent disabled:bg-slate-100"
                                />
                                <span className="text-slate-400">-</span>
                                <input 
                                    type="time" 
                                    value={day.endTime} 
                                    onChange={(e) => updateTime(index, 'endTime', e.target.value)}
                                    disabled={!day.isActive}
                                    className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent disabled:bg-slate-100"
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end pt-4">
                    <Button type="submit" isLoading={isLoading} className="w-auto px-8">Save Schedule</Button>
                </div>
            </form>
        )}

      </div>
    </div>
  );
}