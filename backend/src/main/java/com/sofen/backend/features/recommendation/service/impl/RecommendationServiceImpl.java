package com.sofen.backend.features.recommendation.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sofen.backend.domain.entity.BookingHistory;
import com.sofen.backend.features.recommendation.dto.request.RecommendationChatRequest;
import com.sofen.backend.features.recommendation.dto.response.RecommendationChatResponse;
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
    private final ObjectMapper objectMapper = new ObjectMapper();

    public RecommendationServiceImpl(
            ChatClient.Builder chatClientBuilder,
            BookingHistoryRepository historyRepository) {
        this.chatClient = chatClientBuilder.build();
        this.historyRepository = historyRepository;
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

    @Override
    public RecommendationChatResponse chatAndAdjust(RecommendationChatRequest request) {
        LocalDateTime threeMonthsAgo = LocalDateTime.now().minusMonths(3);
        List<BookingHistory> history = historyRepository.findCompletedUserHistory(request.getUserId(), threeMonthsAgo);
        
        String context = buildContext(history);
        String currentScheduleJson = "";
        try {
            currentScheduleJson = objectMapper.writeValueAsString(request.getCurrentSchedule());
        } catch (Exception e) {
            log.error("Failed to serialize current schedule", e);
        }

        String prompt = buildChatPrompt(context, currentScheduleJson, request.getMessage());

        try {
            String rawResponse = chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content();

            return parseChatResponse(rawResponse);
        } catch (Exception e) {
            log.error("Failed to process chat adjustment for userId={}", request.getUserId(), e);
            return new RecommendationChatResponse(
                    "Maaf, saya sedang mengalami kendala teknis. Jadwalmu belum berubah.",
                    request.getCurrentSchedule()
            );
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

    private String buildChatPrompt(String context, String currentScheduleJson, String userMessage) {
        return """
                Kamu adalah asisten fitness pribadi AI bernama "SofenTrainer AI".
                Tugasmu adalah merevisi jadwal latihan pengguna berdasarkan percakapan.
                
                === KONTEKS KEBIASAAN PENGGUNA ===
                %s
                
                === JADWAL SAAT INI (JSON) ===
                %s
                
                === PERMINTAAN PENGGUNA ===
                "%s"
                
                ATURAN PENTING:
                1. Analisis permintaan pengguna: apakah mereka ingin mengubah jadwal (geser hari, ubah jam, hapus sesi) atau hanya bertanya.
                2. Jika ada perubahan jadwal, update JADWAL SAAT INI sesuai permintaan.
                3. Berikan respons teks yang ramah, berempati, dan membantu dalam bahasa Indonesia.
                4. Jika permintaan tidak masuk akal atau berbahaya, tolak dengan sopan dan kembalikan jadwal tanpa perubahan.
                5. Output HANYA boleh berupa JSON valid tanpa format markdown di luar JSON.
                
                === FORMAT OUTPUT JSON YANG DIHARAPKAN ===
                {
                  "aiMessage": "Tentu, sesi Cardio hari Rabumu sudah saya pindahkan ke hari Jumat jam 16:00 ya!",
                  "updatedSchedule": [
                     ... array objek jadwal yang sudah diperbarui ...
                  ]
                }
                """.formatted(context, currentScheduleJson, userMessage);
    }

    private RecommendationChatResponse parseChatResponse(String raw) {
        String json = raw.replaceAll("```json|```", "").trim();
        try {
            return objectMapper.readValue(json, RecommendationChatResponse.class);
        } catch (Exception e) {
            log.error("Failed to parse AI chat response", e);
            throw new RuntimeException("Gagal memproses respons AI", e);
        }
    }
}
