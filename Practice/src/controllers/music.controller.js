require('dotenv').config();
const musicModel = require('../models/music.model');
const albumModel = require('../models/album.model');

const uplaodFile = require('../services/storage.service').uploadFile;
const jwt = require("jsonwebtoken");

const multer = require("multer");

async function createMusic(req, res) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "artist") {
            return res.status(403).json({ message: "Forbidden" });
        }

        const { title } = req.body;
        const file = req.file;

        const result = await uplaodFile(file.buffer);

        const music = await musicModel.create({
            uri: result.url,
            title,
            artist: decoded.id
        });
        res.status(201).json({ message: "Music uploaded successfully", music });

    } catch (err) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}

async function createAlbum(req, res) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (decoded.role !== "artist") {
            return res.status(403).json({ message: "Forbidden" });
        }

        const { title, musics } = req.body;

        const album = await albumModel.create({
            title,
            artist: decoded.id,
            musics: musics
        });

        res.status(201).json({ message: "Album created successfully", album });
    } catch (err) {
        console.log(err)
        return res.status(401).json({ message: "Unauthorized" });
    }
}
module.exports = { createMusic, createAlbum };