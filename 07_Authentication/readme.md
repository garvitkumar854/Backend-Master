# 07 Authentication - JWT Cookie Auth Basics

This module introduces user registration and token-based authentication with cookies.

## Existing Code Process

1. Basic server creation
- server.js starts app and DB connection.
- Uses PORT from env or 3000.

2. MongoDB connection
- src/db/db.js connects using MONGO_URI.

3. User model creation
- src/models/user.model.js defines username, email (unique), password.

4. App middleware and router setup
- src/app.js uses express.json() and cookie-parser.
- Registers:
  - /api/auth -> auth routes
  - /api/posts -> post routes

5. Register API creation
- src/controllers/auth.controller.js registerUser
- Checks duplicate email.
- Creates user.
- Generates JWT.
- Sets token cookie.

6. Protected route example
- src/routes/post.routes.js reads token from cookie, verifies JWT, then allows create route.

## Essential Packages and Purpose

1. express
- API server and routing.

2. mongoose
- MongoDB models and DB access.

3. jsonwebtoken
- Token generation and verification.

4. cookie-parser
- Reads cookies from request.

5. dotenv
- Loads env configuration.

6. multer
- Installed but not required in current auth flow.

## Environment Setup

Create .env in this folder:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000

## Router and API Details

### Auth router
- POST /api/auth/register
  - Body: { "username": "...", "email": "...", "password": "..." }

### Post router
- POST /api/posts/create
  - Requires token cookie named token
  - Verifies JWT and user existence

## Run Instructions

1. Install dependencies
- npm install

2. Add .env

3. Start server
- node server.js

## Important Notes

1. Password is currently stored without hashing in this module.
2. Add bcrypt hashing and validation for production.
3. Add login route in auth.routes.js if you want full auth flow in this module.
