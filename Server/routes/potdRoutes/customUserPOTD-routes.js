const express = require("express");
const { handleCustomUserPOTD } = require("../../controllers/potdControllers/customUserPOTD-controller");

const router = express.Router();

router.post("/add", handleCustomUserPOTD);

module.exports = router;
