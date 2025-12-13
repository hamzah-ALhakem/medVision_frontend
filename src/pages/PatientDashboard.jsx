// src/pages/PatientDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Play, FileText, MessageSquare, Star, MapPin, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- FETCH REAL DOCTORS ---
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/users/doctors');
        setDoctors(response.data);
      } catch (error) {
        console.error("Failed to load doctors", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const stats = [
    { label: 'Next Appointment', value: 'Dec 12', icon: Calendar, color: 'bg-purple-500' },
    { label: 'Last Screening Result', value: 'Benign', icon: FileText, color: 'bg-emerald-500' },
  ];

  const handleChat = (doctor) => {
    const chatDoctor = {
        id: doctor.id,
        name: `Dr. ${doctor.first_name} ${doctor.last_name}`,
        specialty: doctor.specialty,
        image: `${doctor.first_name[0]}${doctor.last_name[0]}`
    };
    navigate('/messages', { state: { startChatWith: chatDoctor } });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Hero Section */}
      <div className="relative bg-primary rounded-3xl p-8 md:p-12 text-white overflow-hidden shadow-premium">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm font-medium mb-4 backdrop-blur-sm border border-white/10">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            AI Model Ready
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Start your health checkup</h1>
          <p className="text-slate-300 mb-8 text-lg">
            Our advanced AI analyzes 30 distinct cellular features to provide an instant, preliminary screening result.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => navigate('/screening')}
              className="bg-accent hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-accent/25 transition-all transform hover:scale-105"
            >
              <Play size={20} fill="currentColor" /> Start New Screening
            </button>
            <button 
              onClick={() => navigate('/appointments')}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/10 px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 backdrop-blur-sm transition-all"
            >
              <Calendar size={20} /> Book Appointment
            </button>
          </div>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${stat.color} shadow-lg shadow-gray-200`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold text-primary">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Available Doctors */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-primary">Available Specialists</h3>
          <button className="text-sm text-accent font-medium hover:underline">View All</button>
        </div>
        
        {isLoading ? (
            <div className="flex justify-center p-12"><Loader2 className="animate-spin text-accent" /></div>
        ) : doctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {doctors.map((doc) => (
                <div key={doc.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
                
                {/* Header: Avatar & Rating */}
                <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-full bg-surface-muted flex items-center justify-center text-xl font-bold text-primary border-2 border-white shadow-sm uppercase">
                    {doc.first_name[0]}{doc.last_name[0]}
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                    <Star size={14} className="text-amber-500 fill-current" />
                    <span className="text-xs font-bold text-amber-700">5.0</span>
                    </div>
                </div>
                
                {/* Info */}
                <h4 className="font-bold text-primary text-lg">Dr. {doc.first_name} {doc.last_name}</h4>
                <p className="text-sm text-slate-500 mb-3">{doc.specialty || 'General'}</p>
                
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-4 truncate">
                    <MapPin size={14} /> {doc.clinic_address || 'Main Clinic'}
                </div>

                {/* --- INSERTED: Availability Badge --- */}
                <div className="mb-6 mt-auto">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">Clinic Hours</p>
                    <div className="flex flex-wrap gap-2">
                        {doc.schedule && doc.schedule.length > 0 ? (
                            doc.schedule.map((s, i) => (
                                <span key={i} className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-100 font-medium">
                                    {s.day_of_week.substring(0,3)}: {s.start_time.slice(0,5)} - {s.end_time.slice(0,5)}
                                </span>
                            ))
                        ) : (
                            <span className="text-xs text-slate-400 italic bg-slate-50 px-2 py-1 rounded">Not set yet</span>
                        )}
                    </div>
                </div>
                {/* ----------------------------------- */}

                <button 
                    onClick={() => handleChat(doc)}
                    className="w-full py-3 rounded-xl bg-surface-muted text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-white mt-auto"
                >
                    <MessageSquare size={18} /> Chat Now
                </button>
                </div>
            ))}
            </div>
        ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400">
                No doctors available at the moment.
            </div>
        )}
      </div>

    </div>
  );
}