const express = require("express");
const router = express.Router();
const gfgUserController = require("../../controllers/platformControllers/gfg-user-controller");

router.get("/:username", gfgUserController.getGfgUserDetails);
router.post("/heatmap", gfgUserController.getGfgUserHeatmap);

module.exports = router;
