CREATE TABLE bookings (
    id               BIGINT    AUTO_INCREMENT PRIMARY KEY,
    user_id          BIGINT    NOT NULL,
    trainer_id       BIGINT    NOT NULL,
    schedule_id      BIGINT    NOT NULL,
    booked_at        DATETIME  NOT NULL,
    duration_minutes INT       NOT NULL DEFAULT 60,
    notes            TEXT,
    status           ENUM('PENDING','CONFIRMED','CANCELLED','DONE') NOT NULL DEFAULT 'PENDING',
    created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_bookings_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_bookings_trainer
        FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE RESTRICT,
    CONSTRAINT fk_bookings_schedule
        FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE RESTRICT
);

CREATE INDEX idx_bookings_user_id     ON bookings(user_id);
CREATE INDEX idx_bookings_trainer_id  ON bookings(trainer_id);
CREATE INDEX idx_bookings_status      ON bookings(status);
CREATE INDEX idx_bookings_booked_at   ON bookings(booked_at);
CREATE INDEX idx_bookings_user_status ON bookings(user_id, status);
