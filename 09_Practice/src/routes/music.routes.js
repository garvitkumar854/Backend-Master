const express = require('express');
const musicController = require('../controllers/music.controller');

// Middlewares
const multer = require('multer');
const authMiddleware = require('../middlewares/auth.middleware');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

// Create Music
router.post('/upload', authMiddleware.authArtist, upload.single('music'), musicController.createMusic);

// Create Album
router.post('/album', authMiddleware.authArtist, musicController.createAlbum);

// Get All Musics
router.get("/", authMiddleware.authUser, musicController.getAllMusics);

// Get All Albums
router.get("/albums", authMiddleware.authUser, musicController.getAllAlbums);

// Open An Album
router.get('/albums/:albumId', authMiddleware.authUser, musicController.getAlbumById);

module.exports = router;