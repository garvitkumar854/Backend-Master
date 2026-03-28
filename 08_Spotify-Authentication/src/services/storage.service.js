/**
 * STORAGE SERVICE (storage.service.js)
 * 
 * Cloud storage integration for uploading media files
 * Abstracts ImageKit API operations
 * 
 * WHY CLOUD STORAGE?
 * - Server storage is limited and expensive
 * - Cloud storage is scalable and reliable
 * - Enables CDN distribution for fast downloads
 * - Reduces server load
 * 
 * IMAGEKIT:
 * - Image/media hosting service
 * - Provides URLs for file access
 * - Handles file deletion
 * - Offers transformations (resize, format, etc.)
 */

require("dotenv").config(); // Load environment variables
const { ImageKit } = require("@imagekit/nodejs");

/**
 * IMAGEKIT CLIENT INITIALIZATION
 * 
 * Configuration:
 * - privateKey: From environment variable IMAGEKIT_PRIVATE_KEY
 * - Kept secret, never exposed to frontend
 * - Used for server-side operations (upload, delete)
 * 
 * PUBLIC KEY: Used on frontend for client-side uploads
 * PRIVATE KEY: Used on backend for secure operations
 */
const ImageKitClient = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

/**
 * FUNCTION: uploadFile
 * PURPOSE: Upload music file to ImageKit cloud storage
 * 
 * PARAMETERS:
 * - file: Base64 encoded file string
 *   (Converted from binary buffer by controller)
 * 
 * WORKFLOW:
 * 1. Encode file as base64
 * 2. Send to ImageKit API
 * 3. ImageKit stores file and returns metadata
 * 4. Extract and return URL
 * 
 * IMAGEKIT.FILES.UPLOAD OPTIONS:
 * - file: Base64 encoded file content
 * - fileName: Name for the file (can include timestamp)
 * - folder: Organize files in folders
 * 
 * RETURNS:
 * - result object containing:
 *   - url: Public URL to access the file
 *   - fileId: Unique identifier in ImageKit
 *   - name: File name
 *   - size: File size in bytes
 */
async function uploadFile(file) {
    /**
     * UPLOAD TO IMAGEKIT
     * 
     * fileName Strategy:
     * - Prefix: "music_" to identify music files
     * - Timestamp: Date.now() ensures unique names
     * - Prevents conflicts if same song uploaded multiple times
     * 
     * EXAMPLE: "music_1234567890123.mp3"
     * 
     * folder: "spotify/" organizes files in a folder
     * Makes management easier in ImageKit dashboard
     */
    const result = await ImageKitClient.files.upload({
        file,                              // Base64 encoded file
        fileName: "music_" + Date.now(),   // Unique filename with timestamp
        folder: "spotify/",                // File organization folder
    });
    
    /**
     * RETURN RESULT
     * ImageKit returns metadata about uploaded file
     * We return entire result object for controller to use
     */
    return result;
}

// Export uploadFile function for use in controllers
module.exports = { uploadFile };
