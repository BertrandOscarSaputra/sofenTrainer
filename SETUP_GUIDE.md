# Complete Setup Guide - Frontend & Backend Auth Testing

This guide helps you set up and test the complete authentication system for SofenTrainer.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (Client)                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Next.js Frontend (http://localhost:3000)              │   │
│  │  ├─ Landing Page (/)                                   │   │
│  │  ├─ Login Page (/login)                               │   │
│  │  ├─ Register Page (/register)                         │   │
│  │  └─ Dashboard (/dashboard) [Protected]                │   │
│  │                                                         │   │
│  │  Storage:                                              │   │
│  │  - localStorage: JWT Token, User Info                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           ↓                                      │
│                    HTTP Requests                                 │
│                   JWT in Headers                                 │
│                           ↓                                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    Spring Boot Backend                            │
│              (http://localhost:3535)                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Public Endpoints:                                      │   │
│  │  - POST /auth/register → Create user, return JWT       │   │
│  │  - POST /auth/login → Validate credentials, return JWT │   │
│  │                                                         │   │
│  │  Protected Endpoints:                                  │   │
│  │  - Require Authorization: Bearer <JWT>                 │   │
│  │  - Validated by JwtAuthenticationFilter                │   │
│  │                                                         │   │
│  │  Security:                                              │   │
│  │  - Passwords: BCrypt (strength 12)                     │   │
│  │  - JWT: HS256 signed with secret from .env.local       │   │
│  │  - Token expiration: Configurable (default 24h)        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           ↓                                      │
│                    Database Operations                           │
│                           ↓                                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       MySQL Database                              │
│              (localhost:3306/trainer)                            │
│  - Users table: id, name, email, password_hash, role            │
│  - All migrations handled by Flyway                             │
└─────────────────────────────────────────────────────────────────┘
```

## Prerequisites

- Java 21 or higher
- Node.js 18+ and npm
- MySQL 8.0+
- Git

## Step 1: Backend Setup

### 1.1 Configure Backend Environment

```bash
cd backend

# Create .env.local with required variables
cp .env.example .env.local
```

Edit `.env.local`:

```bash
# Generate secure JWT secret
JWT_SECRET=your-256-bit-base64-secret

# Token expiration
JWT_EXPIRATION_MINUTES=1440

# Google Gemini (optional for testing auth)
GEMINI_API_KEY=your-gemini-key

# Database
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/trainer?createDatabaseIfNotExist=true
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=
```

### 1.2 Generate Secure JWT Secret

```bash
# Linux/macOS
openssl rand -base64 32

# PowerShell Windows
[Convert]::ToBase64String((Get-Random -Count 32 -Minimum 0 -Maximum 256 | ForEach-Object {[byte]$_}))
```

### 1.3 Verify MySQL is Running

```bash
# Check MySQL service
# Windows: Should be running in Services
# macOS: brew services list
# Linux: sudo systemctl status mysql

# Connect to test
mysql -u root -h localhost
```

### 1.4 Start Backend Server

```bash
cd backend
./mvnw spring-boot:run
```

Expected output:

```
....
Starting BackendApplication v0.0.1-SNAPSHOT on YOUR_COMPUTER...
...
Backend started on port 3535
```

Verify backend is running:

```bash
curl http://localhost:3535/auth/login
# Should return 405 Method Not Allowed (POST only)
```

## Step 2: Frontend Setup

### 2.1 Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 2.2 Configure Frontend Environment

```bash
# Create .env.local
cp .env.example .env.local
```

File content:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3535
```

### 2.3 Start Frontend Dev Server

```bash
npm run dev
```

Expected output:

```
▲ Next.js 16.2.4
- Local:        http://localhost:3000
- Environments: .env.local

Ready in 1234ms
```

Verify frontend is running: Open http://localhost:3000 in browser

## Step 3: Test Authentication Flow

### Test 1: User Registration

**Step-by-step:**

1. Open http://localhost:3000
2. Click "Create Account" button
3. Fill in form:
   ```
   Full Name: John Trainer
   Email: john@trainer.com
   Password: SecurePass123
   ```
4. Click "Create account"

**Expected result:**

- ✓ Form validation passes
- ✓ Backend receives POST /auth/register
- ✓ User created with hashed password
- ✓ JWT token generated and returned
- ✓ Token stored in browser localStorage
- ✓ Redirected to /dashboard
- ✓ Dashboard shows user info

**Check in browser DevTools:**

- Application → Local Storage
- `token`: JWT token (three parts separated by dots)
- `user`: JSON with id, name, email, role

### Test 2: User Login

**Step-by-step:**

1. Logout from dashboard (click Logout button) or navigate to http://localhost:3000
2. Click "Sign In" button
3. Fill in form:
   ```
   Email: john@trainer.com
   Password: SecurePass123
   ```
4. Click "Sign in"

**Expected result:**

- ✓ Form validation passes
- ✓ Backend receives POST /auth/login
- ✓ Credentials validated against database
- ✓ JWT token generated and returned
- ✓ Token stored in localStorage
- ✓ Redirected to /dashboard
- ✓ Dashboard shows same user info

### Test 3: Invalid Credentials

**Test wrong password:**

1. Go to http://localhost:3000/login
2. Fill in:
   ```
   Email: john@trainer.com
   Password: WrongPassword
   ```
3. Click "Sign in"

**Expected result:**

- ✗ Error message: "Invalid email or password"
- ✗ Not redirected to dashboard
- ✗ No token stored

### Test 4: Duplicate Email Prevention

**Step-by-step:**

1. Go to http://localhost:3000/register
2. Fill in:
   ```
   Full Name: Different Name
   Email: john@trainer.com (same as before)
   Password: AnotherPass123
   ```
3. Click "Create account"

**Expected result:**

- ✗ Error message: "Email already exists" or "409 Conflict"
- ✗ Not redirected to dashboard
- ✗ No new user created

### Test 5: Form Validation

**Test empty fields:**

1. Go to http://localhost:3000/login
2. Click "Sign in" without filling form

**Expected result:**

- ✗ Browser validation error (HTML5)
- ✗ Request not sent to backend

**Test invalid email:**

1. Go to http://localhost:3000/register
2. Fill in:
   ```
   Full Name: Test User
   Email: invalid-email (not an email)
   Password: TestPass123
   ```
3. Click "Create account"

**Expected result:**

- ✗ Browser email validation fails
- ✗ Request not sent to backend

**Test short password:**

1. Go to http://localhost:3000/register
2. Fill in:
   ```
   Full Name: Test User
   Email: test@trainer.com
   Password: short
   ```
3. Click "Create account"

**Expected result:**

- ✗ Error: "Password must be at least 8 characters"
- ✗ Request not sent to backend

### Test 6: Protected Route

**Step-by-step:**

1. Logout or clear localStorage
2. Try to access http://localhost:3000/dashboard directly

**Expected result:**

- ✗ Redirected to http://localhost:3000/login
- ✗ Cannot access dashboard without authentication

### Test 7: Token Persistence

**Step-by-step:**

1. Login successfully
2. Close browser tab (don't clear cache)
3. Reopen http://localhost:3000/dashboard

**Expected result:**

- ✓ Redirected to dashboard (token still valid)
- ✓ User info displayed without logging in again
- ✓ Token retrieved from localStorage

## API Endpoints Reference

### Registration

```bash
POST http://localhost:3535/auth/register
Content-Type: application/json

{
  "name": "John Trainer",
  "email": "john@trainer.com",
  "password": "SecurePass123"
}

Response:
{
  "statusCode": 200,
  "message": "User registered successfully",
  "data": {
    "accessToken": "eyJhbGc...",
    "tokenType": "Bearer",
    "expiresAt": "2026-05-04T21:46:22Z",
    "user": {
      "id": 1,
      "name": "John Trainer",
      "email": "john@trainer.com",
      "role": "USER"
    }
  }
}
```

### Login

```bash
POST http://localhost:3535/auth/login
Content-Type: application/json

{
  "email": "john@trainer.com",
  "password": "SecurePass123"
}

Response:
{
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGc...",
    "tokenType": "Bearer",
    "expiresAt": "2026-05-04T21:46:22Z",
    "user": {
      "id": 1,
      "name": "John Trainer",
      "email": "john@trainer.com",
      "role": "USER"
    }
  }
}
```

### Using Protected Endpoint

```bash
GET http://localhost:3535/api/profile
Authorization: Bearer eyJhbGc...

Response: 200 OK (if token is valid)
```

## Debugging Tips

### Backend Issues

**Check backend logs:**

```bash
# Look for errors in the spring-boot:run terminal
# Common issues:
# - Port 3535 already in use
# - MySQL connection error
# - JWT_SECRET not set
# - Database migrations failed
```

**Test endpoints with curl:**

```bash
# Test registration
curl -X POST http://localhost:3535/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test1234"}'

# Test login
curl -X POST http://localhost:3535/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test1234"}'
```

### Frontend Issues

**Check browser console:**

- F12 → Console tab
- Look for JavaScript errors
- Check Network tab for failed requests

**Verify environment variables:**

```bash
# In frontend root
cat .env.local
# Should show: NEXT_PUBLIC_API_URL=http://localhost:3535
```

**Clear browser data:**

```javascript
// In browser console
localStorage.clear();
sessionStorage.clear();
// Then reload page
```

### Database Issues

**Check user table:**

```sql
mysql -u root -p trainer
SELECT id, name, email, role FROM users;
```

**Check migrations:**

```bash
# Flyway creates these tables:
# - users
# - trainers
# - schedules
# - bookings
# - booking_history
```

## Common Errors and Solutions

| Error                       | Cause                      | Solution                     |
| --------------------------- | -------------------------- | ---------------------------- |
| "Connection refused"        | Backend not running        | Run `./mvnw spring-boot:run` |
| "Invalid token"             | JWT expired or invalid     | Login again to get new token |
| "Email already exists"      | User registered twice      | Use different email          |
| "Please fill in all fields" | Validation failed          | Check form inputs            |
| "CORS error"                | Frontend/backend mismatch  | Verify NEXT_PUBLIC_API_URL   |
| "Database connection error" | MySQL not running          | Start MySQL service          |
| "Port 3535 already in use"  | Another process using port | Kill process or change port  |

## Next Development Steps

After auth testing is complete:

1. **Extend Backend**
   - Create trainer endpoints
   - Create schedule endpoints
   - Create booking endpoints

2. **Extend Frontend**
   - Build trainer listing page
   - Build schedule picker
   - Build booking form
   - Add AI recommendations

3. **Database**
   - Populate sample trainers
   - Create schedule fixtures
   - Add booking history

4. **Testing**
   - Add integration tests
   - Add end-to-end tests
   - Performance testing

## Support Resources

- **Backend docs**: `backend/ENV_SETUP.md`
- **Frontend docs**: `frontend/AUTH_TESTING.md`
- **Spring Security**: https://spring.io/projects/spring-security
- **Next.js**: https://nextjs.org/docs
- **JWT**: https://jwt.io

## Files Created

### Backend

- `.env.local` - Environment variables
- `.env.example` - Template
- `src/main/resources/application.properties` - Loads `.env.local` via `spring.config.import`
- `ENV_SETUP.md` - Backend setup guide

### Frontend

- `.env.local` - Environment variables
- `.env.example` - Template
- `lib/api.ts` - API client
- `lib/auth.ts` - Auth utilities
- `components/LoginForm.tsx` - Login form
- `components/RegisterForm.tsx` - Register form
- `app/login/page.tsx` - Login page
- `app/register/page.tsx` - Register page
- `app/dashboard/page.tsx` - Dashboard
- `app/page.tsx` - Landing page
- `AUTH_TESTING.md` - Frontend guide

---

**Status**: ✅ Complete and Ready for Testing
