CREATE TABLE trainers (
    id         BIGINT       AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT       NOT NULL UNIQUE,
    bio        TEXT,
    specialty  VARCHAR(100),
    profile_picture_url LONGTEXT,
    rating     DECIMAL(3,2) NOT NULL DEFAULT 0.00,
    is_active  BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_trainers_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_trainers_specialty ON trainers(specialty);
CREATE INDEX idx_trainers_is_active ON trainers(is_active);
