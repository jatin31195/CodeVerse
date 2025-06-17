const {
  markQuestionDone,
  unmarkQuestionDone,
  getDoneStatus,
} = require("../../services/potdServices/userProblemStatusService");

exports.markDone = async (req, res) => {
  try {
    const { listId, problemId, date } = req.body;
    const userId = req.user.userId;

    if (!listId || !problemId || !date) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await markQuestionDone({ userId, listId, problemId, date });
    res.json(result);
  } catch (err) {
    console.error("Mark done error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.unmarkDone = async (req, res) => {
  try {
    const { listId, problemId, date } = req.body;
    const userId = req.user.userId;

    if (!listId || !problemId || !date) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await unmarkQuestionDone({ userId, listId, problemId, date });
    res.json(result);
  } catch (err) {
    console.error("Unmark done error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getDoneStatus = async (req, res) => {
  try {
    const { listId, date } = req.query;
    const userId = req.user.userId;

    if (!listId || !date) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const doneProblemIds = await getDoneStatus(userId, listId, date);
    res.json({ success: true, doneProblemIds });
  } catch (err) {
    console.error("Get done status error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
