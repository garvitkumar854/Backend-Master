const musicModel = require("../models/music.model");
const jwt = require("jsonwebtoken");
const { uploadFile } = require("../services/storage.service");

async function createMusic(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "artist") {
      return res
        .status(403)
        .json({ message: "You don't have Required Access" });
    }
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { title } = req.body;
  const file = req.body;

  const result = await uploadFile(file);
  const music = new musicModel({
    uri: result.url,
    title,
    artist: decoded.id,
  });

  res.status(201).json({ message: "Music created successfully", music });
}


module.exports = { createMusic };