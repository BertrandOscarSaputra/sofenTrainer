package com.sofen.backend.repository;

import com.sofen.backend.domain.entity.BookingHistory;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookingHistoryRepository extends JpaRepository<BookingHistory, Long> {

    @Query("""
            select bh
            from BookingHistory bh
            where bh.user.id = :userId
              and bh.completed = true
              and bh.createdAt >= :fromDate
            order by bh.createdAt desc
            """)
    List<BookingHistory> findCompletedUserHistory(@Param("userId") Long userId, @Param("fromDate") LocalDateTime fromDate);

    @Query(value = """
            SELECT
                bh.day_of_week      AS dayOfWeek,
                bh.time_of_day      AS timeOfDay,
                COUNT(*)            AS totalSessions,
                AVG(bh.duration_minutes) AS averageDuration,
                bh.trainer_id       AS trainerId
            FROM booking_history bh
            WHERE bh.user_id = :userId
              AND bh.completed = TRUE
              AND bh.created_at >= :fromDate
            GROUP BY bh.day_of_week, bh.time_of_day, bh.trainer_id
            ORDER BY totalSessions DESC
            """, nativeQuery = true)
    List<UserHabitProjection> getUserHabitSummary(@Param("userId") Long userId, @Param("fromDate") LocalDateTime fromDate);

    interface UserHabitProjection {
        String getDayOfWeek();

        String getTimeOfDay();

        Long getTotalSessions();

        Double getAverageDuration();

        Long getTrainerId();
    }
}
