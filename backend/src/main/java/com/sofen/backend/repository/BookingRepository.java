package com.sofen.backend.repository;

import com.sofen.backend.domain.entity.Booking;
import com.sofen.backend.domain.enums.BookingStatus;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserIdAndStatusInOrderByBookedAtAsc(Long userId, Collection<BookingStatus> statuses);

    boolean existsByScheduleIdAndStatusIn(Long scheduleId, Collection<BookingStatus> statuses);

    List<Booking> findByTrainerIdAndBookedAtBetween(Long trainerId, LocalDateTime start, LocalDateTime end);
}
