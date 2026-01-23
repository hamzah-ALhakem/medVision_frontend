// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import api from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', formData);
      
      // Save data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirect based on role
      if (response.data.user.role === 'doctor') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/patient-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      
      {/* 1. Left Side - Visuals Only (Text Removed) */}
      <div className="hidden lg:flex col-span-1 bg-primary relative overflow-hidden items-center justify-center">
        {/* Abstract Shapes/Background Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3"></div>
        
        {/* Central Logo/Icon (Optional - kept only if you want an image, otherwise empty) */}
        <div className="relative z-10 w-32 h-32 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl">
           <div className="w-16 h-16 bg-accent rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-3xl">M</span>
           </div>
        </div>
      </div>

      {/* 2. Right Side - Login Form */}
      <div className="col-span-1 flex items-center justify-center p-8 bg-surface">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
          
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-primary">Welcome back</h2>
            <p className="text-slate-500 mt-2">Please enter your details to sign in.</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm animate-in zoom-in-95">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input 
              label="Email" 
              type="email" 
              placeholder="Enter your email" 
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
                <Link to="/forgot-password" class="text-xs font-semibold text-accent hover:text-accent/80">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full py-4 text-base">
              Sign in <ArrowRight size={18} />
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-accent hover:underline">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}