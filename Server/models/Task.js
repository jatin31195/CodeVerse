const mongoose = require('mongoose');

const DailyTaskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  task: { type: String, required: true },
  date: { type: String, required: true }, // Store as YYYY-MM-DD
  completed: { type: Boolean, default: false }
});

const DailyTaskModel = mongoose.model('DailyTask', DailyTaskSchema);
module.exports = DailyTaskModel;
