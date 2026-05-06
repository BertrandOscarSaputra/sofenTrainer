import api from './api';
import type { RecommendationResponse, ChatRequest, ChatResponse } from './types';

// ─── Mock Data (fallback development) ───────────────────────
const MOCK_RECOMMENDATIONS: RecommendationResponse = {
  recommendations: [
    {
      day: 'Senin',
      startTime: '07:00',
      duration: 60,
      type: 'Strength Training',
      reason: 'Kamu sering booking sesi pagi hari Senin — momentum awal minggu yang bagus untuk membangun kekuatan.',
    },
    {
      day: 'Rabu',
      startTime: '07:00',
      duration: 60,
      type: 'Kardio',
      reason: 'Mid-week cardio membantu menjaga stamina. Waktu pagi sesuai pola kebiasaanmu.',
    },
    {
      day: 'Jumat',
      startTime: '16:00',
      duration: 60,
      type: 'Yoga & Stretching',
      reason: 'Sesi sore di akhir minggu untuk recovery dan fleksibilitas sebelum weekend.',
    },
    {
      day: 'Sabtu',
      startTime: '08:00',
      duration: 90,
      type: 'HIIT',
      reason: 'Weekend panjang — cocok untuk sesi intensif yang lebih lama. Kamu biasa aktif di hari Sabtu.',
    },
  ],
};

const USE_MOCK = false;

// ─── GET Recommendations ─────────────────────────────────────
// Endpoint: GET /api/recommendations/{userId}
export async function getRecommendations(userId: number): Promise<RecommendationResponse> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return MOCK_RECOMMENDATIONS;
  }
  const res = await api.get<RecommendationResponse>(`/api/recommendations/${userId}`);
  return res.data;
}

// ─── POST Chat (Adjust Schedule via Natural Language) ────────
// Endpoint: POST /api/recommendations/chat
// Body   : { userId, message, currentSchedule }
// Response: { aiMessage, updatedSchedule }
export async function sendChatMessage(payload: ChatRequest): Promise<ChatResponse> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return {
      aiMessage: `Baik! Saya sudah menyesuaikan jadwal berdasarkan permintaanmu: "${payload.message}".`,
      updatedSchedule: payload.currentSchedule,
    };
  }
  const res = await api.post<ChatResponse>('/api/recommendations/chat', payload);
  return res.data;
}
