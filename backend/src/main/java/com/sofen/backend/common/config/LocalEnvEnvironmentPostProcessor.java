package com.sofen.backend.common.config;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.env.MutablePropertySources;

public class LocalEnvEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    private static final String PROPERTY_SOURCE_NAME = "localEnvProperties";
    private static final List<String> FILE_NAMES = List.of(".env.local", ".env");

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        Map<String, Object> localEnv = loadLocalEnvFiles();
        if (localEnv.isEmpty()) {
            return;
        }

        MutablePropertySources propertySources = environment.getPropertySources();
        if (propertySources.contains(PROPERTY_SOURCE_NAME)) {
            propertySources.remove(PROPERTY_SOURCE_NAME);
        }

        propertySources.addFirst(new MapPropertySource(PROPERTY_SOURCE_NAME, localEnv));
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }

    private Map<String, Object> loadLocalEnvFiles() {
        Map<String, Object> properties = new LinkedHashMap<>();

        for (String fileName : FILE_NAMES) {
            Path path = Path.of(fileName);
            if (!Files.exists(path)) {
                continue;
            }

            try {
                for (String line : Files.readAllLines(path)) {
                    String trimmed = line.trim();
                    if (trimmed.isEmpty() || trimmed.startsWith("#")) {
                        continue;
                    }

                    int equalsIndex = trimmed.indexOf('=');
                    if (equalsIndex <= 0) {
                        continue;
                    }

                    String key = trimmed.substring(0, equalsIndex).trim();
                    String value = trimmed.substring(equalsIndex + 1).trim();
                    properties.putIfAbsent(key, unwrapQuotes(value));
                }
            } catch (IOException exception) {
                throw new IllegalStateException("Failed to read local env file: " + path, exception);
            }
        }

        return properties;
    }

    private String unwrapQuotes(String value) {
        if (value.length() < 2) {
            return value;
        }

        char first = value.charAt(0);
        char last = value.charAt(value.length() - 1);
        if ((first == '"' && last == '"') || (first == '\'' && last == '\'')) {
            return value.substring(1, value.length() - 1);
        }

        return value;
    }
}