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
    type: String,
    required: true,
  },
  // Other fields like difficulty, topics, rating, tags, points, etc.
});

// Create a compound index on date and platform
QuestionSchema.index({ date: 1, platform: 1 }, { unique: true });

module.exports = mongoose.model("Question", QuestionSchema);
