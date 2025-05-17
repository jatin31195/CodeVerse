const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/authMiddlewares"); // Import auth middleware

const {
  handleCreateList,
  handleAddQuestion,
  handleGetPublicLists,
  handleGetQuestionsFromList,
  handleUpdateListVisibility,
  handleGetOwnLists, // Import new handler
} = require("../../controllers/potdControllers/customUserPOTD-controller");

// All routes that modify data should be protected by auth middleware
router.post("/list", authMiddleware, handleCreateList);
router.post("/list/add-question", authMiddleware, handleAddQuestion);
router.patch("/list/:listId/visibility", authMiddleware, handleUpdateListVisibility);
router.get('/lists', authMiddleware, handleGetOwnLists);
router.get("/lists/public", handleGetPublicLists);
router.get("/list/:listId/questions", handleGetQuestionsFromList);

module.exports = router;
