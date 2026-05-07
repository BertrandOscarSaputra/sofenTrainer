package com.sofen.backend.repository;

import com.sofen.backend.domain.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Optional<Review> findByBookingId(Long bookingId);
    List<Review> findByTrainerId(Long trainerId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.trainer.id = :trainerId")
    Double getAverageRatingByTrainerId(@Param("trainerId") Long trainerId);
}
