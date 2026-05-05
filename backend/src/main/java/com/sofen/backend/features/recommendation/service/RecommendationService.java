package com.sofen.backend.features.recommendation.service;

import com.sofen.backend.features.recommendation.dto.response.RecommendationResponse;

public interface RecommendationService {
    RecommendationResponse generateRecommendation(Long userId);
}
