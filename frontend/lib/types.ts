// ============================================================
// SofenTrainer — Global TypeScript Interfaces
// ============================================================

// ─── User ───────────────────────────────────────────────────
export interface User {
  id: number;
  name: string;
  email: string;
  role: "ROLE_USER" | "ROLE_TRAINER" | "ROLE_ADMIN";
  profilePictureUrl?: string;
  createdAt?: string;
}

// ─── Trainer ────────────────────────────────────────────────
export interface Trainer {
  id: number;
  userId: number;
  name: string;
  bio: string;
  specialty: string;
  rating: number;
  avatarUrl?: string;
}

// ─── Schedule ───────────────────────────────────────────────
export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export type ScheduleStatus = "AVAILABLE" | "BOOKED" | "BLOCKED";

export interface Schedule {
  id: number;
  trainerId: number;
  dayOfWeek: DayOfWeek;
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  status: ScheduleStatus;
}

// ─── Booking ────────────────────────────────────────────────
export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "DONE";

export interface Booking {
  id: number;
  userId: number;
  trainerId: number;
  scheduleId?: number;
  scheduledAt: string;
  bookedAt: string;
  durationMinutes: number;
  status: BookingStatus;
  userName?: string;
  userProfilePictureUrl?: string;
  createdAt?: string;
  trainer?: Trainer;
  schedule?: Schedule;
  notes?: string;
}

// ─── Booking Request ────────────────────────────────────────
export interface BookingRequest {
  trainerId: number;
  scheduledAt: string;
  scheduleId?: number;
  durationMinutes?: number;
  notes?: string;
}

// ─── Auth ───────────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresAt: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ─── Recommendation (AI) ───────────────────────────────────
export interface RecommendationItem {
  day: string;
  startTime: string;
  duration: number;
  type: string;
  reason: string;
}

export interface RecommendationResponse {
  recommendations: RecommendationItem[];
}

// ─── AI Chat (Recommendation Chatbot) ─────────────────────
export interface ChatRequest {
  userId: number;
  message: string;
  currentSchedule: RecommendationItem[];
}

export interface ChatResponse {
  aiMessage: string;
  updatedSchedule: RecommendationItem[];
}

export interface ChatMessage {
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

// ─── Admin ──────────────────────────────────────────────────
export interface CreateTrainerRequest {
  name: string;
  email: string;
  password: string;
  bio?: string;
  specialty: string;
}

export interface TrainerManagementResponse {
  id: number;
  userId: number;
  name: string;
  email: string;
  bio: string;
  specialty: string;
  rating: number;
  isActive: boolean;
  profilePictureUrl?: string;
  createdAt: string;
}

// ─── Trainer ────────────────────────────────────────────────
export interface TrainerProfileResponse {
  id: number;
  userId: number;
  trainerName: string;
  email: string;
  bio: string;
  specialty: string;
  rating: number;
  isActive: boolean;
  profilePictureUrl?: string;
}

export type TrainerResponse = TrainerProfileResponse;

export interface ProfilePictureResponse {
  url: string;
  message: string;
}
