# SofenTrainer Frontend - Auth Testing UI

Complete frontend authentication UI for testing the secure login/register system.

## Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Backend URL

The frontend connects to the backend API at `http://localhost:3535` by default.

Create or update `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3535
```

### 3. Start Backend (if not already running)

In a separate terminal:

```bash
cd backend
./mvnw spring-boot:run
```

Ensure:

- Backend is running on port 3535
- `.env.local` file has `JWT_SECRET` and other required env vars set

### 4. Start Frontend Dev Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Features

### 🏠 Landing Page (`/`)

- Home page with feature overview
- Sign in / Create account buttons
- Redirects to dashboard if already logged in

### 📝 Register Page (`/register`)

- Create new user account
- Form validation:
  - Name: required, max 100 chars
  - Email: valid email format
  - Password: minimum 8 characters
- Automatically logs in after successful registration
- Redirects to dashboard

### 🔐 Login Page (`/login`)

- Sign in with email and password
- Email and password validation
- Error messages for invalid credentials
- Automatically stores JWT token
- Redirects to dashboard on success

### 📊 Dashboard (`/dashboard`)

- Protected page - requires authentication
- Displays user information
- Shows account details (name, email, role, ID)
- Lists upcoming features
- Logout button

## Architecture

### File Structure

```
frontend/
├── app/
│   ├── page.tsx              # Landing page
│   ├── login/
│   │   └── page.tsx          # Login page
│   ├── register/
│   │   └── page.tsx          # Register page
│   ├── dashboard/
│   │   └── page.tsx          # Protected dashboard
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── LoginForm.tsx         # Login form component
│   └── RegisterForm.tsx      # Register form component
├── lib/
│   ├── api.ts                # API client for backend calls
│   └── auth.ts               # Auth utilities (token, user management)
├── .env.local                # Local environment variables
├── .env.example              # Example env variables
└── package.json              # Dependencies
```

### API Integration

**API Client** (`lib/api.ts`):

- `apiClient.register(data)` - POST /auth/register
- `apiClient.login(data)` - POST /auth/login
- Automatically handles JWT token in requests
- Error handling with user-friendly messages

**Auth Utilities** (`lib/auth.ts`):

- `saveToken()` - Store JWT in localStorage
- `getToken()` - Retrieve JWT from localStorage
- `isAuthenticated()` - Check if user has valid token
- `saveUser()` - Store user info in localStorage
- `getAuthState()` - Get complete auth state
- Token expiration validation

## Testing the System

### Test User Registration

1. Go to http://localhost:3000
2. Click "Create Account"
3. Fill in:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Password: `password123`
4. Click "Create account"
5. ✓ Should redirect to dashboard

### Test User Login

1. Go to http://localhost:3000
2. Click "Sign In"
3. Fill in:
   - Email: `john@example.com`
   - Password: `password123`
4. Click "Sign in"
5. ✓ Should redirect to dashboard with user info

### Test Duplicate Email Prevention

1. Try to register with the same email again
2. ✓ Should show error: "Email already exists"

### Test Token Expiration

1. Login successfully
2. Open browser DevTools → Application → Local Storage
3. Find the `token` entry - it contains your JWT
4. Wait for token expiration time to pass (default 24 hours)
5. ✓ Dashboard should redirect to login on next request

### Test Protected Route

1. Try accessing `/dashboard` without logging in
2. ✓ Should redirect to `/login`

## Available Routes

| Route        | Component      | Protection                |
| ------------ | -------------- | ------------------------- |
| `/`          | Landing Page   | Public                    |
| `/login`     | Login Form     | Public                    |
| `/register`  | Register Form  | Public                    |
| `/dashboard` | User Dashboard | Protected (Requires Auth) |

## Technology Stack

- **Framework**: Next.js 16
- **Runtime**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State**: React Hooks (useState, useEffect)
- **Navigation**: Next.js App Router
- **API Communication**: Fetch API
- **Auth Storage**: Browser localStorage

## Environment Variables

| Variable              | Description     | Example                 |
| --------------------- | --------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3535` |

Note: `NEXT_PUBLIC_` prefix makes the variable available in the browser.

## Building for Production

```bash
# Build the app
npm run build

# Start production server
npm start
```

## Troubleshooting

### "Connection refused" error

- Ensure backend is running on port 3535
- Check `NEXT_PUBLIC_API_URL` is correct
- Verify backend `.env.local` has JWT_SECRET set

### "Invalid email or password" on login

- Check email and password are correct in backend database
- Verify user was registered successfully (check dashboard redirect)

### Token not persisting

- Check browser localStorage is enabled
- Check browser privacy settings aren't blocking localStorage
- Verify no browser extensions are clearing data

### CORS errors

- Ensure backend SecurityConfig allows CORS for `http://localhost:3000`
- Current backend config allows all origins (`*`) for development

### "Please fill in all fields" error

- Ensure all form fields are filled before submitting
- Email must be valid format
- Password minimum 8 characters for registration

## Next Steps

After auth testing is complete:

1. **Schedule Management**
   - Create pages for viewing trainer schedules
   - Build UI for managing availability

2. **Booking System**
   - Create booking request forms
   - Build booking management dashboard
   - Add cancellation and rescheduling

3. **User Profiles**
   - Profile editing page
   - Profile picture upload
   - Preference settings

4. **Recommendations**
   - Display AI-recommended trainers
   - Show personalized training suggestions

5. **Booking History**
   - List past bookings
   - Show upcoming sessions
   - Review and ratings

## Support

For issues or questions:

1. Check the backend logs for API errors
2. Check browser console for client-side errors
3. Verify environment variables are set correctly
4. Ensure both frontend and backend are running
