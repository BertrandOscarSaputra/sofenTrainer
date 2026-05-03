package com.sofen.backend.common.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.PropertiesPropertySource;
import org.springframework.core.io.FileSystemResource;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.Properties;

/**
 * Loads environment variables from .env.local or .env files before Spring
 * resolves property placeholders. This ensures JWT_SECRET and other sensitive
 * values are available during bean creation.
 *
 * This processor runs at the EnvironmentPostProcessor stage, which is BEFORE
 * placeholder resolution, unlike spring.config.import which happens after.
 */
public class LocalEnvEnvironmentPostProcessor implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        // Try to load .env.local first (highest priority for local development)
        File envLocalFile = new File(".env.local");
        if (envLocalFile.exists()) {
            loadEnvFile(environment, envLocalFile);
            return;
        }

        // Fallback to .env if .env.local doesn't exist
        File envFile = new File(".env");
        if (envFile.exists()) {
            loadEnvFile(environment, envFile);
        }
    }

    private void loadEnvFile(ConfigurableEnvironment environment, File envFile) {
        try (FileInputStream fis = new FileInputStream(envFile)) {
            Properties props = new Properties();
            props.load(fis);

            // Add as highest priority property source so they override defaults
            PropertiesPropertySource propertySource = new PropertiesPropertySource(
                    envFile.getName(),
                    props
            );
            environment.getPropertySources().addFirst(propertySource);

        } catch (IOException e) {
            // Log but don't fail - environment variables may be set system-wide
            System.err.println("Warning: Could not load " + envFile.getName() + ": " + e.getMessage());
        }
    }
}
