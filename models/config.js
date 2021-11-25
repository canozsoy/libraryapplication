const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
    } catch (err) {
        console.error
            .bind(console, `MongoDB connection error:${err}`);
    }
};

module.exports = connectDB;
