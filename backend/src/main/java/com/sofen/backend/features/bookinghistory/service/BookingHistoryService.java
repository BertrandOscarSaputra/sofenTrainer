package com.sofen.backend.features.bookinghistory.service;

import com.sofen.backend.domain.entity.Booking;
import com.sofen.backend.features.bookinghistory.dto.response.BookingHistoryResponse;

import java.util.List;

public interface BookingHistoryService {
    List<BookingHistoryResponse> getHistoryByUserId(Long userId);

    BookingHistoryResponse createFromBooking(Booking booking);
}
