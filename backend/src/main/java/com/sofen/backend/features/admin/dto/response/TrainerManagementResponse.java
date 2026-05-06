package com.sofen.backend.features.admin.dto.response;

import com.sofen.backend.domain.entity.Trainer;
import com.sofen.backend.domain.entity.User;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TrainerManagementResponse(
        Long id,
        Long userId,
        String name,
        String email,
        String bio,
        String specialty,
        BigDecimal rating,
        Boolean isActive,
        String profilePictureUrl,
        LocalDateTime createdAt
) {
    public static TrainerManagementResponse from(Trainer trainer) {
        User user = trainer.getUser();
        return new TrainerManagementResponse(
                trainer.getId(),
                user.getId(),
                user.getName(),
                user.getEmail(),
                trainer.getBio(),
                trainer.getSpecialty(),
                trainer.getRating(),
                trainer.getIsActive(),
                trainer.getProfilePictureUrl() != null ? trainer.getProfilePictureUrl() : user.getProfilePictureUrl(),
                trainer.getCreatedAt()
        );
    }
}
