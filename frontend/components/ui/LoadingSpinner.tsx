import React from 'react';
import clsx from 'clsx';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

const sizeMap = {
  sm: 'h-5 w-5',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export default function LoadingSpinner({ size = 'md', className, label }: LoadingSpinnerProps) {
  return (
    <div className={clsx('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={clsx(
          'animate-spin rounded-full border-2 border-white/10 border-t-indigo-500',
          sizeMap[size]
        )}
      />
      {label && <p className="text-sm text-gray-400 animate-pulse">{label}</p>}
    </div>
  );
}

// ─── Skeleton loader for cards ──────────────────────────────
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'rounded-2xl border border-white/10 bg-white/5 p-6 animate-pulse',
        className
      )}
    >
      <div className="h-4 w-2/3 bg-white/10 rounded mb-4" />
      <div className="h-3 w-full bg-white/10 rounded mb-2" />
      <div className="h-3 w-4/5 bg-white/10 rounded mb-4" />
      <div className="h-8 w-1/3 bg-white/10 rounded" />
    </div>
  );
}
