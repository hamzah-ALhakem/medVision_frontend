import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import PatientDashboard from './pages/PatientDashboard';
import Screening from './pages/Screening';
import DoctorDashboard from './pages/DoctorDashboard';
import Appointments from './pages/Appointments';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import HomePage from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import Labs from './pages/Labs';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

function App() {
  return (
    <Routes>
      {/* الصفحة الرئيسية العامة */}
      <Route path="/" element={<HomePage />} />
      
      {/* صفحات المصادقة */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* الصفحات المحمية (التي تتطلب تسجيل دخول وتظهر بداخل التخطيط الجانبي) */}
      <Route element={<DashboardLayout />}>
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} /> {/* 2. إضافة مسار الأدمن */}
        <Route path="/labs" element={<Labs />} />
        <Route path="/screening" element={<Screening />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* التوجيه الافتراضي لأي رابط خاطئ */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;