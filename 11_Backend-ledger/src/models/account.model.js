const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "User reference is required"],
        index: true
    },
    status: {
        type: String,
        required: [true, "Status is required"],
        enum: {
            values: ["ACTIVE", "FROZEN", "CLOSED"],
            message: "Status must be either ACTIVE, FROZEN, or CLOSED",
        },
        default: "ACTIVE"
    },
    currency: {
        type: String,
        required: [true, "Currency is required"],
        default: "INR",
        uppercase: true,
        trim: true,
        match: [/^[A-Z]{3}$/, "Currency must be a valid 3-letter ISO code"]
    }
}, {
    timestamps: true
})

accountSchema.index({ user: 1, status: 1 });

const accountModel = mongoose.model("account", accountSchema);

module.exports = accountModel;