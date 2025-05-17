const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const QuestionSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },

  platform: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  problem_id: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  solutions: [{ type: String, ref: "Solution" }],
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },

  
  easyExplanation: {
    type: String,
    default: null
  },
  realLifeExample: {
    type: String,
    default: null
  }
});

QuestionSchema.index({ date: 1, platform: 1, problem_id: 1 }, { unique: true });

module.exports = mongoose.model("Question", QuestionSchema);
