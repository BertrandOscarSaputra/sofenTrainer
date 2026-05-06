import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'Traino — Booking Latihan + Rekomendasi AI',
  description:
    'Platform booking sesi latihan pribadi dengan trainer profesional dari Traino. Dilengkapi rekomendasi jadwal berbasis AI.',
  keywords: ['fitness', 'trainer', 'booking', 'AI', 'rekomendasi', 'latihan', 'gym', 'Traino'],
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
