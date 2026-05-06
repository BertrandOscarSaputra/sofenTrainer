'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Booking } from '@/lib/types';
import { getBookings, cancelBooking, markBookingDone } from '@/lib/bookingService';

export function useBooking() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getBookings();
      setBookings(data);
    } catch {
      setError('Gagal memuat data booking.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancel = useCallback(async (id: number) => {
    try {
      await cancelBooking(id);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'CANCELLED' as const } : b))
      );
    } catch {
      setError('Gagal membatalkan booking.');
    }
  }, []);

  const handleMarkDone = useCallback(async (id: number) => {
    try {
      await markBookingDone(id);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'DONE' as const } : b))
      );
    } catch {
      setError('Gagal menandai booking selesai.');
    }
  }, []);

  return {
    bookings,
    isLoading,
    error,
    refetch: fetchBookings,
    cancel: handleCancel,
    markDone: handleMarkDone,
  };
}
