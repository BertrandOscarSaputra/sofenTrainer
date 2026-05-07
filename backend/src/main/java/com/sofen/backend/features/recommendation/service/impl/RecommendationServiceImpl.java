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
        List<BookingHistoryRepository.UserHabitProjection> habits = historyRepository.getUserHabitSummary(userId, threeMonthsAgo);

        if (history.isEmpty()) {
            log.info("No booking history found for userId={}, returning default schedule", userId);
            return RecommendationResponse.defaultSchedule();
        }

        String context = buildContext(history, habits);
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
        List<BookingHistoryRepository.UserHabitProjection> habits = historyRepository.getUserHabitSummary(request.getUserId(), threeMonthsAgo);
        
        String context = buildContext(history, habits);
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
                    buildChatFailureMessage(e),
                    request.getCurrentSchedule()
            );
        }
    }

    private String buildChatFailureMessage(Exception exception) {
        String errorText = exception.getMessage() == null ? "" : exception.getMessage().toLowerCase();
        if (errorText.contains("403") || errorText.contains("denied access")) {
            return "Layanan AI sedang tidak bisa diakses (akses proyek ditolak). Jadwalmu belum berubah.";
        }
        return "Maaf, saya sedang mengalami kendala teknis. Jadwalmu belum berubah.";
    }

        private String buildContext(List<BookingHistory> history, List<BookingHistoryRepository.UserHabitProjection> habits) {
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

        String recentSessions = history.stream()
                .limit(5)
                .map(this::formatRecentSession)
                .collect(Collectors.joining(" | "));

        String habitSummary = habits.stream()
                .limit(6)
                .map(this::formatHabitSummary)
                .collect(Collectors.joining(" | "));

        return String.format(
                "Total sesi: %d | Hari favorit: %s | Waktu favorit: %s | Durasi rata-rata: %d menit | Pola habit: %s | Riwayat terbaru: %s",
                history.size(), dayCount, timeCount, (int) avgDuration, habitSummary, recentSessions
        );
    }

    private String formatHabitSummary(BookingHistoryRepository.UserHabitProjection habit) {
        return "%s-%s (%d sesi, rata-rata %.0f menit)".formatted(
                formatDayLabel(habit.getDayOfWeek()),
                formatTimeOfDayLabel(habit.getTimeOfDay()),
                habit.getTotalSessions() == null ? 0 : habit.getTotalSessions(),
                habit.getAverageDuration() == null ? 0.0 : habit.getAverageDuration()
        );
    }

    private String formatRecentSession(BookingHistory bookingHistory) {
        return "%s %s %d menit".formatted(
                formatDayLabel(bookingHistory.getDayOfWeek()),
                bookingHistory.getTimeOfDay().name().toLowerCase(),
                bookingHistory.getDurationMinutes()
        );
    }

    private String formatDayLabel(String dayOfWeek) {
        if (dayOfWeek == null || dayOfWeek.isBlank()) {
            return "-";
        }

        String lowerCase = dayOfWeek.toLowerCase();
        return lowerCase.substring(0, 1).toUpperCase() + lowerCase.substring(1);
    }

    private String formatTimeOfDayLabel(String timeOfDay) {
        if (timeOfDay == null || timeOfDay.isBlank()) {
            return "-";
        }

        String lowerCase = timeOfDay.toLowerCase();
        return lowerCase.substring(0, 1).toUpperCase() + lowerCase.substring(1);
    }

    private String buildPrompt(String context) {
        return """
                Kamu adalah asisten fitness profesional.
                Berdasarkan kebiasaan latihan user berikut:
                %s

                                Analisis dulu pola latihan user dari riwayatnya: hari yang paling sering dipilih, waktu yang paling sering dipakai, durasi rata-rata, dan jenis latihan yang paling cocok.

                                Gunakan analisis tersebut untuk merekomendasikan jadwal latihan optimal untuk minggu depan.
                                Sertakan: hari, waktu mulai, durasi, jenis latihan, dan alasan singkat yang merujuk pada pola riwayat user.

                                Aturan rekomendasi:
                                1. Gunakan format waktu 24 jam HH:mm.
                                2. Reason harus menjelaskan kenapa jadwal itu cocok berdasarkan riwayat user.
                                3. Jangan membuat waktu yang bertentangan dengan konteks riwayat.
                                4. Jika riwayat user dominan di pagi hari, prioritaskan pagi; jika dominan sore/malam, prioritaskan itu.
                                5. Hindari jam ekstrem (<05:00 atau >22:00).
                                6. Jangan paksa variasi waktu jika riwayat user menunjukkan preferensi yang konsisten pada satu waktu.

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
                Kamu adalah asisten fitness pribadi AI bernama "Traino AI".
                Tugasmu adalah merevisi jadwal latihan pengguna berdasarkan percakapan.
                
                === KONTEKS KEBIASAAN PENGGUNA ===
                %s
                
                === JADWAL SAAT INI (JSON) ===
                %s
                
                === PERMINTAAN PENGGUNA ===
                "%s"
                
                ATURAN PENTING:
                                1. Analisis permintaan pengguna lalu bandingkan dengan jadwal saat ini.
                                2. Gunakan riwayat jadwal untuk memutuskan apakah pengguna cenderung pagi, siang, sore, atau malam.
                                3. Jika ada perubahan jadwal, update JADWAL SAAT INI sesuai permintaan dan pertahankan pola waktu yang paling masuk akal dari riwayat.
                                4. Reason harus menyebut alasan berdasarkan riwayat pengguna, bukan asumsi umum.
                                5. Output HANYA boleh berupa JSON valid tanpa format markdown di luar JSON.
                                6. Gunakan format waktu 24 jam HH:mm dan hindari jam ekstrem (<05:00 atau >22:00) kecuali diminta eksplisit oleh pengguna.
                
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
