package com.sofen.backend.features.bookinghistory.dto.response;

import com.sofen.backend.domain.entity.BookingHistory;
import com.sofen.backend.domain.entity.Review;
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
    private Boolean reviewed;
    private Integer reviewRating;
    private String reviewComment;
    private LocalDateTime createdAt;

    public static BookingHistoryResponse from(BookingHistory history, Review review) {
        return BookingHistoryResponse.builder()
                .id(history.getId())
                .bookingId(history.getBooking().getId())
                .userId(history.getUser().getId())
                .trainerId(history.getTrainer().getId())
                .trainerName(history.getTrainer().getUser().getName())
                .trainerProfilePictureUrl(history.getTrainer().getProfilePictureUrl())
                .trainerSpecialty(history.getTrainer().getSpecialty())
                .status(Boolean.TRUE.equals(history.getCompleted()) ? "DONE" : "CANCELLED")
                .scheduledAt(history.getBooking().getScheduledAt()) // Use actual scheduled time from booking
                .bookedAt(history.getBooking().getBookedAt()) // Creation time of booking
                .durationMinutes(history.getDurationMinutes())
                .dayOfWeek(history.getDayOfWeek())
                .timeOfDay(history.getTimeOfDay())
                .completed(history.getCompleted())
                .reviewed(review != null)
                .reviewRating(review != null ? review.getRating() : null)
                .reviewComment(review != null ? review.getComment() : null)
                .createdAt(history.getCreatedAt())
                .build();
    }
}
