const express = require("express");
const router = express.Router();
const ProblemStatusController = require("../../controllers/potdControllers/userProblemStatusController");
const authMiddleware =require('../../middlewares/authMiddlewares')
router.post("/mark-done", authMiddleware,ProblemStatusController.markDone);
router.post("/unmark-done",authMiddleware, ProblemStatusController.unmarkDone);
router.get("/done-status",authMiddleware, ProblemStatusController.getDoneStatus);

module.exports = router;
