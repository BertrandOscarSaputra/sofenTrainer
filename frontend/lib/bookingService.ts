import api from './api';
import type { Booking, BookingRequest, Trainer, Schedule } from './types';

// ─── Mock Data (fallback untuk development tanpa backend) ───
const MOCK_TRAINERS: Trainer[] = [
  { id: 1, userId: 2, name: 'Budi Santoso', bio: 'Certified personal trainer dengan 5 tahun pengalaman di bidang strength training dan functional fitness.', specialty: 'Strength Training', rating: 4.8 },
  { id: 2, userId: 3, name: 'Sari Dewi', bio: 'Spesialis yoga dan pilates, membantu klien mencapai keseimbangan tubuh dan pikiran.', specialty: 'Yoga & Pilates', rating: 4.9 },
  { id: 3, userId: 4, name: 'Andi Pratama', bio: 'Mantan atlet marathon, spesialis cardio dan endurance training untuk semua level.', specialty: 'Cardio & Endurance', rating: 4.7 },
  { id: 4, userId: 5, name: 'Maya Lestari', bio: 'CrossFit level 2 trainer, fokus pada high intensity interval training dan body transformation.', specialty: 'CrossFit & HIIT', rating: 4.6 },
  { id: 5, userId: 6, name: 'Rudi Hermawan', bio: 'Ahli rehabilitasi cedera dan mobility training, membantu recovery pasca cedera olahraga.', specialty: 'Rehabilitation', rating: 4.8 },
  { id: 6, userId: 7, name: 'Dina Safitri', bio: 'Pelatih boxing dan muay thai, menggabungkan martial arts dengan fitness untuk latihan menyenangkan.', specialty: 'Boxing & Martial Arts', rating: 4.5 },
];

const MOCK_SCHEDULES: Schedule[] = [
  { id: 1, trainerId: 1, dayOfWeek: 'MONDAY', startTime: '07:00', endTime: '08:00', status: 'AVAILABLE' },
  { id: 2, trainerId: 1, dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '10:00', status: 'BOOKED' },
  { id: 3, trainerId: 1, dayOfWeek: 'WEDNESDAY', startTime: '07:00', endTime: '08:00', status: 'AVAILABLE' },
  { id: 4, trainerId: 1, dayOfWeek: 'FRIDAY', startTime: '16:00', endTime: '17:00', status: 'AVAILABLE' },
  { id: 5, trainerId: 2, dayOfWeek: 'TUESDAY', startTime: '08:00', endTime: '09:00', status: 'AVAILABLE' },
  { id: 6, trainerId: 2, dayOfWeek: 'THURSDAY', startTime: '10:00', endTime: '11:00', status: 'AVAILABLE' },
  { id: 7, trainerId: 2, dayOfWeek: 'SATURDAY', startTime: '07:00', endTime: '08:00', status: 'AVAILABLE' },
  { id: 8, trainerId: 3, dayOfWeek: 'MONDAY', startTime: '06:00', endTime: '07:00', status: 'AVAILABLE' },
  { id: 9, trainerId: 3, dayOfWeek: 'WEDNESDAY', startTime: '17:00', endTime: '18:00', status: 'BOOKED' },
  { id: 10, trainerId: 3, dayOfWeek: 'FRIDAY', startTime: '06:00', endTime: '07:00', status: 'AVAILABLE' },
  { id: 11, trainerId: 4, dayOfWeek: 'TUESDAY', startTime: '16:00', endTime: '17:00', status: 'AVAILABLE' },
  { id: 12, trainerId: 4, dayOfWeek: 'THURSDAY', startTime: '16:00', endTime: '17:00', status: 'AVAILABLE' },
  { id: 13, trainerId: 5, dayOfWeek: 'MONDAY', startTime: '10:00', endTime: '11:00', status: 'AVAILABLE' },
  { id: 14, trainerId: 5, dayOfWeek: 'WEDNESDAY', startTime: '10:00', endTime: '11:00', status: 'AVAILABLE' },
  { id: 15, trainerId: 6, dayOfWeek: 'SATURDAY', startTime: '09:00', endTime: '10:00', status: 'AVAILABLE' },
  { id: 16, trainerId: 6, dayOfWeek: 'SUNDAY', startTime: '09:00', endTime: '10:00', status: 'AVAILABLE' },
];

