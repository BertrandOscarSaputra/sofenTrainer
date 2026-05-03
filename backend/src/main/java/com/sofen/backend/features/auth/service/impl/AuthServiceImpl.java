package com.sofen.backend.features.auth.service.impl;

import com.sofen.backend.common.exception.DuplicateResourceException;
import com.sofen.backend.common.exception.ResourceNotFoundException;
import com.sofen.backend.common.security.JwtService;
import com.sofen.backend.domain.entity.User;
import com.sofen.backend.domain.enums.UserRole;
import com.sofen.backend.features.auth.dto.request.LoginRequest;
import com.sofen.backend.features.auth.dto.request.RegisterRequest;
import com.sofen.backend.features.auth.dto.response.AuthResponse;
import com.sofen.backend.features.auth.dto.response.UserResponse;
import com.sofen.backend.features.auth.service.AuthService;
import com.sofen.backend.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();

        userRepository.findByEmail(email).ifPresent(user -> {
            throw new DuplicateResourceException("Email is already registered");
        });

        User user = new User();
        user.setName(request.name().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(UserRole.USER);

        User savedUser = userRepository.save(user);
        String accessToken = jwtService.generateToken(savedUser);

        return new AuthResponse(
                accessToken,
                "Bearer",
                jwtService.extractExpiration(accessToken),
                UserResponse.from(savedUser));
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, request.password()));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.email()));

        String accessToken = jwtService.generateToken(user);
        return new AuthResponse(
                accessToken,
                "Bearer",
                jwtService.extractExpiration(accessToken),
                UserResponse.from(user));
    }
}