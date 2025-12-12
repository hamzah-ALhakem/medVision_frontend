// src/components/ui/Button.jsx
import React from 'react';
import { Loader2 } from 'lucide-react'; // Icon for loading state

export default function Button({ children, isLoading, variant = 'primary', className = '', ...props }) {
  const baseStyles = "w-full py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95";

  const variants = {
    primary: "bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-light hover:shadow-xl",
    outline: "border-2 border-primary/20 text-primary hover:bg-surface-muted hover:border-primary",
    ghost: "text-primary/70 hover:bg-surface-muted hover:text-primary",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      disabled={isLoading} 
      {...props}
    >
      {isLoading ? <Loader2 className="animate-spin" size={20} /> : children}
    </button>
  );
}