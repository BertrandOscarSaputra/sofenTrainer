package com.sofen.backend.features.booking.controller;

import com.sofen.backend.features.booking.dto.request.CreateBookingRequest;
import com.sofen.backend.features.booking.dto.response.BookingResponse;
import com.sofen.backend.features.booking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    // Controller (Pelayan) harus kenal sama Service (Koki)
    private final BookingService bookingService;

    // Pintu masuk (endpoint) untuk bikin booking: POST http://localhost:8080/api/bookings
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody CreateBookingRequest request) { // Menerima Kertas Pesanan
        
        // CATATAN: Untuk sementara kita anggap User yang login punya ID = 1.
        // Nanti kalau fitur Login (JWT) kamu udah jalan, angka 1L ini diganti dengan ID dari Token.
        Long currentUserId = 1L; 

        // Pelayan menyerahkan kertas pesanan (request) ke Koki (bookingService)
        BookingResponse response = bookingService.createBooking(currentUserId, request);
        
        // Pelayan memberikan struk (response) ke Frontend dengan status 201 (Created/Berhasil Dibuat)
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Pintu masuk (endpoint) untuk Trainer menerima/menolak booking: PATCH http://localhost:8080/api/bookings/{id}/status?newStatus=CONFIRMED
    @PatchMapping("/{id}/status")
    public ResponseEntity<BookingResponse> updateStatus(
            @PathVariable("id") Long bookingId,
            @RequestParam("newStatus") com.sofen.backend.domain.enums.BookingStatus newStatus) { // Terima pesan status baru dari Frontend
        
        // Pelayan memberikan ID booking dan Status Baru ke Koki
        BookingResponse response = bookingService.updateBookingStatus(bookingId, newStatus);
        
        // Pelayan mengembalikan Struk terbaru ke Frontend
        return ResponseEntity.ok(response);
    }
}
