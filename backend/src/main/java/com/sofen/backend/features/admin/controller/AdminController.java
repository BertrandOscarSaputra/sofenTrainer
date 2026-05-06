package com.sofen.backend.features.admin.controller;

import com.sofen.backend.common.response.ApiResponse;
import com.sofen.backend.features.admin.dto.request.CreateTrainerRequest;
import com.sofen.backend.features.admin.dto.response.TrainerManagementResponse;
import com.sofen.backend.features.admin.service.AdminService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/admin")
@PreAuthorize("hasAnyRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    /**
     * Create a new trainer (admin only)
     */
    @PostMapping("/trainers")
    public ResponseEntity<ApiResponse<TrainerManagementResponse>> createTrainer(
            @Valid @RequestBody CreateTrainerRequest request) {
        log.info("Admin creating new trainer: email={}", request.email());
        TrainerManagementResponse response = adminService.createTrainer(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Trainer berhasil dibuat", response));
    }

    /**
     * Get all trainers
     */
    @GetMapping("/trainers")
    public ResponseEntity<ApiResponse<List<TrainerManagementResponse>>> getAllTrainers() {
        log.info("Admin fetching all trainers");
        List<TrainerManagementResponse> trainers = adminService.getAllTrainers();
        return ResponseEntity.ok(ApiResponse.success("Berhasil mengambil daftar trainer", trainers));
    }

    /**
     * Get trainer by ID
     */
    @GetMapping("/trainers/{trainerId}")
    public ResponseEntity<ApiResponse<TrainerManagementResponse>> getTrainerById(
            @PathVariable Long trainerId) {
        log.info("Admin fetching trainer: trainerId={}", trainerId);
        TrainerManagementResponse trainer = adminService.getTrainerById(trainerId);
        return ResponseEntity.ok(ApiResponse.success("Berhasil mengambil data trainer", trainer));
    }

    /**
     * Update trainer active status
     */
    @PutMapping("/trainers/{trainerId}/status")
    public ResponseEntity<ApiResponse<TrainerManagementResponse>> updateTrainerStatus(
            @PathVariable Long trainerId,
            @RequestParam Boolean isActive) {
        log.info("Admin updating trainer status: trainerId={}, isActive={}", trainerId, isActive);
        TrainerManagementResponse response = adminService.updateTrainerStatus(trainerId, isActive);
        return ResponseEntity.ok(ApiResponse.success("Status trainer berhasil diperbarui", response));
    }

    /**
     * Delete a trainer
     */
    @DeleteMapping("/trainers/{trainerId}")
    public ResponseEntity<ApiResponse<Void>> deleteTrainer(
            @PathVariable Long trainerId) {
        log.info("Admin deleting trainer: trainerId={}", trainerId);
        adminService.deleteTrainer(trainerId);
        return ResponseEntity.ok(ApiResponse.success("Trainer berhasil dihapus", null));
    }
}
