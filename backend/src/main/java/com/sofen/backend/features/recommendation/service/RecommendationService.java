package com.sofen.backend.features.recommendation.service;

import com.sofen.backend.features.recommendation.dto.request.RecommendationChatRequest;
import com.sofen.backend.features.recommendation.dto.response.RecommendationChatResponse;
import com.sofen.backend.features.recommendation.dto.response.RecommendationResponse;

public interface RecommendationService {
    RecommendationResponse generateRecommendation(Long userId);
    
    RecommendationChatResponse chatAndAdjust(RecommendationChatRequest request);
}
