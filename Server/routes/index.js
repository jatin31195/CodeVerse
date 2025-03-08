const express = require('express');
const router = express.Router();
const authRoutes= require('./authRoutes');
const platformRoutes = require('./platformRoutes');
const taskRoutes=require('./taskRoutes')
router.use('/ques',platformRoutes);
router.use('/auth',authRoutes);
router.use('/tasks',taskRoutes);
module.exports = router;