package com.sofen.backend.features.booking.service;

import com.sofen.backend.features.booking.dto.request.CreateBookingRequest;
import com.sofen.backend.features.booking.dto.response.BookingResponse;

import java.util.List;

public interface BookingService {
    BookingResponse createBooking(Long userId, CreateBookingRequest request);

    BookingResponse updateBookingStatus(Long bookingId, com.sofen.backend.domain.enums.BookingStatus newStatus);

    List<BookingResponse> getBookingsByUserId(Long userId);

    List<BookingResponse> getBookingsForTrainer(Long trainerUserId);

    BookingResponse getBookingById(Long bookingId);

    BookingResponse cancelBooking(Long bookingId);

    BookingResponse markBookingDone(Long bookingId);
}
