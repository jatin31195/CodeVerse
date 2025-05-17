const express = require("express");
const router = express.Router();
const gfgController = require("../../controllers/platformControllers/gfg-controller");

router.get('/potd/:date', gfgController.getGFGPOTDByDateHandler);

module.exports = router;
