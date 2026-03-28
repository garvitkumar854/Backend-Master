const mongoose = require('mongoose');
const config = require('./config.js');

// DB Connection 

async function connectDB() {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log('Connected to DB');
    } catch (err) {
        console.error('Error connecting to DB', err.message);
        throw err;
    }
}

module.exports = connectDB;