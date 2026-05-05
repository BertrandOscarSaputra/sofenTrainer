package com.sofen.backend.features.booking.controller;

import com.sofen.backend.features.booking.dto.request.CreateBookingRequest;
import com.sofen.backend.features.booking.dto.response.BookingResponse;
import com.sofen.backend.features.booking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @GetMapping
    public ResponseEntity<List<BookingResponse>> getBookings() {
        // TODO: Replace hardcoded userId with authenticated user ID from JWT
        Long currentUserId = 1L;
        return ResponseEntity.ok(bookingService.getBookingsByUserId(currentUserId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody CreateBookingRequest request) {
        // TODO: Replace hardcoded userId with authenticated user ID from JWT
        Long currentUserId = 1L;
        BookingResponse response = bookingService.createBooking(currentUserId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BookingResponse> cancelBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }

    @PatchMapping("/{id}/done")
    public ResponseEntity<BookingResponse> markBookingDone(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.markBookingDone(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<BookingResponse> updateStatus(
            @PathVariable("id") Long bookingId,
            @RequestParam("newStatus") com.sofen.backend.domain.enums.BookingStatus newStatus) {
        BookingResponse response = bookingService.updateBookingStatus(bookingId, newStatus);
        return ResponseEntity.ok(response);
    }
}
