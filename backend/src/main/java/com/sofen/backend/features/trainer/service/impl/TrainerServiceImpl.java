package com.sofen.backend.features.trainer.service.impl;

import com.sofen.backend.common.exception.DuplicateResourceException;
import com.sofen.backend.common.exception.ResourceNotFoundException;
import com.sofen.backend.domain.entity.Trainer;
import com.sofen.backend.domain.entity.User;
import com.sofen.backend.domain.enums.UserRole;
import com.sofen.backend.features.trainer.dto.request.CreateTrainerRequest;
import com.sofen.backend.features.trainer.dto.request.UpdateTrainerRequest;
import com.sofen.backend.features.trainer.dto.response.TrainerResponse;
import com.sofen.backend.features.trainer.service.TrainerService;
import com.sofen.backend.repository.TrainerRepository;
import com.sofen.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TrainerServiceImpl implements TrainerService {

    private final TrainerRepository trainerRepository;
    private final UserRepository userRepository;

    @Override
    public List<TrainerResponse> getAllActiveTrainers() {
        return trainerRepository.findByIsActiveTrue().stream()
                .map(TrainerResponse::from)
                .toList();
    }

    @Override
    public TrainerResponse getTrainerById(Long id) {
        Trainer trainer = trainerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer tidak ditemukan dengan ID: " + id));
        return TrainerResponse.from(trainer);
    }

    @Override
    @Transactional
    public TrainerResponse createTrainer(CreateTrainerRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User tidak ditemukan dengan ID: " + request.getUserId()));

        if (user.getRole() != UserRole.TRAINER) {
            throw new IllegalArgumentException("User harus memiliki role TRAINER untuk membuat profil trainer");
        }

        trainerRepository.findByUserId(user.getId()).ifPresent(existing -> {
            throw new DuplicateResourceException("User ini sudah memiliki profil trainer");
        });

        Trainer trainer = new Trainer();
        trainer.setUser(user);
        trainer.setBio(request.getBio());
        trainer.setSpecialty(request.getSpecialty());

        Trainer savedTrainer = trainerRepository.save(trainer);
        return TrainerResponse.from(savedTrainer);
    }

    @Override
    @Transactional
    public TrainerResponse updateTrainer(Long id, UpdateTrainerRequest request) {
        Trainer trainer = trainerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer tidak ditemukan dengan ID: " + id));

        if (request.getBio() != null) {
            trainer.setBio(request.getBio());
        }

        if (request.getSpecialty() != null) {
            trainer.setSpecialty(request.getSpecialty());
        }

        if (request.getIsActive() != null) {
            trainer.setIsActive(request.getIsActive());
        }

        Trainer savedTrainer = trainerRepository.save(trainer);
        return TrainerResponse.from(savedTrainer);
    }
}
