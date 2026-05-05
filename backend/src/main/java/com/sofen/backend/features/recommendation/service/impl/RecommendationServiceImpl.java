package com.sofen.backend.features.recommendation.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sofen.backend.domain.entity.BookingHistory;
import com.sofen.backend.features.recommendation.dto.response.RecommendationResponse;
import com.sofen.backend.features.recommendation.service.RecommendationService;
import com.sofen.backend.repository.BookingHistoryRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
public class RecommendationServiceImpl implements RecommendationService {

    private final ChatClient chatClient;
    private final BookingHistoryRepository historyRepository;
    private final ObjectMapper objectMapper;

    public RecommendationServiceImpl(
            ChatClient.Builder chatClientBuilder,
            BookingHistoryRepository historyRepository,
            ObjectMapper objectMapper) {
        this.chatClient = chatClientBuilder.build();
        this.historyRepository = historyRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public RecommendationResponse generateRecommendation(Long userId) {
        LocalDateTime threeMonthsAgo = LocalDateTime.now().minusMonths(3);
        List<BookingHistory> history = historyRepository.findCompletedUserHistory(userId, threeMonthsAgo);

        if (history.isEmpty()) {
            log.info("No booking history found for userId={}, returning default schedule", userId);
            return RecommendationResponse.defaultSchedule();
        }

        String context = buildContext(history);
        String prompt = buildPrompt(context);

        try {
            String rawResponse = chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content();

            return parseResponse(rawResponse);
        } catch (Exception e) {
            log.error("Failed to generate AI recommendation for userId={}", userId, e);
            return RecommendationResponse.defaultSchedule();
        }
    }

    private String buildContext(List<BookingHistory> history) {
        Map<String, Long> dayCount = history.stream()
                .collect(Collectors.groupingBy(
                        BookingHistory::getDayOfWeek,
                        Collectors.counting()
                ));

        Map<String, Long> timeCount = history.stream()
                .collect(Collectors.groupingBy(
                        h -> h.getTimeOfDay().name(),
                        Collectors.counting()
                ));

        double avgDuration = history.stream()
                .mapToInt(BookingHistory::getDurationMinutes)
                .average()
                .orElse(60);

        return String.format(
                "Total sesi: %d | Hari favorit: %s | Waktu favorit: %s | Durasi rata-rata: %d menit",
                history.size(), dayCount, timeCount, (int) avgDuration
        );
    }

    private String buildPrompt(String context) {
        return """
                Kamu adalah asisten fitness profesional.
                Berdasarkan kebiasaan latihan user berikut:
                %s

                Rekomendasikan jadwal latihan optimal untuk minggu depan.
                Sertakan: hari, waktu mulai, durasi, jenis latihan, dan alasan singkat.

                Balas HANYA dalam format JSON seperti ini:
                {
                  "recommendations": [
                    {
                      "day": "Senin",
                      "startTime": "07:00",
                      "duration": 60,
                      "type": "Kardio",
                      "reason": "Sesuai pola latihan pagi hari kamu"
                    }
                  ]
                }
                """.formatted(context);
    }

    private RecommendationResponse parseResponse(String raw) {
        String json = raw.replaceAll("```json|```", "").trim();
        try {
            return objectMapper.readValue(json, RecommendationResponse.class);
        } catch (Exception e) {
            log.error("Failed to parse AI response", e);
            return RecommendationResponse.defaultSchedule();
        }
    }
}
