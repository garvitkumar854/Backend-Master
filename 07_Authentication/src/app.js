const express = require("express");
const app = express();

const cookieParser = require("cookie-parser"); // Middleware for parsing cookies
app.use(express.json());
app.use(cookieParser()); // Use cookie-parser middleware

const authRoutes = require("./routes/auth.routes");
const postRoutes = require("./routes/post.routes");


app.use("/api/auth", authRoutes);

app.use("/api/posts", postRoutes);

module.exports = app;
