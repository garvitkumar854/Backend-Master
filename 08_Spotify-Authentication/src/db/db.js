/**
 * DATABASE CONNECTION MODULE (db.js)
 * 
 * This file handles the MongoDB connection setup using Mongoose
 * Mongoose is an ODM (Object Data Modeling) library that provides:
 * - Schema validation
 * - Type casting
 * - Query building
 * - Relationship management
 * 
 * ENVIRONMENT VARIABLES:
 * MONGO_URI: Connection string to MongoDB database
 * Example: mongodb://localhost:27017/spotify-clone
 */

require('dotenv').config(); // Load environment variables from .env file
const mongoose = require('mongoose');

/**
 * FUNCTION: connectDB
 * PURPOSE: Establish connection to MongoDB database
 * RETURNS: Promise that resolves when connected
 * 
 * WORKFLOW:
 * 1. Read MONGO_URI from environment variables
 * 2. Attempt to connect to MongoDB
 * 3. Log success message if connected
 * 4. Log error and exit if connection fails
 */
async function connectDB() {
    try {
        // Connect to MongoDB using the connection string from .env
        // mongoose.connect() returns a Promise
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        // If connection fails, log the error
        console.error('Error connecting to MongoDB:', error);
        
        // Exit process with error code (1 = failure)
        // This prevents the server from running with no database
        process.exit(1);
    }
}

// Export function to be called in server.js
module.exports = connectDB;