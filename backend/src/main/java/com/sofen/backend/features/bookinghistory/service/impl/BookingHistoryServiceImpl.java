package com.sofen.backend.features.bookinghistory.service.impl;

import com.sofen.backend.domain.entity.Booking;
import com.sofen.backend.domain.entity.BookingHistory;
import com.sofen.backend.features.bookinghistory.dto.response.BookingHistoryResponse;
import com.sofen.backend.features.bookinghistory.service.BookingHistoryService;
import com.sofen.backend.repository.BookingHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingHistoryServiceImpl implements BookingHistoryService {

    private final BookingHistoryRepository bookingHistoryRepository;

    @Override
    public List<BookingHistoryResponse> getHistoryByUserId(Long userId) {
        LocalDateTime threeMonthsAgo = LocalDateTime.now().minusMonths(3);
        return bookingHistoryRepository.findCompletedUserHistory(userId, threeMonthsAgo).stream()
                .map(BookingHistoryResponse::from)
                .toList();
    }

    @Override
    @Transactional
    public BookingHistoryResponse createFromBooking(Booking booking) {
        BookingHistory history = new BookingHistory();
        history.setBooking(booking);
        history.setUser(booking.getUser());
        history.setTrainer(booking.getTrainer());
        history.setBookedAt(booking.getBookedAt());
        history.setDurationMinutes(booking.getDurationMinutes());
        history.setDayOfWeek(BookingHistory.normalizeDayOfWeek(booking.getBookedAt()));
        history.setTimeOfDay(BookingHistory.classifyTime(booking.getBookedAt()));
        history.setCompleted(true);

        BookingHistory saved = bookingHistoryRepository.save(history);
        return BookingHistoryResponse.from(saved);
    }
}
