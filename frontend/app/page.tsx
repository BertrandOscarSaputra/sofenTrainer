'use client';

import React from 'react';
import Link from 'next/link';
import {
  Dumbbell,
  CalendarCheck,
  Sparkles,
  Clock,
  ArrowRight,
  Star,
  User,
  ChevronRight,
  Zap,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

// ─── Feature data ───────────────────────────────────────────
const features = [
  {
    icon: CalendarCheck,
    title: 'Booking Mudah',
    description: 'Pilih trainer, pilih jadwal, dan booking dalam hitungan detik. Tanpa ribet, tanpa antri.',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    icon: Sparkles,
    title: 'Rekomendasi AI',
    description: 'Google Gemini menganalisis kebiasaan latihanmu dan menyarankan jadwal optimal untuk minggu depan.',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Clock,
    title: 'Jadwal Fleksibel',
    description: 'Trainer menyediakan berbagai slot waktu. Pagi, siang, atau sore — semua tersedia.',
    gradient: 'from-emerald-500 to-teal-500',
  },
];

const steps = [
  { step: '01', title: 'Pilih Trainer', desc: 'Browse trainer berdasarkan spesialisasi dan rating.' },
  { step: '02', title: 'Pilih Jadwal', desc: 'Lihat slot waktu yang tersedia dan pilih yang cocok.' },
  { step: '03', title: 'Booking & Latihan', desc: 'Konfirmasi booking dan mulai sesi latihanmu!' },
];

const trainers = [
  { name: 'Budi Santoso', specialty: 'Strength Training', rating: 4.8 },
  { name: 'Sari Dewi', specialty: 'Yoga & Pilates', rating: 4.9 },
  { name: 'Andi Pratama', specialty: 'Cardio & Endurance', rating: 4.7 },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-radial opacity-60" />
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-indigo-500/10 blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-20 left-10 w-64 h-64 rounded-full bg-cyan-500/10 blur-[100px] animate-pulse-glow delay-500" />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8 animate-slide-up">
            <Zap size={14} className="text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
              Powered by Google Gemini AI
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 animate-slide-up delay-100" style={{ fontFamily: 'var(--font-heading)' }}>
            Latihan Lebih Cerdas{' '}
            <br />
            <span className="text-gradient">dengan AI</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up delay-200">
            Booking sesi latihan dengan trainer profesional. Dapatkan rekomendasi jadwal personal
            yang disesuaikan dengan kebiasaan dan pola latihanmu.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-300">
            <Link href="/register">
              <Button size="lg" variant="primary">
                Mulai Gratis
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="secondary">
                Sudah Punya Akun
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-md mx-auto mt-16 animate-slide-up delay-400">
            {[
              { value: '50+', label: 'Trainer' },
              { value: '1.2K', label: 'Sesi Selesai' },
              { value: '4.8', label: 'Rating' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Kenapa <span className="text-gradient">SofenTrainer</span>?
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto">
              Semua yang kamu butuhkan untuk mengatur jadwal latihan dengan efisien.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card key={feature.title} hover className="group animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon size={22} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-radial opacity-40" />
        <div className="relative max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Cara Kerjanya
            </h2>
            <p className="text-gray-400">3 langkah mudah untuk mulai latihan.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((item, i) => (
              <div key={item.step} className="relative animate-slide-up" style={{ animationDelay: `${i * 150}ms` }}>
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-[1px] bg-gradient-to-r from-indigo-500/30 to-transparent z-0" />
                )}
                <div className="relative text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-5">
                    <span className="text-2xl font-bold text-indigo-400" style={{ fontFamily: 'var(--font-heading)' }}>
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TRAINER SHOWCASE ═══ */}
      <section id="trainers" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Trainer <span className="text-gradient">Profesional</span>
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto">
              Trainer bersertifikat dengan pengalaman di berbagai bidang fitness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trainers.map((trainer, i) => (
              <Card key={trainer.name} hover className="text-center animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center mx-auto mb-4 border border-white/10">
                  <User size={32} className="text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{trainer.name}</h3>
                <p className="text-sm text-indigo-400 font-medium mb-3">{trainer.specialty}</p>
                <div className="flex items-center justify-center gap-1">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span className="text-sm font-semibold text-amber-400">{trainer.rating}</span>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/register">
              <Button variant="outline" size="lg">
                Lihat Semua Trainer
                <ChevronRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ CTA BOTTOM ═══ */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="text-center py-12 px-8 relative overflow-hidden glow-indigo">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10" />
            <div className="relative">
              <Dumbbell size={40} className="text-indigo-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                Siap Mulai Latihan?
              </h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Daftar sekarang dan biarkan AI membantu merencanakan jadwal latihan optimalmu.
              </p>
              <Link href="/register">
                <Button size="lg" variant="primary">
                  Daftar Gratis Sekarang
                  <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
