package com.sofen.backend.repository;

import com.sofen.backend.domain.entity.Schedule;
import com.sofen.backend.domain.enums.ScheduleStatus;
import java.time.DayOfWeek;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByTrainerIdAndStatusOrderByDayOfWeekAscStartTimeAsc(Long trainerId, ScheduleStatus status);

    List<Schedule> findByTrainerIdAndDayOfWeek(Long trainerId, DayOfWeek dayOfWeek);
}
