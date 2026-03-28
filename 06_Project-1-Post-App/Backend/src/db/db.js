/**
 * DATABASE CONNECTION MODULE (db.js)
 * 
 * Establishes MongoDB connection using Mongoose
 * MongoDB: NoSQL database for storing post data
 * Mongoose: ODM (Object Data Modeling) library for MongoDB
 * 
 * CONNECTION:
 * - Local: mongodb://localhost:27017/postapp
 * - Cloud: MongoDB Atlas (cloud database service)
 * 
 * Environment Variable:
 * - MONGO_URI: Connection string from .env file
 */

const mongoose = require("mongoose");

/**
 * FUNCTION: connectDB
 * PURPOSE: Connect to MongoDB database
 * 
 * ASYNC: This function returns a Promise
 * - try/catch: Handle success and error cases
 * - await: Wait for connection to complete before proceeding
 * 
 * SUCCESS:
 * - Log "Connected to DB.."
 * - Mongoose ready for database operations
 * 
 * ERROR:
 * - Log "Error connecting to DB.."
 * - Database operations will fail if connection fails
 * 
 * BEST PRACTICE:
 * - Call this function before starting Express server
 * - Use in server.js: await connectDB();
 */
async function connectDB() {
  try {
    // Connect to MongoDB using environment variable
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB..");
  } catch (err) {
    // Connection failed
    console.log("Error connecting to DB..");
    // In production: Should exit process or retry
  }
}

// Export function for use in server.js
module.exports = connectDB;
