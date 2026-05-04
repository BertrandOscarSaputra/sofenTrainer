package com.sofen.backend.features.booking.dto.request;

import jakarta.validation.constraints.NotNull;
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

    @NotNull(message = "Schedule ID tidak boleh kosong")
    private Long scheduleId;

    private String notes;
}
