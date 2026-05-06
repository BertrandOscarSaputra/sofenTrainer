package com.sofen.backend.features.profile.service.impl;

import com.sofen.backend.common.exception.ResourceNotFoundException;
import com.sofen.backend.common.util.FileStorageService;
import com.sofen.backend.domain.entity.Trainer;
import com.sofen.backend.domain.entity.User;
import com.sofen.backend.features.profile.dto.response.ProfilePictureResponse;
import com.sofen.backend.features.profile.service.ProfileService;
import com.sofen.backend.repository.TrainerRepository;
import com.sofen.backend.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Slf4j
@Service
@Transactional
public class ProfileServiceImpl implements ProfileService {

    private final FileStorageService fileStorageService;
    private final UserRepository userRepository;
    private final TrainerRepository trainerRepository;

    public ProfileServiceImpl(
            FileStorageService fileStorageService,
            UserRepository userRepository,
            TrainerRepository trainerRepository) {
        this.fileStorageService = fileStorageService;
        this.userRepository = userRepository;
        this.trainerRepository = trainerRepository;
    }

    @Override
    public ProfilePictureResponse uploadUserProfilePicture(Long userId, MultipartFile file) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User tidak ditemukan dengan ID: " + userId));

            String pictureUrl = fileStorageService.uploadProfilePicture(file);
            user.setProfilePictureUrl(pictureUrl);
            userRepository.save(user);

            log.info("User profile picture uploaded: userId={}, url={}", userId, pictureUrl);
            return new ProfilePictureResponse(pictureUrl, "Foto profil berhasil diupload");
        } catch (IOException e) {
            log.error("Failed to upload user profile picture: userId={}", userId, e);
            throw new RuntimeException("Gagal mengupload foto profil: " + e.getMessage());
        }
    }

    @Override
    public ProfilePictureResponse uploadTrainerProfilePicture(Long trainerId, MultipartFile file) {
        try {
            Trainer trainer = trainerRepository.findById(trainerId)
                    .orElseThrow(() -> new ResourceNotFoundException("Trainer tidak ditemukan dengan ID: " + trainerId));

            String pictureUrl = fileStorageService.uploadProfilePicture(file);
            trainer.setProfilePictureUrl(pictureUrl);
            trainerRepository.save(trainer);

            log.info("Trainer profile picture uploaded: trainerId={}, url={}", trainerId, pictureUrl);
            return new ProfilePictureResponse(pictureUrl, "Foto profil trainer berhasil diupload");
        } catch (IOException e) {
            log.error("Failed to upload trainer profile picture: trainerId={}", trainerId, e);
            throw new RuntimeException("Gagal mengupload foto profil: " + e.getMessage());
        }
    }
}
