const express = require("express")
const leetcodeRouter = require('./leetcode-routes');
const codeforcesRouter = require('./codeforces-router');
const gfgRouter=require('./gfg-router');
const router = express.Router();


router.use('/leetcode',leetcodeRouter);
router.use('/codeforces',codeforcesRouter);
router.use('/gfg',gfgRouter);

module.exports = router;