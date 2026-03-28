# 10_Auth_Project

This project implements JWT authentication with a session-based refresh token strategy.

## Auth and Session Concept

### Token Types

1. Access Token
- Short-lived token for protected APIs.
- Includes: `id`, `role`, `sessionId`.
- TTL: 15 minutes.
- Client storage: memory (recommended).

2. Refresh Token
- Long-lived token used only to get a new access token.
- TTL: 7 days.
- Sent and stored in `httpOnly` cookie.
- Stored in DB as a hash (not plain token).

### Session Model (MongoDB)

Each login/register creates one session document:

- `user`: ObjectId of user
- `refreshToken`: bcrypt hash of refresh token
- `ip`: request IP
- `userAgent`: device/browser details
- `revoke`: session active/inactive flag
- `createdAt`, `updatedAt`: timestamps

### Session Lifecycle

1. Register or Login
- Server creates refresh token.
- Server hashes refresh token.
- Server creates session entry in DB.
- Server returns access token and sets refresh token cookie.

2. Refresh Access Token (`/auth/refresh-token`)
- Server reads refresh token from cookie.
- Validates JWT signature and expiry.
- Finds active session (`revoke: false`) for user.
- Compares incoming token with hashed token in DB.
- Rotates refresh token (new token + new hash).
- Sends new access token + new refresh cookie.

3. Logout (`/auth/logout`)
- Verifies incoming refresh token.
- Marks matching session `revoke: true`.
- Clears refresh token cookie.

4. Logout All (`/auth/logout-all`)
- Revokes all active sessions for the user.
- Clears refresh token cookie.

## Security Notes

- Keep access token TTL short.
- Do not store refresh token in local storage.
- Use `httpOnly`, `secure`, `sameSite` cookies for refresh token.
- Hash refresh tokens before saving in database.

## Required Environment Variables

Create `.env` in project root:

```env
# App
NODE_ENV=development
PORT=3000

# Database
MONGO_URI=mongodb://127.0.0.1:27017/auth-project

# JWT
JWT_SECRET=your_jwt_secret_here

# Google OAuth + Gmail API (for Nodemailer)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://developers.google.com/oauthplayground
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
GOOGLE_USER=your_gmail_address@gmail.com
```

`GOOGLE_REFRESH_TOKEN` and `GOOGLE_USER` are required to send email via Gmail OAuth2.

## Nodemailer + Gmail API Setup (Step by Step)

### 1. Prepare Gmail Account

1. Use the Gmail account you want as sender.
2. Enable 2-Step Verification for that account.

### 2. Create Google Cloud Project

1. Open Google Cloud Console.
2. Create a new project.
3. Open APIs and Services.

### 3. Enable Gmail API

1. Go to Library.
2. Search `Gmail API`.
3. Enable it for your project.

### 4. Configure OAuth Consent Screen

1. Open OAuth consent screen.
2. Choose External (or Internal for Workspace org).
3. Fill app details.
4. Add your Gmail account in Test users.

### 5. Create OAuth Credentials

1. Go to Credentials.
2. Create Credentials -> OAuth client ID.
3. Application type: Web application.
4. Add authorized redirect URI:
	 `https://developers.google.com/oauthplayground`
5. Save and copy Client ID and Client Secret.

### 6. Generate Refresh Token

1. Open OAuth 2.0 Playground.
2. Click settings icon (top-right):
	 - Enable `Use your own OAuth credentials`.
	 - Paste your Client ID and Client Secret.
3. In scopes, select Gmail scope:
	 `https://mail.google.com/`
4. Click Authorize APIs.
5. Sign in using the same Gmail user (`GOOGLE_USER`).
6. Click Exchange authorization code for tokens.
7. Copy refresh token and set it as `GOOGLE_REFRESH_TOKEN`.

### 7. Install Packages

```bash
npm install nodemailer googleapis
```

### 8. Configure Transporter Example

```js
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const oAuth2Client = new google.auth.OAuth2(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	process.env.GOOGLE_REDIRECT_URI
);

oAuth2Client.setCredentials({
	refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

async function createTransporter() {
	const accessToken = await oAuth2Client.getAccessToken();

	return nodemailer.createTransport({
		service: 'gmail',
		auth: {
			type: 'OAuth2',
			user: process.env.GOOGLE_USER,
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
			accessToken: accessToken.token
		}
	});
}

module.exports = { createTransporter };
```

## Common Issues

- `invalid_grant`: refresh token expired or generated with wrong OAuth client.
- `unauthorized_client`: OAuth consent/config mismatch.
- `redirect_uri_mismatch`: redirect URI in credentials does not match actual URI.
- `insufficient permissions`: wrong Gmail scope selected.

## Auth Routes

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/logout`
- `GET /auth/logout-all`
- `GET /auth/get-me`
- `GET /auth/refresh-token`