const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { 
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "DailyTask" }], 
  favoriteLists: [{ type: mongoose.Schema.Types.ObjectId, ref: "FavoriteList" }] 
});

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
