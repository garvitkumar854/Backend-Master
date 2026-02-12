const mongoose = require("mongoose");

async function connectDB() {
    // cluster uri: "<cluster_uri/database"
    // connect to the database
    await mongoose.connect("<your-mongodb-uri>")
    // use await = because of waiting to connect to the database, then only move to next line
    console.log("Connected to DB..."); 0
}

// export the logic
module.exports = connectDB;