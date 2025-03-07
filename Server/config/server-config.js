const dotenv = require('dotenv');

dotenv.config();
console.log(process.env.MONGO_URL)
console.log(process.env.PORT)
module.exports = {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL
}
