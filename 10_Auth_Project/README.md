# Auth Project (JWT + Refresh Session + OTP Email Verification)

This project is a complete authentication backend built with Express and MongoDB.

It teaches practical auth patterns:
1. Account registration with hashed password.
2. Email verification using OTP.
3. Login with JWT access token.
4. Refresh token rotation using secure cookie + DB session hash.
5. Single-device logout and logout-all-devices.

This README is written as a future reference so you can quickly understand the codebase, run it, debug it, and improve it.

## 1. Quick Start

### Prerequisites

- Node.js 18+
- MongoDB local/Atlas
- Gmail sender setup (App Password or OAuth2)

### Install

```bash
npm install
```

### Create `.env`

```env
# Core
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/auth-project
JWT_SECRET=replace_with_strong_secret

# Email sender identity (required for sending OTP emails)
GOOGLE_USER=your_email@gmail.com

# Option A: Gmail App Password (easiest for local development)
GOOGLE_APP_PASSWORD=your_16_char_app_password

# Option B: OAuth2 (use this if not using app password)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=https://developers.google.com/oauthplayground
GOOGLE_REFRESH_TOKEN=
```

### Run

```bash
npm run dev
```

Server base URL:

```txt
http://localhost:3000
```

Auth API base URL:

```txt
http://localhost:3000/api/auth
```

## 2. Project Structure

```txt
server.js                  # Entry point: connect DB and start server
src/app.js                 # Express app setup, middleware, routes
src/config/config.js       # Environment variable loading + exports
src/config/database.js     # MongoDB connection
src/controllers/auth.controller.js
src/routes/auth.routes.js
src/models/user.model.js
src/models/session.model.js
src/models/otp.model.js
src/services/email.service.js
src/utils/otp.util.js
```

## 3. Authentication Architecture

### Token Strategy

1. Access token
- Purpose: authorize protected routes.
- Storage: client memory recommended.
- Lifetime: 15 minutes.
- Payload: `id`, `role`, `sessionId`.

2. Refresh token
- Purpose: issue new access tokens.
- Storage: `httpOnly` cookie.
- Lifetime: 7 days.
- Database: only bcrypt hash is stored (never raw token).

### Session Strategy

Each successful login creates a session document with:
- `user` (ObjectId)
- `refreshToken` (bcrypt hash)
- `ip`
- `userAgent`
- `revoke` (boolean)
- timestamps

This enables per-device control and refresh-token revocation.

## 4. End-to-End Flow

### Register

1. Validate input (`fullName`, `username`, `email`, `password`).
2. Normalize username/email to lowercase.
3. Check duplicates.
4. Hash password and create user.
5. Generate 6-digit OTP and hash it.
6. Save OTP hash in `otps` collection.
7. Send OTP email.

### Verify Email

1. Receive `email` + `otp`.
2. Fetch latest OTP document for email.
3. Compare OTP using bcrypt.
4. Mark user `verified: true`.
5. Delete OTP records for that user.

### Login

1. Validate credentials.
2. Verify password hash.
3. Block if user not verified.
4. Create refresh token (7d).
5. Hash refresh token and store in session.
6. Create access token (15m).
7. Set refresh token in secure cookie.

### Refresh Token

1. Read refresh token from cookie.
2. Verify JWT.
3. Find active session.
4. Compare token with stored hash.
5. Issue new access token.
6. Rotate refresh token and update session hash.

### Logout

1. Read refresh token from cookie.
2. Validate against active session hash.
3. Mark session `revoke: true`.
4. Clear refresh cookie.

### Logout All

1. Verify incoming refresh token.
2. Revoke all active sessions of that user.
3. Clear refresh cookie.

## 5. API Reference

Base path: `/api/auth`

### `POST /register`

Body:

```json
{
  "fullName": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "Password123"
}
```

Success: `201 Created`

### `GET /verify-email`

Current controller expects `email` and `otp` in request body.

Body:

```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

Success: `200 OK`

### `POST /login`

Body (username flow):

```json
{
  "username": "johndoe",
  "password": "Password123"
}
```

Body (email flow):

```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

Success: `200 OK`
- Returns `accessToken` in JSON.
- Sets `refreshToken` cookie.

### `GET /refresh-token`

Requires refresh cookie.

Success: `200 OK`
- Returns new access token.
- Rotates refresh cookie.

### `GET /get-me`

Header:

```txt
Authorization: Bearer <access_token>
```

Success: `200 OK`

### `GET /logout`

Requires refresh cookie.

Success: `200 OK`

### `GET /logout-all`

Requires refresh cookie.

Success: `200 OK`

## 6. Testing with Postman or Thunder Client

1. Call `POST /register`.
2. Read OTP from email inbox.
3. Call `GET /verify-email` with body.
4. Call `POST /login`.
5. Copy `accessToken` for protected calls.
6. Ensure cookie jar is enabled so refresh cookie is sent automatically.
7. Call `GET /refresh-token` to get a new access token.
8. Call `GET /logout` and `GET /logout-all` to validate revocation behavior.

## 7. Security Notes

- Passwords and refresh tokens are hashed before DB storage.
- Refresh token is stored in `httpOnly` cookie.
- Access token TTL is short to reduce compromise window.
- Session records support device-aware revocation.

Recommended next hardening:
1. Add rate limiting on login/OTP endpoints.
2. Add account lockout/backoff on repeated bad passwords.
3. Add CSRF protection if using cookies across browser contexts.
4. Add OTP expiration enforcement at query level.

## 8. Common Issues and Fixes

1. No refresh cookie in local testing
- Reason: cookie is set with `secure: true`, which requires HTTPS.
- Fix options:
  - Use HTTPS locally (best), or
  - Toggle cookie `secure` by environment for development.

2. Email sending fails
- Verify `GOOGLE_USER` is set.
- Use either:
  - `GOOGLE_APP_PASSWORD`, or
  - OAuth2 trio (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`).

3. Mongo connection error
- Ensure `MONGO_URI` is valid and MongoDB is reachable.

4. Invalid or expired token errors
- Access token expired after 15m; call refresh endpoint using refresh cookie.

## 9. Current Code Caveats (Good Learning Opportunities)

These are useful improvements to practice next:

1. `loginUser` query currently uses object keys `normalizedUsername` / `normalizedEmail` instead of schema keys `username` / `email`.
2. `verifyEmail` route is registered as `GET` but expects body data; `POST` is usually more appropriate.
3. `logoutUser` selects any active session without filtering by user from decoded token.
4. OTP HTML says "valid for 10 minutes" but DB logic does not enforce explicit OTP expiry yet.

Implementing these will improve correctness and security.

## 10. Suggested Learning Roadmap

If you revisit this project in future, improve in this order:

1. Fix endpoint/method consistency (`verify-email` to `POST`).
2. Fix login query bug and add unit tests for username/email login.
3. Add middleware-based auth guard for protected routes.
4. Add OTP expiration field + cleanup job.
5. Add refresh token family/rotation replay detection.
6. Add Swagger/OpenAPI docs and request validation (Joi/Zod).
7. Add integration tests for full auth lifecycle.

## 11. NPM Scripts

```bash
npm run dev     # Start with nodemon
npm start       # Start with node
```

## 12. License

ISC