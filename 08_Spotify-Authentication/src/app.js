/**
 * SPOTIFY AUTHENTICATION - Main Application File (app.js)
 * 
 * This file is the entry point for the Express application where:
 * - Middleware is configured (JSON parsing, Cookie handling)
 * - Routes are registered (Authentication, Music endpoints)
 * - Server requests are processed
 * 
 * KEY CONCEPTS:
 * 1. Middleware: Functions that process every incoming request
 * 2. Routes: Organized endpoints for different features
 * 3. Cookie-Parser: Middleware to parse cookies from HTTP requests
 */

const express = require('express');
const cookieParser = require('cookie-parser');

// Import route handlers
const authRoutes = require('./routes/auth.routes');     // Authentication endpoints (register, login, logout)
const musicRoutes = require('./routes/music.routes');   // Music endpoints (create, get, upload)

// Initialize Express application
const app = express();

/**
 * MIDDLEWARE CONFIGURATION
 * Middleware is executed for each incoming request in order
 */

// Parse incoming JSON request bodies from clients
// This converts req.body to a JavaScript object
app.use(express.json());

// Parse cookies from incoming HTTP requests
// This makes cookies available via req.cookies
// Used to extract authentication tokens
app.use(cookieParser());

/**
 * ROUTE REGISTRATION
 * Routes are prefixed with /api/auth and /api/music
 * Example: POST /api/auth/register routes to authRoutes
 */

// Mount authentication routes
// Available endpoints: POST /api/auth/register, POST /api/auth/login, POST /api/auth/logout
app.use('/api/auth', authRoutes);

// Mount music routes
// Available endpoints: POST /api/music/upload, GET /api/music, etc.
app.use('/api/music', musicRoutes);

// Export the configured Express app to be used in server.js
module.exports = app;