const MOCK_BOOKINGS: Booking[] = [
  { id: 1, userId: 1, trainerId: 1, scheduleId: 2, bookedAt: '2026-05-05T09:00:00', durationMinutes: 60, status: 'CONFIRMED', trainer: MOCK_TRAINERS[0], schedule: MOCK_SCHEDULES[1] },
  { id: 2, userId: 1, trainerId: 2, scheduleId: 5, bookedAt: '2026-05-03T08:00:00', durationMinutes: 60, status: 'DONE', trainer: MOCK_TRAINERS[1], schedule: MOCK_SCHEDULES[4] },
  { id: 3, userId: 1, trainerId: 3, scheduleId: 9, bookedAt: '2026-05-01T17:00:00', durationMinutes: 60, status: 'DONE', trainer: MOCK_TRAINERS[2], schedule: MOCK_SCHEDULES[8] },
];

const USE_MOCK = false; // Set false saat backend sudah aktif

// ─── Trainers ───────────────────────────────────────────────
export async function getTrainers(): Promise<Trainer[]> {
  if (USE_MOCK) return MOCK_TRAINERS;
  const res = await api.get<Trainer[]>('/api/trainers');
  return res.data;
}

// ─── Schedules ──────────────────────────────────────────────
export async function getTrainerSchedules(trainerId: number): Promise<Schedule[]> {
  if (USE_MOCK) return MOCK_SCHEDULES.filter((s) => s.trainerId === trainerId);
  // Note: GET schedules for trainer endpoint might need validation in backend
  const res = await api.get<Schedule[]>(`/api/schedules/trainer/${trainerId}`);
  return res.data;
}

// ─── Bookings ───────────────────────────────────────────────
export async function getBookings(): Promise<Booking[]> {
  if (USE_MOCK) return MOCK_BOOKINGS;
  const res = await api.get<Booking[]>('/api/bookings');
  return res.data;
}

export async function getBookingById(id: number): Promise<Booking> {
  if (USE_MOCK) {
    const found = MOCK_BOOKINGS.find((b) => b.id === id);
    if (!found) throw new Error('Booking not found');
    return found;
  }
  const res = await api.get<Booking>(`/api/bookings/${id}`);
  return res.data;
}

export async function createBooking(data: BookingRequest): Promise<Booking> {
  if (USE_MOCK) {
    const newBooking: Booking = {
      id: Date.now(),
      userId: 1,
      trainerId: data.trainerId,
      scheduleId: data.scheduleId,
      scheduledAt: data.scheduledAt,
      bookedAt: new Date().toISOString(),
      durationMinutes: data.durationMinutes || 60,
      status: 'PENDING',
      trainer: MOCK_TRAINERS.find((t) => t.id === data.trainerId),
      schedule: data.scheduleId ? MOCK_SCHEDULES.find((s) => s.id === data.scheduleId) : undefined,
    };
    MOCK_BOOKINGS.push(newBooking);
    return newBooking;
  }
  const res = await api.post<Booking>('/api/bookings', data);
  return res.data;
}

export async function cancelBooking(id: number): Promise<void> {
  if (USE_MOCK) {
    const booking = MOCK_BOOKINGS.find((b) => b.id === id);
    if (booking) booking.status = 'CANCELLED';
    return;
  }
  await api.delete(`/api/bookings/${id}`);
}

export async function markBookingDone(id: number): Promise<void> {
  if (USE_MOCK) {
    const booking = MOCK_BOOKINGS.find((b) => b.id === id);
    if (booking) booking.status = 'DONE';
    return;
  }
  await api.patch(`/api/bookings/${id}/done`);
}

export async function getTrainerBookings(): Promise<Booking[]> {
  if (USE_MOCK) return MOCK_BOOKINGS;
  const res = await api.get<Booking[]>('/api/bookings/trainer');
  return res.data;
}

export async function updateBookingStatus(id: number, newStatus: string): Promise<Booking> {
  if (USE_MOCK) {
    const booking = MOCK_BOOKINGS.find((b) => b.id === id);
    if (booking) booking.status = newStatus;
    return booking as Booking;
  }
  const res = await api.patch<Booking>(`/api/bookings/${id}/status`, null, {
    params: { newStatus }
  });
  return res.data;
}

// ─── Booking History ─────────────────────────────────────────
// Endpoint terpisah: riwayat sesi 3 bulan terakhir (status DONE)
export async function getBookingHistory(userId: number): Promise<Booking[]> {
  if (USE_MOCK) {
    return MOCK_BOOKINGS.filter((b) => b.status === 'DONE');
  }
  const res = await api.get<Booking[]>(`/api/booking-history/user/${userId}`);
  return res.data;
}
