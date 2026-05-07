package com.sofen.backend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class AIConfigTest implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AIConfigTest.class);
    
    @Value("${spring.ai.google.genai.api-key:}")
    private String apiKey;
    
    @Value("${spring.ai.google.genai.chat.options.model:}")
    private String model;

    @Override
    public void run(String... args) throws Exception {
        log.info("=== AI Configuration Check ===");
        log.info("API Key present: {}", !apiKey.isEmpty() ? "YES" : "NO");
        log.info("API Key length: {}", apiKey.length());
        log.info("Model: {}", model);
        log.info("AI Service: READY (No startup test to avoid quota issues)");
        log.info("=== End AI Configuration Check ===");
    }
}
