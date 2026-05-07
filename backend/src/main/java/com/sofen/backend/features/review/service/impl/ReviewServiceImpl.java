package com.sofen.backend.features.review.service.impl;

import com.sofen.backend.common.exception.ResourceNotFoundException;
import com.sofen.backend.domain.entity.Booking;
import com.sofen.backend.domain.entity.Review;
import com.sofen.backend.domain.entity.Trainer;
import com.sofen.backend.domain.enums.BookingStatus;
import com.sofen.backend.features.review.dto.request.CreateReviewRequest;
import com.sofen.backend.features.review.dto.response.ReviewResponse;
import com.sofen.backend.features.review.service.ReviewService;
import com.sofen.backend.repository.BookingRepository;
import com.sofen.backend.repository.ReviewRepository;
import com.sofen.backend.repository.TrainerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final TrainerRepository trainerRepository;

    @Override
    @Transactional
    public ReviewResponse createReview(Long userId, CreateReviewRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking tidak ditemukan"));

        if (!booking.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Anda tidak berhak memberikan review untuk booking ini");
        }

        if (booking.getStatus() != BookingStatus.DONE) {
            throw new IllegalArgumentException("Review hanya dapat diberikan setelah sesi selesai");
        }

        if (reviewRepository.findByBookingId(booking.getId()).isPresent()) {
            throw new com.sofen.backend.common.exception.DuplicateResourceException("Booking ini sudah pernah direview. Silakan ubah review yang sudah ada.");
        }

        Review review = new Review();
        review.setBooking(booking);
        review.setUser(booking.getUser());
        review.setTrainer(booking.getTrainer());
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        Review savedReview = reviewRepository.save(review);
        updateTrainerRating(booking.getTrainer().getId());
        return ReviewResponse.from(savedReview);
    }

    @Override
    @Transactional
    public ReviewResponse updateReview(Long userId, Long bookingId, CreateReviewRequest request) {
        Review review = reviewRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Review tidak ditemukan untuk booking ini"));

        if (!review.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Anda tidak berhak mengubah review ini");
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment());

        Review savedReview = reviewRepository.save(review);
        updateTrainerRating(savedReview.getTrainer().getId());
        return ReviewResponse.from(savedReview);
    }

    @Override
    public List<ReviewResponse> getReviewsByTrainerId(Long trainerId) {
        return reviewRepository.findByTrainerId(trainerId).stream()
                .map(ReviewResponse::from)
                .toList();
    }

    @Override
    public ReviewResponse getReviewByBookingId(Long bookingId) {
        return reviewRepository.findByBookingId(bookingId)
                .map(ReviewResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Review tidak ditemukan untuk booking ini"));
    }

    private void updateTrainerRating(Long trainerId) {
        Trainer trainer = trainerRepository.findById(trainerId)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer tidak ditemukan"));

        Double avgRating = reviewRepository.getAverageRatingByTrainerId(trainerId);
        if (avgRating != null) {
            trainer.setRating(BigDecimal.valueOf(avgRating));
            trainerRepository.save(trainer);
        }
    }
}
