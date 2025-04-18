const ChatService = require("../services/chatService");

exports.getHistory = async (req, res) => {
  try {
    const messages = await ChatService.getMessages(req.params.questionId);
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.postMessage = async (req, res) => {
  try {
    const saved = await ChatService.addMessage(
      req.params.questionId,
      req.user.id,
      req.body.text
    );
    res.status(201).json({ message: saved });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
