'use client';

import React from 'react';
import Link from 'next/link';
import {
  CalendarPlus,
  Sparkles,
  CalendarCheck,
  Activity,
  CheckCircle,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import BookingCard from '@/components/BookingCard';
import { useAuth } from '@/hooks/useAuth';
import { useBooking } from '@/hooks/useBooking';
import { SkeletonCard } from '@/components/ui/LoadingSpinner';

export default function DashboardPage() {
  const { user } = useAuth();
  const { bookings, isLoading, cancel, markDone } = useBooking();

  const activeBookings = bookings.filter(
    (b) => b.status === 'PENDING' || b.status === 'CONFIRMED'
  );
  const doneBookings = bookings.filter((b) => b.status === 'DONE');
  const totalBookings = bookings.length;

  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-6xl mx-auto">
      {/* ─── Header ─── */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
          Halo, {user?.name || 'User'}! 👋
        </h1>
        <p className="text-gray-400 text-sm">{today}</p>
      </div>

      {/* ─── Stats ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 flex items-center justify-center">
            <CalendarCheck size={22} className="text-indigo-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{totalBookings}</p>
            <p className="text-xs text-gray-500">Total Booking</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 flex items-center justify-center">
            <Activity size={22} className="text-cyan-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{activeBookings.length}</p>
            <p className="text-xs text-gray-500">Sesi Aktif</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center">
            <CheckCircle size={22} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{doneBookings.length}</p>
            <p className="text-xs text-gray-500">Sesi Selesai</p>
          </div>
        </Card>
      </div>

      {/* ─── Quick Actions ─── */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link href="/booking">
          <Button variant="primary" size="md">
            <CalendarPlus size={18} />
            Booking Baru
          </Button>
        </Link>
        <Link href="/recommendation">
          <Button variant="secondary" size="md">
            <Sparkles size={18} />
            Lihat Rekomendasi AI
          </Button>
        </Link>
      </div>

      {/* ─── Booking Aktif ─── */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-4">Booking Aktif</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : activeBookings.length === 0 ? (
          <Card className="text-center py-10">
            <CalendarCheck size={40} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 mb-4">Belum ada booking aktif.</p>
            <Link href="/booking">
              <Button variant="outline" size="sm">Buat Booking Pertama</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={cancel}
                onMarkDone={markDone}
              />
            ))}
          </div>
        )}
      </div>

      {/* ─── Riwayat ─── */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Riwayat Sesi</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <SkeletonCard />
          </div>
        ) : doneBookings.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-gray-500 text-sm">Belum ada riwayat sesi.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {doneBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
