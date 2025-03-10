const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const SolutionSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    question: { type: String, ref: "Question", required: true },
    user: { type: String, ref: "User", required: true },
    type: { type: String, enum: ["brute", "better", "optimal"], required: true },
    language: { type: String, enum: ["C++", "Java"], required: true },
    content: { type: String, required: true },
    votes: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Solution", SolutionSchema);
