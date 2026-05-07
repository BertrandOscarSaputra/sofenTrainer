package com.sofen.backend.features.trainer.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateTrainerRequest {

    @Size(max = 5000, message = "Bio maksimal 5000 karakter")
    private String bio;

    @Size(max = 100, message = "Spesialisasi maksimal 100 karakter")
    private String specialty;

    private Boolean isActive;

    private String name;
    private String email;
}
