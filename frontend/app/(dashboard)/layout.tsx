'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0F1E]">
        <LoadingSpinner size="lg" label="Memuat..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
