package com.sofen.backend.features.profile.dto.request;

import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;

public record ProfilePictureRequest(
        @NotNull(message = "File tidak boleh kosong")
        MultipartFile file
) {}
