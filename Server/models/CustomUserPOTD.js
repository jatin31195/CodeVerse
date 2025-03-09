const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const CustomUserPOTDSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  user_id: { type: String, required: true, ref: "User" },
  platform: { type: String, required: true },
  title: { type: String, required: true },
  link: { type: String, required: true },
  problem_id: { type: Number, required: true },
  addedAt: { type: Date, default: Date.now },
});

// Create a unique index on the correct fields
CustomUserPOTDSchema.index({ user_id: 1, problem_id: 1 }, { unique: true });

module.exports = mongoose.model("CustomUserPOTD", CustomUserPOTDSchema);
