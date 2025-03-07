const mongoose = require('mongoose');
const {MONGO_URL} = require('./server-config');

const connectDb = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log('Conncted to MongoDB');
    } catch (error) {
        console.log('MongoDB Connection Error:',error);
        process.exit(1);
    }
}

module.exports = connectDb;