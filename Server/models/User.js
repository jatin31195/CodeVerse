const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  
  username: { 
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    default:"",
  },
  profilePic: {
    type: String,
    default: "", 
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
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: true,
  },
  
  leetcodeUsername: {
    type: String,
    default: "",
  },
  codeforcesUsername: {
    type: String,
    default: "",
  },
  gfgUsername: {
    type: String,
    default: "",
  },
  
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
 
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "DailyTask" }], 
  favoriteLists: [{ type: mongoose.Schema.Types.ObjectId, ref: "FavoriteList" }]
});

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
