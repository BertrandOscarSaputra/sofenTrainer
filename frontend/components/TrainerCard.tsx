import React from 'react';
import clsx from 'clsx';
import { Star, User } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import type { Trainer } from '@/lib/types';

interface TrainerCardProps {
  trainer: Trainer;
  onSelect: (trainer: Trainer) => void;
  isSelected?: boolean;
}

export default function TrainerCard({ trainer, onSelect, isSelected = false }: TrainerCardProps) {
  return (
    <Card
      hover
      className={clsx(
        'relative overflow-hidden group',
        isSelected && 'ring-2 ring-indigo-500 border-indigo-500/50 shadow-lg shadow-indigo-500/20'
      )}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center border border-white/10 group-hover:border-indigo-500/30 transition-colors">
          <User size={24} className="text-indigo-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-white truncate">{trainer.name}</h3>
          <p className="text-sm text-indigo-400 font-medium">{trainer.specialty}</p>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1.5 mb-3">
        <Star size={14} className="text-amber-400 fill-amber-400" />
        <span className="text-sm font-semibold text-amber-400">{(trainer.rating ?? 0).toFixed(1)}</span>
        <span className="text-xs text-gray-500 ml-1">rating</span>
      </div>

      {/* Bio */}
      <p className="text-sm text-gray-400 leading-relaxed mb-5 line-clamp-2">
        {trainer.bio}
      </p>

      {/* Action */}
      <Button
        variant={isSelected ? 'primary' : 'outline'}
        size="sm"
        className="w-full"
        onClick={() => onSelect(trainer)}
      >
        {isSelected ? '✓ Terpilih' : 'Pilih Trainer'}
      </Button>
    </Card>
  );
}
