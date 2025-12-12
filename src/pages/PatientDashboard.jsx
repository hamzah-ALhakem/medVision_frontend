// src/pages/PatientDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Play, FileText, CheckCircle } from 'lucide-react';

export default function PatientDashboard() {
  const navigate = useNavigate();

  // Updated Stats
  const stats = [
    { label: 'Next Appointment', value: 'Dec 12', icon: Calendar, color: 'bg-purple-500' },
    { label: 'Last Screening Result', value: 'Benign', icon: FileText, color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Hero Section */}
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

      {/* Stats Grid */}
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

      {/* Recent History Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-primary">Recent Screening History</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-muted text-xs uppercase text-slate-500 font-semibold">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Screening ID</th>
                <th className="px-6 py-4">Result</th>
                <th className="px-6 py-4">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm text-primary font-medium">Dec 01, 2025</td>
                <td className="px-6 py-4 text-sm text-slate-500">#SCR-2025-001</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Benign
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-primary">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: '94%' }}></div>
                    </div>
                    94%
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}