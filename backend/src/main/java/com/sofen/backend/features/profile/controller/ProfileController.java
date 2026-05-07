package com.sofen.backend.features.profile.controller;

import com.sofen.backend.common.response.ApiResponse;
import com.sofen.backend.common.security.JwtService;
import com.sofen.backend.features.profile.dto.response.ProfilePictureResponse;
import com.sofen.backend.features.profile.service.ProfileService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/profile")
public class ProfileController {

    private final ProfileService profileService;
    private final JwtService jwtService;

    public ProfileController(ProfileService profileService, JwtService jwtService) {
        this.profileService = profileService;
        this.jwtService = jwtService;
    }

    /**
     * Upload user profile picture
     */
    @PostMapping(value = "/picture/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ProfilePictureResponse>> uploadUserProfilePicture(
            @RequestParam("file") MultipartFile file,
            @RequestHeader("Authorization") String bearerToken) {
        String token = bearerToken.replace("Bearer ", "");
        Long userId = jwtService.extractUserId(token);

        log.info("User uploading profile picture: userId={}", userId);
        ProfilePictureResponse response = profileService.uploadUserProfilePicture(userId, file);

        return ResponseEntity.ok(ApiResponse.success("Foto profil berhasil diupload", response));
    }

    /**
     * Upload trainer profile picture
     */
    @PostMapping(value = "/trainer/{trainerId}/picture/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ProfilePictureResponse>> uploadTrainerProfilePicture(
            @PathVariable Long trainerId,
            @RequestParam("file") MultipartFile file) {
        log.info("Uploading trainer profile picture: trainerId={}", trainerId);
        ProfilePictureResponse response = profileService.uploadTrainerProfilePicture(trainerId, file);

        return ResponseEntity.ok(ApiResponse.success("Foto profil trainer berhasil diupload", response));
    }
}
