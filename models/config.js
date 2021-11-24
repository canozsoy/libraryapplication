const mongoose = require('mongoose');

const mongoURL = process.env.MONGO_URL;

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURL);
    } catch (err) {
        console.error
            .bind(console, `MongoDB connection error:${err}`);
    }
};

module.exports = connectDB;
