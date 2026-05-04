package com.sofen.backend.features.schedule.dto.response;

import com.sofen.backend.domain.enums.ScheduleStatus;
import lombok.Builder;
import lombok.Data;
import java.time.DayOfWeek;
import java.time.LocalTime;

@Data
@Builder
public class ScheduleResponse {
    private Long id;
    private Long trainerId;
    private DayOfWeek dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private ScheduleStatus status;
}
