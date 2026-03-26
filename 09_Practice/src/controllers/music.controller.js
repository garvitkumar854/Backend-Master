// Models
const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model");
// JWT
const jwt = require("jsonwebtoken");
// Image Kit - Upload
const { uploadFile } = require("../services/storage.service");

//* Create Music
async function createMusic(req, res) {


    const { title } = req.body;
    const file = req.file;

    if (!title || !file?.buffer) {
        return res.status(400).json({ message: "Title and music file are required" });
    }

    const result = await uploadFile(file.buffer.toString("base64"));
    const music = await musicModel.create({
        uri: result.url,
        title,
        artist: req.user.id,
    });

    res.status(201).json({
        message: "Music created successfully",
        music: {
            id: music._id,
            uri: music.uri,
            title: music.title,
            artist: music.artist,
        }
    });
}

// Create Album
async function createAlbum(req, res) {
    const { title, musics } = req.body;

    const album = await albumModel.create({
        title,
        artist: req.user.id,
        musics: musics,
    })
    res.status(201).json({
        message: "Album created Successfully",
        album: {
            id: album._id,
            title: album.title,
            artist: album.artist,
            musics: album.musics,
        }
    })
}

// Get All Musics
async function getAllMusics(req, res) {
    try {
        const musics = await musicModel.find().populate("artist", "username email");
        res.status(200).json({
            message: "All Musics Fetched Successfully",
            musics: musics,
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Get All Albums
async function getAllAlbums(req, res) {
    try {
        const albums = await albumModel.find().select("title artist").populate("artist", "username email");
        res.status(200).json({
            message: "All Albums",
            albums: albums
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

async function getAlbumById(req, res) {
    try {
        const { albumId } = req.params;

        const album = await albumModel
            .findById(albumId)
            .populate("artist", "username email")
            .populate("musics");

        if (!album) {
            return res.status(404).json({ message: "Album not found" });
        }

        return res.status(200).json({
            message: "Album Fetched Successfully",
            album: album,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { createMusic, createAlbum, getAllMusics, getAllAlbums, getAlbumById };