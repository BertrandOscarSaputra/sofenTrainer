import React from 'react';
import clsx from 'clsx';
import type { BookingStatus, ScheduleStatus } from '@/lib/types';

type BadgeType = BookingStatus | ScheduleStatus | 'default';

const badgeStyles: Record<BadgeType, string> = {
  PENDING: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  CONFIRMED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  CANCELLED: 'bg-red-500/20 text-red-400 border-red-500/30',
  DONE: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  AVAILABLE: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  BOOKED: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  BLOCKED: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  default: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const badgeLabels: Record<BadgeType, string> = {
  PENDING: 'Menunggu',
  CONFIRMED: 'Dikonfirmasi',
  CANCELLED: 'Dibatalkan',
  DONE: 'Selesai',
  AVAILABLE: 'Tersedia',
  BOOKED: 'Terisi',
  BLOCKED: 'Diblokir',
  default: 'Unknown',
};

interface BadgeProps {
  status: BadgeType;
  className?: string;
}

export default function Badge({ status, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        badgeStyles[status] || badgeStyles.default,
        className
      )}
    >
      {badgeLabels[status] || status}
    </span>
  );
}
