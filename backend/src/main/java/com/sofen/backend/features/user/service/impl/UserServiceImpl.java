package com.sofen.backend.features.user.service.impl;

import com.sofen.backend.common.exception.DuplicateResourceException;
import com.sofen.backend.common.exception.ResourceNotFoundException;
import com.sofen.backend.domain.entity.User;
import com.sofen.backend.features.user.dto.request.UpdateUserRequest;
import com.sofen.backend.features.user.dto.response.UserProfileResponse;
import com.sofen.backend.features.user.service.UserService;
import com.sofen.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserProfileResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User tidak ditemukan dengan ID: " + id));
        return UserProfileResponse.from(user);
    }

    @Override
    @Transactional
    public UserProfileResponse updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User tidak ditemukan dengan ID: " + id));

        if (request.getName() != null) {
            user.setName(request.getName().trim());
        }

        if (request.getEmail() != null) {
            String newEmail = request.getEmail().trim().toLowerCase();
            if (!newEmail.equals(user.getEmail())) {
                userRepository.findByEmail(newEmail).ifPresent(existing -> {
                    throw new DuplicateResourceException("Email sudah digunakan oleh user lain");
                });
                user.setEmail(newEmail);
            }
        }

        User savedUser = userRepository.save(user);
        return UserProfileResponse.from(savedUser);
    }

    @Override
    public List<UserProfileResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserProfileResponse::from)
                .toList();
    }
}
