require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const multer = require("multer");
app.use(cors());
app.use(express.json());

const postModel = require("./models/post.model");

const upload = multer({ storage: multer.memoryStorage() });
const { uploadImage, deleteImage } = require("./services/storage.service");

app.post("/create-post", upload.single("image"), async (req, res) => {
  const result = await uploadImage(req.file.buffer);
  await postModel.create({
    fileId: result.fileId,
    image: result.url,
    caption: req.body.caption,
  });

  res.status(201).json({
    message: "Post created",
    result,
  });

  console.log("Post Created:", result);
});

app.get("/posts", async (req, res) => {
  const posts = await postModel.find();
  res.status(200).json({
    message: "Posts retrieved",
    posts,
  });
  console.log("Posts Retrieved:", posts);
});

app.delete("/delete-post/:id", async (req, res) => {
  try {
    const fileId = req.params.id;

    // Find post using ImageKit fileId
    const post = await postModel.findOne({ fileId });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Delete image from ImageKit
    const response = await deleteImage(fileId);

    // Delete post from MongoDB
    await postModel.findByIdAndDelete(post._id);

    console.log("ImageKit delete response:", response);

    res.json({ message: "Post deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
});


module.exports = app;
