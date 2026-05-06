import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3535',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request interceptor: attach JWT token ──────────────────
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('traino_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor: handle 401 → redirect to login ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('traino_token');
      localStorage.removeItem('traino_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// ─── Utility: Ekstrak pesan error secara konsisten ───────────
// Dipakai di semua catch block di seluruh aplikasi.
//
// Logika:
//   - err.response === undefined  → backend tidak bisa diakses (network error)
//   - err.response.data.message   → pesan error dari backend
//   - fallback                    → pesan default yang diberikan
export function getErrorMessage(err: unknown, fallback: string): string {
  const axiosErr = err as {
    response?: { data?: { message?: string } };
    request?: unknown;
  };

  // Tidak ada response = server tidak bisa dijangkau
  if (axiosErr?.request && !axiosErr?.response) {
    return 'Tidak dapat terhubung ke server. Pastikan backend sudah berjalan.';
  }

  // Ada response = server merespons dengan error
  return axiosErr?.response?.data?.message || fallback;
}

