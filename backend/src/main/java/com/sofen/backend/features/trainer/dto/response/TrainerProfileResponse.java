package com.sofen.backend.features.trainer.dto.response;

import com.sofen.backend.domain.entity.Trainer;
import java.math.BigDecimal;

public record TrainerProfileResponse(
        Long id,
        String name,
        String bio,
        String specialty,
        BigDecimal rating,
        Boolean isActive
) {
    public static TrainerProfileResponse from(Trainer trainer) {
        return new TrainerProfileResponse(
                trainer.getId(),
                trainer.getUser().getName(),
                trainer.getBio(),
                trainer.getSpecialty(),
                trainer.getRating(),
                trainer.getIsActive()
        );
    }
}
