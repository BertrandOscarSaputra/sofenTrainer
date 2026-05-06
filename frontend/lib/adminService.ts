import api from "./api";
import type {
  ApiResponse,
  CreateTrainerRequest,
  TrainerManagementResponse,
} from "./types";

export const adminService = {
  // Create a new trainer
  async createTrainer(data: CreateTrainerRequest) {
    const res = await api.post<ApiResponse<TrainerManagementResponse>>(
      "/admin/trainers",
      data,
    );
    return res.data.data;
  },

  // Get all trainers
  async getAllTrainers() {
    const res =
      await api.get<ApiResponse<TrainerManagementResponse[]>>(
        "/admin/trainers",
      );
    return res.data.data;
  },

  // Get trainer by ID
  async getTrainerById(trainerId: number) {
    const res = await api.get<ApiResponse<TrainerManagementResponse>>(
      `/admin/trainers/${trainerId}`,
    );
    return res.data.data;
  },

  // Update trainer status
  async updateTrainerStatus(trainerId: number, isActive: boolean) {
    const res = await api.put<ApiResponse<TrainerManagementResponse>>(
      `/admin/trainers/${trainerId}/status`,
      {},
      { params: { isActive } },
    );
    return res.data.data;
  },

  // Delete trainer
  async deleteTrainer(trainerId: number) {
    await api.delete(`/admin/trainers/${trainerId}`);
  },
};
