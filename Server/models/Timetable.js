const mongoose = require("mongoose");

const TimetableSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  schedule: {
    type: Array, 
    required: true,
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 86400 
  },
  currentTimetable: { type: mongoose.Schema.Types.ObjectId, ref: "Timetable" }
});

const TimetableModel = mongoose.model("Timetable", TimetableSchema);
module.exports = TimetableModel;
