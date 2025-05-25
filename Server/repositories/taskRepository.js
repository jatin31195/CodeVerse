const mongoose = require("mongoose");
const DailyTask = require("../models/Task");
const User = require("../models/User");

function toValidDate(value, fieldName) {
  if (value instanceof Date) {
    if (isNaN(value.getTime())) {
      throw new Error(`Invalid ${fieldName}`);
    }
    return value;
  }
  
  const d = new Date(value);
  if (isNaN(d.getTime())) {
    throw new Error(`Invalid ${fieldName}`);
  }
  return d;
}

const DailyTaskRepository = {
  
  getTasksByDate: async (userId, date) => {
    if (!date) {
      throw new Error("Please provide a date (YYYY-MM-DD).");
    }
    const d = toValidDate(date, "date");
    const startOfDay = new Date(d);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(d);
    endOfDay.setHours(23, 59, 59, 999);

    return await DailyTask.find({
      user: userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });
  },

  addTask: async (userId, { task, date, endDateTime, reminderTime }) => {
  const d = toValidDate(date, "date");
  const end = toValidDate(endDateTime, "endDateTime");
  const reminder = reminderTime ? toValidDate(reminderTime, "reminderTime") : undefined;

  const newTask = await DailyTask.create({
    user: userId,
    task,
    date: d,
    endDateTime: end,
    ...(reminder && { reminderTime: reminder }),
  });

  await User.findByIdAndUpdate(
    userId,
    { $push: { tasks: newTask._id } },
    { new: true }
  );

  return newTask;
},

  taskExists: async (userId, { task, date }) => {
    if (!date) {
      throw new Error("Please provide a date (YYYY-MM-DD) to check for task existence.");
    }
    const d = toValidDate(date, "date");
    const startOfDay = new Date(d);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(d);
    endOfDay.setHours(23, 59, 59, 999);

    return await DailyTask.findOne({
      user: userId,
      task,
      date: { $gte: startOfDay, $lte: endOfDay },
    });
  },

  
  updateTask: async (taskId, fields, userId) => {
    const toSet = {};

    if (typeof fields.task === "string") {
      toSet.task = fields.task;
    }

    if (fields.date !== undefined) {
     
      toSet.date = toValidDate(fields.date, "date");
    }

    if (fields.endDateTime !== undefined) {
      toSet.endDateTime = toValidDate(fields.endDateTime, "endDateTime");
    }

    if (typeof fields.reminderEnabled === "boolean") {
      toSet.reminderEnabled = fields.reminderEnabled;
    }

    if (typeof fields.completed === "boolean") {
      toSet.completed = fields.completed;
    }

    
    if (Object.keys(toSet).length === 0) {
      return null;
    }

    return await DailyTask.findOneAndUpdate(
      { _id: taskId, user: userId },
      { $set: toSet },
      { new: true }
    );
  },

  
  deleteTask: async (taskId, userId) => {
    
    const task = await DailyTask.findOne({ _id: taskId, user: userId });
    if (!task) return null;

    await User.findByIdAndUpdate(task.user, { $pull: { tasks: taskId } });
    await DailyTask.findByIdAndDelete(taskId);
    return task;
  },
  deleteOverdueIncompleteTasks :async () => {
  const now = new Date();

  const tasksToDelete = await DailyTask.find({
    completed: false,
    endDateTime: { $lte: now },
  });

  if (tasksToDelete.length === 0) return 0;

  const taskIds = tasksToDelete.map(t => t._id);
  const userTaskMap = {};

  
  tasksToDelete.forEach(task => {
    const userId = task.user.toString();
    if (!userTaskMap[userId]) userTaskMap[userId] = [];
    userTaskMap[userId].push(task._id);
  });

  
  await DailyTask.deleteMany({ _id: { $in: taskIds } });

 
  const userIds = Object.keys(userTaskMap);
  for (const userId of userIds) {
    await User.findByIdAndUpdate(
      userId,
      { $pull: { tasks: { $in: userTaskMap[userId] } } }
    );
  }

  return taskIds.length;
},

};

module.exports = DailyTaskRepository;
