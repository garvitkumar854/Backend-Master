/**
 * USER MODEL (user.model.js)
 * 
 * Defines the structure and rules for user documents in MongoDB
 * A Mongoose Schema acts as a blueprint for user data
 * 
 * LEARNING CONCEPTS:
 * - Schema: Defines field names, types, and validation rules
 * - Model: Creates a class to interact with the database
 * - unique: Ensures no duplicate values in the database
 * - enum: Restricts value to specific allowed options
 * - default: Sets a default value if not provided
 */

const mongoose = require('mongoose');

/**
 * USER SCHEMA
 * Defines all fields that a user document must contain
 */
const userSchema = new mongoose.Schema({
    /**
     * USERNAME
     * - Type: String
     * - Required: User must provide a username
     * - Unique: No two users can have the same username
     * - Useful for: Queries, user identification, login
     */
    username: {
        type: String,
        required: true,
        unique: true
    },

    /**
     * EMAIL
     * - Type: String
     * - Required: User must provide an email
     * - Unique: No two users can have the same email
     * - Useful for: Notifications, password recovery, login
     */
    email: {
        type: String,
        required: true,
        unique: true
    },

    /**
     * PASSWORD
     * - Type: String (stores HASHED password, never plain text!)
     * - Required: User must provide a password
     * - Important: Password should be hashed using bcryptjs before storing
     * - Security: Never log or expose this field
     */
    password: {
        type: String,
        required: true
    },

    /**
     * ROLE - Role-Based Access Control (RBAC)
     * - Type: String
     * - Enum: Restricts to only 'user' or 'artist' values
     * - Default: Set to 'user' if not specified
     * - Purpose: Determines what actions user can perform
     *   - 'user': Can listen to music, view albums
     *   - 'artist': Can upload music, create albums, plus user duties
     */
    role: {
        type: String,
        enum: ['user', 'artist'],
        default: 'user'
    }
});

/**
 * CREATE MODEL
 * - Converts schema into a model
 * - First parameter: Collection name in MongoDB (lowercase)
 * - Second parameter: Schema to use
 * - Returns: A model class with methods like find(), create(), etc.
 */
const userModel = mongoose.model('user', userSchema);

// Export the model to be used in controllers and routes
module.exports = userModel;