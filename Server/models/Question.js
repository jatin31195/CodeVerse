const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const QuestionSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    platform: { type: String, enum: ["LeetCode", "GFG", "Codeforces"], required: true },
    title: { type: String, required: true },
    link: { type: String, required: true },
    date: { type: String, required: true, unique: true },
  });
  QuestionSchema.index({ date: 1, platform: 1 }, { unique: true });
  module.exports = mongoose.model("Question", QuestionSchema);