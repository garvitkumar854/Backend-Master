/**
 * POST MODEL (post.model.js)
 * 
 * Defines the structure and validation rules for post documents
 * MongoDB, via Mongoose, stores social media posts
 * 
 * LEARNING CONCEPTS:
 * - Schema: Blueprint for document structure
 * - Model: Class for database operations (create, find, delete, etc.)
 * - String type: Text fields in MongoDB
 */

const mongoose = require("mongoose");

/**
 * POST SCHEMA
 * Defines all fields that each post document must contain
 * 
 * FIELDS EXPLANATION:
 */
const postSchema = new mongoose.Schema({
  /**
   * FILEID
   * - Type: String
   * - Purpose: Unique identifier from ImageKit cloud storage
   * - Used for: Deleting image from cloud when post is deleted
   * - Important: Different from MongoDB _id
   * - Value: Provided by ImageKit after file upload
   */
  fileId: String,

  /**
   * IMAGE
   * - Type: String
   * - Purpose: Public URL to image
   * - Used for: Displaying image in frontend
   * - Value: Provided by ImageKit (e.g., https://imagekit.io/...)
   * - Why URL instead of uploading file?
   *   - Cloud storage more scalable than server storage
   *   - CDN distribution for faster downloads
   *   - Reduces server load and storage costs
   */
  image: String,

  /**
   * CAPTION
   * - Type: String
   * - Purpose: User's text content for the post
   * - Used for: Displaying text in feed
   * - Example: "Beautiful sunset today! 🌅"
   * - Limit: Could add maxlength in production (e.g., 280 chars)
   */
  caption: String,
});

/**
 * CREATE MODEL
 * - Converts schema to a queryable model
 * - Collection name: "post" (in MongoDB)
 * - Available methods: create(), find(), findByIdAndDelete(), etc.
 */
const postModel = mongoose.model("post", postSchema);

/**
 * USAGE EXAMPLES:
 * 
 * Create post:
 * await postModel.create({
 *   fileId: "123abc",
 *   image: "https://...",
 *   caption: "My post"
 * });
 * 
 * Find all posts:
 * const posts = await postModel.find();
 * 
 * Delete post:
 * await postModel.findByIdAndDelete(_id);
 * 
 * Find by fileId:
 * const post = await postModel.findOne({ fileId });
 */

// Export model for use in controllers
module.exports = postModel;
