const mongoose = require("mongoose");


// Creation of Schema
const noteSchema = new mongoose.Schema({
    title: String,
    description: String
})

// creation of model to use CRUD operations, code reusability
const noteModel = mongoose.model("Note", noteSchema);

// export the model
module.exports = noteModel;