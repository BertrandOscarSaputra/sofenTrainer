package com.sofen.backend.repository;

import com.sofen.backend.domain.entity.Trainer;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainerRepository extends JpaRepository<Trainer, Long> {
    Optional<Trainer> findByUserId(Long userId);

    List<Trainer> findByIsActiveTrue();
}
