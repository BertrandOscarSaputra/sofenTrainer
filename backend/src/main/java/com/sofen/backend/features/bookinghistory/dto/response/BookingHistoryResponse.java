package com.sofen.backend.features.bookinghistory.dto.response;

import com.sofen.backend.domain.entity.BookingHistory;
import com.sofen.backend.domain.enums.TimeOfDay;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class BookingHistoryResponse {
    private Long id;
    private Long bookingId;
    private Long userId;
    private Long trainerId;
    private String trainerName;
    private LocalDateTime bookedAt;
    private Integer durationMinutes;
    private String dayOfWeek;
    private TimeOfDay timeOfDay;
    private Boolean completed;
    private LocalDateTime createdAt;

    public static BookingHistoryResponse from(BookingHistory history) {
        return BookingHistoryResponse.builder()
                .id(history.getId())
                .bookingId(history.getBooking().getId())
                .userId(history.getUser().getId())
                .trainerId(history.getTrainer().getId())
                .trainerName(history.getTrainer().getUser().getName())
                .bookedAt(history.getBookedAt())
                .durationMinutes(history.getDurationMinutes())
                .dayOfWeek(history.getDayOfWeek())
                .timeOfDay(history.getTimeOfDay())
                .completed(history.getCompleted())
                .createdAt(history.getCreatedAt())
                .build();
    }
}
