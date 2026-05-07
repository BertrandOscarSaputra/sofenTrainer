import api from "./api";
import type { Review, CreateReviewRequest } from "./types";

export const reviewService = {
  createReview: async (data: CreateReviewRequest): Promise<Review> => {
    const res = await api.post<Review>("/api/reviews", data);
    return res.data;
  },

  updateReview: async (
    bookingId: number,
    data: CreateReviewRequest,
  ): Promise<Review> => {
    const res = await api.put<Review>(
      `/api/reviews/booking/${bookingId}`,
      data,
    );
    return res.data;
  },

  getReviewsByTrainer: async (trainerId: number): Promise<Review[]> => {
    const res = await api.get<Review[]>(`/api/reviews/trainer/${trainerId}`);
    return res.data;
  },

  getReviewByBooking: async (bookingId: number): Promise<Review> => {
    const res = await api.get<Review>(`/api/reviews/booking/${bookingId}`);
    return res.data;
  },
};
