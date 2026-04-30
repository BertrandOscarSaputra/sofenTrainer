CREATE TABLE booking_history (
    id               BIGINT       AUTO_INCREMENT PRIMARY KEY,
    booking_id       BIGINT       NOT NULL UNIQUE,
    user_id          BIGINT       NOT NULL,
    trainer_id       BIGINT       NOT NULL,
    booked_at        DATETIME     NOT NULL,
    duration_minutes INT          NOT NULL DEFAULT 60,
    day_of_week      VARCHAR(10)  NOT NULL,
    time_of_day      ENUM('PAGI','SIANG','SORE','MALAM') NOT NULL,
    completed        BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_history_booking
        FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    CONSTRAINT fk_history_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_history_trainer
        FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX idx_history_booking_id ON booking_history(booking_id);
CREATE INDEX idx_history_user_id           ON booking_history(user_id);
CREATE INDEX idx_history_user_day          ON booking_history(user_id, day_of_week);
CREATE INDEX idx_history_user_time         ON booking_history(user_id, time_of_day);
CREATE INDEX idx_history_user_trainer      ON booking_history(user_id, trainer_id);
CREATE INDEX idx_history_created_at        ON booking_history(created_at);
