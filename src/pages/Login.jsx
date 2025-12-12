// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import api from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 1. Send data to Backend
      const response = await api.post('/auth/login', formData);

      // 2. On Success: Save Token & Role
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // 3. Redirect based on Role
      if (user.role === 'doctor') navigate('/doctor-dashboard');
      else if (user.role === 'patient') navigate('/patient-dashboard');
      else navigate('/admin-dashboard');

    } catch (err) {
      // 4. Handle Errors (like "Account not approved")
      const msg = err.response?.data?.message || 'Connection failed. Is the backend running?';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-surface-muted to-accent-soft/30">
      {/* Main Card */}
      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-premium overflow-hidden grid md:grid-cols-2 min-h-[600px]">

        {/* Left Side: Brand/Visual */}
        <div className="bg-primary p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center" />

          <div className="relative z-10">
            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck size={28} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">MedVision AI</h1>
            <p className="text-primary-foreground/70 text-lg">Next-generation breast cancer screening powered by advanced machine learning.</p>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3 text-sm opacity-80">
              <div className="w-8 h-[1px] bg-white/50" />
              <span>Secure HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-3 text-sm opacity-80">
              <div className="w-8 h-[1px] bg-white/50" />
              <span>94% Model Accuracy</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-primary mb-2">Welcome Back</h2>
            <p className="text-primary/60">Please sign in to access your dashboard.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input 
              label="Email Address" 
              type="email" 
              placeholder="name@hospital.com"
              icon={Mail}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />

            <div className="space-y-2">
              <Input 
                label="Password" 
                type="password" 
                placeholder="••••••••"
                icon={Lock}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
              <div className="flex justify-end">
                <a href="#" className="text-sm text-accent hover:text-accent/80 font-medium">Forgot Password?</a>
              </div>
            </div>

            <Button type="submit" isLoading={isLoading}>
              Sign In to Dashboard
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-primary/60">
            Don't have an account?{' '}
            <Link to="/signup" className="text-accent font-semibold hover:underline">
              Create Account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}