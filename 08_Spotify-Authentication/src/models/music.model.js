/**
 * MUSIC MODEL (music.model.js)
 * 
 * Defines the structure for music documents in MongoDB
 * Each music document represents one song/track in the application
 * 
 * KEY CONCEPTS:
 * - ObjectId: MongoDB's unique identifier for documents
 * - ref: Creates a relationship to another collection (User)
 * - Population: Loading related data from referenced documents
 */

const mongoose = require('mongoose');

/**
 * MUSIC SCHEMA
 * Defines the structure of a music/track document
 */
const musicSchema = new mongoose.Schema({
    /**
     * URI - Uniform Resource Identifier
     * - Type: String
     * - Required: True
     * - Purpose: URL/path to the actual music file stored in ImageKit (cloud storage)
     * - Example: "https://imagekit.io/spotify/music_1234567890.mp3"
     * - Used by: Frontend to stream/play the music
     */
    uri: {
        type: String,
        required: true,
    },

    /**
     * TITLE
     * - Type: String
     * - Required: True
     * - Purpose: Name/title of the song
     * - Example: "Hello World", "Sunset Dreams"
     * - Used by: Display in UI, search functionality
     */
    title: {
        type: String,
        required: true,
    },

    /**
     * ARTIST - Reference Relationship
     * - Type: mongoose.Schema.Types.ObjectId
     * - ref: "user" - Points to the User collection
     * - Required: True
     * - Purpose: Links music to the artist (user) who created it
     * - How it works: Stores the user's MongoDB ID
     * 
     * RELATIONSHIP:
     * Music.artist --> User._id
     * This is a Many-to-One relationship:
     * - Many music tracks can be created by one artist
     * - One artist can create many tracks
     * 
     * POPULATION:
     * Using .populate('artist') in queries retrieves full user details
     */
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    }
});

/**
 * CREATE MODEL
 * - Converts schema into a queryable model
 * - Collection name: 'music' (in MongoDB)
 * - Available methods: create(), find(), findById(), updateOne(), deleteOne(), etc.
 */
const musicModel = mongoose.model('music', musicSchema);

// Export model for use in controllers
module.exports = musicModel;