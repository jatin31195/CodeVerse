const express = require("express");
const {
  getTasks,
  addTask,
  updateTask,
  completeTask,
  toggleReminder
} = require("../controllers/taskController");
const authMiddleware = require("../middlewares/authMiddlewares");

const router = express.Router();

router.get("/", authMiddleware, getTasks);
router.post("/", authMiddleware, addTask);
router.put("/:taskId", authMiddleware, updateTask);
router.delete("/:taskId", authMiddleware, completeTask);
router.patch("/:taskId/reminder",authMiddleware,toggleReminder);
module.exports = router;
