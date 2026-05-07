'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, Search } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TrainerCard from '@/components/TrainerCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { Trainer, Schedule } from '@/lib/types';
import { getTrainers, createBooking } from '@/lib/bookingService';
import { getErrorMessage } from '@/lib/api';



function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState(1);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState(60);
  const [isLoadingTrainers, setIsLoadingTrainers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [trainerError, setTrainerError] = useState('');
  const [scheduleError, setScheduleError] = useState('');
  const [bookingError, setBookingError] = useState('');

  // Load trainers
  useEffect(() => {
    (async () => {
      setIsLoadingTrainers(true);
      setTrainerError('');
      try {
        const data = await getTrainers();
        setTrainers(data);

        // Auto-select trainer from query params (from recommendation flow)
        const trainerId = searchParams.get('trainerId');
        if (trainerId) {
          const trainer = data.find((t) => t.id === Number(trainerId));
          if (trainer) {
            setSelectedTrainer(trainer);
            setStep(2);
          }
        }
      } catch (err: unknown) {
        setTrainerError(getErrorMessage(err, 'Gagal memuat daftar trainer. Pastikan backend sudah berjalan.'));
      } finally {
        setIsLoadingTrainers(false);
      }
    })();
  }, [searchParams]);

  // Load schedules is no longer needed for selection step
  // but we can keep the state if we want to show trainer availability info later.
  // For now, removing the automatic fetch to keep it simple.

  const handleSelectTrainer = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setSelectedDateTime('');
    setStep(2);
  };

  const handleNextStep = () => {
    if (step === 2 && !selectedDateTime) {
      setScheduleError('Silakan pilih tanggal dan waktu latihan');
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    if (!selectedTrainer || !selectedDateTime) return;
    setIsSubmitting(true);
    setBookingError('');
    try {
      await createBooking({
        trainerId: selectedTrainer.id,
        scheduledAt: new Date(selectedDateTime).toISOString(),
        durationMinutes: duration,
        notes: notes.trim() || undefined,
      });
      setIsSuccess(true);
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err: unknown) {
      setBookingError(getErrorMessage(err, 'Booking gagal. Jadwal mungkin sudah dipesan orang lain. Silakan pilih jadwal lain.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTrainers = trainers.filter(
    (t) =>
      (t.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (t.specialty?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  // ─── Success screen ───
  if (isSuccess) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 animate-slide-up">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
          <Check size={40} className="text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Booking Berhasil! 🎉
        </h2>
        <p className="text-gray-400 mb-2">
          Sesi latihan dengan <span className="text-white font-medium">{selectedTrainer?.name}</span> telah dibooking.
        </p>
        <p className="text-sm text-gray-500">Mengalihkan ke dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* ─── Header ─── */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
          Booking Latihan
        </h1>
        <p className="text-gray-400 text-sm">Pilih trainer dan jadwal yang sesuai untukmu</p>
      </div>

      {/* ─── Progress Indicator ─── */}
      <div className="flex items-center gap-3 mb-10">
        {[
          { num: 1, label: 'Pilih Trainer' },
          { num: 2, label: 'Pilih Jadwal' },
          { num: 3, label: 'Konfirmasi' },
        ].map((s, i) => (
          <React.Fragment key={s.num}>
            <button
              onClick={() => {
                if (s.num < step) setStep(s.num);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                step === s.num
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                  : step > s.num
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-white/5 text-gray-500 border border-white/5'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step > s.num
                    ? 'bg-emerald-500 text-white'
                    : step === s.num
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white/10 text-gray-500'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < 2 && (
              <div className={`flex-1 h-[1px] ${step > s.num ? 'bg-emerald-500/30' : 'bg-white/10'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ═══ STEP 1: Pilih Trainer ═══ */}
      {step === 1 && (
        <div className="animate-fade-in">
          {/* Search */}
          <div className="relative mb-6">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari trainer berdasarkan nama atau spesialisasi..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all text-sm"
            />
          </div>

          {isLoadingTrainers ? (
            <div className="py-20">
              <LoadingSpinner size="lg" label="Memuat trainer..." />
            </div>
          ) : trainerError ? (
            <Card className="text-center py-10">
              <p className="text-red-400 mb-3">⚠️ {trainerError}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-sm text-indigo-400 hover:text-indigo-300 underline transition-colors"
              >
                Coba lagi
              </button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTrainers.map((trainer) => (
                <TrainerCard
                  key={trainer.id}
                  trainer={trainer}
                  onSelect={handleSelectTrainer}
                  isSelected={selectedTrainer?.id === trainer.id}
                />
              ))}
            </div>
          )}

          {!isLoadingTrainers && !trainerError && filteredTrainers.length === 0 && (
            <Card className="text-center py-10">
              <p className="text-gray-400">Tidak ada trainer yang cocok dengan pencarian &ldquo;{searchQuery}&rdquo;</p>
            </Card>
          )}
        </div>
      )}

      {/* ═══ STEP 2: Pilih Jadwal ═══ */}
      {step === 2 && selectedTrainer && (
        <div className="animate-fade-in">
          {/* Selected trainer info */}
          <Card className="mb-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center border border-white/10">
              <span className="text-lg font-bold text-indigo-400">
                {selectedTrainer.name?.[0] || '?'}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">{selectedTrainer.name}</p>
              <p className="text-xs text-indigo-400">{selectedTrainer.specialty}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
              Ganti
            </Button>
          </Card>

          <h3 className="text-lg font-semibold text-white mb-4">Pilih Tanggal & Waktu Latihan</h3>

          <Card className="p-8 border border-white/10 bg-white/5">
            <div className="max-w-md mx-auto space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Tanggal dan Jam Sesi
                </label>
                <input
                  type="datetime-local"
                  value={selectedDateTime}
                  onChange={(e) => setSelectedDateTime(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
                />
                <p className="mt-2 text-xs text-gray-500 italic">
                  * Pilih waktu yang sesuai dengan ketersediaan Anda dan trainer.
                </p>
              </div>

              {scheduleError && (
                <p className="text-sm text-red-400">⚠️ {scheduleError}</p>
              )}

              <Button 
                variant="primary" 
                className="w-full" 
                onClick={handleNextStep}
                disabled={!selectedDateTime}
              >
                Lanjutkan Ke Konfirmasi
                <ArrowRight size={18} />
              </Button>
            </div>
          </Card>

          <div className="flex justify-between mt-8">
            <Button variant="ghost" onClick={() => setStep(1)}>
              <ArrowLeft size={18} />
              Kembali
            </Button>
          </div>
        </div>
      )}

      {/* ═══ STEP 3: Konfirmasi ═══ */}
      {step === 3 && selectedTrainer && selectedDateTime && (
        <div className="animate-fade-in max-w-lg mx-auto">
          <Card glow className="p-8">
            <h3 className="text-xl font-bold text-white mb-6 text-center" style={{ fontFamily: 'var(--font-heading)' }}>
              Konfirmasi Booking
            </h3>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-sm text-gray-400">Trainer</span>
                <span className="text-sm font-semibold text-white">{selectedTrainer.name}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-sm text-gray-400">Spesialisasi</span>
                <span className="text-sm text-indigo-400">{selectedTrainer.specialty}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-sm text-gray-400">Waktu Latihan</span>
                <span className="text-sm font-semibold text-white text-right">
                  {new Date(selectedDateTime).toLocaleString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-sm text-gray-400">Durasi Terpilih</span>
                <span className="text-sm font-semibold text-white">{duration} menit</span>
              </div>
            </div>

            {/* ─── Pilihan Durasi ─── */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Durasi Latihan
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[30, 60, 90, 120].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDuration(mins)}
                    className={`py-2 px-1 text-xs font-semibold rounded-lg border transition-all ${
                      duration === mins
                        ? 'bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/20'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            {/* ─── Catatan / Notes ─── */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Catatan <span className="text-gray-500">(opsional)</span>
              </label>
              <textarea
                id="booking-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Saya ingin fokus pada latihan kaki..."
                rows={3}
                maxLength={300}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all text-sm resize-none"
              />
              <p className="text-xs text-gray-600 mt-1 text-right">{notes.length}/300</p>
            </div>

            {bookingError && (
              <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                ⚠️ {bookingError}
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => setStep(2)}>
                <ArrowLeft size={18} />
                Kembali
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleSubmit}
                isLoading={isSubmitting}
              >
                Konfirmasi
                <ArrowRight size={18} />
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="py-20"><LoadingSpinner size="lg" label="Memuat..." /></div>}>
      <BookingContent />
    </Suspense>
  );
}
