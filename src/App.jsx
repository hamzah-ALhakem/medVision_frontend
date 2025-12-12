// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Auth Pages
import Login from './pages/Login';
import Signup from './pages/Signup';



import PatientDashboard from './pages/PatientDashboard';
import Screening from './pages/Screening';
import DoctorDashboard from './pages/DoctorDashboard';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';
import Appointments from './pages/Appointments';
import Messages from './pages/Messages';
import Settings from './pages/Settings';






function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Dashboard Routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/screening" element={<Screening />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Default Redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;