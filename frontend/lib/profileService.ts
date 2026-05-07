import api from "./api";
import type { ApiResponse, ProfilePictureResponse } from "./types";

export const profileService = {
  // Upload user profile picture
  async uploadUserProfilePicture(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post<ApiResponse<ProfilePictureResponse>>(
      "/profile/picture/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return res.data.data;
  },

  // Upload trainer profile picture
  async uploadTrainerProfilePicture(trainerId: number, file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post<ApiResponse<ProfilePictureResponse>>(
      `/profile/trainer/${trainerId}/picture/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return res.data.data;
  },
};
