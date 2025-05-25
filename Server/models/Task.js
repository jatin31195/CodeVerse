const mongoose = require('mongoose');

const DailyTaskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  task: { type: String, required: true },
  date: { type: Date, required: true }, 
  endDateTime: { type: Date, required: true },
  completed: { type: Boolean, default: false },
  reminderEnabled: { type: Boolean, default: false },
  reminderTime: { type: Date }

});

const DailyTaskModel = mongoose.model('DailyTask', DailyTaskSchema);
module.exports = DailyTaskModel;
