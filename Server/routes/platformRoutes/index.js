const express=require("express")
const router = express.Router();

const leetcodeRouter = require('./leetcode-routes');
router.use('/leetcode',leetcodeRouter);

module.exports = router;