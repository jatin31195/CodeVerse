const express = require('express');
const router = express.Router();
const authRoutes= require('./authRoutes');
const platformRoutes = require('./platformRoutes');
const taskRoutes=require('./taskRoutes')
const leetcodeUserRouter=require('./platformRoutes/leetcode-user-route');
const gfgUserRouter=require("./platformRoutes/gfg-user-routes");
const codeforcesUserRouter=require('./platformRoutes/codeforces-user-routes');
router.use('/ques',platformRoutes);
router.use('/auth',authRoutes);
router.use('/tasks',taskRoutes);
router.use('/leetcode-user',leetcodeUserRouter);
router.use('/gfg-user',gfgUserRouter);
router.use('/codeforces-user',codeforcesUserRouter);
module.exports = router;