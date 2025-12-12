// src/pages/Screening.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, AlertCircle, CheckCircle, ArrowRight, RotateCcw } from 'lucide-react';
import Button from '../components/ui/Button';

// --- FIELD CONFIGURATION ---
const fieldList = [
  { key: 'radius', label: 'Radius' }, { key: 'texture', label: 'Texture' },
  { key: 'perimeter', label: 'Perimeter' }, { key: 'area', label: 'Area' },
  { key: 'smoothness', label: 'Smoothness' }, { key: 'compactness', label: 'Compactness' },
  { key: 'concavity', label: 'Concavity' }, { key: 'concave_points', label: 'Concave Pts' },
  { key: 'symmetry', label: 'Symmetry' }, { key: 'fractal_dimension', label: 'Fractal Dim' },
];

export default function Screening() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('input');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // 30 Fields State
  const [formData, setFormData] = useState({
    radius_mean: '', texture_mean: '', perimeter_mean: '', area_mean: '', smoothness_mean: '',
    compactness_mean: '', concavity_mean: '', concave_points_mean: '', symmetry_mean: '', fractal_dimension_mean: '',
    radius_se: '', texture_se: '', perimeter_se: '', area_se: '', smoothness_se: '',
    compactness_se: '', concavity_se: '', concave_points_se: '', symmetry_se: '', fractal_dimension_se: '',
    radius_worst: '', texture_worst: '', perimeter_worst: '', area_worst: '', smoothness_worst: '',
    compactness_worst: '', concavity_worst: '', concave_points_worst: '', symmetry_worst: '', fractal_dimension_worst: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if(error) setError(''); // Clear error on type
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Strict Validation: Check for empty values
    const emptyFields = Object.values(formData).some(val => val === '' || val === null);
    if (emptyFields) {
      setError('All 30 values are mandatory for an accurate AI prediction.');
      window.scrollTo(0, 0);
      return;
    }

    setStatus('analyzing');

    // Simulate AI Processing
    setTimeout(() => {
      setResult({
        diagnosis: 'Benign', 
        confidence: 96.4,
        description: 'The analysis indicates benign characteristics. Regular yearly screening is recommended.'
      });
      setStatus('result');
    }, 3000);
  };

  // Helper Component
  const renderInputGroup = (title, prefix) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
      <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
        <Activity size={18} className="text-accent" /> {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {fieldList.map((field) => {
          const inputName = `${field.key}_${prefix}`;
          return (
            <div key={inputName}>
              <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">
                {field.label}
              </label>
              <input
                name={inputName}
                type="number"
                step="0.0001"
                placeholder="0.00"
                value={formData[inputName]}
                onChange={handleChange}
                required
                className="w-full bg-surface-muted border-2 border-transparent focus:border-accent rounded-lg py-2 px-3 outline-none transition-all font-medium text-primary"
              />
            </div>
          );
        })}
      </div>
    </div>
  );

  // --- VIEW: ANALYZING ---
  if (status === 'analyzing') {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] text-center animate-in fade-in">
        <div className="relative w-32 h-32 mb-8">
          <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-accent rounded-full border-t-transparent animate-spin"></div>
          <Activity className="absolute inset-0 m-auto text-accent animate-pulse" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">Analyzing Samples...</h2>
        <p className="text-slate-500">Our AI model is processing 30 distinct cell features.</p>
      </div>
    );
  }

  // --- VIEW: RESULT ---
  if (status === 'result') {
    const isMalignant = result.diagnosis === 'Malignant';
    return (
      <div className="max-w-2xl mx-auto animate-in zoom-in-95 duration-500">
        <div className={`p-8 rounded-3xl text-center border-4 ${isMalignant ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${isMalignant ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
            {isMalignant ? <AlertCircle size={40} /> : <CheckCircle size={40} />}
          </div>
          
          <h2 className={`text-3xl font-bold mb-2 ${isMalignant ? 'text-red-700' : 'text-emerald-700'}`}>
            {result.diagnosis} Detected
          </h2>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">{result.description}</p>

          <div className="text-center mb-8">
            <p className="text-sm text-slate-500 uppercase tracking-wider font-bold">AI Confidence Score</p>
            <p className="text-4xl font-bold text-primary mt-2">{result.confidence}%</p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button variant="outline" className="w-auto" onClick={() => setStatus('input')}>
              <RotateCcw size={18} /> New Screening
            </Button>
            <Button variant="primary" className="w-auto" onClick={() => navigate('/patient-dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW: INPUT FORM ---
  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">New AI Screening</h1>
        <p className="text-slate-500">Enter the cytological features below. All values are mandatory.</p>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-2 font-medium">
            <AlertCircle size={20} />
            {error}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {renderInputGroup("Mean Values", "mean")}
        {renderInputGroup("Standard Error", "se")}
        {renderInputGroup("Worst Values", "worst")}

        <div className="flex justify-end pt-4 pb-10">
          <Button type="submit" className="w-auto px-8">
            Run AI Analysis <ArrowRight size={20} />
          </Button>
        </div>
      </form>
    </div>
  );
}