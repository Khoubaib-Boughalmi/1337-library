const mongoose = require('mongoose');
require('dotenv').config();

async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
    } catch (error) {}
}

module.exports = connectToDatabase;
