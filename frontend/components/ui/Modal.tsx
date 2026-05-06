'use client';

import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal content */}
      <div
        className={clsx(
          'relative z-10 w-full max-w-lg',
          'bg-[#111827] border border-white/10 rounded-2xl shadow-2xl',
          'animate-in fade-in zoom-in-95 duration-200',
          className
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="px-6 pb-6 pt-2">{children}</div>
      </div>
    </div>
  );
}
