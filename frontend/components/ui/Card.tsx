import React from 'react';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  style?: React.CSSProperties;
}

export default function Card({ children, className, hover = false, glow = false, style }: CardProps) {
  return (
    <div
      style={style}
      className={clsx(
        'rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6',
        'transition-all duration-300',
        hover && 'hover:-translate-y-1 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer',
        glow && 'shadow-lg shadow-indigo-500/10 border-indigo-500/20',
        className
      )}
    >
      {children}
    </div>
  );
}
