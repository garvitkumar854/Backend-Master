const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "artist"], // Define the allowed roles for users (list option)
    default: "user", // Set default role to 'user'
  },
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
