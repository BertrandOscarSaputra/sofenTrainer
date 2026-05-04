package com.sofen.backend.features.booking.service;

import com.sofen.backend.features.booking.dto.request.CreateBookingRequest;
import com.sofen.backend.features.booking.dto.response.BookingResponse;

public interface BookingService {
    BookingResponse createBooking(Long userId, CreateBookingRequest request);
    BookingResponse updateBookingStatus(Long bookingId, com.sofen.backend.domain.enums.BookingStatus newStatus);
}
