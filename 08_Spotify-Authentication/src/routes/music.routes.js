/**
 * MUSIC ROUTES (music.routes.js)
 * 
 * Defines all music and album-related API endpoints
 * Implements role-based access control using middleware
 * 
 * MIDDLEWARE STACK:
 * - authArtist: Only users with "artist" role allowed
 * - authUser: Any authenticated user ("user" or "artist" role)
 * - upload.single('music'): Handle music file upload
 * 
 * LEARNING CONCEPTS:
 * - Route protection: Middleware runs before controller
 * - Multer: Handles file uploads from clients
 * - Memory storage: Stores file in RAM before cloud upload
 */

const express = require('express');
const musicController = require('../controllers/music.controller');

// Middleware imports
const multer = require('multer');              // File upload handling
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * MULTER CONFIGURATION
 * Multer is middleware for handling file uploads
 * 
 * STORAGE OPTIONS:
 * - memoryStorage: Temporarily stores file in server RAM
 * - diskStorage: Stores file on server disk
 * 
 * We use memoryStorage because:
 * - File is uploaded to ImageKit (cloud) immediately
 * - No need for persistent server storage
 * - Automatic cleanup when request ends
 */
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create Express router
const router = express.Router();

/**
 * ENDPOINT: POST /upload
 * PROTECTED: Artist only (via authArtist middleware)
 * PURPOSE: Upload a music file and create music document
 * 
 * MIDDLEWARE CHAIN:
 * 1. authArtist: Verify user is artist
 * 2. upload.single('music'): Extract music file from form data
 * 3. musicController.createMusic: Handle music creation
 * 
 * REQUEST:
 * - Content-Type: multipart/form-data
 * - Fields:
 *   - music (file): Audio file to upload
 *   - title (text): Song title
 * 
 * RESPONSE:
 * - 201 Created: Music uploaded successfully
 * - 400 Bad Request: Missing required fields
 * - 401 Unauthorized: Not authenticated
 * - 403 Forbidden: User is not an artist
 */
router.post('/upload', authMiddleware.authArtist, upload.single('music'), musicController.createMusic);

/**
 * ENDPOINT: POST /album
 * PROTECTED: Artist only
 * PURPOSE: Create an album with multiple songs
 * 
 * REQUEST BODY:
 * {
 *   title: "Album Name",
 *   musics: ["ObjectId1", "ObjectId2", "ObjectId3"]
 * }
 * 
 * NOTE:
 * - Music ObjectIds must exist in database
 * - Artist should own the music or have permission
 */
router.post('/album', authMiddleware.authArtist, musicController.createAlbum);

/**
 * ENDPOINT: GET /
 * PROTECTED: Any authenticated user
 * PURPOSE: Retrieve all music tracks
 * 
 * QUERY PARAMETERS:
 * None (could be extended with pagination)
 * 
 * RESPONSE:
 * - 200 OK: Array of music documents with artist info
 * - 401 Unauthorized: No valid token
 * - 403 Forbidden: Invalid or expired token
 * 
 * FEATURES:
 * - Returns max 10 results (limit in controller)
 * - Populates artist information
 * - Artists can listen to all music
 */
router.get("/", authMiddleware.authUser, musicController.getAllMusics);

/**
 * ENDPOINT: GET /albums
 * PROTECTED: Any authenticated user
 * PURPOSE: Retrieve all albums
 * 
 * RESPONSE:
 * - 200 OK: Array of albums with artist info
 * - Includes: title, artist (username, email)
 */
router.get("/albums", authMiddleware.authUser, musicController.getAllAlbums);

/**
 * ENDPOINT: GET /albums/:albumId
 * PROTECTED: Any authenticated user
 * PURPOSE: Get specific album with all songs
 * 
 * ROUTE PARAMETERS:
 * - albumId: MongoDB ID of album
 * 
 * RESPONSE:
 * - 200 OK: Album object with populated artist and musics
 * - 404 Not Found: Album doesn't exist
 * - 401 Unauthorized: Not authenticated
 * 
 * FEATURES:
 * - Populates full artist document
 * - Populates all music documents in the album
 * - Returns complete album structure
 */
router.get('/albums/:albumId', authMiddleware.authUser, musicController.getAlbumById);

// Export router for use in app.js
module.exports = router;