const {
  createCustomPOTDList,
  addQuestionToList,
  getPublicLists,
  getQuestionsFromList,
  updateListVisibility,
  getOwnLists,
} = require("../../services/potdServices/customUserPOTD-service");

const handleGetOwnLists = async (req, res) => {
  const userId = req.user.userId;
  try {
    const lists = await getOwnLists(userId);
    res.json({ success: true, lists });
  } catch (err) {
    console.error("Error fetching own lists:", err);
    res.status(500).json({ success: false, message: "Could not fetch lists." });
  }
};

const handleCreateList = async (req, res) => {
  const { name, isPublic } = req.body;
  const userId = req.user.userId;
  try {
    const list = await createCustomPOTDList(userId, name, isPublic);
    res.status(201).json({ success: true, list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Could not create list." });
  }
};

const handleAddQuestion = async (req, res) => {
  const { platform, title, link, date, listId } = req.body;
  const userId = req.user.userId;

  if (!listId) {
    return res
      .status(400)
      .json({ success: false, message: "listId is required" });
  }

  try {
    const result = await addQuestionToList(userId, listId, {
      platform,
      title,
      link,
      date,
    });
    if (!result.success) {
      return res.status(403).json(result);
    }
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Error adding question." });
  }
};

const handleUpdateListVisibility = async (req, res) => {
  const { listId } = req.params;
  const { isPublic } = req.body;
  const userId = req.user.userId;
  try {
    const result = await updateListVisibility(userId, listId, isPublic);
    if (!result.success) {
      return res.status(403).json(result);
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error updating visibility." });
  }
};

const handleGetPublicLists = async (_, res) => {
  try {
    const lists = await getPublicLists();
    res.json({ success: true, lists });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

const handleGetQuestionsFromList = async (req, res) => {
  const { listId } = req.params;
  try {
    const questions = await getQuestionsFromList(listId);
    res.json({ success: true, questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

module.exports = {
  handleCreateList,
  handleAddQuestion,
  handleGetPublicLists,
  handleGetQuestionsFromList,
  handleUpdateListVisibility,
  handleGetOwnLists,
};
