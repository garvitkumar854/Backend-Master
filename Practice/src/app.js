const express = require("express");
const app = express();

// middlewares

const cookieParser = require("cookie-parser");

// routes
const authRoutes = require("./routes/auth.routes");
const musicRoutes = require("./routes/music.routes");

// middlewares usage
app.use(express.json());
app.use(cookieParser());

// Auth routes
app.use("/api/auth", authRoutes);
// Music routes
app.use("/api/music", musicRoutes);

module.exports = app;
