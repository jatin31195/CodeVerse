const express = require('express');
const router = express.Router();
const customPOTDRoute = require('./customUserPOTD-routes');
const solutionRoute = require('./solution-routes');

router.use('/user-potd',customPOTDRoute);

module.exports = router;