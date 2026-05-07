package com.sofen.backend.features.profile.service;

import com.sofen.backend.features.profile.dto.response.ProfilePictureResponse;
import org.springframework.web.multipart.MultipartFile;

public interface ProfileService {
    ProfilePictureResponse uploadUserProfilePicture(Long userId, MultipartFile file);

    ProfilePictureResponse uploadTrainerProfilePicture(Long trainerId, MultipartFile file);
}
