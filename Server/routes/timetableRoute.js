const express = require("express");
const router = express.Router();
const timetableController = require("../controllers/timetableController");
const  authMiddleware  = require("../middlewares/authMiddlewares");


router.post("/schedule", authMiddleware, timetableController.createTimetable);
router.get("/schedule", authMiddleware, timetableController.getTimetable);
router.delete("/schedule", authMiddleware, timetableController.deleteTimetable);

module.exports = router;
