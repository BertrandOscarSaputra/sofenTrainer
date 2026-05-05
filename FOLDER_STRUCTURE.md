# Folder Structure

This document provides an overview of the directory structure for the **sofenTrainer** project.

## Root Directory
```text
sofenTrainer/
├── .github/              # GitHub Actions workflows
├── backend/              # Spring Boot (Java) backend service
├── frontend/             # Next.js (TypeScript) frontend application
├── SETUP_GUIDE.md        # Main setup instructions
└── sofentrainer-planning.md # Project planning and roadmap
```

---

## Backend (`/backend`)
Built with Spring Boot 3+ and Maven.

```text
backend/
├── src/
│   ├── main/
│   │   ├── java/com/sofen/backend/
│   │   │   ├── common/         # Shared utilities and configurations
│   │   │   ├── domain/         # Entity models and DTOs
│   │   │   ├── features/       # Feature-based modular structure
│   │   │   │   ├── auth/       # Authentication (JWT, Security)
│   │   │   │   ├── booking/    # Booking management logic
│   │   │   │   ├── schedule/   # Trainer scheduling
│   │   │   │   └── ...         # Other domain features
│   │   │   └── repository/     # JPA repositories
│   │   └── resources/
│   │       ├── db/migration/   # Flyway/Liquibase migrations
│   │       ├── application.properties # Main configuration
│   │       └── static/         # Static assets for backend
│   └── test/                   # Unit and integration tests
├── pom.xml                     # Maven dependencies
└── ENV_SETUP.md                # Backend-specific environment setup
```

---

## Frontend (`/frontend`)
Built with Next.js (App Router), Tailwind CSS, and TypeScript.

```text
frontend/
├── app/                  # Next.js App Router (Pages, Layouts, APIs)
│   ├── (auth)/           # Authentication-related routes
│   ├── (dashboard)/      # Protected dashboard routes
│   ├── api/              # Client-side API route handlers
│   ├── globals.css       # Global CSS and Tailwind directives
│   └── layout.tsx        # Root layout
├── public/               # Static assets (images, icons, etc.)
├── components/           # Reusable UI components
├── lib/                  # Shared libraries and utility functions
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```
