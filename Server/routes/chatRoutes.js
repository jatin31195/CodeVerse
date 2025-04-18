const router = require("express").Router();
const ChatController = require("../controllers/chatController");
const authMiddleware = require("../middlewares/authMiddlewares"); 

router.get("/:questionId", authMiddleware, ChatController.getHistory);
router.post("/:questionId/message", authMiddleware, ChatController.postMessage);

module.exports = router;
