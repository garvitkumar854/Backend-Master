const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  fileId: String,
  image: String,
  caption: String,
});

const postModel = mongoose.model("post", postSchema);

module.exports = postModel;
