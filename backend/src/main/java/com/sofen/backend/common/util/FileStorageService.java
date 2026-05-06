package com.sofen.backend.common.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;

@Slf4j
@Service
public class FileStorageService {

    public String uploadProfilePicture(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File tidak boleh kosong");
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("File harus berupa gambar");
        }

        // Validate file size (max 5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("Ukuran file maksimal 5MB");
        }

        String base64 = Base64.getEncoder().encodeToString(file.getBytes());
        String dataUrl = contentType + ";base64," + base64;
        log.info("Profile picture encoded as Base64 data URL, size={} bytes", file.getSize());
        return "data:" + dataUrl;
    }
}
