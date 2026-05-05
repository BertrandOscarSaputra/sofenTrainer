package com.sofen.backend.features.user.service;

import com.sofen.backend.features.user.dto.request.UpdateUserRequest;
import com.sofen.backend.features.user.dto.response.UserProfileResponse;

import java.util.List;

public interface UserService {
    UserProfileResponse getUserById(Long id);

    UserProfileResponse updateUser(Long id, UpdateUserRequest request);

    List<UserProfileResponse> getAllUsers();
}
