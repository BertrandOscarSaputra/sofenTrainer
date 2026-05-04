package com.sofen.backend.features.booking.dto.response;

import com.sofen.backend.domain.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private Long id;
    private Long userId;
    private Long trainerId;
    private Long scheduleId;
    private String notes;
    private Integer durationMinutes;
    private BookingStatus status;
    private LocalDateTime bookedAt;
    private LocalDateTime createdAt;
}
