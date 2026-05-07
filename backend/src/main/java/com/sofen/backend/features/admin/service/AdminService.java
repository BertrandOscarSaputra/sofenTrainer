package com.sofen.backend.features.admin.service;

import com.sofen.backend.features.admin.dto.request.CreateTrainerRequest;
import com.sofen.backend.features.admin.dto.response.TrainerManagementResponse;
import java.util.List;

public interface AdminService {
    TrainerManagementResponse createTrainer(CreateTrainerRequest request);

    TrainerManagementResponse updateTrainerStatus(Long trainerId, Boolean isActive);

    List<TrainerManagementResponse> getAllTrainers();

    TrainerManagementResponse getTrainerById(Long trainerId);

    void deleteTrainer(Long trainerId);
}
