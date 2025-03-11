const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const platformRoutes = require("./platformRoutes");
const taskRoutes = require("./taskRoutes");
const customPOTDRoute = require('./potdRoutes');

const leetcodeUserRouter=require('./platformRoutes/leetcode-user-route');
const gfgUserRouter=require("./platformRoutes/gfg-user-routes");
const codeforcesUserRouter=require('./platformRoutes/codeforces-user-routes');
const SolutionRoute = require('./potdRoutes/solution-routes');

const getAllQuestions=require('.././controllers/questionsController');
const ticketRaise=require('./ticketRoutes');
router.use("/ticket-Raise",ticketRaise);
router.use("/ques", platformRoutes);
router.use("/auth", authRoutes);
router.use("/tasks", taskRoutes);
router.use('/custom',customPOTDRoute);
router.use('/questions',getAllQuestions.getAllQuestions);
router.use('/leetcode-user',leetcodeUserRouter);
router.use('/gfg-user',gfgUserRouter);
router.use('/codeforces-user',codeforcesUserRouter);

router.use('/solutions',SolutionRoute);

module.exports = router;
