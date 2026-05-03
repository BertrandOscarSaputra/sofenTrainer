package com.sofen.backend.common.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

/**
 * Loads environment variables from .env.local or .env file at application startup.
 * This enables Spring properties with ${VAR} syntax to read from .env files
 */
@Component
public class DotEnvConfig {

    @PostConstruct
    public void loadDotEnv() {
        try {
            // Load .env or .env.local file from the project root directory
            // java-dotenv automatically looks for these files
            Dotenv.load();
        } catch (Exception e) {
            // If .env files are not found, environment variables must be set manually
            System.out.println("Note: .env or .env.local file not found. Using system environment variables instead.");
        }
    }
}
