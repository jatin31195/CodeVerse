const mongoose = require("mongoose");

const userProblemStatusSchema = new mongoose.Schema({
  userId: { type: String, ref: "User", required: true },
  listId: { type: String, ref: "CustomPOTDList", required: true },
  problemId: { type: String, required: true }, 
  date: { type: Date, required: true },
  isDone: { type: Boolean, default: false },
  markedAt: { type: Date, default: Date.now },
});

userProblemStatusSchema.index({ userId: 1, listId: 1, date: 1, problemId: 1 }, { unique: true });

module.exports = mongoose.model("UserProblemStatus", userProblemStatusSchema);
