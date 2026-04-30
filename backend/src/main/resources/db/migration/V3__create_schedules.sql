CREATE TABLE schedules (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    trainer_id  BIGINT NOT NULL,
    day_of_week ENUM('MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY') NOT NULL,
    start_time  TIME   NOT NULL,
    end_time    TIME   NOT NULL,
    status      ENUM('AVAILABLE','BOOKED','BLOCKED') NOT NULL DEFAULT 'AVAILABLE',
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_schedules_trainer
        FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE,

    CONSTRAINT chk_schedules_time
        CHECK (end_time > start_time)
);

CREATE INDEX idx_schedules_trainer_id  ON schedules(trainer_id);
CREATE INDEX idx_schedules_day_status  ON schedules(day_of_week, status);
CREATE INDEX idx_schedules_trainer_day ON schedules(trainer_id, day_of_week);
