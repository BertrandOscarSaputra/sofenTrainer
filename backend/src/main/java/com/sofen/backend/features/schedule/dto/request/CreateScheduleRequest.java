package com.sofen.backend.features.schedule.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.DayOfWeek;
import java.time.LocalTime;

@Data
public class CreateScheduleRequest {
    
    @NotNull(message = "Hari tidak boleh kosong")
    private DayOfWeek dayOfWeek; // Contoh: MONDAY, TUESDAY

    @NotNull(message = "Jam mulai tidak boleh kosong")
    private LocalTime startTime; // Contoh: 09:00

    @NotNull(message = "Jam selesai tidak boleh kosong")
    private LocalTime endTime; // Contoh: 11:00
}
