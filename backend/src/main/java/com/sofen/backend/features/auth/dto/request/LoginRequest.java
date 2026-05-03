package com.sofen.backend.features.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "is required")
        @Email(message = "must be a valid email")
        String email,

        @NotBlank(message = "is required")
        String password) {
}