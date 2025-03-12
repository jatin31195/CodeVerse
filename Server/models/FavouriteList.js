
const mongoose = require("mongoose");

const favoriteListSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    questions: [{ type: String, ref: "Question" ,required:true}],
  },
  { timestamps: true }
);

module.exports = mongoose.model("FavoriteList", favoriteListSchema);
