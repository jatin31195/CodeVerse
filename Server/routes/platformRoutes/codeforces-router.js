const express = require("express");
const { codeforcesController } = require("../../controllers/platformControllers");
const router = express.Router();


router.get("/problem", codeforcesController.fetchDailyProblem);
router.get('/potd/:date',codeforcesController.currentQues);

module.exports = router;
