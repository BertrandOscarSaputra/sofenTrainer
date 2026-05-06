package com.sofen.backend.features.schedule.service.impl;

import com.sofen.backend.domain.entity.Schedule;
import com.sofen.backend.domain.entity.Trainer;
import com.sofen.backend.domain.enums.ScheduleStatus;
import com.sofen.backend.features.schedule.dto.request.CreateScheduleRequest;
import com.sofen.backend.features.schedule.dto.response.ScheduleResponse;
import com.sofen.backend.features.schedule.service.ScheduleService;
import com.sofen.backend.repository.ScheduleRepository;
import com.sofen.backend.repository.TrainerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ScheduleServiceImpl implements ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final TrainerRepository trainerRepository;

    @Override
    @Transactional
    public ScheduleResponse createSchedule(Long trainerId, CreateScheduleRequest request) {
        
        // 1. VALIDASI LOGIKA DASAR: Jam Selesai harus setelah Jam Mulai
        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new RuntimeException("Jam selesai harus lebih besar dari jam mulai (contoh: mulai 09:00, selesai 11:00)");
        }

        // 2. Cari Trainer di Database
        Trainer trainer = trainerRepository.findById(trainerId)
                .orElseThrow(() -> new RuntimeException("Trainer tidak ditemukan"));

        // 3. Buat Entitas Schedule Baru (Kertas pengumuman jadwal)
        Schedule schedule = new Schedule();
        schedule.setTrainer(trainer);
        schedule.setDayOfWeek(request.getDayOfWeek());
        schedule.setStartTime(request.getStartTime());
        schedule.setEndTime(request.getEndTime());
        schedule.setStatus(ScheduleStatus.AVAILABLE); // Otomatis berstatus AVAILABLE

        // 4. Simpan ke Database
        Schedule savedSchedule = scheduleRepository.save(schedule);

        // 5. Kembalikan Response ke Frontend
        return ScheduleResponse.builder()
                .id(savedSchedule.getId())
                .trainerId(savedSchedule.getTrainer().getId())
                .dayOfWeek(savedSchedule.getDayOfWeek())
                .startTime(savedSchedule.getStartTime())
                .endTime(savedSchedule.getEndTime())
                .status(savedSchedule.getStatus())
                .build();
    }
    @Override
    @Transactional(readOnly = true)
    public java.util.List<ScheduleResponse> getSchedulesByTrainerId(Long trainerId) {
        return scheduleRepository.findByTrainerIdAndStatusOrderByDayOfWeekAscStartTimeAsc(
                trainerId, ScheduleStatus.AVAILABLE)
                .stream()
                .map(s -> ScheduleResponse.builder()
                        .id(s.getId())
                        .trainerId(s.getTrainer().getId())
                        .dayOfWeek(s.getDayOfWeek())
                        .startTime(s.getStartTime())
                        .endTime(s.getEndTime())
                        .status(s.getStatus())
                        .build())
                .collect(java.util.stream.Collectors.toList());
    }
}
