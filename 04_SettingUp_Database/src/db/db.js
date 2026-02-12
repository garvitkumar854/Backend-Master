const mongoose = require("mongoose");

async function connectDB() {
    // cluster uri: "mongodb+srv://Garvit:jc7DhOD4W1qcFBRJ@backend.amxg3j4.mongodb.net/"
    // connect to the database
    await mongoose.connect("<your-mongodb-uri>")
    // use await = because of waiting to connect to the database, then only move to next line
    console.log("Connected to DB..."); 0
}

// export the logic
module.exports = connectDB;