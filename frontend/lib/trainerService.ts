import api from "./api";
import type { ApiResponse, TrainerProfileResponse } from "./types";

export const trainerService = {
  // Get my trainer profile
  async getMyProfile() {
    const res = await api.get<TrainerResponse>("/api/trainers/profile");
    return res.data;
  },

  // Update trainer profile
  async updateProfile(data: any) {
    const res = await api.put<TrainerResponse>("/api/trainers/profile", data);
    return res.data;
  },
};
