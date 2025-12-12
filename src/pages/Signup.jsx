// src/pages/Signup.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Stethoscope, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Mail, Phone, Lock, Calendar, Globe, MapPin } from 'lucide-react';
import api from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

// --- EXPANDED COUNTRY LIST ---
const countryOptions = [
  { code: 'YE', name: 'Yemen', dial: '+967', length: 9 },
  { code: 'EG', name: 'Egypt', dial: '+20', length: 10 },
  { code: 'SA', name: 'Saudi Arabia', dial: '+966', length: 9 },
  { code: 'AE', name: 'United Arab Emirates', dial: '+971', length: 9 },
  { code: 'US', name: 'United States', dial: '+1', length: 10 },
  { code: 'GB', name: 'United Kingdom', dial: '+44', length: 10 },
  { code: 'JO', name: 'Jordan', dial: '+962', length: 9 },
  { code: 'KW', name: 'Kuwait', dial: '+965', length: 8 },
  { code: 'QA', name: 'Qatar', dial: '+974', length: 8 },
  { code: 'BH', name: 'Bahrain', dial: '+973', length: 8 },
  { code: 'OM', name: 'Oman', dial: '+968', length: 8 },
  { code: 'LB', name: 'Lebanon', dial: '+961', length: 8 },
  { code: 'IQ', name: 'Iraq', dial: '+964', length: 10 },
  { code: 'SD', name: 'Sudan', dial: '+249', length: 9 },
  { code: 'LY', name: 'Libya', dial: '+218', length: 9 },
  { code: 'MA', name: 'Morocco', dial: '+212', length: 9 },
  { code: 'TN', name: 'Tunisia', dial: '+216', length: 8 },
  { code: 'DZ', name: 'Algeria', dial: '+213', length: 9 },
];

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({}); 

  const [formData, setFormData] = useState({
    role: '', 
    fullName: '',
    email: '',
    countryCode: '+967', // Default
    phone: '',
    gender: '', 
    password: '',
    confirmPassword: '',
    dateOfBirth: '', // Will store as DD/MM/YYYY
    clinicAddress: '',
    licenseNumber: '',
    specialty: '',
  });

  const currentCountry = countryOptions.find(c => c.dial === formData.countryCode) || countryOptions[0];

  // --- SMART DATE FORMATTER (DD/MM/YYYY) ---
  const handleDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-numbers
    
    // Auto-add slashes
    if (value.length >= 2) value = value.slice(0, 2) + '/' + value.slice(2);
    if (value.length >= 5) value = value.slice(0, 5) + '/' + value.slice(5, 10);
    
    // Limit length
    value = value.slice(0, 10);

    setFormData({ ...formData, dateOfBirth: value });
    
    // Real-time validation
    if (value.length === 10) {
      const [day, month, year] = value.split('/').map(Number);
      const date = new Date(year, month - 1, day);
      const now = new Date();
      
      if (
        date.getDate() !== day || 
        date.getMonth() + 1 !== month || 
        date.getFullYear() !== year
      ) {
        setErrors(prev => ({ ...prev, dateOfBirth: "Invalid date." }));
      } else if (year < 1900 || year > now.getFullYear()) {
        setErrors(prev => ({ ...prev, dateOfBirth: "Invalid year." }));
      } else if (now.getFullYear() - year < 18) {
        setErrors(prev => ({ ...prev, dateOfBirth: "You must be 18+." }));
      } else {
        setErrors(prev => ({ ...prev, dateOfBirth: "" }));
      }
    }
  };

  // --- VALIDATION ---
  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return "Full Name is required.";
        if (value.trim().length < 3) return "Name must be 3+ chars.";
        return "";
      
      case 'email':
        if (!value.trim() || !/\S+@\S+\.\S+/.test(value)) return "Valid Email is required.";
        return "";

      case 'phone':
        if (!value.trim()) return "Required.";
        // Check exact length based on country
        if (value.length !== currentCountry.length) {
          return `Must be ${currentCountry.length} digits for ${currentCountry.name}.`;
        }
        return "";

      case 'password':
        if (value.length < 8) return "Min 8 chars, 1 Uppercase, 1 Number.";
        if (!/[A-Z]/.test(value) || !/[0-9]/.test(value)) return "Need Uppercase & Number.";
        return "";

      case 'confirmPassword':
        if (value !== formData.password) return "Passwords do not match.";
        return "";

      // Doctor Specific
      case 'licenseNumber':
      case 'clinicAddress':
      case 'specialty':
        return formData.role === 'doctor' && !value.trim() ? "This field is required." : "";

      default: return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // For phone: only allow numbers
    if (name === 'phone' && !/^\d*$/.test(value)) return;

    setFormData({ ...formData, [name]: value });
    
    const errorMsg = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate Date manually before submit
    if (formData.role === 'patient' && formData.dateOfBirth.length !== 10) {
      setErrors(prev => ({ ...prev, dateOfBirth: "Full date required (DD/MM/YYYY)." }));
      return;
    }

    // Check all other fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const msg = validateField(key, formData[key]);
      if (msg) newErrors[key] = msg;
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      // Backend expects "YYYY-MM-DD" often, so let's convert it if needed
      // OR send as string if backend handles it. Assuming we send string for now.
      const submissionData = {
        ...formData,
        phone: `${formData.countryCode}${formData.phone}`
      };
      
      await api.post('/auth/register', submissionData);
      navigate('/login');
    } catch (err) {
      setErrors(prev => ({ ...prev, global: err.response?.data?.message || 'Registration failed.' }));
    } finally {
      setIsLoading(false);
    }
  };

  // --- COMPONENTS ---
  const RoleCard = ({ role, icon: Icon, title, desc }) => (
    <div 
      onClick={() => { setFormData({ ...formData, role }); setStep(2); setErrors({}); }}
      className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center text-center gap-4 group
      ${formData.role === role 
        ? 'border-accent bg-accent/5 ring-4 ring-accent/10' 
        : 'border-slate-100 bg-white hover:border-accent/50 hover:shadow-lg'}`}
    >
      <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors
        ${formData.role === role ? 'bg-accent text-white' : 'bg-surface-muted text-primary group-hover:bg-accent/10 group-hover:text-accent'}`}>
        <Icon size={32} />
      </div>
      <div>
        <h3 className="text-lg font-bold text-primary">{title}</h3>
        <p className="text-sm text-primary/60 mt-1">{desc}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-muted flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-premium p-8 md:p-12">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Create Account</h1>
          <p className="text-primary/60">Step {step} of 2 • {step === 1 ? 'Select Role' : 'Your Details'}</p>
          <div className="w-full h-1 bg-surface-muted mt-6 rounded-full overflow-hidden">
            <div className="h-full bg-accent transition-all duration-500" style={{ width: step === 1 ? '50%' : '100%' }} />
          </div>
        </div>

        {errors.global && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
            <AlertCircle size={18} /> {errors.global}
          </div>
        )}

        {step === 1 && (
          <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
            <RoleCard role="patient" icon={User} title="Patient" desc="Screening & Health History" />
            <RoleCard role="doctor" icon={Stethoscope} title="Doctor" desc="Manage Patients & Appointments" />
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in slide-in-from-right-4">
            
            {/* Full Name */}
            <Input 
              label="Full Name" 
              name="fullName"
              placeholder="John Doe" 
              value={formData.fullName} 
              onChange={handleChange}
              error={errors.fullName}
              icon={User}
            />
            
            <div className="grid md:grid-cols-2 gap-4">
              <Input 
                label="Email Address" 
                name="email"
                type="email"
                placeholder="name@email.com" 
                value={formData.email} 
                onChange={handleChange}
                error={errors.email}
                icon={Mail}
              />

              {/* --- COUNTRY & PHONE --- */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-primary/80 ml-1">Phone Number</label>
                <div className="flex gap-2">
                  {/* Country Dropdown */}
                  <div className="relative w-2/5">
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={(e) => {
                        setFormData({...formData, countryCode: e.target.value, phone: ''});
                        setErrors({...errors, phone: ''});
                      }}
                      className="w-full h-full bg-surface-muted border-2 border-transparent rounded-xl py-3 pl-2 pr-1 outline-none font-medium text-primary text-sm appearance-none cursor-pointer hover:bg-slate-200 transition-colors truncate"
                    >
                      {countryOptions.map(c => (
                        <option key={c.code} value={c.dial}>
                          {c.name} ({c.dial})
                        </option>
                      ))}
                    </select>
                    {/* Small arrow icon overlay */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 bg-surface-muted pl-1">
                      <Globe size={14} />
                    </div>
                  </div>

                  {/* Phone Input */}
                  <div className="relative w-3/5">
                    <input
                      name="phone"
                      type="tel"
                      placeholder={`e.g. ${currentCountry.dial.replace('+','')}...`}
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength={currentCountry.length}
                      className={`w-full bg-surface-muted border-2 rounded-xl py-3 px-4 outline-none transition-all duration-300 font-medium text-primary placeholder:text-primary/30
                      ${errors.phone 
                        ? 'border-red-300 bg-red-50/50 focus:border-red-500' 
                        : 'border-transparent focus:border-accent focus:bg-white'}`}
                    />
                  </div>
                </div>
                {errors.phone && <p className="text-xs font-medium text-red-500 ml-1">{errors.phone}</p>}
              </div>
            </div>

            {/* --- CUSTOM DATE INPUT (DD/MM/YYYY) --- */}
            {formData.role === 'patient' && (
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-primary/80 ml-1">Date of Birth</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40">
                    <Calendar size={20} />
                  </div>
                  <input
                    type="text"
                    value={formData.dateOfBirth}
                    onChange={handleDateChange}
                    placeholder="DD / MM / YYYY"
                    maxLength={10}
                    className={`w-full bg-surface-muted border-2 rounded-xl py-3 pl-12 pr-4 outline-none transition-all duration-300 font-medium text-primary placeholder:text-primary/30
                    ${errors.dateOfBirth 
                      ? 'border-red-300 bg-red-50/50 focus:border-red-500' 
                      : 'border-transparent focus:border-accent focus:bg-white'}`}
                  />
                </div>
                {errors.dateOfBirth && <p className="text-xs font-medium text-red-500 ml-1">{errors.dateOfBirth}</p>}
              </div>
            )}

            {/* Gender */}
            <div>
              <label className="block text-sm font-semibold text-primary/80 mb-2 ml-1">Gender</label>
              <div className="grid grid-cols-2 gap-4">
                {['Male', 'Female'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, gender: g });
                      if(errors.gender) setErrors({...errors, gender: ''});
                    }}
                    className={`py-3 rounded-xl border-2 font-medium transition-all flex items-center justify-center gap-2
                    ${formData.gender === g 
                      ? 'border-accent bg-accent/5 text-accent ring-2 ring-accent/20' 
                      : 'border-surface-muted text-slate-400 hover:border-slate-300'}`}
                  >
                    {g === 'Male' ? <User size={18} /> : <User size={18} />} {g}
                  </button>
                ))}
              </div>
              {errors.gender && <p className="text-xs font-medium text-red-500 ml-1 mt-1">{errors.gender}</p>}
            </div>

            {/* Doctor Specific */}
            {formData.role === 'doctor' && (
              <div className="p-5 bg-accent/5 rounded-2xl border border-accent/10 space-y-4 animate-in fade-in">
                <h4 className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 size={14} /> Professional Verification
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input 
                    label="Medical Specialty" 
                    name="specialty"
                    placeholder="e.g. Oncologist" 
                    value={formData.specialty} 
                    onChange={handleChange}
                    error={errors.specialty}
                    icon={Stethoscope}
                  />
                  <Input 
                    label="License Number" 
                    name="licenseNumber"
                    placeholder="MD-123456" 
                    value={formData.licenseNumber} 
                    onChange={handleChange}
                    error={errors.licenseNumber}
                    icon={CheckCircle2}
                  />
                </div>
                <Input 
                  label="Clinic / Hospital Name & Address" 
                  name="clinicAddress"
                  placeholder="e.g. Cairo City Hospital, Main St." 
                  value={formData.clinicAddress} 
                  onChange={handleChange}
                  error={errors.clinicAddress}
                  icon={MapPin}
                />
              </div>
            )}

            {/* Password */}
            <div className="grid md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <Input 
                label="Password" 
                name="password"
                type="password" 
                placeholder="••••••••" 
                value={formData.password} 
                onChange={handleChange}
                error={errors.password}
                icon={Lock}
              />
              <Input 
                label="Confirm Password" 
                name="confirmPassword"
                type="password" 
                placeholder="••••••••" 
                value={formData.confirmPassword} 
                onChange={handleChange}
                error={errors.confirmPassword}
                icon={Lock}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                className="w-1/3"
                onClick={() => { setStep(1); setError(''); }}
              >
                <ArrowLeft size={18} /> Back
              </Button>
              <Button type="submit" isLoading={isLoading} className="flex-1">
                Create Account <ArrowRight size={18} />
              </Button>
            </div>
          </form>
        )}

        <div className="mt-8 text-center text-sm text-primary/60">
          Already have an account?{' '}
          <Link to="/login" className="text-accent font-semibold hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
}