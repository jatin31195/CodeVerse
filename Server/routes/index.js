const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const platformRoutes = require("./platformRoutes");
const taskRoutes = require("./taskRoutes");
const customPOTDRoute = require('./potdRoutes');

router.use("/ques", platformRoutes);
router.use("/auth", authRoutes);
router.use("/tasks", taskRoutes);
router.use('/custom',customPOTDRoute);

module.exports = router;
