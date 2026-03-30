# 08 Spotify Authentication 🎧

> Role-based music backend with JWT auth, artist-only uploads, and album relationships.

This project is a strong intermediate backend system that combines:
- 🔐 authentication and authorization
- 🎭 RBAC (user vs artist)
- ☁ cloud media upload using ImageKit
- 🗃 relational MongoDB modeling with Mongoose populate

---

## ✨ Why This Project Matters

This is not only a CRUD API. It demonstrates real backend patterns used in production:
1. Account system with hashed passwords.
2. Role-based route protection.
3. Media upload pipeline (buffer -> base64 -> cloud -> DB URL).
4. Document references and nested population.
5. Separation of concerns (routes, controllers, middleware, models, services).

---

## 🧭 Table of Contents

1. [System Snapshot](#-system-snapshot)
2. [Feature Overview](#-feature-overview)
3. [Architecture Blueprint](#-architecture-blueprint)
4. [Build Journey and Sequence](#-build-journey-and-sequence)
5. [Role-Based Access Control Deep Dive](#-role-based-access-control-deep-dive)
6. [Auth Lifecycle Deep Dive](#-auth-lifecycle-deep-dive)
7. [Music and Album Domain Model](#-music-and-album-domain-model)
8. [Upload Pipeline Explained](#-upload-pipeline-explained)
9. [Project Structure with Links](#-project-structure-with-links)
10. [Environment Variables](#-environment-variables)
11. [API Reference](#-api-reference)
12. [Request and Response Examples](#-request-and-response-examples)
13. [Run and Verify](#-run-and-verify)
14. [Important Concepts to Master](#-important-concepts-to-master)
15. [Known Limitations and Upgrade Path](#-known-limitations-and-upgrade-path)

---

## 🧩 System Snapshot

Project type: Backend API  
Domain: Spotify-like platform  
Primary roles: `user`, `artist`

User capabilities:
1. Register/Login/Logout
2. View music list
3. View albums
4. View album details with all songs

Artist capabilities (plus all user capabilities):
1. Upload music
2. Create albums

---

## 🚀 Feature Overview

- ✅ Register with role support
- ✅ Login with username or email
- ✅ Cookie-based JWT session
- ✅ Artist-only upload endpoint
- ✅ Artist-only album creation endpoint
- ✅ Public-to-authenticated read APIs for music and albums
- ✅ Population of related documents (artist and musics)

---

## 🏗 Architecture Blueprint

```mermaid
flowchart LR
A[Client] --> B[/api/auth Routes]
A --> C[/api/music Routes]
B --> D[Auth Controller]
C --> E[Music Controller]
C --> F[RBAC Middleware]
E --> G[Storage Service]
G --> H[ImageKit]
D --> I[(User Collection)]
E --> J[(Music Collection)]
E --> K[(Album Collection)]
F --> D
```

Flow summary:
1. Client sends auth request or music request.
2. RBAC middleware validates token and role before protected actions.
3. Controllers perform business logic.
4. Upload endpoint sends binary data to ImageKit service.
5. Metadata and relationships are persisted in MongoDB.

---

## 🛠 Build Journey and Sequence

The project progression is best understood in this order:

### Phase 1: Identity layer
1. Model users with roles.
2. Register and login users.
3. Hash password using bcrypt.
4. Issue signed JWT token.
5. Store token in cookie.

### Phase 2: Access control layer
1. Add middleware for token verification.
2. Add role checks:
   - artist-only paths
   - authenticated-user paths

### Phase 3: Music domain layer
1. Create music model with artist reference.
2. Implement upload endpoint.
3. Persist cloud URL in DB.

### Phase 4: Album domain layer
1. Create album model with music references.
2. Build album creation endpoint.
3. Build album read endpoints with populate.

### Phase 5: Read optimization layer
1. Populate artist details in lists.
2. Populate musics inside album details.
3. Limit music listing to reduce payload size.

---

## 🎭 Role-Based Access Control Deep Dive

RBAC is implemented in [src/middlewares/auth.middleware.js](src/middlewares/auth.middleware.js).

Two middleware guards:
1. `authArtist`
2. `authUser`

Access matrix:

| Endpoint Type | user | artist |
|---|---|---|
| Auth APIs | ✅ | ✅ |
| Read music/albums | ✅ | ✅ |
| Upload music | ❌ | ✅ |
| Create album | ❌ | ✅ |

Why this matters:
1. Prevents unauthorized content creation.
2. Keeps policy centralized in middleware.
3. Makes controller code simpler and safer.

---

## 🔐 Auth Lifecycle Deep Dive

Auth logic is in [src/controllers/auth.controller.js](src/controllers/auth.controller.js).

### Register flow
1. Accept username, email, password, role.
2. Check duplicate username/email.
3. Hash password with bcrypt.
4. Save user.
5. Sign JWT with user id and role.
6. Set cookie token.

### Login flow
1. Accept username or email + password.
2. Lookup user with `$or` condition.
3. Compare provided password with hash.
4. Sign token and set cookie.

### Logout flow
1. Read token from cookie.
2. Clear cookie.
3. Return success response.

---

## 🎼 Music and Album Domain Model

### User model
Defined in [src/models/user.model.js](src/models/user.model.js).

Important fields:
1. username (unique)
2. email (unique)
3. password (hashed)
4. role (`user` or `artist`)

### Music model
Defined in [src/models/music.model.js](src/models/music.model.js).

Important fields:
1. uri (cloud URL)
2. title
3. artist (ObjectId -> user)

### Album model
Defined in [src/models/album.model.js](src/models/album.model.js).

Important fields:
1. title
2. artist (ObjectId -> user)
3. musics (ObjectId[] -> music)

Relationship map:
1. One artist can create many music tracks.
2. One artist can create many albums.
3. One album can include many tracks.

---

## ☁ Upload Pipeline Explained

Upload logic spans these files:
1. [src/routes/music.routes.js](src/routes/music.routes.js)
2. [src/controllers/music.controller.js](src/controllers/music.controller.js)
3. [src/services/storage.service.js](src/services/storage.service.js)

Pipeline:
1. Multer reads `music` file into memory buffer.
2. Controller converts buffer to base64 string.
3. Service sends base64 content to ImageKit.
4. ImageKit returns URL and file metadata.
5. Controller saves URL + title + artist reference in DB.

Why memory storage is used here:
1. File is immediately forwarded to cloud.
2. No local disk cleanup complexity.
3. Simpler for cloud-first architecture.

---

## 🗂 Project Structure with Links

- [server.js](server.js)
- [src/app.js](src/app.js)
- [src/routes/auth.routes.js](src/routes/auth.routes.js)
- [src/routes/music.routes.js](src/routes/music.routes.js)
- [src/controllers/auth.controller.js](src/controllers/auth.controller.js)
- [src/controllers/music.controller.js](src/controllers/music.controller.js)
- [src/middlewares/auth.middleware.js](src/middlewares/auth.middleware.js)
- [src/models/user.model.js](src/models/user.model.js)
- [src/models/music.model.js](src/models/music.model.js)
- [src/models/album.model.js](src/models/album.model.js)
- [src/services/storage.service.js](src/services/storage.service.js)
- [src/db/db.js](src/db/db.js)
- [package.json](package.json)

---

## 🌍 Environment Variables

Create `.env` in project root:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

Note:
1. `IMAGEKIT_PRIVATE_KEY` is mandatory for backend uploads.
2. Keep private key secret and never expose in frontend bundles.

---

## 📡 API Reference

Base URL: `http://localhost:3000`

### Auth Endpoints

| Method | Path | Access | Purpose |
|---|---|---|---|
| POST | /api/auth/register | Public | Create user account |
| POST | /api/auth/login | Public | Login and set cookie token |
| POST | /api/auth/logout | Authenticated | Clear session cookie |

### Music and Album Endpoints

| Method | Path | Access | Purpose |
|---|---|---|---|
| POST | /api/music/upload | Artist only | Upload one music track |
| POST | /api/music/album | Artist only | Create album with track IDs |
| GET | /api/music | Authenticated user/artist | List tracks (limited) |
| GET | /api/music/albums | Authenticated user/artist | List albums |
| GET | /api/music/albums/:albumId | Authenticated user/artist | Get album with tracks |

---

## 🧪 Request and Response Examples

### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "arijit",
  "email": "arijit@example.com",
  "password": "password123",
  "role": "artist"
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "arijit@example.com",
  "password": "password123"
}
```

### Upload Music

```http
POST /api/music/upload
Content-Type: multipart/form-data

music: <binary_file>
title: "My New Song"
```

### Create Album

```http
POST /api/music/album
Content-Type: application/json

{
  "title": "Night Sessions",
  "musics": ["<musicObjectId1>", "<musicObjectId2>"]
}
```

---

## ▶ Run and Verify

1. Install dependencies.
```bash
npm install
```

2. Add `.env` values.

3. Start development server.
```bash
npm run dev
```

4. Validate lifecycle quickly.
1. Register an artist.
2. Login as artist.
3. Upload music.
4. Create album with uploaded track IDs.
5. Login as user.
6. Read music and albums.

---

## 🧠 Important Concepts to Master

1. Difference between authentication and authorization.
2. Why role checks belong in middleware.
3. Why passwords must be hashed before persistence.
4. How Mongoose `ref` and `populate` build relational reads.
5. Why cloud URL storage is better than storing binary blobs in DB.
6. Why endpoint-level access policy matters for multi-role systems.

---

## ⚠ Known Limitations and Upgrade Path

### Current limitations
1. Token cookie options can be hardened (`httpOnly`, `sameSite`, `secure` by environment).
2. Input validation is minimal on some endpoints.
3. No refresh-token strategy yet (single JWT cookie approach).
4. Music listing limit is fixed at 10 without pagination parameters.
5. No ownership enforcement check during album composition.

### Recommended upgrades
1. Add request validation middleware per route.
2. Add refresh token + session model for long-lived secure sessions.
3. Add robust logging and centralized error middleware.
4. Add pagination, filtering, and sorting for music and albums.
5. Add ownership validation for album creation to ensure artist can only include own tracks.
6. Add automated tests (Jest + Supertest) for auth and RBAC boundaries.

---

## ✅ Final Takeaway

This project is an excellent bridge between beginner APIs and production-style backend systems.  
You are practicing real engineering concerns: identity, policy, cloud storage, and relational querying in a clean module layout.
