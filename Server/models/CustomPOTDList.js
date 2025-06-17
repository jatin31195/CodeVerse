const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const customPOTDListSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },

  createdBy: {
    type: String,
    ref: "User",
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  isPublic: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Enforce unique list name per user
customPOTDListSchema.index({ createdBy: 1, name: 1 }, { unique: true });
customPOTDListSchema.index({ createdAt: 1 }, { expireAfterSeconds: 345600 });
module.exports = mongoose.model("CustomPOTDList", customPOTDListSchema);
