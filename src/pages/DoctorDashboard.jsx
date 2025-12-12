// src/pages/DoctorDashboard.jsx
import React from 'react';
import { Users, FileText, Search, AlertCircle } from 'lucide-react';

export default function DoctorDashboard() {
  const stats = [
    { label: 'Total Patients', value: '142', icon: Users, color: 'bg-blue-500', trend: '+12% this month' },
    { label: 'Pending Reviews', value: '8', icon: FileText, color: 'bg-amber-500', trend: 'Needs attention' },
    { label: 'Critical Cases', value: '3', icon: AlertCircle, color: 'bg-red-500', trend: 'High Priority' },
  ];

  const patients = [
    { id: 1, name: 'Sarah Ahmed', age: 34, date: 'Dec 11, 2025', result: 'High Risk', confidence: '89%', status: 'Unreviewed' },
    { id: 2, name: 'Layla Mahmoud', age: 45, date: 'Dec 10, 2025', result: 'Benign', confidence: '96%', status: 'Reviewed' },
    { id: 3, name: 'Noor Ali', age: 29, date: 'Dec 09, 2025', result: 'Benign', confidence: '94%', status: 'Reviewed' },
    { id: 4, name: 'Fatima Hassan', age: 52, date: 'Dec 08, 2025', result: 'High Risk', confidence: '91%', status: 'In Progress' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Unreviewed': return 'bg-amber-100 text-amber-700';
      case 'High Risk': return 'bg-red-100 text-red-700';
      case 'Benign': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Stats */}
      <div>
        <h1 className="text-2xl font-bold text-primary mb-6">Doctor's Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all">
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold text-primary">{stat.value}</h3>
                <p className={`text-xs mt-2 font-medium ${stat.label === 'Critical Cases' ? 'text-red-500' : 'text-emerald-600'}`}>
                  {stat.trend}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${stat.color} shadow-lg opacity-90 group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Patient List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="text-lg font-bold text-primary">Recent Screenings</h3>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search patients..." className="pl-10 pr-4 py-2 bg-surface-muted border-none rounded-xl text-sm focus:ring-2 focus:ring-accent w-full outline-none"/>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-muted text-xs uppercase text-slate-500 font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">Patient Name</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">AI Prediction</th>
                <th className="px-6 py-4">Confidence</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-xs">
                        {patient.name.substring(0,2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-primary">{patient.name}</p>
                        <p className="text-xs text-slate-400">{patient.age} yrs</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{patient.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(patient.result)}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${patient.result === 'High Risk' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                      {patient.result}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">{patient.confidence}</td>
                  <td className="px-6 py-4">
                     <span className={`px-2 py-1 rounded text-xs font-semibold ${patient.status === 'Unreviewed' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
                       {patient.status}
                     </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}