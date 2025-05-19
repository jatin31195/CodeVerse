const express = require("express");
const { codeforcesController } = require("../../controllers/platformControllers");
const router = express.Router();
router.get('/potd/:date',codeforcesController.getPOTDByDate);

module.exports = router;
