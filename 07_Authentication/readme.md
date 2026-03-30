# 07 Authentication - JWT Cookie Auth Basics 🔐

This module introduces practical authentication with JWT and cookies, layered on Express + MongoDB.

---

## 🎯 What You Learn

- User registration flow
- Token generation with JWT
- Cookie-based authentication
- Protected route verification pattern

---

## 🧩 Build Sequence

### 1) Server Startup
- [server.js](server.js) connects DB and starts app
- Port is read from env with fallback to 3000

### 2) App Middleware and Route Mounting
- [src/app.js](src/app.js) enables:
  - `express.json()`
  - `cookie-parser`
- Route groups:
  - `/api/auth`
  - `/api/posts`

### 3) Database Layer
- [src/db/db.js](src/db/db.js) connects MongoDB using `MONGO_URI`

### 4) User Model
- [src/models/user.model.js](src/models/user.model.js)
- Fields: username, email (unique), password

### 5) Auth Controller Flow
- [src/controllers/auth.controller.js](src/controllers/auth.controller.js)
- Register flow:
  1. Read body
  2. Check duplicate email
  3. Create user
  4. Generate token
  5. Set token cookie

### 6) Protected Route Pattern
- [src/routes/post.routes.js](src/routes/post.routes.js)
- Reads `token` from cookie
- Verifies token with `JWT_SECRET`
- Allows access only for valid tokens

---

## 📡 API Map

| Route Group | Method | Path | Purpose |
|---|---|---|---|
| Auth | POST | /api/auth/register | Create user + set auth token cookie |
| Posts | POST | /api/posts/create | Protected sample route |

### Register Body Example
```json
{
  "username": "garvit",
  "email": "garvit@example.com",
  "password": "12345678"
}
```

---

## 🧰 Essential Packages and Purpose

1. **express** - Server and routing
2. **mongoose** - MongoDB connection and model operations
3. **jsonwebtoken** - Token sign/verify
4. **cookie-parser** - Read cookies from incoming requests
5. **dotenv** - Manage environment configuration
6. **multer** - Installed dependency, not central in current auth flow

---

## 🌍 Environment Setup

Create `.env` in this folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

---

## ⚙️ Run Locally

```bash
npm install
node server.js
```

---

## 🧠 Important Concepts

1. JWT carries user identity in a signed token.
2. Cookie storage makes token auto-sent by browser on requests.
3. Protected routes should verify token before business logic.
4. Duplicate email prevention is a core auth check.

---

## ⚠️ Important Notes

1. Password is currently stored without hashing in this module.
2. Add `bcryptjs` hashing before storing user password.
3. Add login endpoint for complete auth lifecycle.
4. Add input validation and centralized error handling.

