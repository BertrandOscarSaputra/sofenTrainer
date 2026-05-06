import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'SofenTrainer — Booking Latihan + Rekomendasi AI',
  description:
    'Platform booking sesi latihan pribadi dengan trainer profesional. Dilengkapi rekomendasi jadwal berbasis AI yang mempelajari kebiasaan latihanmu.',
  keywords: ['fitness', 'trainer', 'booking', 'AI', 'rekomendasi', 'latihan', 'gym'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="min-h-screen bg-[#0A0F1E] text-gray-100 antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
