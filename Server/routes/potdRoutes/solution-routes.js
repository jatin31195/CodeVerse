const express = require("express");
const { addSolution, getSolutionsByQuestion, voteSolution } = require("../../controllers/potdControllers/solution-controller");
const  analyzeSolutionComplexity  = require("../../controllers/potdControllers/solution-complexity-controller");

const router = express.Router();

router.post("/add", addSolution);  
router.get("/:questionId", getSolutionsByQuestion); 
router.post("/vote", voteSolution); 
router.post("/complexity",analyzeSolutionComplexity);

module.exports = router;
