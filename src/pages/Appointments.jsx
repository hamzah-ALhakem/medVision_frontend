import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Plus, Loader2, Check, X } from 'lucide-react';
import Button from '../components/ui/Button';
import api from '../services/api';

export default function Appointments() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); 
  
  // 1. Get User Data Safely
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isPatient = user.role && user.role.toLowerCase() === 'patient';

  // Fetch Data
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

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Handle Status Update (Accept/Reject)
  const handleStatusUpdate = async (id, newStatus) => {
    setActionLoading(id);
    try {
        await api.put(`/appointments/${id}/status`, { status: newStatus });
        // Refresh list locally
        setAppointments(prev => prev.map(apt => 
            apt.id === id ? { ...apt, status: newStatus } : apt
        ));
    } catch (err) {
        console.error(err);
        alert("Failed to update status");
    } finally {
        setActionLoading(null);
    }
  };

  // --- 🔥 THE FIX IS HERE ---
  // Filter Logic
  const filtered = appointments.filter(apt => {
    const aptDate = new Date(apt.appointment_date);
    const today = new Date();
    today.setHours(0,0,0,0);
    aptDate.setHours(0,0,0,0);

    if (activeTab === 'upcoming') {
        // إذا كانت الحالة "معلق" (Pending)، أظهرها دائماً في القائمة القادمة
        // هذا يضمن أن يرى الطبيب الطلب حتى لو كان هناك فرق في التوقيت
        if (apt.status === 'pending') return true;
        
        // وإلا، أظهر المواعيد المستقبلية فقط
        return aptDate >= today;
    } else {
        // History tab: Past dates OR Cancelled/Completed items
        return (aptDate < today && apt.status !== 'pending') || apt.status === 'cancelled' || apt.status === 'completed';
    }
  });

  const StatusBadge = ({ status }) => {
    let styles = 'bg-slate-100 text-slate-600';
    if (status === 'confirmed') styles = 'bg-emerald-100 text-emerald-700';
    if (status === 'pending') styles = 'bg-amber-100 text-amber-700';
    if (status === 'cancelled') styles = 'bg-red-100 text-red-700';

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${styles}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-1">Appointments</h1>
          <p className="text-slate-500">Manage your scheduled visits.</p>
        </div>
        
        {/* Only Patient sees Book Button */}
        {isPatient && (
          <div className="w-full md:w-auto">
            <Button className="w-full md:w-auto px-6" onClick={() => alert('Please select a doctor from Dashboard.')}>
              <Plus size={20} /> Book New Appointment
            </Button>
          </div>
        )}
      </div>

      <div className="flex gap-6 border-b border-slate-200">
        <button onClick={() => setActiveTab('upcoming')} className={`pb-3 text-sm font-semibold transition-all ${activeTab === 'upcoming' ? 'text-accent border-b-2 border-accent' : 'text-slate-400 hover:text-slate-600'}`}>Current & Requests</button>
        <button onClick={() => setActiveTab('past')} className={`pb-3 text-sm font-semibold transition-all ${activeTab === 'past' ? 'text-accent border-b-2 border-accent' : 'text-slate-400 hover:text-slate-600'}`}>History</button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-accent" /></div>
        ) : filtered.length > 0 ? (
          filtered.map((apt) => (
            <div key={apt.id} className={`bg-white p-6 rounded-2xl shadow-sm border flex flex-col lg:flex-row gap-6 items-start lg:items-center hover:shadow-md transition-all ${apt.status === 'pending' ? 'border-amber-200 bg-amber-50/30' : 'border-slate-100'}`}>
              
              {/* Date Block */}
              <div className="flex-shrink-0 w-full lg:w-24 bg-surface-muted rounded-xl p-4 text-center border border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase">
                  {new Date(apt.appointment_date).toLocaleDateString('en-US', { month: 'short' })}
                </span>
                <span className="text-2xl font-bold text-primary block">
                  {new Date(apt.appointment_date).getDate()}
                </span>
              </div>

              {/* Info Block */}
              <div className="flex-1 space-y-2 w-full">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-primary">
                        {isPatient 
                            ? `Dr. ${apt.first_name} ${apt.last_name}` 
                            : `Patient: ${apt.first_name} ${apt.last_name}`
                        }
                    </h3>
                    <p className="text-sm text-slate-500">
                        {isPatient ? apt.specialty : `${apt.gender || 'Patient'} • Phone: ${apt.phone || 'N/A'}`}
                    </p>
                  </div>
                  <StatusBadge status={apt.status} />
                </div>
                
                <div className="flex gap-4 text-sm text-slate-600">
                  <div className="flex gap-2"><Clock size={16} className="text-accent"/> {apt.appointment_time.slice(0, 5)}</div>
                  {apt.clinic_address && <div className="flex gap-2"><MapPin size={16} className="text-accent"/> {apt.clinic_address}</div>}
                </div>

                {apt.reason && (
                    <div className="text-xs text-slate-500 bg-white/50 p-3 rounded-lg mt-2 border border-slate-200/50">
                        <span className="font-bold">Reason:</span> {apt.reason}
                    </div>
                )}
              </div>

              {/* ACTIONS (DOCTOR ONLY) - SHOW IF PENDING */}
              {!isPatient && apt.status === 'pending' && (
                  <div className="flex lg:flex-col gap-2 w-full lg:w-auto mt-4 lg:mt-0 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
                      <button 
                        onClick={() => handleStatusUpdate(apt.id, 'confirmed')}
                        disabled={actionLoading === apt.id}
                        className="flex-1 lg:w-32 py-2 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-200"
                      >
                        {actionLoading === apt.id ? <Loader2 size={16} className="animate-spin"/> : <><Check size={16} /> Accept</>}
                      </button>
                      
                      <button 
                        onClick={() => handleStatusUpdate(apt.id, 'cancelled')}
                        disabled={actionLoading === apt.id}
                        className="flex-1 lg:w-32 py-2 px-4 bg-white border border-red-200 text-red-500 hover:bg-red-50 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all"
                      >
                        <X size={16} /> Decline
                      </button>
                  </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 border-dashed">
            <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-primary">No appointments found</h3>
            <p className="text-slate-500 text-sm">List is empty.</p>
          </div>
        )}
      </div>
    </div>
  );
}