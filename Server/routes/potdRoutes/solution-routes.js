const express = require("express");
const { addSolution, getSolutionsByQuestion, voteSolution } = require("../../controllers/potdControllers/solution-controller");

const router = express.Router();

router.post("/add", addSolution);  
router.get("/:questionId", getSolutionsByQuestion); 
router.post("/vote", voteSolution); 

module.exports = router;
