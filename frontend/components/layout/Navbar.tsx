'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0F1E]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <img 
              src="/traino.png" 
              alt="Traino Logo" 
              className="w-10 h-10 object-contain"
            />
            <span className="text-xl font-bold text-white tracking-tight">
              Trai<span className="text-indigo-400">no</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/#features" className="text-sm text-gray-400 hover:text-white transition-colors">
              Fitur
            </Link>
            <Link href="/#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">
              Cara Kerja
            </Link>
            <Link href="/#trainers" className="text-sm text-gray-400 hover:text-white transition-colors">
              Trainer
            </Link>
            <div className="flex items-center gap-3 ml-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">Masuk</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">Daftar Gratis</Button>
              </Link>
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#0A0F1E]/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-3">
            <Link href="/#features" className="block text-sm text-gray-400 hover:text-white py-2" onClick={() => setIsOpen(false)}>
              Fitur
            </Link>
            <Link href="/#how-it-works" className="block text-sm text-gray-400 hover:text-white py-2" onClick={() => setIsOpen(false)}>
              Cara Kerja
            </Link>
            <Link href="/#trainers" className="block text-sm text-gray-400 hover:text-white py-2" onClick={() => setIsOpen(false)}>
              Trainer
            </Link>
            <div className="flex flex-col gap-2 pt-3 border-t border-white/10">
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" size="md" className="w-full">Masuk</Button>
              </Link>
              <Link href="/register" onClick={() => setIsOpen(false)}>
                <Button variant="primary" size="md" className="w-full">Daftar Gratis</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
