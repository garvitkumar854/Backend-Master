# Backend Ledger (Authentication Module)

A simple Node.js + Express + MongoDB backend that implements user registration and login using JWT and secure password hashing.

## 1. Existing Code Process (Step-by-Step)

### Step 1: Basic Server Creation
The entry point starts the Express app and connects to MongoDB.

- Server bootstrap: [server.js](server.js)
- Express app setup: [src/app.js](src/app.js)

Flow:
1. Import app and database connector.
2. Connect to MongoDB.
3. Start server on port 3000.

### Step 2: MongoDB Database Connection
Database connection is handled in one reusable function.

- DB config: [src/config/db.js](src/config/db.js)

Flow:
1. Load environment variables using dotenv.
2. Call mongoose.connect with MONGO_URI.
3. Log success or exit process on failure.

### Step 3: User Model Creation
User schema defines validation, password rules, and password hashing.

- User model: [src/models/user.model.js](src/models/user.model.js)

What it does:
1. Stores name, email, password.
2. Validates email format and uniqueness.
3. Hides password by default using select: false.
4. Hashes password before saving using bcryptjs pre-save hook.
5. Provides comparePassword method for login.

### Step 4: Router Creation
Auth routes map endpoints to controller methods.

- Routes file: [src/routes/auth.routes.js](src/routes/auth.routes.js)

Defined routes:
1. POST /api/auth/register
2. POST /api/auth/login

### Step 5: Register API Creation
The register controller creates new users and generates JWT.

- Controller file: [src/controllers/auth.controller.js](src/controllers/auth.controller.js)

Flow:
1. Read name, email, password from request body.
2. Validate required fields.
3. Check if user already exists by email.
4. Create user (password gets hashed by model hook).
5. Generate JWT token.
6. Set token in cookie and return response.

### Step 6: Login API Creation
The login controller authenticates existing users.

- Controller file: [src/controllers/auth.controller.js](src/controllers/auth.controller.js)

Flow:
1. Read email and password from request body.
2. Find user by email and include password field.
3. Compare plain password with hashed password.
4. Generate JWT token if credentials are valid.
5. Set token in cookie and return response.

## 2. Essential Packages (Installation and Purpose)

From [package.json](package.json):

1. express
Purpose: HTTP server and routing.

2. mongoose
Purpose: MongoDB connection and schema/model layer.

3. dotenv
Purpose: Load environment variables from .env.

4. bcryptjs
Purpose: Hash passwords and compare credentials securely.

5. jsonwebtoken
Purpose: Generate signed JWT tokens for auth sessions.

6. cookie-parser
Purpose: Parse cookies from request headers.

7. multer
Purpose: File upload handling (installed, optional in current auth flow).

## 3. Environment File (.env) Setup

Create a .env file in the project root:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_random_secret

Current project already reads env values in:
- [src/config/db.js](src/config/db.js)
- [src/controllers/auth.controller.js](src/controllers/auth.controller.js)

## 4. API Documentation

Base URL:
http://localhost:3000

### 4.1 Register User
Endpoint:
POST /api/auth/register

Request Body:
{
  "name": "Garvit",
  "email": "garvit@example.com",
  "password": "password123"
}

Success Response (201):
{
  "message": "User registered successfully",
  "user": {
    "_id": "...",
    "name": "Garvit",
    "email": "garvit@example.com"
  },
  "token": "..."
}

### 4.2 Login User
Endpoint:
POST /api/auth/login

Request Body:
{
  "email": "garvit@example.com",
  "password": "password123"
}

Success Response (200):
{
  "message": "User logged in successfully",
  "user": {
    "_id": "...",
    "name": "Garvit",
    "email": "garvit@example.com"
  },
  "token": "..."
}

## 5. How To Run

1. Install dependencies:
npm install

2. Add .env file with valid values.

3. Start development server:
npm run dev

4. Or run normal server:
npm start

## 6. Folder Structure

- [server.js](server.js): Server start point
- [src/app.js](src/app.js): Express app and middleware setup
- [src/config/db.js](src/config/db.js): DB connection logic
- [src/models/user.model.js](src/models/user.model.js): User schema and methods
- [src/controllers/auth.controller.js](src/controllers/auth.controller.js): Register/login logic
- [src/routes/auth.routes.js](src/routes/auth.routes.js): Auth route definitions

## 7. Recommended Improvements (Production Readiness)

1. Add try/catch with centralized error handling middleware.
2. Use secure cookie options (httpOnly, sameSite, secure in production).
3. Add input validation middleware for request schemas.
4. Add auth middleware for protected routes.
5. Add tests for register/login success and failure cases.
6. Move hardcoded port to environment variable.
7. Ensure email regex in user schema is strict and correctly escaped.