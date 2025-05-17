const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const customUserPOTDSchema = new mongoose.Schema({
  _id:      { type: String, default: uuidv4 },
  list_id:  { type: String, ref: "CustomPOTDList", required: true },
  platform: { type: String, required: true },
  title:    { type: String, required: true },
  link:     { type: String, required: true },
  date:     { type: Date,   required: true },
  addedAt:  { type: Date,   default: Date.now },
});

// keep your “one question per date per list” index
customUserPOTDSchema.index({ list_id: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("CustomUserPOTD", customUserPOTDSchema);
