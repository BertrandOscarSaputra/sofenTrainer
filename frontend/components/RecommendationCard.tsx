import React from 'react';
import { Sparkles, Calendar, Clock, ArrowRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import type { RecommendationItem } from '@/lib/types';

interface RecommendationCardProps {
  recommendation: RecommendationItem;
  onBook: (rec: RecommendationItem) => void;
  index?: number;
}

export default function RecommendationCard({ recommendation, onBook, index = 0 }: RecommendationCardProps) {
  return (
    <Card
      hover
      className="relative overflow-hidden group"
      glow
    >
      {/* AI badge */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
          <Sparkles size={14} className="text-white" />
        </div>
        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
          Rekomendasi AI #{index + 1}
        </span>
      </div>

      {/* Schedule info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={15} className="text-cyan-400" />
          <span className="text-sm font-semibold text-white">{recommendation.day}</span>
          <span className="text-sm text-gray-400">—</span>
          <span className="text-sm text-gray-300">{recommendation.startTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={15} className="text-cyan-400" />
          <span className="text-sm text-gray-300">{recommendation.duration} menit</span>
        </div>
      </div>

      {/* Type badge */}
      <div className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-3">
        <span className="text-xs font-semibold text-cyan-400">{recommendation.type}</span>
      </div>

      {/* Reason */}
      <p className="text-sm text-gray-400 leading-relaxed mb-5 italic">
        &ldquo;{recommendation.reason}&rdquo;
      </p>

      {/* Action */}
      <Button
        variant="primary"
        size="sm"
        className="w-full group/btn"
        onClick={() => onBook(recommendation)}
      >
        Booking Sekarang
        <ArrowRight size={16} className="group-hover/btn:translate-x-0.5 transition-transform" />
      </Button>
    </Card>
  );
}
