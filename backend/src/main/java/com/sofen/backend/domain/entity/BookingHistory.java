package com.sofen.backend.domain.entity;

import com.sofen.backend.domain.enums.TimeOfDay;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.Locale;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

@Getter
@Setter
@Entity
@Table(name = "booking_history")
public class BookingHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_id", nullable = false)
    private Trainer trainer;

    @Column(nullable = false)
    private LocalDateTime bookedAt;

    @Column(nullable = false)
    private Integer durationMinutes = 60;

    @Column(nullable = false, length = 10)
    private String dayOfWeek;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private TimeOfDay timeOfDay;

    @Column(nullable = false)
    private Boolean completed = true;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public static TimeOfDay classifyTime(LocalDateTime dateTime) {
        int hour = dateTime.getHour();
        if (hour >= 5 && hour < 12) {
            return TimeOfDay.PAGI;
        }
        if (hour >= 12 && hour < 15) {
            return TimeOfDay.SIANG;
        }
        if (hour >= 15 && hour < 19) {
            return TimeOfDay.SORE;
        }
        return TimeOfDay.MALAM;
    }

    public static String normalizeDayOfWeek(LocalDateTime dateTime) {
        return dateTime.getDayOfWeek().name().toUpperCase(Locale.ROOT);
    }
}
