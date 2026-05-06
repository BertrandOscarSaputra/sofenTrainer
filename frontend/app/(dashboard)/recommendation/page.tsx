'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Brain, RefreshCw, CalendarX } from 'lucide-react';
import Button from '@/components/ui/Button';
import RecommendationCard from '@/components/RecommendationCard';
import { SkeletonCard } from '@/components/ui/LoadingSpinner';
import Card from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { getRecommendations } from '@/lib/recommendationService';
import type { RecommendationItem, RecommendationResponse } from '@/lib/types';

export default function RecommendationPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [data, setData] = useState<RecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await getRecommendations(user?.id || 1);
      setData(res);
    } catch {
      setError('Gagal memuat rekomendasi. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBook = (rec: RecommendationItem) => {
    const params = new URLSearchParams({
      scheduleDay: rec.day,
      scheduleTime: rec.startTime,
    });
    router.push(`/booking?${params.toString()}`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
              Rekomendasi AI
            </h1>
            <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 border border-indigo-500/20 text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
              Gemini
            </span>
          </div>
          <p className="text-gray-400 text-sm">
            Jadwal latihan yang dipersonalisasi berdasarkan kebiasaanmu
          </p>
        </div>

        <Button variant="secondary" size="sm" onClick={fetchRecommendations} disabled={isLoading}>
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      {/* ─── AI Info Banner ─── */}
      <Card className="mb-8 flex items-start gap-4 border-indigo-500/15 bg-indigo-500/5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shrink-0">
          <Brain size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white mb-1">Ditenagai Google Gemini</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            AI menganalisis riwayat booking, hari favorit, waktu latihan, dan durasi rata-rata kamu untuk
            memberikan rekomendasi jadwal yang optimal. Semakin banyak sesi yang kamu selesaikan, semakin akurat rekomendasinya.
          </p>
        </div>
      </Card>

      {/* ─── Loading State ─── */}
      {isLoading && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Sparkles size={18} className="text-indigo-400 animate-pulse" />
            <span className="text-sm text-indigo-300 animate-pulse">
              AI sedang menganalisis kebiasaan latihanmu...
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      )}

      {/* ─── Error State ─── */}
      {!isLoading && error && (
        <Card className="text-center py-10">
          <p className="text-red-400 mb-4">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchRecommendations}>
            Coba Lagi
          </Button>
        </Card>
      )}

      {/* ─── Empty State ─── */}
      {!isLoading && !error && data && data.recommendations.length === 0 && (
        <Card className="text-center py-16">
          <CalendarX size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Belum Ada Data</h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto mb-6">
            Lakukan beberapa booking dan selesaikan sesi latihanmu terlebih dahulu agar AI bisa mempelajari kebiasaanmu dan memberikan rekomendasi yang akurat.
          </p>
          <Button variant="primary" size="md" onClick={() => router.push('/booking')}>
            Buat Booking Pertama
          </Button>
        </Card>
      )}

      {/* ─── Recommendations Grid ─── */}
      {!isLoading && !error && data && data.recommendations.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {data.recommendations.map((rec, i) => (
            <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
              <RecommendationCard
                recommendation={rec}
                onBook={handleBook}
                index={i}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
