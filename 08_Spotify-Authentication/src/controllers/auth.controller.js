/**
 * AUTHENTICATION CONTROLLER (auth.controller.js)
 * 
 * Handles all user authentication operations:
 * - User Registration: Creating new user accounts
 * - User Login: Verifying credentials and issuing tokens
 * - User Logout: Clearing authentication tokens
 * 
 * KEY CONCEPTS:
 * - Password Hashing: Converting passwords using bcryptjs (one-way encryption)
 * - JWT Tokens: JSON Web Tokens for maintaining authentication across requests
 * - Cookies: Secure way to store tokens on client side
 * - HTTP Status Codes:
 *   201: Created (successful resource creation)
 *   401: Unauthorized (authentication failed)
 *   409: Conflict (resource already exists)
 */

require('dotenv').config(); // Load environment variables

const userModel = require('../models/user.model');  // User database model
const jwt = require('jsonwebtoken');                 // For creating JWT tokens
const bcrypt = require('bcryptjs');                  // For password hashing/comparison

/**
 * FUNCTION: registerUser
 * METHOD: POST /api/auth/register
 * PURPOSE: Create a new user account with hashed password
 * 
 * REQUEST BODY:
 * {
 *   username: "john_doe",
 *   email: "john@example.com",
 *   password: "securePassword123",
 *   role: "user" (optional, defaults to "user")
 * }
 * 
 * WORKFLOW:
 * 1. Extract user data from request
 * 2. Check if user already exists (by username or email)
 * 3. Hash the password using bcryptjs
 * 4. Store user in database with hashed password
 * 5. Generate JWT token with user ID and role
 * 6. Send token in secure cookie
 * 7. Return success response with user data and token
 */
async function registerUser(req, res) {
    const { username, email, password, role = "user" } = req.body;

    // CHECK: User already exists?
    // Using $or operator to check both username and email
    // This prevents duplicate accounts
    const isUserAlreadyExists = await userModel.findOne({
        $or: [
            { username: username },
            { email: email }
        ]
    });

    // If user exists, return conflict error (409)
    if (isUserAlreadyExists) {
        return res.status(409).json({ message: "User already exists" });
    }

    /**
     * HASHING: Convert password to hash
     * - bcrypt.hash(password, saltRounds)
     * - saltRounds (10): Higher number = more secure but slower
     * - Important: Hash is one-way, cannot be reversed
     * - If attacker gets database, they cannot see original passwords
     */
    const hash = await bcrypt.hash(password, 10);

    // CREATE: Store user in database with hashed password
    const user = await userModel.create({
        username,
        email,
        password: hash,  // Store HASH not original password
        role
    });

    /**
     * TOKEN GENERATION
     * - jwt.sign(payload, secret)
     * - payload: Data encoded in token (user ID, role)
     * - secret: Private key from environment (never expose!)
     * - Token is sent to client for future authenticated requests
     */
    const token = jwt.sign({
        id: user._id,      // User's database ID
        role: user.role    // User's role (user or artist)
    }, process.env.JWT_SECRET);

    /**
     * COOKIE STORAGE
     * - Stores token in HTTP-only cookie
     * - Cookie is automatically sent with every request
     * - More secure than localStorage (blocks XSS attacks)
     */
    res.cookie("token", token);

    // SUCCESS: Return 201 Created with user and token
    res.status(201).json({ message: "User registered successfully", user, token });
}

/**
 * FUNCTION: loginUser
 * METHOD: POST /api/auth/login
 * PURPOSE: Authenticate user with credentials and issue token
 * 
 * REQUEST BODY:
 * {
 *   username: "john_doe",     // OR
 *   email: "john@example.com",  // Can use either username or email
 *   password: "securePassword123"
 * }
 * 
 * AUTHENTICATION FLOW:
 * 1. Find user by username or email
 * 2. Compare provided password with stored hash
 * 3. If valid, generate JWT token
 * 4. Store token in cookie
 * 5. Return success response
 */
async function loginUser(req, res) {
    const { username, email, password } = req.body;

    /**
     * FIND: Search for user by username or email
     * The $or operator tries both conditions
     * Example: User can login with either:
     * - username: "john_doe"
     * OR
     * - email: "john@example.com"
     */
    const user = await userModel.findOne({
        $or: [{ username }, { email }]
    });

    // STATUS 401: User not found
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    /**
     * VERIFY PASSWORD
     * - bcrypt.compare(plainPassword, hashedPassword)
     * - Compares plain text password with stored hash
     * - Returns true/false (never reveals the hash)
     * - This is the secure way to verify passwords
     */
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // STATUS 401: Password incorrect
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    /**
     * GENERATE TOKEN
     * Token contains user ID and role for future requests
     */
    const token = jwt.sign({
        id: user._id,
        role: user.role
    }, process.env.JWT_SECRET);

    // Store token in secure cookie
    res.cookie("token", token);
    
    // SUCCESS: Return 200 OK with user and token
    res.status(200).json({ message: "Login successful", user, token });
}

/**
 * FUNCTION: logoutUser
 * METHOD: POST /api/auth/logout
 * PURPOSE: Clear authentication token and end session
 * 
 * WORKFLOW:
 * 1. Check if user has a token (is logged in)
 * 2. Clear the token cookie
 * 3. Return success message
 * 
 * NOTE: JWT tokens are stateless, so logout just removes the cookie
 * Token itself remains valid until expiration (could implement blacklist for validation)
 */
async function logoutUser(req, res) {
    try {
        // Extract token from cookies
        const token = req.cookies.token;
        
        // Check if user is already logged out (no token)
        if (!token) {
            return res.status(400).json({ message: "User already logged out" });
        }
        
        /**
         * CLEAR COOKIE
         * - res.clearCookie() removes the token cookie
         * - Browser will no longer send token with requests
         * - Effectively logs out the user on client side
         */
        res.clearCookie("token");

        // Return success
        res.status(200).json({ message: "User Logged out successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

// Export all authentication functions
module.exports = { registerUser, loginUser, logoutUser };