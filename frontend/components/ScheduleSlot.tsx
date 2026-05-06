import React from 'react';
import clsx from 'clsx';
import { Clock } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import type { Schedule } from '@/lib/types';

const dayLabels: Record<string, string> = {
  MONDAY: 'Senin',
  TUESDAY: 'Selasa',
  WEDNESDAY: 'Rabu',
  THURSDAY: 'Kamis',
  FRIDAY: 'Jumat',
  SATURDAY: 'Sabtu',
  SUNDAY: 'Minggu',
};

interface ScheduleSlotProps {
  schedule: Schedule;
  onSelect: (schedule: Schedule) => void;
  isSelected?: boolean;
}

export default function ScheduleSlot({ schedule, onSelect, isSelected = false }: ScheduleSlotProps) {
  const isAvailable = schedule.status === 'AVAILABLE';

  return (
    <button
      onClick={() => isAvailable && onSelect(schedule)}
      disabled={!isAvailable}
      className={clsx(
        'w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer',
        isAvailable && !isSelected && 'border-white/10 bg-white/5 hover:border-indigo-500/40 hover:bg-indigo-500/5',
        isAvailable && isSelected && 'border-indigo-500 bg-indigo-500/15 shadow-md shadow-indigo-500/20 ring-1 ring-indigo-500/50',
        !isAvailable && 'border-white/5 bg-white/[0.02] opacity-50 cursor-not-allowed'
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={clsx(
          'text-sm font-semibold',
          isSelected ? 'text-indigo-300' : isAvailable ? 'text-white' : 'text-gray-500'
        )}>
          {dayLabels[schedule.dayOfWeek] || schedule.dayOfWeek}
        </span>
        <Badge status={schedule.status} />
      </div>

      <div className="flex items-center gap-2">
        <Clock size={14} className={isSelected ? 'text-indigo-400' : 'text-gray-500'} />
        <span className={clsx(
          'text-sm',
          isSelected ? 'text-indigo-300' : isAvailable ? 'text-gray-300' : 'text-gray-600'
        )}>
          {schedule.startTime} — {schedule.endTime}
        </span>
      </div>

      {isSelected && (
        <div className="mt-2 pt-2 border-t border-indigo-500/20">
          <span className="text-xs text-indigo-400 font-medium">✓ Jadwal dipilih</span>
        </div>
      )}
    </button>
  );
}
