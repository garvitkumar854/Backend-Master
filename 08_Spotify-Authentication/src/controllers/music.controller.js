/**
 * MUSIC CONTROLLER (music.controller.js)
 * 
 * Handles all music-related operations:
 * - Creating/uploading music tracks
 * - Creating albums (collections of songs)
 * - Retrieving music and albums
 * - Populating artist information
 * 
 * KEY CONCEPTS:
 * - Multer: Middleware for handling file uploads
 * - ImageKit: Cloud storage service for media files
 * - Population: Loading referenced document data in Mongoose
 * - Base64: Converting binary file data to storable format
 */

// Import models for database operations
const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model");

// JWT library for token operations (if needed)
const jwt = require("jsonwebtoken");

// ImageKit service for cloud file storage
const { uploadFile } = require("../services/storage.service");

/**
 * FUNCTION: createMusic
 * METHOD: POST /api/music/upload
 * PROTECTED: Yes (Artist only - via authArtist middleware)
 * 
 * PURPOSE: Upload a music file and create a music document in database
 * 
 * REQUEST:
 * - Multipart form data
 * - Fields: title (string), music (file)
 * - User: Authenticated artist
 * 
 * WORKFLOW:
 * 1. Extract title and music file from request
 * 2. Validate inputs
 * 3. Convert file buffer to base64
 * 4. Upload to ImageKit cloud storage
 * 5. Create music document with URL
 * 6. Return success response
 * 
 * LEARNING POINT:
 * - req.file.buffer: Contains the binary music file data
 * - toString("base64"): Converts binary to base64 string for transmission
 * - req.user.id: Artist's ID (attached by authArtist middleware)
 */
async function createMusic(req, res) {
    // Extract title from form data
    const { title } = req.body;
    
    // Extract uploaded file from multer middleware
    // req.file contains: buffer, mimetype, size, etc.
    const file = req.file;

    /**
     * VALIDATION
     * Check if title and music file are provided
     * Both are required for creating a music document
     */
    if (!title || !file?.buffer) {
        return res.status(400).json({ message: "Title and music file are required" });
    }

    /**
     * UPLOAD TO CLOUD STORAGE
     * - Convert binary buffer to base64 string
     * - Send to ImageKit service
     * - ImageKit stores file and returns URL
     */
    const result = await uploadFile(file.buffer.toString("base64"));
    
    /**
     * CREATE MUSIC DOCUMENT
     * - uri: URL of music file from ImageKit
     * - title: Song name from user input
     * - artist: User's ID (from req.user set by middleware)
     */
    const music = await musicModel.create({
        uri: result.url,      // Cloud storage URL
        title,                 // Song title
        artist: req.user.id,   // Artist's user ID
    });

    /**
     * SUCCESS RESPONSE
     * Return 201 Created with music details
     */
    res.status(201).json({
        message: "Music created successfully",
        music: {
            id: music._id,
            uri: music.uri,
            title: music.title,
            artist: music.artist,
        }
    });
}

/**
 * FUNCTION: createAlbum
 * METHOD: POST /api/music/album
 * PROTECTED: Yes (Artist only)
 * 
 * PURPOSE: Create an album (collection of songs)
 * 
 * REQUEST BODY:
 * {
 *   title: "My Album Name",
 *   musics: [
 *     "ObjectId1",
 *     "ObjectId2",
 *     "ObjectId3"
 *   ]
 * }
 * 
 * NOTE: musics array should contain IDs of already created music documents
 */
async function createAlbum(req, res) {
    const { title, musics } = req.body;

    // Create album document
    const album = await albumModel.create({
        title,                 // Album name
        artist: req.user.id,   // Artist's user ID
        musics: musics,        // Array of music ObjectIds
    });

    res.status(201).json({
        message: "Album created Successfully",
        album: {
            id: album._id,
            title: album.title,
            artist: album.artist,
            musics: album.musics,
        }
    });
}

/**
 * FUNCTION: getAllMusics
 * METHOD: GET /api/music
 * PROTECTED: Yes (Any authenticated user)
 * 
 * PURPOSE: Retrieve all music tracks with artist information
 * 
 * FEATURES:
 * - Limit: Returns maximum 10 results per request
 * - Populate: Loads full artist data instead of just ID
 * - Projection: Select specific artist fields (username, email)
 * 
 * LEARNING CONCEPTS:
 * .limit(10): Pagination - get only 10 results
 * .populate("artist", "username email"):
 *   - Replaces artist ObjectId with full user document
 *   - Only includes username and email fields
 *   - Performs a JOIN operation internally
 */
async function getAllMusics(req, res) {
    try {
        /**
         * QUERY WITH POPULATION
         * .find(): Get all music documents
         * .limit(10): Get first 10 results only
         * .populate("artist", "username email"):
         *   - Load the artist user document
         *   - Only include username and email (not password!)
         */
        const musics = await musicModel.find()
            .limit(10)
            .populate("artist", "username email");

        res.status(200).json({
            message: "All Musics Fetched Successfully",
            musics: musics,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

/**
 * FUNCTION: getAllAlbums
 * METHOD: GET /api/music/albums
 * PROTECTED: Yes (Any authenticated user)
 * 
 * PURPOSE: Retrieve all albums with artist information
 * 
 * FEATURES:
 * .select("title artist"): Only get title and artist fields
 * .populate("artist", "username email"): Get artist details
 */
async function getAllAlbums(req, res) {
    try {
        const albums = await albumModel.find()
            .select("title artist")              // Only fetch title and artist
            .populate("artist", "username email"); // Get artist details

        res.status(200).json({
            message: "All Albums",
            albums: albums
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

/**
 * FUNCTION: getAlbumById
 * METHOD: GET /api/music/albums/:albumId
 * PROTECTED: Yes (Any authenticated user)
 * 
 * PURPOSE: Get a specific album with all songs and artist details
 * 
 * PARAMS:
 * - albumId: MongoDB ID of the album
 * 
 * WORKFLOW:
 * 1. Extract albumId from URL parameter
 * 2. Find album by ID
 * 3. Populate artist details
 * 4. Populate all music documents in the array
 * 5. Return complete album with all nested data
 */
async function getAlbumById(req, res) {
    try {
        const { albumId } = req.params;

        /**
         * CHAIN POPULATION
         * - .findById(albumId): Find album by ID
         * - .populate("artist", "username email"): Get artist details
         * - .populate("musics"): Get all music documents
         * 
         * Result: Complete album object with nested user and music data
         */
        const album = await albumModel
            .findById(albumId)
            .populate("artist", "username email")
            .populate("musics");

        // Check if album exists
        if (!album) {
            return res.status(404).json({ message: "Album not found" });
        }

        return res.status(200).json({
            message: "Album Fetched Successfully",
            album: album,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Export all controller functions for use in routes
module.exports = { createMusic, createAlbum, getAllMusics, getAllAlbums, getAlbumById };