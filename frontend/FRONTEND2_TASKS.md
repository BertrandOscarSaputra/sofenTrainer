# 📋 FRONTEND 2 — TASK LIST & PROGRESS TRACKER

> **Peran:** Menghubungkan UI ke backend — bukan bikin UI, tapi bikin data benar-benar masuk & keluar dari backend.
> **Branch:** `frontend_sharon`
> **Base URL Backend:** `http://localhost:3535` (atau sesuai `.env` → `NEXT_PUBLIC_API_URL`)

---

## 📁 FILE PENTING YANG KAMU KELOLA

| File | Lokasi | Fungsi |
|------|--------|--------|
| `api.ts` | `frontend/lib/api.ts` | Axios instance + interceptor JWT |
| `auth.ts` | `frontend/lib/auth.ts` | Helper simpan/ambil token dari localStorage |
| `bookingService.ts` | `frontend/lib/bookingService.ts` | Semua fungsi booking, trainer, schedule |
| `recommendationService.ts` | `frontend/lib/recommendationService.ts` | Fungsi ambil rekomendasi AI |
| `AuthContext.tsx` | `frontend/context/AuthContext.tsx` | Global state login/logout |
| `types.ts` | `frontend/lib/types.ts` | Semua TypeScript types |

---

## ✅ CHECKLIST TASK (CENTANG KALAU SUDAH SELESAI)

---

### 🔐 TASK 1 — LOGIN & AUTH FLOW
> **File:** `AuthContext.tsx`, `api.ts`
> **Status:** `[x] Selesai`

- [x] **1.1** Pastikan `USE_MOCK = false` di `AuthContext.tsx`
- [x] **1.2** Test login dengan akun real → `POST /auth/login`
  - Endpoint: `POST /auth/login`
  - Body: `{ email, password }`
  - Response: `{ data: { accessToken, user } }`
- [x] **1.3** Token tersimpan di `localStorage` dengan key `traino_token`
- [x] **1.4** User tersimpan di `localStorage` dengan key `traino_user`
- [x] **1.5** Setelah login → redirect ke `/dashboard`
- [x] **1.6** Token otomatis terpasang di setiap request (sudah ada di `api.ts`)
- [x] **1.7** Kalau token expired → auto redirect ke `/login` (sudah ada di interceptor)
- [x] **1.8** Tambahkan **pesan error** kalau login gagal (tampilkan di UI, bukan hanya console)
- [x] **1.9** Test REGISTER → `POST /auth/register`

---

### 👤 TASK 2 — TAMPILKAN DATA TRAINER
> **File:** `bookingService.ts` → fungsi `getTrainers()`
> **Status:** `[x] Selesai`

- [x] **2.1** Pastikan `USE_MOCK = false` di `bookingService.ts`
- [x] **2.2** Test `GET /api/trainers` → muncul daftar trainer dari database
- [x] **2.3** TrainerCard menampilkan: nama, bio, specialty, rating
- [x] **2.4** Kalau backend error → tampilkan pesan error yang ramah ke user

**Endpoint yang dipakai:**
```
GET /api/trainers          → semua trainer aktif
GET /api/trainers/{id}     → detail 1 trainer
```

---

### 📅 TASK 3 — TAMPILKAN SCHEDULE TRAINER
> **File:** `bookingService.ts` → fungsi `getTrainerSchedules(trainerId)`
> **Status:** `[x] Selesai`

- [x] **3.1** Saat user klik trainer → load schedules dari `GET /api/schedules/trainer/{id}`
- [x] **3.2** Tampilkan slot waktu dengan status: `AVAILABLE` / `BOOKED`
- [x] **3.3** Slot yang sudah `BOOKED` → disable tombolnya (tidak bisa diklik)
- [x] **3.4** Kalau tidak ada schedule → tampilkan pesan "Tidak ada jadwal tersedia"

**Endpoint yang dipakai:**
```
GET /api/schedules/trainer/{trainerId}   → semua jadwal trainer tertentu
```

---

### 📌 TASK 4 — BOOKING TRAINER ⭐ (PALING PENTING)
> **File:** `bookingService.ts` → fungsi `createBooking(data)`
> **Status:** `[x] Selesai`

- [x] **4.1** Saat user klik "Book" → kirim `POST /api/bookings`
- [x] **4.2** Request body benar:
  ```json
  {
    "trainerId": 2,
    "scheduleId": 5,
    "bookedAt": "2026-05-06T11:45:00.000Z",
    "durationMinutes": 60,
    "notes": "Catatan opsional"
  }
  ```
- [x] **4.3** Setelah booking berhasil → tampilkan notifikasi sukses (layar "Booking Berhasil! 🎉")
- [x] **4.4** Setelah booking berhasil → redirect ke halaman dashboard setelah 2 detik
- [x] **4.5** Kalau booking gagal → tampilkan pesan error yang jelas di form
- [ ] **4.6** Test booking benar-benar masuk ke database (cek di backend) ← **test manual**

**Endpoint yang dipakai:**
```
POST   /api/bookings          → buat booking baru
GET    /api/bookings          → daftar booking aktif user (PENDING/CONFIRMED)
GET    /api/bookings/{id}     → detail booking
DELETE /api/bookings/{id}     → cancel booking
PATCH  /api/bookings/{id}/done → tandai selesai
```

