const express = require("express")
const leetcodeRouter = require('./leetcode-routes');
const codeforcesRouter = require('./codeforces-router');
const gfgRouter=require('./gfg-router');
const getEasyExplanationController = require('../../controllers/easyExplanation-controller');

const router = express.Router();

router.post('/easy',getEasyExplanationController);
router.use('/leetcode',leetcodeRouter);
router.use('/codeforces',codeforcesRouter);
router.use('/gfg',gfgRouter);

module.exports = router;