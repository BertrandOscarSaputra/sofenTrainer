package com.sofen.backend.features.schedule.controller;

import com.sofen.backend.features.schedule.dto.request.CreateScheduleRequest;
import com.sofen.backend.features.schedule.dto.response.ScheduleResponse;
import com.sofen.backend.features.schedule.service.ScheduleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;

    @PostMapping
    public ResponseEntity<ScheduleResponse> createSchedule(
            @Valid @RequestBody CreateScheduleRequest request) {

        // CATATAN: Sama seperti Booking tadi, kita anggap ID Trainer yang login adalah 2L sementara ini.
        // Nanti diganti dengan ID dari JWT Token kalau fiturnya sudah siap.
        Long currentTrainerId = 2L;

        ScheduleResponse response = scheduleService.createSchedule(currentTrainerId, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/trainer/{trainerId}")
    public ResponseEntity<java.util.List<ScheduleResponse>> getSchedulesByTrainerId(@PathVariable Long trainerId) {
        return ResponseEntity.ok(scheduleService.getSchedulesByTrainerId(trainerId));
    }
}
