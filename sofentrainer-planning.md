# SofenTrainer — Planning Pengembangan Software

> Aplikasi Booking Latihan + Rekomendasi Jadwal Berbasis Kebiasaan User
> Stack: Java Spring Boot · React · MySQL · Spring AI Gemini · Apache

---

## Daftar Isi

1. [Ringkasan Proyek](#1-ringkasan-proyek)
2. [Arsitektur Sistem](#2-arsitektur-sistem)
3. [Struktur Database](#3-struktur-database)
4. [Struktur Folder Proyek](#4-struktur-folder-proyek)
5. [API Endpoint](#5-api-endpoint)
6. [Rencana Fase Pengembangan](#6-rencana-fase-pengembangan)
7. [Implementasi Spring AI Gemini](#7-implementasi-spring-ai-gemini)
8. [Konfigurasi & Deployment](#8-konfigurasi--deployment)
9. [Checklist Fitur](#9-checklist-fitur)

---

## 1. Ringkasan Proyek

**SofenTrainer** adalah aplikasi web untuk memesan sesi latihan dengan trainer, dilengkapi sistem rekomendasi jadwal berbasis kebiasaan user yang ditenagai oleh Google Gemini melalui Spring AI.

| Komponen | Teknologi |
|---|---|
| Frontend | React + Vite + Axios + React Router + TailwindCSS |
| Backend | Java 21 + Spring Boot 3.x |
| Auth | Spring Security + JWT (JJWT) |
| AI Recommendation | Spring AI + Google Gemini (gemini-2.0-flash) |
| Database | MySQL 8.x + Spring Data JPA (Hibernate) |
| Server | Apache Tomcat (WAR deployment) |
| DB Migration | Flyway |

---

## 2. Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────┐
│                    REACT FRONTEND                        │
│  Login/Register │ Dashboard │ Booking │ Rekomendasi      │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP/REST + JWT
┌────────────────────────▼────────────────────────────────┐
│              SPRING BOOT BACKEND (Apache Tomcat)         │
│                                                          │
│  [Auth Filter JWT]                                       │
│                                                          │
│  Controllers:                                            │
│  /auth  │  /booking  │  /schedule  │  /recommendation   │
│                                                          │
│  Services:                                               │
│  AuthService │ BookingService │ ScheduleService          │
│  RecommendationService ──► Spring AI ChatClient          │
│                                    │                     │
│                            Google Gemini API             │
│                          (gemini-2.0-flash)              │
│                                                          │
│  JPA Repositories (Spring Data)                          │
└────────────────────────┬────────────────────────────────┘
                         │ JDBC / JPA
┌────────────────────────▼────────────────────────────────┐
│                    MYSQL DATABASE                        │
│  users │ trainers │ bookings │ schedules                 │
│  booking_history (dasar analisis kebiasaan + AI)         │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Struktur Database

### Tabel `users`
```sql
CREATE TABLE users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        ENUM('USER', 'TRAINER', 'ADMIN') DEFAULT 'USER',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabel `trainers`
```sql
CREATE TABLE trainers (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users(id),
    bio         TEXT,
    specialty   VARCHAR(100),
    rating      DECIMAL(3,2) DEFAULT 0.00
);
```

### Tabel `schedules`
```sql
CREATE TABLE schedules (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    trainer_id  BIGINT NOT NULL REFERENCES trainers(id),
    day_of_week ENUM('MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'),
    start_time  TIME NOT NULL,
    end_time    TIME NOT NULL,
    status      ENUM('AVAILABLE','BOOKED','BLOCKED') DEFAULT 'AVAILABLE'
);
```

### Tabel `bookings`
```sql
CREATE TABLE bookings (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users(id),
    trainer_id  BIGINT NOT NULL REFERENCES trainers(id),
    schedule_id BIGINT NOT NULL REFERENCES schedules(id),
    booked_at   DATETIME NOT NULL,
    duration_minutes INT DEFAULT 60,
    status      ENUM('PENDING','CONFIRMED','CANCELLED','DONE') DEFAULT 'PENDING',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabel `booking_history` *(kunci untuk AI recommendation)*
```sql
CREATE TABLE booking_history (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id          BIGINT NOT NULL REFERENCES users(id),
    trainer_id       BIGINT NOT NULL REFERENCES trainers(id),
    booked_at        DATETIME NOT NULL,
    duration_minutes INT DEFAULT 60,
    day_of_week      VARCHAR(10),
    time_of_day      ENUM('PAGI','SIANG','SORE','MALAM'),
    completed        BOOLEAN DEFAULT TRUE,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

> **Catatan:** `booking_history` diisi otomatis oleh `BookingService` setiap kali booking berstatus `DONE`. Tabel ini digunakan `RecommendationService` untuk membangun konteks prompt ke Gemini.

---

## 4. Struktur Folder Proyek

### Backend (Spring Boot)
```
sofentrainer-backend/
├── src/main/java/com/sofentrainer/
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   ├── JwtTokenProvider.java
│   │   └── SpringAiConfig.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── BookingController.java
│   │   ├── ScheduleController.java
│   │   └── RecommendationController.java
│   ├── service/
│   │   ├── AuthService.java
│   │   ├── BookingService.java
│   │   ├── ScheduleService.java
│   │   └── RecommendationService.java
│   ├── entity/
│   │   ├── User.java
│   │   ├── Trainer.java
│   │   ├── Booking.java
│   │   ├── Schedule.java
│   │   └── BookingHistory.java
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── TrainerRepository.java
│   │   ├── BookingRepository.java
│   │   ├── ScheduleRepository.java
│   │   └── BookingHistoryRepository.java
│   ├── dto/
│   │   ├── request/
│   │   │   ├── LoginRequest.java
│   │   │   ├── RegisterRequest.java
│   │   │   └── BookingRequest.java
│   │   └── response/
│   │       ├── AuthResponse.java
│   │       ├── BookingResponse.java
│   │       └── RecommendationResponse.java
│   └── SofenTrainerApplication.java
├── src/main/resources/
│   ├── application.properties
│   ├── application-dev.properties
│   ├── application-prod.properties
│   └── db/migration/
│       ├── V1__create_users.sql
│       ├── V2__create_trainers.sql
│       ├── V3__create_schedules.sql
│       ├── V4__create_bookings.sql
│       └── V5__create_booking_history.sql
└── pom.xml
```

### Frontend (React)
```
sofentrainer-frontend/
├── src/
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── BookingPage.jsx
│   │   └── RecommendationPage.jsx
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── BookingCard.jsx
│   │   ├── TrainerCard.jsx
│   │   ├── ScheduleSlot.jsx
│   │   └── RecommendationCard.jsx
│   ├── services/
│   │   ├── api.js          ← Axios instance + interceptor JWT
│   │   ├── authService.js
│   │   ├── bookingService.js
│   │   └── recommendationService.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   └── useAuth.js
│   └── App.jsx
├── .env
└── vite.config.js
```

---

## 5. API Endpoint

### Auth
| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/auth/register` | Daftar user baru |
| POST | `/auth/login` | Login, return JWT token |

### Booking
| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| GET | `/booking` | List booking milik user | ✅ |
| POST | `/booking` | Buat booking baru | ✅ |
| GET | `/booking/{id}` | Detail booking | ✅ |
| DELETE | `/booking/{id}` | Batalkan booking | ✅ |
| PATCH | `/booking/{id}/done` | Tandai selesai (trigger history) | ✅ |

### Schedule
| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| GET | `/schedule/trainer/{id}` | Slot tersedia trainer | ✅ |
| POST | `/schedule` | Tambah slot (trainer only) | ✅ TRAINER |

### Recommendation
| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| GET | `/recommendation/{userId}` | Rekomendasi jadwal dari Gemini | ✅ |

---

## 6. Rencana Fase Pengembangan

### Fase 1 — Setup & Fondasi *(Minggu 1–2)*

**Backend**
- [ ] Init Spring Boot project (Spring Web, Security, Data JPA, MySQL Driver, JJWT, Spring AI)
- [ ] Setup `application.properties` untuk koneksi MySQL dan profile dev/prod
- [ ] Buat entity JPA: User, Trainer, Booking, Schedule, BookingHistory
- [ ] Setup Flyway migration, jalankan V1–V5

**Frontend**
- [ ] Init React + Vite project
- [ ] Install: Axios, React Router, TailwindCSS
- [ ] Setup Axios instance dengan base URL dan JWT interceptor
- [ ] Buat `AuthContext` dan `useAuth` hook

---

### Fase 2 — Autentikasi *(Minggu 2–3)*

**Backend**
- [ ] Implementasi `JwtTokenProvider` (generate, validate, extract claims)
- [ ] `SecurityConfig` dengan JWT filter chain
- [ ] `AuthController`: POST `/auth/register` dan `/auth/login`
- [ ] `UserDetailsService` untuk load user dari DB

**Frontend**
- [ ] Halaman Login dan Register
- [ ] Simpan JWT di `localStorage`, attach ke header `Authorization`
- [ ] Protected route (redirect ke login jika tidak ada token)

---

### Fase 3 — Fitur Booking & Jadwal *(Minggu 3–5)*

**Backend**
- [ ] `ScheduleController` dan `ScheduleService`
  - GET slot tersedia per trainer
  - POST tambah slot (khusus TRAINER role)
- [ ] `BookingController` dan `BookingService`
  - Validasi: cek konflik jadwal, cek slot masih AVAILABLE
  - POST booking → ubah status schedule ke BOOKED
  - PATCH done → simpan ke `booking_history`
- [ ] `BookingHistoryRepository` dengan query analisis kebiasaan

**Frontend**
- [ ] Halaman Booking: pilih trainer → kalender slot → konfirmasi
- [ ] Dashboard: list booking aktif, riwayat, status badge
- [ ] Notifikasi sukses/gagal booking

---

### Fase 4 — Spring AI + Gemini Recommendation *(Minggu 5–6)*

**Backend**
- [ ] Tambah dependency `spring-ai-google-genai-spring-boot-starter`
- [ ] Konfigurasi `GEMINI_API_KEY` di environment variable
- [ ] `RecommendationService`:
  - Query `booking_history` → rangkum pola (hari favorit, waktu, durasi)
  - Build prompt konteks + instruksi JSON output
  - Panggil `ChatClient.prompt().user(prompt).call().content()`
  - Parse response JSON ke `RecommendationResponse` DTO
- [ ] `RecommendationController`: GET `/recommendation/{userId}`

**Frontend**
- [ ] Halaman Rekomendasi: tampilkan kartu saran per hari
- [ ] Tombol "Booking Sekarang" dari kartu rekomendasi → redirect ke halaman booking dengan slot pre-filled

---

### Fase 5 — Testing & Polish *(Minggu 6–7)*

- [ ] Unit test `BookingService` dan `RecommendationService` dengan JUnit 5 + Mockito
- [ ] Integration test endpoint dengan Spring Boot Test + MockMvc
- [ ] Validasi input (Bean Validation / `@Valid`) di semua controller
- [ ] Global exception handler (`@ControllerAdvice`)
- [ ] CORS config di `SecurityConfig` untuk allow domain frontend

---

### Fase 6 — Deployment *(Minggu 7–8)*

- [ ] Build backend sebagai WAR: `mvn clean package -Pprod`
- [ ] Deploy WAR ke Apache Tomcat server
- [ ] Build frontend: `npm run build` → serve static via Nginx atau sub-path Apache
- [ ] Setup environment variable production (DB credentials, JWT secret, Gemini API key)
- [ ] Konfigurasi SSL (HTTPS) di Apache
- [ ] Smoke test semua endpoint di production

---

## 7. Implementasi Spring AI Gemini

### Dependency (`pom.xml`)
```xml
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-google-genai-spring-boot-starter</artifactId>
    <version>1.0.0</version>
</dependency>
```

### Konfigurasi (`application.properties`)
```properties
# Google AI Studio (development)
spring.ai.google.genai.api-key=${GEMINI_API_KEY}
spring.ai.google.genai.chat.options.model=gemini-2.0-flash
spring.ai.google.genai.chat.options.temperature=0.7
spring.ai.google.genai.chat.options.max-tokens=1024
```

### `RecommendationService.java`
```java
@Service
public class RecommendationService {

    private final ChatClient chatClient;
    private final BookingHistoryRepository historyRepo;

    public RecommendationService(ChatClient.Builder builder,
                                  BookingHistoryRepository historyRepo) {
        this.chatClient = builder.build();
        this.historyRepo = historyRepo;
    }

    public RecommendationResponse generateRecommendation(Long userId) {
        List<BookingHistory> history = historyRepo.findByUserId(userId);

        if (history.isEmpty()) {
            return RecommendationResponse.defaultSchedule();
        }

        String context = buildContext(history);

        String prompt = """
            Kamu adalah asisten fitness profesional.
            Berdasarkan kebiasaan latihan user berikut:
            %s

            Rekomendasikan jadwal latihan optimal untuk minggu depan.
            Sertakan: hari, waktu mulai, durasi, jenis latihan, dan alasan singkat.
            
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

        String rawResponse = chatClient.prompt()
                .user(prompt)
                .call()
                .content();

        return parseResponse(rawResponse);
    }

    private String buildContext(List<BookingHistory> history) {
        Map<String, Long> dayCount = history.stream()
            .collect(Collectors.groupingBy(
                h -> h.getDayOfWeek(),
                Collectors.counting()
            ));
        Map<String, Long> timeCount = history.stream()
            .collect(Collectors.groupingBy(
                h -> h.getTimeOfDay().name(),
                Collectors.counting()
            ));
        double avgDuration = history.stream()
            .mapToInt(BookingHistory::getDurationMinutes)
            .average().orElse(60);

        return String.format(
            "Total sesi: %d | Hari favorit: %s | Waktu favorit: %s | Durasi rata-rata: %d menit",
            history.size(), dayCount, timeCount, (int) avgDuration
        );
    }

    private RecommendationResponse parseResponse(String raw) {
        // Strip markdown code block jika ada
        String json = raw.replaceAll("```json|```", "").trim();
        // Parse dengan ObjectMapper atau Gson
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.readValue(json, RecommendationResponse.class);
        } catch (Exception e) {
            return RecommendationResponse.defaultSchedule();
        }
    }
}
```

### `RecommendationResponse.java`
```java
public class RecommendationResponse {
    private List<ScheduleItem> recommendations;

    public static RecommendationResponse defaultSchedule() {
        ScheduleItem item = new ScheduleItem(
            "Senin", "07:00", 60, "Kardio", "Jadwal default untuk pemula"
        );
        return new RecommendationResponse(List.of(item));
    }

    // Getters, setters, constructors...

    public record ScheduleItem(
        String day,
        String startTime,
        int duration,
        String type,
        String reason
    ) {}
}
```

---

## 8. Konfigurasi & Deployment

### `application-prod.properties`
```properties
# Database
spring.datasource.url=jdbc:mysql://${DB_HOST}:3306/${DB_NAME}
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASS}
spring.jpa.hibernate.ddl-auto=validate

# JWT
app.jwt.secret=${JWT_SECRET}
app.jwt.expiration=86400000

# Gemini
spring.ai.google.genai.api-key=${GEMINI_API_KEY}

# Server
server.servlet.context-path=/api
```

### Environment Variables yang Dibutuhkan
```bash
DB_HOST=localhost
DB_NAME=sofentrainer_db
DB_USER=sofentrainer_user
DB_PASS=your_secure_password
JWT_SECRET=your_256bit_jwt_secret_key
GEMINI_API_KEY=your_google_ai_studio_key
```

### Build & Deploy
```bash
# Backend
mvn clean package -Pprod -DskipTests
cp target/sofentrainer.war /opt/tomcat/webapps/

# Frontend
npm run build
cp -r dist/* /var/www/sofentrainer/
```

---

## 9. Checklist Fitur

### MVP (Minimum Viable Product)
- [ ] Register & Login user
- [ ] Lihat daftar trainer dan jadwal tersedia
- [ ] Booking sesi latihan
- [ ] Batalkan booking
- [ ] Dashboard riwayat booking
- [ ] Rekomendasi jadwal berbasis AI (Gemini)

### Nice to Have (Post-MVP)
- [ ] Notifikasi email konfirmasi booking (Spring Mail)
- [ ] Rating trainer setelah sesi selesai
- [ ] Filter trainer berdasarkan spesialisasi
- [ ] Kalender view jadwal user
- [ ] Admin dashboard (kelola user, trainer, booking)
- [ ] Streaming response Gemini (Server-Sent Events) untuk UX lebih smooth
- [ ] Cache rekomendasi Gemini (Redis) agar tidak panggil API setiap request

---

*Dokumen ini adalah living document — update sesuai progres development.*
