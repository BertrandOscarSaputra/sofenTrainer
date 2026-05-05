package com.sofen.backend.features.recommendation.dto.request;

import com.sofen.backend.features.recommendation.dto.response.RecommendationResponse.ScheduleItem;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class RecommendationChatRequest {

    @NotNull(message = "User ID tidak boleh kosong")
    private Long userId;

    @NotBlank(message = "Pesan tidak boleh kosong")
    private String message;

    @NotNull(message = "Jadwal saat ini tidak boleh kosong")
    private List<ScheduleItem> currentSchedule;
}
