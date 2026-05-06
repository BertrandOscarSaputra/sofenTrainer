import React from 'react';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25',
  secondary:
    'bg-white/10 text-white hover:bg-white/20 border border-white/10',
  danger:
    'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20',
  ghost:
    'bg-transparent text-gray-300 hover:bg-white/5 hover:text-white',
  outline:
    'bg-transparent text-indigo-400 border border-indigo-500/50 hover:bg-indigo-500/10',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-base rounded-xl',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-[#0A0F1E]',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
