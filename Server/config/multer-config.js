const multer = require('multer');
const { storage } = require('../config/cloudinary-config');

const upload = multer({ storage });
module.exports = upload;
