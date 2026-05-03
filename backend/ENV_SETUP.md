# Environment Variable Setup

This document explains how to configure environment variables for SofenTrainer backend.

## Required Environment Variables

| Variable                 | Description                                   | Example                                       |
| ------------------------ | --------------------------------------------- | --------------------------------------------- |
| `JWT_SECRET`             | 256-bit BASE64-encoded secret for JWT signing | `c29mZW50cmFpbmVyLXNlY3VyZS1qd3Qtc2VjcmV0...` |
| `JWT_EXPIRATION_MINUTES` | JWT token expiration time in minutes          | `1440` (24 hours)                             |
| `GEMINI_API_KEY`         | Google Gemini API key for AI features         | `AIzaSyD...`                                  |

## Local Development Setup

### Option 1: Using .env.local file (Recommended for Development)

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and fill in your actual values:

   ```
   JWT_SECRET=your-base64-secret-here
   JWT_EXPIRATION_MINUTES=1440
   GEMINI_API_KEY=your-api-key-here
   ```

3. To use `.env.local` in IDE or command line, you have two options:

   **Option A: Spring Boot with dotenv (Recommended)**
   - The current setup expects environment variables to be set in your system

   **Option B: IDE Configuration**
   - **VS Code**: Create `.vscode/launch.json` and add env vars
   - **IntelliJ IDEA**: Run → Edit Configurations → Environment variables
   - **Eclipse**: Run → Run Configurations → Environment tab

4. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

### Option 2: System Environment Variables

Set environment variables directly in your system:

**Windows (PowerShell):**

```powershell
$env:JWT_SECRET="your-base64-secret"
$env:GEMINI_API_KEY="your-api-key"
$env:JWT_EXPIRATION_MINUTES="1440"
```

**Windows (Command Prompt):**

```cmd
set JWT_SECRET=your-base64-secret
set GEMINI_API_KEY=your-api-key
set JWT_EXPIRATION_MINUTES=1440
```

**Linux/macOS:**

```bash
export JWT_SECRET="your-base64-secret"
export GEMINI_API_KEY="your-api-key"
export JWT_EXPIRATION_MINUTES="1440"
```

### Option 3: Maven Command Line

```bash
./mvnw spring-boot:run -DJWT_SECRET="your-secret" -DGEMINI_API_KEY="your-key"
```

## Docker Deployment

### docker-compose.yml

```yaml
version: "3.8"
services:
  backend:
    build: .
    environment:
      JWT_SECRET: ${JWT_SECRET}
      GEMINI_API_KEY: ${GEMINI_API_KEY}
      JWT_EXPIRATION_MINUTES: 1440
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/trainer
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}
    ports:
      - "3535:3535"
    depends_on:
      - mysql
```

Then run:

```bash
export JWT_SECRET="your-secret"
export GEMINI_API_KEY="your-api-key"
docker-compose up
```

### Dockerfile

```dockerfile
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app
COPY . .
RUN mvn clean package

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /app/target/backend-*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Then build and run:

```bash
docker build -t sofen-trainer-backend .
docker run -e JWT_SECRET="secret" -e GEMINI_API_KEY="key" sofen-trainer-backend
```

## CI/CD Deployment (GitHub Actions / Azure DevOps)

### GitHub Actions Example

```yaml
name: Deploy
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          java-version: "21"
      - run: mvn clean package
        env:
          JWT_SECRET: ${{ secrets.JWT_SECRET }}
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
```

Store secrets in GitHub Settings → Secrets and variables → Actions.

## Generating a Secure JWT_SECRET

Generate a 256-bit BASE64-encoded secret:

**Linux/macOS:**

```bash
openssl rand -base64 32
```

**PowerShell:**

```powershell
[Convert]::ToBase64String((Get-Random -Count 32 -Minimum 0 -Maximum 256 | ForEach-Object {[byte]$_}))
```

## Getting GEMINI_API_KEY

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key
5. Store it in `.env.local` or as an environment variable

## Important Security Notes

⚠️ **Never commit `.env.local` or `.env` files to version control**

- These files are in `.gitignore` to prevent accidental commits
- Always use `.env.example` as a template for team members

⚠️ **Never hardcode secrets in code**

- The `${VAR_NAME:default}` syntax in `application.properties` reads from environment variables
- Fallback defaults are for development only

⚠️ **Use strong JWT secrets**

- Minimum 256-bit (32 bytes) for HMAC-SHA256
- Use the command above to generate

⚠️ **Protect your API keys**

- Treat GEMINI_API_KEY like a password
- Use CI/CD secrets management, not plain text
- Rotate keys periodically in production

## Testing Your Setup

After setting environment variables, test with:

```bash
# Should return JWT token in response
curl -X POST http://localhost:3535/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123"}'
```

If you see the auth endpoints working, environment variables are properly configured.

## Troubleshooting

**JWT tokens not generated?**

- Check JWT_SECRET is set: `echo $JWT_SECRET`
- Verify it's 256-bit BASE64 encoded
- Restart the application after setting env vars

**GEMINI_API_KEY not working?**

- Verify key is from [Google AI Studio](https://aistudio.google.com/app/apikey)
- Check the key has the format `AIza...`
- Ensure API is enabled in Google Cloud Console

**"Invalid API Key" error?**

- Key may have expired or been revoked
- Generate a new key from Google AI Studio
- Update environment variable

## Next Steps

Once environment variables are configured:

1. Run backend: `./mvnw spring-boot:run`
2. Test endpoints with curl or Postman
3. Connect frontend to `http://localhost:3535`
