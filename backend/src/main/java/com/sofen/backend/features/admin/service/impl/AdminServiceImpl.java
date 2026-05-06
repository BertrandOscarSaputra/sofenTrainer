package com.sofen.backend.features.admin.service.impl;

import com.sofen.backend.common.exception.DuplicateResourceException;
import com.sofen.backend.common.exception.ResourceNotFoundException;
import com.sofen.backend.domain.entity.Trainer;
import com.sofen.backend.domain.entity.User;
import com.sofen.backend.domain.enums.UserRole;
import com.sofen.backend.features.admin.dto.request.CreateTrainerRequest;
import com.sofen.backend.features.admin.dto.response.TrainerManagementResponse;
import com.sofen.backend.features.admin.service.AdminService;
import com.sofen.backend.repository.TrainerRepository;
import com.sofen.backend.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@Transactional
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final TrainerRepository trainerRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminServiceImpl(
            UserRepository userRepository,
            TrainerRepository trainerRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.trainerRepository = trainerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public TrainerManagementResponse createTrainer(CreateTrainerRequest request) {
        String email = request.email().trim().toLowerCase();

        // Check if email already exists
        userRepository.findByEmail(email).ifPresent(user -> {
            throw new DuplicateResourceException("Email sudah terdaftar");
        });

        // Create new user with TRAINER role
        User user = new User();
        user.setName(request.name().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(UserRole.TRAINER);

        User savedUser = userRepository.save(user);
        log.info("Created new user with TRAINER role: userId={}", savedUser.getId());

        // Create trainer profile
        Trainer trainer = new Trainer();
        trainer.setUser(savedUser);
        trainer.setBio(request.bio());
        trainer.setSpecialty(request.specialty());
        trainer.setIsActive(true);

        Trainer savedTrainer = trainerRepository.save(trainer);
        log.info("Created new trainer profile: trainerId={}", savedTrainer.getId());

        return TrainerManagementResponse.from(savedTrainer);
    }

    @Override
    public TrainerManagementResponse updateTrainerStatus(Long trainerId, Boolean isActive) {
        Trainer trainer = trainerRepository.findById(trainerId)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer tidak ditemukan dengan ID: " + trainerId));

        trainer.setIsActive(isActive);
        Trainer updatedTrainer = trainerRepository.save(trainer);
        log.info("Updated trainer status: trainerId={}, isActive={}", trainerId, isActive);

        return TrainerManagementResponse.from(updatedTrainer);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TrainerManagementResponse> getAllTrainers() {
        return trainerRepository.findAll().stream()
                .map(TrainerManagementResponse::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TrainerManagementResponse getTrainerById(Long trainerId) {
        Trainer trainer = trainerRepository.findById(trainerId)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer tidak ditemukan dengan ID: " + trainerId));

        return TrainerManagementResponse.from(trainer);
    }

    @Override
    public void deleteTrainer(Long trainerId) {
        Trainer trainer = trainerRepository.findById(trainerId)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer tidak ditemukan dengan ID: " + trainerId));

        User user = trainer.getUser();
        trainerRepository.delete(trainer);
        userRepository.delete(user);
        log.info("Deleted trainer and associated user: trainerId={}, userId={}", trainerId, user.getId());
    }
}
