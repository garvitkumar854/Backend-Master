const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true, // Automatically removes extra spaces
        minlength: [3, 'Full name must be at least 3 characters long']
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        lowercase: true, // Always saves "John" as "john"
        minlength: [3, 'Username must be at least 3 characters'],
        match: [/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers, and underscore']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        // Regex validation for email format
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    role: {
        type: String,
        enum: {
            values: ['user', 'admin'], // Added 'artist' based on your Spotify project
            message: '{VALUE} is not a valid role'
        },
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false // This prevents the password from being returned in API calls by default (Security Best Practice)
    },
    verified:{
        type: Boolean,
        default: false
    }
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;