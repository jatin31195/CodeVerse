const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    JWT_SECRET : process.env.JWT_SECRET,
    OPENAI : process.env.OPENAI,
}
