package com.sofen.backend.features.review.controller;

import com.sofen.backend.common.security.CustomUserDetails;
import com.sofen.backend.features.review.dto.request.CreateReviewRequest;
import com.sofen.backend.features.review.dto.response.ReviewResponse;
import com.sofen.backend.features.review.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            return ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();
        }
        return null;
    }

    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(@Valid @RequestBody CreateReviewRequest request) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(reviewService.createReview(userId, request));
    }

    @PutMapping("/booking/{bookingId}")
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable Long bookingId,
            @Valid @RequestBody CreateReviewRequest request) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(reviewService.updateReview(userId, bookingId, request));
    }

    @GetMapping("/trainer/{trainerId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByTrainerId(@PathVariable Long trainerId) {
        return ResponseEntity.ok(reviewService.getReviewsByTrainerId(trainerId));
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<ReviewResponse> getReviewByBookingId(@PathVariable Long bookingId) {
        return ResponseEntity.ok(reviewService.getReviewByBookingId(bookingId));
    }
}
