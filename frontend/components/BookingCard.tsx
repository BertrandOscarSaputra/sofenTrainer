import React from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import type { Booking } from '@/lib/types';

const dayLabels: Record<string, string> = {
  MONDAY: 'Senin',
  TUESDAY: 'Selasa',
  WEDNESDAY: 'Rabu',
  THURSDAY: 'Kamis',
  FRIDAY: 'Jumat',
  SATURDAY: 'Sabtu',
  SUNDAY: 'Minggu',
};

interface BookingCardProps {
  booking: Booking;
  onCancel?: (id: number) => void;
  onMarkDone?: (id: number) => void;
}

export default function BookingCard({ booking, onCancel, onMarkDone }: BookingCardProps) {
  const isActive = booking.status === 'PENDING' || booking.status === 'CONFIRMED';
  const trainerName = booking.trainer?.name || `Trainer #${booking.trainerId}`;
  
  const formattedDateTime = booking.scheduledAt ? new Date(booking.scheduledAt).toLocaleString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  }) : '';

  return (
    <Card className={`relative transition-all ${!isActive ? 'opacity-70 grayscale-[0.3] border-white/5' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
            <User size={18} className="text-indigo-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">{trainerName}</h4>
            {booking.trainer?.specialty && (
              <p className="text-xs text-gray-500">{booking.trainer.specialty}</p>
            )}
          </div>
        </div>
        <Badge status={booking.status} />
      </div>

      <div className="space-y-2 mb-4">
        {formattedDateTime && (
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Calendar size={14} className="text-indigo-400" />
            <span>{formattedDateTime}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock size={14} className="text-gray-500" />
          <span>{booking.durationMinutes} menit</span>
        </div>
        {booking.notes && (
          <p className="mt-3 text-xs text-gray-400 italic bg-white/5 p-2 rounded-lg border border-white/5">
            "{booking.notes}"
          </p>
        )}
      </div>

      {isActive && (
        <div className="flex items-center gap-2 pt-3 border-t border-white/5">
          {onCancel && (
            <Button variant="danger" size="sm" onClick={() => onCancel(booking.id)}>
              Batalkan
            </Button>
          )}
          {onMarkDone && booking.status === 'CONFIRMED' && (
            <Button variant="secondary" size="sm" onClick={() => onMarkDone(booking.id)}>
              Tandai Selesai
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
