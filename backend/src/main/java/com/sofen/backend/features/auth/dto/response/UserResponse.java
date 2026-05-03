package com.sofen.backend.features.auth.dto.response;

import com.sofen.backend.domain.entity.User;
import com.sofen.backend.domain.enums.UserRole;

public record UserResponse(
        Long id,
        String name,
        String email,
        UserRole role) {

    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}