const express = require("express");
const router = express.Router();
const codeforcesUserController = require("../../controllers/platformControllers/codeforces-user-controller");

router.get("/:username", codeforcesUserController.getUserFullData);


module.exports = router;
