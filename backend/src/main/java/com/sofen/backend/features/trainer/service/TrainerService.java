package com.sofen.backend.features.trainer.service;

import com.sofen.backend.features.trainer.dto.request.CreateTrainerRequest;
import com.sofen.backend.features.trainer.dto.request.UpdateTrainerRequest;
import com.sofen.backend.features.trainer.dto.response.TrainerResponse;

import java.util.List;

public interface TrainerService {
    List<TrainerResponse> getAllActiveTrainers();

    TrainerResponse getTrainerById(Long id);

    TrainerResponse createTrainer(CreateTrainerRequest request);

    TrainerResponse updateTrainer(Long id, UpdateTrainerRequest request);

    TrainerResponse getTrainerByUserId(Long userId);

    TrainerResponse updateTrainerByUserId(Long userId, UpdateTrainerRequest request);
}
