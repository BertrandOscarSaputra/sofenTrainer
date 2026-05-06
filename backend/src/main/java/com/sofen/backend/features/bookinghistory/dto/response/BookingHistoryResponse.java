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
    private String trainerProfilePictureUrl;
    private String trainerSpecialty;
    private String status;
    private LocalDateTime scheduledAt;
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
                .trainerProfilePictureUrl(history.getTrainer().getProfilePictureUrl())
                .trainerSpecialty(history.getTrainer().getSpecialty())
                .status(Boolean.TRUE.equals(history.getCompleted()) ? "DONE" : "CANCELLED")
                .scheduledAt(history.getBookedAt()) // Use bookedAt as scheduled time
                .bookedAt(history.getBooking().getBookedAt()) // Creation time of booking
                .durationMinutes(history.getDurationMinutes())
                .dayOfWeek(history.getDayOfWeek())
                .timeOfDay(history.getTimeOfDay())
                .completed(history.getCompleted())
                .createdAt(history.getCreatedAt())
                .build();
    }
}
