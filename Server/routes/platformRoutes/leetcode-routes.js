const express = require("express");
const {leetcodeController}=require('../../controllers/platformControllers');

const router = express.Router();

router.get("/potd/:date", leetcodeController.getPOTDByDate);

module.exports = router; 
