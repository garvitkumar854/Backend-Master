# Spotify Clone - Authentication & Authorization Learning Project

Learn core backend concepts: **Authentication**, **Authorization**, **Middlewares**, **Role-Based Access Control**, and **JWT Tokens**.

---

## 📚 Project Concepts

### Two Types of Users

| User Type | Role | Permissions |
|-----------|------|-------------|
| **Normal User** | Listener | Browse and listen to music |
| **Artist** | Creator | Create, upload, and manage music |

---

## 🚀 Implementation Workflow

### Phase 1: Database & User Model Setup

**Objective**: Create a secure user authentication system

- Create MongoDB database connection
- Create User model with fields: username, email, password (hashed), role
- Define schema validation rules
- **Learning Point**: Always hash passwords before storing in the database (never store plain text)

### Phase 2: User Registration API

**Objective**: Allow users to create accounts securely

Steps to implement:
1. Accept user data (email, username, password)
2. Validate input data
3. Check if user already exists in database
4. Hash password using `bcryptjs` package
5. Store user in database
6. Generate JWT token for authentication
7. Store token in HTTP-only cookie
8. Return success response

**Security Best Practice**:
```
- Use bcryptjs for password hashing (never use plain MD5 or SHA1)
- Store hashed password, never the original password
- Use HTTP-only cookies to prevent XSS attacks
- Validate all input data on the server side
```

### Phase 3: User Login API

**Objective**: Authenticate users and maintain sessions

Login function supports **two authentication methods**:
- Email + Password
- Username + Password

Steps to implement:
1. Accept credentials (email or username + password)
2. Find user in database by email or username
3. Compare provided password with stored hash using bcryptjs
4. If valid: Generate JWT token
5. Store token in secure HTTP-only cookie
6. Export both `registerUser` and `loginUser` functions

**Learning Point**: 
- Hashing is one-way encryption (can't reverse it)
- Always compare hashes using bcryptjs.compare() method
- Tokens should have expiration time for security

### Phase 4: Music Model & Routes

**Objective**: Create role-based music management system

Music Model fields:
- `title` - Name of the song
- `image` - Album/cover art URL
- `artist` - Reference to Artist (User ID from User Model)
- `createdAt` - Timestamp
- `duration` - Song length

Create music route behavior:
- Create separate routes for different user roles
- Only Artists can create music
- Normal Users can only view/listen
- Implement authorization middleware to verify user role

### Phase 5: API Protection with Middleware

**Objective**: Secure endpoints based on user roles

Implementation:
- Create authentication middleware to verify JWT token
- Create authorization middleware to check user role
- Apply middleware to music endpoints:
  - `GET /music` - Available to all authenticated users
  - `POST /music` - Available only to Artists
  - `DELETE /music/:id` - Available only to Artist (owner) or Admin

**Security Concept**:
```
Authentication = Who are you? (login verification)
Authorization = What are you allowed to do? (permission verification)
```

---

## 📋 Setup & Testing Checklist

- [ ] Install dependencies: `npm install`
- [ ] Configure MongoDB connection
- [ ] Run server and verify it starts without errors
- [ ] Test Register API with Postman/Insomnia
- [ ] Test Login API with different credentials
- [ ] Verify JWT tokens are generated
- [ ] Test Music creation (verify Artist role required)
- [ ] Test protected routes with and without token

---

## 🔐 Key Packages Used

- **`bcryptjs`** - Password hashing and verification
- **`jsonwebtoken`** - JWT token generation and verification
- **`mongoose`** - MongoDB object modeling
- **`express`** - Web framework
- **`dotenv`** - Environment variable management

---

## 💡 Learning Outcomes

After completing this project, you will understand:
1. How password hashing protects user data
2. How JWT tokens work for authentication
3. Difference between authentication and authorization
4. How to implement role-based access control
5. How to secure API endpoints with middleware