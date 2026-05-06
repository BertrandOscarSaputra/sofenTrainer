package com.sofen.backend.features.booking.dto.request;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateBookingRequest {

    @NotNull(message = "Trainer ID tidak boleh kosong")
    private Long trainerId;

    @NotNull(message = "Tanggal dan waktu booking tidak boleh kosong")
    private LocalDateTime scheduledAt;

    private Integer durationMinutes;

    private String notes;
}
