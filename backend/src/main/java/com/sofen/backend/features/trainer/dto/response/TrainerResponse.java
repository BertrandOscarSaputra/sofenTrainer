package com.sofen.backend.features.trainer.dto.response;

import com.sofen.backend.domain.entity.Trainer;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class TrainerResponse {
    private Long id;
    private Long userId;
    private String trainerName;
    private String email;
    private String bio;
    private String specialty;
    private BigDecimal rating;
    private Boolean isActive;
    private LocalDateTime createdAt;

    public static TrainerResponse from(Trainer trainer) {
        return TrainerResponse.builder()
                .id(trainer.getId())
                .userId(trainer.getUser().getId())
                .trainerName(trainer.getUser().getName())
                .email(trainer.getUser().getEmail())
                .bio(trainer.getBio())
                .specialty(trainer.getSpecialty())
                .rating(trainer.getRating())
                .isActive(trainer.getIsActive())
                .createdAt(trainer.getCreatedAt())
                .build();
    }
}
