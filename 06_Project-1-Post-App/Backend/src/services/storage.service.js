/**
 * STORAGE SERVICE (storage.service.js)
 * 
 * Cloud storage integration using ImageKit
 * Handles image upload and deletion in cloud
 * 
 * WHY CLOUD STORAGE?
 * - Server storage is limited and expensive
 * - Cloud storage is scalable and reliable
 * - Users expect fast global access
 * - CDN distribution for quick downloads worldwide
 * 
 * IMAGEKIT:
 * - Image hosting and manipulation service
 * - Provides URLs for images
 * - Handles file deletion
 * - Image optimization and transformations
 * 
 * SECURITY:
 * - Private key: Server-side only (backend)
 * - Public key: Can be used on frontend
 * - URL generation tokens: For specific permissions
 */

require("dotenv").config(); // Load environment variables
const ImageKit = require("@imagekit/nodejs");

/**
 * IMAGEKIT CLIENT INITIALIZATION
 * 
 * Configuration:
 * - publicKey: Available (not used here for uploads)
 * - privateKey: From IMAGEKIT_PRIVATE_KEY environment variable
 * - urlEndpoint: Base URL for accessing files
 * 
 * Private Key Usage:
 * - Only on backend for secure operations
 * - Upload files
 * - Delete files
 * - Transform files
 */
const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

/**
 * FUNCTION: uploadImage
 * PURPOSE: Upload image to ImageKit cloud storage
 * 
 * PARAMETERS:
 * - buffer: Binary image file data in memory
 * 
 * WORKFLOW:
 * 1. Receive binary buffer from multer middleware
 * 2. Convert buffer to base64 string
 * 3. Send to ImageKit API
 * 4. ImageKit stores and returns metadata
 * 5. Return URL and fileId to controller
 * 
 * BASE64 ENCODING:
 * - Converts binary data to ASCII string
 * - Safe for transmission over HTTP
 * - 33% larger after encoding (tradeoff)
 * 
 * RETURNS:
 * - result containing:
 *   - url: Public URL to access image
 *   - fileId: Unique identifier for deletion
 *   - name: Original filename
 *   - size: File size in bytes
 * 
 * EXAMPLE RESPONSE:
 * {
 *   url: "https://imagekit.io/examples/image.jpg",
 *   fileId: "507f1f77bcf86cd799439011",
 *   name: "image.jpg",
 *   size: 45678
 * }
 */
async function uploadImage(buffer) {
  /**
   * UPLOAD TO IMAGEKIT
   * 
   * Parameters:
   * - file: Buffer converted to base64 string
   * - fileName: Auto-generated name (e.g., image.jpg)
   * 
   * ImageKit handles:
   * - File storage
   * - CDN distribution
   * - Metadata generation
   * - URL creation
   */
  const result = await imagekit.files.upload({
    file: buffer.toString("base64"), // Convert binary to base64
    fileName: "image.jpg",           // Default filename
  });
  
  // Return upload result to controller
  return result;
}

/**
 * FUNCTION: deleteImage
 * PURPOSE: Delete image from ImageKit cloud storage
 * 
 * PARAMETERS:
 * - fileId: Unique ImageKit identifier of file to delete
 * 
 * WORKFLOW:
 * 1. Call ImageKit delete API with fileId
 * 2. ImageKit removes file from storage
 * 3. Storage quota is freed up
 * 4. Return status to controller
 * 
 * USAGE:
 * - Called when user deletes a post
 * - Removes image file to save storage costs
 * - URL becomes invalid after deletion
 * 
 * ERROR HANDLING:
 * - If fileId doesn't exist, ImageKit may not error
 * - Frontend should handle 404 when loading deleted images
 */
async function deleteImage(fileId) {
  /**
   * DELETE FROM IMAGEKIT
   * 
   * Parameter:
   * - fileId: Unique identifier from upload response
   * 
   * Result:
   * - Success: File removed from ImageKit
   * - Returns status from ImageKit API
   * - URL will no longer work after deletion
   */
  return await imagekit.files.delete(fileId);
}

// Export functions for use in controllers
module.exports = {
  uploadImage,
  deleteImage,
};

