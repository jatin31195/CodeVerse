const express = require("express");
const leetcodeUserController = require("../../controllers/platformControllers/leetcode-user-controller");

const router = express.Router();

router.get("/:username", leetcodeUserController.getLeetCodeUserData);

module.exports = router;
