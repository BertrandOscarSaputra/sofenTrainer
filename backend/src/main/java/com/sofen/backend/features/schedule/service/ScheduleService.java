package com.sofen.backend.features.schedule.service;

import com.sofen.backend.features.schedule.dto.request.CreateScheduleRequest;
import com.sofen.backend.features.schedule.dto.response.ScheduleResponse;

import java.util.List;

public interface ScheduleService {
    ScheduleResponse createSchedule(Long trainerId, CreateScheduleRequest request);
    List<ScheduleResponse> getSchedulesByTrainerId(Long trainerId);
}
