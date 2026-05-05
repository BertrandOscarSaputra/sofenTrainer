package com.sofen.backend.features.bookinghistory.controller;

import com.sofen.backend.features.bookinghistory.dto.response.BookingHistoryResponse;
import com.sofen.backend.features.bookinghistory.service.BookingHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/booking-history")
@RequiredArgsConstructor
public class BookingHistoryController {

    private final BookingHistoryService bookingHistoryService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingHistoryResponse>> getHistoryByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingHistoryService.getHistoryByUserId(userId));
    }
}
