const mongoose = require("mongoose");

const favoriteListSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    questions: [
      {
        questionId: { type: String, ref: "Question" },
        title: { type: String },
        questionUrl: { type: String },
        difficulty: { type: String },
        platform: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("FavoriteList", favoriteListSchema);
