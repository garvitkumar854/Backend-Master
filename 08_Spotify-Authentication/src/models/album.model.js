/**
 * ALBUM MODEL (album.model.js)
 * 
 * Defines the structure for album documents in MongoDB
 * An album is a collection of music tracks created by an artist
 * 
 * KEY CONCEPTS:
 * - Array of References: One album contains multiple music tracks
 * - Document Relationships: Albums link to Users and Music documents
 */

const mongoose = require('mongoose');

/**
 * ALBUM SCHEMA
 * Represents a collection of songs grouped together
 */
const albumSchema = new mongoose.Schema({
    /**
     * TITLE
     * - Type: String
     * - Required: True
     * - Purpose: Name of the album
     * - Example: "Greatest Hits", "Debut Album", "Summer Vibes"
     */
    title: {
        type: String,
        required: true,
    },

    /**
     * MUSICS - Array of Music References
     * - Type: Array of ObjectIds
     * - ref: "music" - Points to the Music collection
     * - Purpose: Stores IDs of all songs in this album
     * 
     * ONE-TO-MANY RELATIONSHIP:
     * Album --> [Music documents]
     * One album contains multiple music tracks
     * 
     * WORKFLOW:
     * 1. Create individual music documents
     * 2. Add their ObjectIds to this musics array
     * 3. Use .populate('musics') to retrieve full music data
     * 
     * EXAMPLE:
     * musics: [
     *   ObjectId("507f1f77bcf86cd799439011"),
     *   ObjectId("507f1f77bcf86cd799439012"),
     *   ObjectId("507f1f77bcf86cd799439013")
     * ]
     */
    musics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "music"
    }],

    /**
     * ARTIST - Reference to User
     * - Type: ObjectId
     * - ref: "user" - Points to the User collection
     * - Required: True
     * - Purpose: Links album to the artist who created it
     * 
     * MANY-TO-ONE RELATIONSHIP:
     * Many albums --> One artist (user)
     * One artist can create multiple albums
     */
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    }
});

/**
 * CREATE MODEL
 * - Makes schema queryable through Mongoose methods
 */
const albumModel = mongoose.model("album", albumSchema);

// Export for use in controllers
module.exports = albumModel;