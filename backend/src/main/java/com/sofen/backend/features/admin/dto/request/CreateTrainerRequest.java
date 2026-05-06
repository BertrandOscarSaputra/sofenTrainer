package com.sofen.backend.features.admin.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateTrainerRequest(
        @NotBlank(message = "Nama tidak boleh kosong")
        String name,

        @NotBlank(message = "Email tidak boleh kosong")
        @Email(message = "Email harus valid")
        String email,

        @NotBlank(message = "Password tidak boleh kosong")
        String password,

        String bio,

        @NotNull(message = "Specialty tidak boleh kosong")
        String specialty
) {}
