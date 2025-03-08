const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");


const SolutionSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    question: { type: String, ref: "Question", required: true },
    user: { type: String, ref: "User", required: true },
    type: { type: String, enum: ["brute", "better", "optimal"], required: true },
    content: { type: String, required: true },
    votes: { type: Number, default: 0 },
  });
  
  module.exports = mongoose.model("Solution", SolutionSchema);