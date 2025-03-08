const express = require('express');
const router = express.Router();
const authRoutes= require('./authRoutes');
const platformRoutes = require('./platformRoutes');

router.use('/ques',platformRoutes);
router.use('/auth',authRoutes);
module.exports = router;