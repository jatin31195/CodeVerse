const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const ChatSchema = new mongoose.Schema({
  question: { type: String, ref: "Question", required: true, unique: true },
  messages: [MessageSchema],
  createdAt: { type: Date, default: Date.now, expires: 129600 }
});




module.exports = mongoose.model("Chat", ChatSchema);
