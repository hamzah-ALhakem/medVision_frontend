// src/components/layout/DashboardLayout.jsx
import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout() {


    // Mobile Sidebar State
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


    //   // 1. Check for User Data
    //   const user = JSON.parse(localStorage.getItem('user'));
    //   const token = localStorage.getItem('token');

    //   // 2. Protect the Route (Redirect to Login if no token)
    //   if (!token || !user) {
    //     return <Navigate to="/login" replace />;
    //   }


    // Fake user for testing UI
    const user = {
        firstName: "Hamzah",
        lastName: "Developer",
        role: "doctor" // 'patient' or 'doctor'
    };
    // ------------------------------------




   return (
    <div className="min-h-screen bg-surface-muted flex">
      {/* Sidebar (Responsive) */}
      <Sidebar 
        role={user.role} 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-primary/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
        <Header 
          user={user} 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
        />
        
        <div className="p-4 md:p-8 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}