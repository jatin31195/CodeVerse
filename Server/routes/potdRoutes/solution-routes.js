const express = require("express");
const { addSolution, getSolutionsByQuestion, voteSolution } = require("../../controllers/potdControllers/solution-controller");
const authMiddleware = require("../../middlewares/authMiddlewares");

const router = express.Router();

router.post("/add",authMiddleware, addSolution);  
router.get("/:questionId", getSolutionsByQuestion); 
router.post("/vote",authMiddleware, voteSolution); 


module.exports = router;
