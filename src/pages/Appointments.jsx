// src/pages/Appointments.jsx
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Plus } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Appointments() {
  const [activeTab, setActiveTab] = useState('upcoming');
  
  // --- FAKE USER ROLE (Replace this with real context later) ---
  const userRole = 'patient'; // Change to 'doctor' to test hiding the button
  
  const appointments = [
    { id: 1, name: 'Dr. Emily Carter', specialty: 'Oncologist', date: 'Dec 15, 2025', time: '09:00 AM', location: 'Cairo Medical Center', status: 'Confirmed', type: 'upcoming' },
    { id: 2, name: 'Dr. Michael Roberts', specialty: 'Radiologist', date: 'Dec 20, 2025', time: '02:30 PM', location: 'City Hospital', status: 'Pending', type: 'upcoming' },
    { id: 3, name: 'Dr. Sarah Johnson', specialty: 'General Practice', date: 'Nov 10, 2025', time: '11:00 AM', location: 'Clinic A', status: 'Completed', type: 'past' }
  ];

  const filtered = appointments.filter(apt => apt.type === activeTab);

  const StatusBadge = ({ status }) => (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{status}</span>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-1">Appointments</h1>
          <p className="text-slate-500">Manage your scheduled visits and history.</p>
        </div>
        
        {/* Only show Book Button if NOT a doctor */}
        {userRole !== 'doctor' && (
          <div className="w-full md:w-auto">
            <Button className="w-full md:w-auto px-6" onClick={() => alert('Booking Modal')}>
              <Plus size={20} /> Book New Appointment
            </Button>
          </div>
        )}
      </div>

      <div className="flex gap-6 border-b border-slate-200">
        <button onClick={() => setActiveTab('upcoming')} className={`pb-3 text-sm font-semibold transition-all ${activeTab === 'upcoming' ? 'text-accent border-b-2 border-accent' : 'text-slate-400 hover:text-slate-600'}`}>Upcoming</button>
        <button onClick={() => setActiveTab('past')} className={`pb-3 text-sm font-semibold transition-all ${activeTab === 'past' ? 'text-accent border-b-2 border-accent' : 'text-slate-400 hover:text-slate-600'}`}>Past History</button>
      </div>

      <div className="space-y-4">
        {filtered.map((apt) => (
          <div key={apt.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="flex-shrink-0 w-full md:w-24 bg-surface-muted rounded-xl p-4 text-center border border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase">{apt.date.split(' ')[0]}</span>
              <span className="text-2xl font-bold text-primary">{apt.date.split(' ')[1].replace(',','')}</span>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-start">
                <div><h3 className="text-lg font-bold text-primary">{apt.name}</h3><p className="text-sm text-slate-500">{apt.specialty}</p></div>
                <StatusBadge status={apt.status} />
              </div>
              <div className="flex gap-4 text-sm text-slate-600"><div className="flex gap-2"><Clock size={16} className="text-accent"/>{apt.time}</div><div className="flex gap-2"><MapPin size={16} className="text-accent"/>{apt.location}</div></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}