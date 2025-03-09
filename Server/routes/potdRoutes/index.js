const express = require('express');
const router = express.Router();
const customPOTDRoute = require('./customUserPOTD-routes');

router.use('/user-potd',customPOTDRoute);

module.exports = router;