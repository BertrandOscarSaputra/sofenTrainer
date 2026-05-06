import api from "./api";
import type { ApiResponse, TrainerProfileResponse } from "./types";

export const trainerService = {
  // Get my trainer profile
  async getMyProfile() {
    const res =
      await api.get<ApiResponse<TrainerProfileResponse>>("/trainer/profile");
    return res.data.data;
  },
};
