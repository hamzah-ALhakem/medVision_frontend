// src/pages/Appointments.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Plus, Loader2 } from 'lucide-react';
import Button from '../components/ui/Button';
import api from '../services/api';

export default function Appointments() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 1. Get User Data Safely
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isPatient = user.role && user.role.toLowerCase() === 'patient';

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get('/appointments');
        setAppointments(response.data);
      } catch (error) {
        console.error("Failed to fetch appointments", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  // Filter based on Date
  const filtered = appointments.filter(apt => {
    const aptDate = new Date(apt.appointment_date);
    const today = new Date();
    // Reset hours to compare just dates
    today.setHours(0,0,0,0);
    aptDate.setHours(0,0,0,0);

    return activeTab === 'upcoming' ? aptDate >= today : aptDate < today;
  });

  const StatusBadge = ({ status }) => (
    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize
      ${status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
      {status}
    </span>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-1">Appointments</h1>
          <p className="text-slate-500">Manage your scheduled visits and history.</p>
        </div>
        
        {/* 👇 STRICT CHECK: Only render this button if user is a PATIENT */}
        {isPatient && (
          <div className="w-full md:w-auto">
            <Button className="w-full md:w-auto px-6" onClick={() => alert('Please use the Dashboard to select a doctor first!')}>
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
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-accent" /></div>
        ) : filtered.length > 0 ? (
          filtered.map((apt) => (
            <div key={apt.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 items-start md:items-center hover:shadow-md transition-all">
              <div className="flex-shrink-0 w-full md:w-24 bg-surface-muted rounded-xl p-4 text-center border border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase">
                  {new Date(apt.appointment_date).toLocaleDateString('en-US', { month: 'short' })}
                </span>
                <span className="text-2xl font-bold text-primary block">
                  {new Date(apt.appointment_date).getDate()}
                </span>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    {/* Display Patient Name for Doctor, Doctor Name for Patient */}
                    <h3 className="text-lg font-bold text-primary">
                        {isPatient 
                            ? `Dr. ${apt.first_name} ${apt.last_name}` 
                            : `Patient: ${apt.first_name} ${apt.last_name}`
                        }
                    </h3>
                    <p className="text-sm text-slate-500">
                        {isPatient ? apt.specialty : `${apt.gender}, Phone: ${apt.phone}`}
                    </p>
                  </div>
                  <StatusBadge status={apt.status} />
                </div>
                <div className="flex gap-4 text-sm text-slate-600">
                  <div className="flex gap-2"><Clock size={16} className="text-accent"/> {apt.appointment_time.slice(0, 5)}</div>
                  {apt.clinic_address && <div className="flex gap-2"><MapPin size={16} className="text-accent"/> {apt.clinic_address}</div>}
                </div>
                {/* Show Reason if user is Doctor */}
                {!isPatient && apt.reason && (
                    <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded mt-2">
                        Reason: {apt.reason}
                    </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 border-dashed">
            <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-primary">No appointments found</h3>
            <p className="text-slate-500 text-sm">You have no {activeTab} appointments.</p>
          </div>
        )}
      </div>
    </div>
  );
}