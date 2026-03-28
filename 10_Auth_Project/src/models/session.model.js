const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, "User is required"],
    },
    refreshToken: {
        type: String,
        required: [true, "Refresh Token is required"],
    },
    ip: {
        type: String,
        required: [true, "IP Address is required"],
    },
    userAgent: {
        type: String,
        required: [true, "User Agent is required"],
    },
    revoke: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const sessionModel = mongoose.model('sessions', sessionSchema);

module.exports = sessionModel;