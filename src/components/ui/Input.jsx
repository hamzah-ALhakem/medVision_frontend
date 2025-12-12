// src/components/ui/Input.jsx
import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function Input({ label, error, icon: Icon, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-semibold text-primary/80 ml-1">
          {label}
        </label>
      )}
      
      <div className="relative group">
        {Icon && (
          <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors
            ${error ? 'text-red-400' : 'text-primary/40 group-focus-within:text-accent'}`}>
            <Icon size={20} />
          </div>
        )}
        
        <input
          className={`w-full bg-surface-muted border-2 rounded-xl py-3 px-4 outline-none transition-all duration-300 font-medium text-primary placeholder:text-primary/30
          ${Icon ? 'pl-12' : ''}
          ${error 
            ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
            : 'border-transparent focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/10'
          }`}
          {...props}
        />

        {/* Error Icon inside input */}
        {error && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 animate-in fade-in zoom-in">
            <AlertCircle size={20} />
          </div>
        )}
      </div>
      
      {/* Inline Error Message */}
      {error && (
        <p className="text-xs font-medium text-red-500 ml-1 animate-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
}