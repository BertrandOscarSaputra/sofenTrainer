package com.sofen.backend.features.auth.service;

import com.sofen.backend.features.auth.dto.request.LoginRequest;
import com.sofen.backend.features.auth.dto.request.RegisterRequest;
import com.sofen.backend.features.auth.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}