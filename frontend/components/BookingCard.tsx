import React from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
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
  const trainerName = booking.trainerName || booking.trainer?.name || `Trainer #${booking.trainerId}`;
  const specialty = booking.trainerSpecialty || booking.trainer?.specialty;
  
  const formattedDate = booking.scheduledAt ? new Date(booking.scheduledAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) : '';

  const formattedTime = booking.scheduledAt ? new Date(booking.scheduledAt).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  }) : '';

  const bookedDate = booking.bookedAt ? new Date(booking.bookedAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short'
  }) : '';

  if (!isActive) {
    const isDone = String(booking.status).toUpperCase() === 'DONE';
    return (
      <Card key={booking.id} className={`p-5 border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
        isDone 
          ? 'bg-green-500/[0.02] border-green-500/10' 
          : 'bg-red-500/[0.02] border-red-500/10 opacity-75'
      }`}>
        <div className="flex items-center gap-4">
          <Avatar 
            src={booking.trainerProfilePictureUrl} 
            name={trainerName} 
            size="md" 
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-bold text-white">
                {trainerName}
              </p>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                isDone ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
              }`}>
                {isDone ? 'Selesai' : 'Batal'}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar size={12} /> 
                {formattedDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {formattedTime}
              </span>
              <span>{booking.durationMinutes} menit</span>
            </div>
            {booking.notes && (
              <p className="mt-2 text-xs text-gray-400 italic">"{booking.notes}"</p>
            )}
          </div>
        </div>
        
        <div className="text-right flex flex-col items-end gap-1">
           <p className="text-[10px] text-gray-600 uppercase font-bold">Waktu Booking</p>
           <p className="text-xs text-gray-400">{bookedDate}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative hover:border-indigo-500/30 transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar 
            src={booking.trainerProfilePictureUrl} 
            name={trainerName} 
            size="md" 
          />
          <div>
            <h4 className="text-sm font-semibold text-white">{trainerName}</h4>
            {specialty && (
              <p className="text-xs text-gray-500">{specialty}</p>
            )}
          </div>
        </div>
        <Badge status={booking.status} />
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Calendar size={14} className="text-indigo-400" />
          <span>{formattedDate} — {formattedTime}</span>
        </div>
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

      <div className="flex items-center gap-2 pt-3 border-t border-white/5">
        {onCancel && (
          <Button variant="danger" size="sm" onClick={() => onCancel(booking.id)} className="flex-1">
            Batalkan
          </Button>
        )}
        {onMarkDone && booking.status === 'CONFIRMED' && (
          <Button variant="secondary" size="sm" onClick={() => onMarkDone(booking.id)} className="flex-1">
            Tandai Selesai
          </Button>
        )}
      </div>
    </Card>
  );
}
