const express = require("express");
const { submitSolution, voteSolution } = require("../controllers/solutionController");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");

router.post("/submit", authMiddleware, submitSolution);
router.post("/vote", authMiddleware, voteSolution);

module.exports = router;