---

### 📊 TASK 5 — DASHBOARD (LIHAT BOOKING USER)
> **File:** `bookingService.ts` → fungsi `getBookings()`
> **Status:** `[x] Selesai`

- [x] **5.1** Dashboard menampilkan daftar booking aktif user (`GET /api/bookings`)
- [x] **5.2** Tampilkan: nama trainer, jadwal, status booking
- [x] **5.3** Tombol **Cancel** → memanggil `DELETE /api/bookings/{id}`
- [x] **5.4** Tombol **Tandai Selesai** → memanggil `PATCH /api/bookings/{id}/done`
- [x] **5.5** Setelah cancel/done → list otomatis refresh (optimistic update)
- [x] **5.6** Tampilkan **Riwayat Booking** dari `GET /api/booking-history/user/{userId}`

---

### 🤖 TASK 6 — REKOMENDASI AI
> **File:** `recommendationService.ts` → fungsi `getRecommendations(userId)`
> **Status:** `[x] Selesai`

- [x] **6.1** Pastikan `USE_MOCK = false` di `recommendationService.ts`
- [x] **6.2** Halaman rekomendasi memanggil `GET /api/recommendations/{userId}`
- [x] **6.3** Tampilkan: hari, jam, durasi, tipe latihan, alasan AI
- [x] **6.4** Fitur **Chat AI** → `POST /api/recommendations/chat`
  - Input pesan user + jadwal saat ini dikirim ke backend
  - Balasan AI + jadwal yang diperbarui tampil di UI
  - Loading indicator (animasi titik-titik) saat AI memproses
- [x] **6.5** Loading state ditampilkan saat AI sedang generate

---

### 🧹 TASK 7 — CLEANUP & KONSISTENSI
> **Status:** `[x] Selesai`

- [x] **7.1** Hanya ada **1 axios instance** → `frontend/lib/api.ts`
- [x] **7.2** Hanya ada **1 AuthContext** → `frontend/context/AuthContext.tsx`
- [x] **7.3** Semua halaman pakai `useContext(AuthContext)` via `hooks/useAuth.ts`
- [x] **7.4** Tidak ada `console.log` / `console.error` di seluruh kode
- [x] **7.5** Semua `USE_MOCK` sudah di-set `false`

---

### 🚨 TASK 8 — HANDLE ERROR
> **Status:** `[x] Selesai`

- [x] **8.1** Login gagal → tampilkan pesan dari server (atau "Email atau password salah")
- [x] **8.2** Register gagal → tampilkan pesan error dari server
- [x] **8.3** Booking gagal → pesan error tampil di form konfirmasi
- [x] **8.4** Network error → tampilkan: *"Tidak dapat terhubung ke server. Pastikan backend sudah berjalan."* via `getErrorMessage()` di `lib/api.ts`
- [x] **8.5** Loading state di semua tombol submit (disable + spinner)

---

## 🧪 FULL FLOW TEST (WAJIB SEBELUM PUSH)

Jalankan ini urutan sesuai nomor:

| # | Action | Expected Result |
|---|--------|----------------|
| 1 | Buka `http://localhost:3000` | Redirect ke `/login` |
| 2 | Login dengan akun valid | Redirect ke `/dashboard` |
| 3 | Buka halaman Booking | Tampil daftar trainer dari DB |
| 4 | Klik trainer → lihat jadwal | Tampil slot AVAILABLE/BOOKED |
| 5 | Klik "Book" slot tersedia | Muncul notifikasi sukses |
| 6 | Buka Dashboard | Booking baru muncul di list |
| 7 | Cancel booking | Booking hilang dari list aktif |
| 8 | Buka halaman Rekomendasi | AI generate jadwal dari history |
| 9 | Logout | Token hapus, redirect ke login |

---

## ⚠️ MASALAH UMUM & SOLUSINYA

| Error | Penyebab | Solusi |
|-------|----------|--------|
| `401 Unauthorized` | Token tidak terpasang / expired | Cek `api.ts` interceptor, cek `localStorage` |
| `CORS Error` | Backend belum allow origin frontend | Minta Backend dev tambah CORS config |
| `404 Not Found` | Endpoint salah | Cek `API_DOCUMENTATION.md` di root project |
| `Network Error` | Backend tidak jalan | Jalankan backend di port `3535` |
| Data tidak muncul | `USE_MOCK` masih `true` | Set `USE_MOCK = false` di service file |

---

## 🔄 COMMIT & PUSH

Setelah semua task selesai:

```bash
git add .
git commit -m "feat: connect frontend to real API - auth, booking, recommendation"
git push origin frontend_sharon
```

---

## 📞 KONTAK JIKA BUTUH BANTUAN

- **Endpoint tidak ada / berbeda** → tanya **Backend Developer**
- **UI tidak sesuai desain** → tanya **Frontend 1**
- **Data tidak masuk DB** → debugging bersama **Backend Developer**

---

*Last updated: 2026-05-06*
*Branch: `frontend_sharon`*
