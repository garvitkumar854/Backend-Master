/**
 * AUTHENTICATION ROUTES (auth.routes.js)
 * 
 * Defines all authentication-related API endpoints
 * Routes map HTTP methods and paths to controller functions
 * 
 * ROUTE STRUCTURE:
 * router.METHOD('/path', controller.function)
 * 
 * AVAILABLE ENDPOINTS:
 * - POST /register: Create new user account
 * - POST /login: Authenticate user and get token
 * - POST /logout: Clear authentication token
 */

const express = require('express');
const authController = require('../controllers/auth.controller');
const router = express.Router();

/**
 * ENDPOINT: POST /register
 * PURPOSE: Register a new user account
 * 
 * REQUEST BODY:
 * {
 *   username: "john_doe",
 *   email: "john@example.com",
 *   password: "securePassword123",
 *   role: "user" // optional, defaults to "user"
 * }
 * 
 * RESPONSE:
 * - 201 Created: User registered successfully
 * - 409 Conflict: User already exists
 * 
 * SECURITY:
 * - Password is hashed server-side
 * - Never expose plain passwords
 */
router.post('/register', authController.registerUser);

/**
 * ENDPOINT: POST /login
 * PURPOSE: Authenticate user and get JWT token
 * 
 * REQUEST BODY:
 * {
 *   username: "john_doe" OR email: "john@example.com",
 *   password: "securePassword123"
 * }
 * 
 * RESPONSE:
 * - 200 OK: Login successful, returns token
 * - 401 Unauthorized: Invalid credentials
 * 
 * TOKEN HANDLING:
 * - Token is set in HTTP-only cookie
 * - Token is also returned in response body
 * - Token required for protected endpoints
 */
router.post('/login', authController.loginUser);

/**
 * ENDPOINT: POST /logout
 * PURPOSE: Clear authentication token and end session
 * 
 * RESPONSE:
 * - 200 OK: Successfully logged out
 * - 400 Bad Request: User already logged out
 */
router.post('/logout', authController.logoutUser);

// Export router for use in app.js
module.exports = router;