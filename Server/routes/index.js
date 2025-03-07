const express = require('express');
const router = express.Router();

const platformRoutes = require('./platformRoutes');

router.use('/ques',platformRoutes);

module.exports = router;