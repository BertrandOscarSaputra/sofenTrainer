-- Migration for Review System
CREATE TABLE reviews (
    id         BIGINT       AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT       NOT NULL UNIQUE,
    user_id    BIGINT       NOT NULL,
    trainer_id BIGINT       NOT NULL,
    rating     INT          NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment    TEXT,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_reviews_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    CONSTRAINT fk_reviews_user    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
    CONSTRAINT fk_reviews_trainer FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE
);

-- Add review_id to booking_history or just keep it separate. 
-- Keeping it separate is cleaner as we can join by booking_id.
