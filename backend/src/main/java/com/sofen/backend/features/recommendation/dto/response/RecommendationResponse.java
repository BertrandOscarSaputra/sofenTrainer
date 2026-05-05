package com.sofen.backend.features.recommendation.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class RecommendationResponse {
    private List<ScheduleItem> recommendations;

    public static RecommendationResponse defaultSchedule() {
        ScheduleItem item = new ScheduleItem(
                "Senin", "07:00", 60, "Kardio", "Jadwal default untuk pemula"
        );
        return new RecommendationResponse(List.of(item));
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ScheduleItem {
        private String day;
        private String startTime;
        private int duration;
        private String type;
        private String reason;
    }
}
