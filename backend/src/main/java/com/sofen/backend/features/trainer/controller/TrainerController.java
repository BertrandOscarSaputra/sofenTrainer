package com.sofen.backend.features.trainer.controller;

import com.sofen.backend.features.trainer.dto.request.CreateTrainerRequest;
import com.sofen.backend.features.trainer.dto.request.UpdateTrainerRequest;
import com.sofen.backend.features.trainer.dto.response.TrainerResponse;
import com.sofen.backend.features.trainer.service.TrainerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/trainers")
@RequiredArgsConstructor
public class TrainerController {

    private final TrainerService trainerService;

    @GetMapping
    public ResponseEntity<List<TrainerResponse>> getAllActiveTrainers() {
        return ResponseEntity.ok(trainerService.getAllActiveTrainers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainerResponse> getTrainerById(@PathVariable Long id) {
        return ResponseEntity.ok(trainerService.getTrainerById(id));
    }

    @PostMapping
    public ResponseEntity<TrainerResponse> createTrainer(
            @Valid @RequestBody CreateTrainerRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(trainerService.createTrainer(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrainerResponse> updateTrainer(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTrainerRequest request) {
        return ResponseEntity.ok(trainerService.updateTrainer(id, request));
    }
}
