/**
 * POST APP - MAIN APPLICATION FILE (app.js)
 * 
 * Simple Instagram/Twitter-like social media app backend
 * Features: Create posts with images, view all posts, delete posts
 * 
 * ARCHITECTURE:
 * - Express.js: Web server framework
 * - MongoDB: Database for storing post data
 * - ImageKit: Cloud storage for images
 * - Multer: File upload handling
 * - CORS: Enable cross-origin requests from frontend
 * 
 * LEARNING PATH:
 * 1. Express setup and middleware
 * 2. File upload handling (Multer)
 * 3. Cloud storage integration (ImageKit)
 * 4. Database operations (MongoDB)
 * 5. RESTful API endpoints
 */

require("dotenv").config(); // Load environment variables (.env file)
const express = require("express");
const app = express();
const cors = require("cors");           // Cross-Origin Resource Sharing
const multer = require("multer");       // File upload middleware

/**
 * MIDDLEWARE CONFIGURATION
 * Middleware processes requests before reaching route handlers
 */

// Enable CORS: Allow requests from frontend (different origin/port)
// Without CORS: Browser blocks frontend->backend API calls
// Frontend runs on http://localhost:5173 (Vite)
// Backend runs on http://localhost:3000
app.use(cors());

// Parse JSON request bodies
// Converts JSON strings to JavaScript objects
app.use(express.json());

// Import Post model for database operations
const postModel = require("./models/post.model");

/**
 * MULTER CONFIGURATION
 * Handles file uploads from clients
 * 
 * memoryStorage():
 * - Temporarily stores uploaded files in server RAM
 * - Good for small files that are processed quickly
 * - Files are lost if server restarts
 * - Alternative: diskStorage (stores on server hard drive)
 * 
 * In our case:
 * - File uploaded via multer
 * - Immediately sent to ImageKit cloud storage
 * - Deleted from memory
 * - No need for persistent storage
 */
const upload = multer({ storage: multer.memoryStorage() });

// Import ImageKit functions for cloud storage
const { uploadImage, deleteImage } = require("./services/storage.service");

/**
 * ENDPOINT: POST /create-post
 * PURPOSE: Create a new post with image and caption
 * 
 * REQUEST:
 * - Content-Type: multipart/form-data
 * - Fields:
 *   - image (file): JPEG/PNG image file
 *   - caption (text): Post text/description
 * 
 * WORKFLOW:
 * 1. upload.single('image'): Extract image from request
 * 2. uploadImage(): Upload to ImageKit cloud
 * 3. Save post data to MongoDB
 * 4. Return response with upload result
 * 
 * RESPONSE:
 * - 201 Created: Post created successfully
 * - Includes: fileId, image URL, caption
 */
app.post("/create-post", upload.single("image"), async (req, res) => {
  /**
   * STEP 1: Upload image to cloud storage
   * 
   * req.file.buffer: Binary image data in memory
   * uploadImage(): 
   *   - Converts buffer to base64
   *   - Sends to ImageKit
   *   - Returns: { fileId, url, ... }
   * 
   * fileId: Unique ImageKit identifier for deletion later
   * url: Public URL to access image
   */
  const result = await uploadImage(req.file.buffer);

  /**
   * STEP 2: Create post document in MongoDB
   * 
   * Stores:
   * - fileId: For later image deletion
   * - image: URL to display image
   * - caption: User's text content
   * - _id: Auto-generated MongoDB ID
   * - createdAt: Auto timestamp
   */
  await postModel.create({
    fileId: result.fileId,   // For identifying image to delete
    image: result.url,       // URL for displaying image
    caption: req.body.caption, // User's post text
  });

  // STEP 3: Return success response
  res.status(201).json({
    message: "Post created",
    result,
  });

  // Log for debugging
  console.log("Post Created:", result);
});

/**
 * ENDPOINT: GET /posts
 * PURPOSE: Retrieve all posts from database
 * 
 * WORKFLOW:
 * 1. Find all posts in MongoDB
 * 2. Sort by creation date (newest first)
 * 3. Return array of posts
 * 
 * RESPONSE:
 * - 200 OK: Array of post objects
 * - Each post contains: _id, fileId, image, caption
 * 
 * LEARNING POINT:
 * - No pagination implemented yet
 * - In production: Implement pagination to limit data transfer
 * - Example: .limit(20).skip(page * 20)
 */
app.get("/posts", async (req, res) => {
  // Retrieve all posts from MongoDB
  const posts = await postModel.find();
  
  res.status(200).json({
    message: "Posts retrieved",
    posts,
  });
  
  console.log("Posts Retrieved:", posts);
});

/**
 * ENDPOINT: DELETE /delete-post/:id
 * PURPOSE: Delete a post and its image from cloud storage
 * 
 * URL PARAMETER:
 * - id: Post ID to delete (can be fileId or _id)
 * 
 * TWO-STEP DELETION PROCESS:
 * 1. Delete image from ImageKit (cloud storage)
 * 2. Delete post document from MongoDB
 * 
 * Why delete from both?
 * - ImageKit: Storage quota management
 * - MongoDB: Prevent references to deleted images
 * - Cost: Cloud storage costs money for each file
 * 
 * ERROR HANDLING:
 * - Return 404 if post not found
 * - Return 500 if deletion fails
 * 
 * WORKFLOW:
 */
app.delete("/delete-post/:id", async (req, res) => {
  try {
    // Extract fileId from URL parameter
    const fileId = req.params.id;

    /**
     * STEP 1: Find post by ImageKit fileId
     * 
     * Why search by fileId?
     * - fileId uniquely identifies image in ImageKit
     * - Ensures we delete the correct image
     * - Different from MongoDB _id
     */
    const post = await postModel.findOne({ fileId });

    // Check if post exists
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    /**
     * STEP 2: Delete image from ImageKit cloud storage
     * - Removes file from cloud
     * - Updates storage quota
     * - Returns response status
     */
    const response = await deleteImage(fileId);

    /**
     * STEP 3: Delete post document from MongoDB
     * - Uses MongoDB _id (different from fileId)
     * - post._id: Retrieved from database query above
     * - findByIdAndDelete: Finds and removes in one operation
     */
    await postModel.findByIdAndDelete(post._id);

    // Log ImageKit response for debugging
    console.log("ImageKit delete response:", response);

    // Return success
    res.json({ message: "Post deleted successfully" });

  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
});

// Export app for use in server.js
module.exports = app;
