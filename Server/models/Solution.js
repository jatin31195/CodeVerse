const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const SolutionSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    question: { type: String, ref: "Question", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["brute", "better", "optimal"], required: true },
    language: { type: String, enum: ["C++", "Java"], required: true },
    content: { type: String, required: true },
    votes: { type: Number, default: 0 },
    upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    downvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });
SolutionSchema.index({ question: 1, user: 1 }, { unique: true });
module.exports = mongoose.model("Solution", SolutionSchema);
