package com.sofen.backend.features.review.service;

import com.sofen.backend.features.review.dto.request.CreateReviewRequest;
import com.sofen.backend.features.review.dto.response.ReviewResponse;

import java.util.List;

public interface ReviewService {
    ReviewResponse createReview(Long userId, CreateReviewRequest request);
    ReviewResponse updateReview(Long userId, Long bookingId, CreateReviewRequest request);
    List<ReviewResponse> getReviewsByTrainerId(Long trainerId);
    ReviewResponse getReviewByBookingId(Long bookingId);
}
