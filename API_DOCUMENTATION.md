# SofenTrainer API Documentation

Base URL for backend API is typically `http://localhost:3535` as configured in `application.properties`.

All endpoints returning JSON usually wrap responses in an `ApiResponse` structure, except where specifically returning standard REST responses directly (like in the newly added feature controllers).

---

## 1. Authentication (`/auth`)

### 1.1 Register User
- **Method**: `POST`
- **URL**: `/auth/register`
- **Description**: Register a new user account.
- **Request Body** (JSON):
  ```json
  {
    "name": "User Name",
    "email": "user@example.com",
    "password": "securepassword123"
  }
  ```

### 1.2 Login User
- **Method**: `POST`
- **URL**: `/auth/login`
- **Description**: Authenticate a user and receive a JWT token.
- **Request Body** (JSON):
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123"
  }
  ```

---

## 2. Users (`/api/users`)

### 2.1 Get All Users
- **Method**: `GET`
- **URL**: `/api/users`
- **Description**: Retrieves a list of all users.

### 2.2 Get User By ID
- **Method**: `GET`
- **URL**: `/api/users/{id}`
- **Description**: Retrieve a specific user's profile.

### 2.3 Update User
- **Method**: `PUT`
- **URL**: `/api/users/{id}`
- **Description**: Update user's name or email.
- **Request Body** (JSON):
  ```json
  {
    "name": "Updated Name",
    "email": "updated_email@example.com"
  }
  ```

---

## 3. Trainers (`/api/trainers`)

### 3.1 Get All Active Trainers
- **Method**: `GET`
- **URL**: `/api/trainers`
- **Description**: List all active trainer profiles.

### 3.2 Get Trainer By ID
- **Method**: `GET`
- **URL**: `/api/trainers/{id}`
- **Description**: Get details of a specific trainer profile.

### 3.3 Create Trainer Profile
- **Method**: `POST`
- **URL**: `/api/trainers`
- **Description**: Create a trainer profile for a user (User must have `TRAINER` role).
- **Request Body** (JSON):
  ```json
  {
    "userId": 1,
    "bio": "Experienced fitness trainer...",
    "specialty": "Weightlifting"
  }
  ```

### 3.4 Update Trainer Profile
- **Method**: `PUT`
- **URL**: `/api/trainers/{id}`
- **Description**: Update trainer profile details.
- **Request Body** (JSON):
  ```json
  {
    "bio": "Updated bio...",
    "specialty": "Cardio",
    "isActive": true
  }
  ```

---

## 4. Schedules (`/api/schedules`)

### 4.1 Create Schedule
- **Method**: `POST`
- **URL**: `/api/schedules`
- **Description**: Add a new available time slot for a trainer.
- **Request Body** (JSON):
  ```json
  {
    "dayOfWeek": "MONDAY",
    "startTime": "09:00:00",
    "endTime": "11:00:00"
  }
  ```

---

## 5. Bookings (`/api/bookings`)

### 5.1 Get User's Active Bookings
- **Method**: `GET`
- **URL**: `/api/bookings`
- **Description**: Retrieve list of active bookings (PENDING or CONFIRMED) for the currently authenticated user.

### 5.2 Get Booking By ID
- **Method**: `GET`
- **URL**: `/api/bookings/{id}`
- **Description**: View details of a specific booking.

### 5.3 Create Booking
- **Method**: `POST`
- **URL**: `/api/bookings`
- **Description**: Create a new booking for a specific trainer and schedule slot.
- **Request Body** (JSON):
  ```json
  {
    "trainerId": 2,
    "scheduleId": 5,
    "notes": "Looking forward to the session!"
  }
  ```

### 5.4 Update Booking Status (Trainer/Admin)
- **Method**: `PATCH`
- **URL**: `/api/bookings/{id}/status?newStatus={STATUS}`
- **Description**: Update the status of a booking (e.g., to `CONFIRMED`, `CANCELLED`).
- **Query Params**: `newStatus` (e.g., `CONFIRMED`)

### 5.5 Cancel Booking
- **Method**: `DELETE`
- **URL**: `/api/bookings/{id}`
- **Description**: Cancel a booking. Changes status to `CANCELLED`.

### 5.6 Mark Booking Done
- **Method**: `PATCH`
- **URL**: `/api/bookings/{id}/done`
- **Description**: Mark a booking as completed. Changes status to `DONE` and auto-generates a `BookingHistory` record.

---

## 6. Booking History (`/api/booking-history`)

### 6.1 Get User's Booking History
- **Method**: `GET`
- **URL**: `/api/booking-history/user/{userId}`
- **Description**: Retrieve a user's completed sessions from the past 3 months. Used to track habits.

---

## 7. AI Recommendations (`/api/recommendations`)

### 7.1 Get Schedule Recommendations
- **Method**: `GET`
- **URL**: `/api/recommendations/{userId}`
- **Description**: Fetches an AI-generated recommended workout schedule based on the user's booking history and habits.
- **Response** (JSON):
  ```json
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
  ```

### 7.2 Interactive Schedule Adjustments (Chatbot Sync)
- **Method**: `POST`
- **URL**: `/api/recommendations/chat`
- **Description**: Allows the user to modify their AI-generated schedule using natural language chat. The AI receives the current schedule state and the user's message, then returns a conversational response alongside the newly updated schedule data.
- **Request Body** (JSON):
  ```json
  {
    "userId": 1,
    "message": "Bisakah jadwal hari Senin dipindah ke Selasa sore?",
    "currentSchedule": [
      {
        "day": "Senin",
        "startTime": "07:00",
        "duration": 60,
        "type": "Kardio",
        "reason": "Sesuai pola latihan pagi hari kamu"
      }
    ]
  }
  ```
- **Response** (JSON):
  ```json
  {
    "aiMessage": "Tentu! Sesi Kardio kamu sudah saya pindahkan ke hari Selasa jam 16:00.",
    "updatedSchedule": [
      {
        "day": "Selasa",
        "startTime": "16:00",
        "duration": 60,
        "type": "Kardio",
        "reason": "Sesuai pola latihan pagi hari kamu"
      }
    ]
  }
  ```
