const mongoose = require("mongoose");

async function connectDB() {
  await mongoose.connect(
    "mongodb+srv://Garvit:jc7DhOD4W1qcFBRJ@backend.amxg3j4.mongodb.net/notes",
  );

  console.log("Connected to DB..");
}

module.exports =  connectDB;
