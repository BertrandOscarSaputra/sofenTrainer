package com.sofen.backend.features.recommendation.controller;

import com.sofen.backend.features.recommendation.dto.request.RecommendationChatRequest;
import com.sofen.backend.features.recommendation.dto.response.RecommendationChatResponse;
import com.sofen.backend.features.recommendation.dto.response.RecommendationResponse;
import com.sofen.backend.features.recommendation.service.RecommendationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/{userId}")
    public ResponseEntity<RecommendationResponse> getRecommendation(@PathVariable Long userId) {
        return ResponseEntity.ok(recommendationService.generateRecommendation(userId));
    }

    @PostMapping("/chat")
    public ResponseEntity<RecommendationChatResponse> chatAndAdjustSchedule(
            @Valid @RequestBody RecommendationChatRequest request) {
        return ResponseEntity.ok(recommendationService.chatAndAdjust(request));
    }
}
