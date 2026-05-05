package com.sofen.backend.features.recommendation.controller;

import com.sofen.backend.features.recommendation.dto.response.RecommendationResponse;
import com.sofen.backend.features.recommendation.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
}
