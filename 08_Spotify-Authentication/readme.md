# 08 Spotify Authentication - RBAC Music Backend

This module is a Spotify-style backend with authentication and role-based access.

Roles:
1. user: can browse/listen
2. artist: can upload music and create albums

## Existing Code Process

1. Basic server creation
- server.js loads app, connects DB, starts on port 3000.

2. MongoDB database connection
- src/db/db.js connects using MONGO_URI.

3. User and music models
- src/models/user.model.js: username, email, password, role.
- src/models/music.model.js: uri, title, artist reference.
- src/models/album.model.js: title, musics array, artist reference.

4. Auth APIs
- src/controllers/auth.controller.js
- Register: hashes password, creates user, sets token cookie.
- Login: verifies credentials, sets token cookie.
- Logout: clears cookie.

5. Middleware and router creation
- src/middlewares/auth.middleware.js
  - authArtist: only artist role.
  - authUser: any authenticated role.
- src/routes/auth.routes.js and src/routes/music.routes.js define API map.

6. Music upload and album flow
- Multer reads uploaded file.
- storage.service uploads to ImageKit.
- music.controller creates music and albums in MongoDB.

## Essential Packages and Purpose

1. express
- HTTP server and routes.

2. mongoose
- Schema/model and database queries.

3. bcryptjs
- Password hashing and comparison.

4. jsonwebtoken
- JWT auth tokens.

5. cookie-parser
- Cookie parsing for auth token.

6. multer
- Multipart upload parsing.

7. @imagekit/nodejs
- Cloud file upload for music media.

8. dotenv
- Env variable loading.

## Environment Setup

Create .env file:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

## API Reference

### Auth
1. POST /api/auth/register
- Body: { "username": "...", "email": "...", "password": "...", "role": "user|artist" }

2. POST /api/auth/login
- Body: { "username": "..." or "email": "...", "password": "..." }

3. POST /api/auth/logout
- Clears cookie token.

### Music
1. POST /api/music/upload
- Protected: artist only
- multipart/form-data
- Fields: music (file), title (text)

2. POST /api/music/album
- Protected: artist only
- Body: { "title": "...", "musics": ["musicObjectId1", "musicObjectId2"] }

3. GET /api/music/
- Protected: authenticated user/artist
- Returns music list.

4. GET /api/music/albums
- Protected: authenticated user/artist

5. GET /api/music/albums/:albumId
- Protected: authenticated user/artist

## Run Instructions

1. Install dependencies
- npm install

2. Configure .env

3. Start dev server
- npm run dev

4. Start production-like
- npm start

## Notes

1. Add request validation to reject empty title/files.
2. Set cookie options (httpOnly, sameSite, secure in production).
3. Add pagination/filtering for list endpoints.
