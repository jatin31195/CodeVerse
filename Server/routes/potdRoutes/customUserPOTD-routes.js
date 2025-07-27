const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/authMiddlewares");

const {
  handleCreateList,
  handleAddQuestion,
  handleGetPublicLists,
  handleGetQuestionsFromList,
  handleUpdateListVisibility,
  handleGetOwnLists,
  handleAddAdmin,
  handleRemoveAdmin,
} = require("../../controllers/potdControllers/customUserPOTD-controller");

router.post("/list", authMiddleware, handleCreateList);
router.post("/list/add-question", authMiddleware, handleAddQuestion);
router.patch("/list/:listId/visibility", authMiddleware, handleUpdateListVisibility);
router.post("/list/admin", authMiddleware, handleAddAdmin);
router.delete("/list/admin", authMiddleware, handleRemoveAdmin);
router.get("/lists", authMiddleware, handleGetOwnLists);
router.get("/lists/public", handleGetPublicLists);
router.get("/list/:listId/questions", handleGetQuestionsFromList);

module.exports = router;
