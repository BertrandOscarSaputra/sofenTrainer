import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-radial opacity-50" />
      <div className="absolute top-10 right-20 w-60 h-60 rounded-full bg-indigo-500/8 blur-[100px]" />
      <div className="absolute bottom-10 left-20 w-48 h-48 rounded-full bg-cyan-500/8 blur-[80px]" />

      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
