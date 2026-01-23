// src/pages/DoctorDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Users, FileText, Search, Check, X, Clock, Calendar, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // 1. Fetch Appointments from API
  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments');
      setAppointments(res.data);
    } catch (err) {
      console.error("Failed to load appointments", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // 2. Handle Accept/Reject
  const handleStatusUpdate = async (id, newStatus) => {
    setActionLoading(id);
    try {
        await api.put(`/appointments/${id}/status`, { status: newStatus });
        // Update UI locally
        setAppointments(prev => prev.map(apt => 
            apt.id === id ? { ...apt, status: newStatus } : apt
        ));
    } catch (err) {
        alert("Failed to update status");
    } finally {
        setActionLoading(null);
    }
  };

  // Helper for Status Colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'confirmed': return 'bg-emerald-100 text-emerald-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <h1 className="text-2xl font-bold text-primary mb-6">Patient Appointments</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-primary">Requests & Visits</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-muted text-xs uppercase text-slate-500 font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">Patient Name</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                  <tr><td colSpan="5" className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-accent"/></td></tr>
              ) : appointments.length > 0 ? (
                appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-primary">{apt.first_name} {apt.last_name}</p>
                        <p className="text-xs text-slate-400">{apt.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                            <span className="flex items-center gap-1 text-sm font-medium text-slate-700">
                                <Calendar size={14} className="text-accent"/> 
                                {new Date(apt.appointment_date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                                <Clock size={14}/> 
                                {apt.appointment_time.slice(0, 5)} {/* Shows Start Time */}
                            </span>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${getStatusColor(apt.status)}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                        <p className="text-sm text-slate-600 truncate" title={apt.reason}>{apt.reason || 'No reason provided'}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {apt.status === 'pending' ? (
                        <div className="flex items-center justify-center gap-2">
                           <button 
                             onClick={() => handleStatusUpdate(apt.id, 'confirmed')}
                             disabled={actionLoading === apt.id}
                             className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"
                             title="Accept"
                           >
                             {actionLoading === apt.id ? <Loader2 size={16} className="animate-spin"/> : <Check size={16} />}
                           </button>
                           <button 
                             onClick={() => handleStatusUpdate(apt.id, 'cancelled')}
                             disabled={actionLoading === apt.id}
                             className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                             title="Decline"
                           >
                             <X size={16} />
                           </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="p-8 text-center text-slate-400">No appointments found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}