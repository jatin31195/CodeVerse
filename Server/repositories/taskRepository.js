const DailyTask = require("../models/Task");
const User = require("../models/User");

const DailyTaskRepository = {
  // Fetch tasks by user and date
  getTasksByDate: async (userId, date) => {
    return await DailyTask.find({ user: userId, date });
  },

  // Add a new task for today
  addTask: async (userId, task) => {
    const today = new Date().toISOString().split("T")[0];

    const newTask = await DailyTask.create({ user: userId, task, date: today });

    // Add reference in User model
    await User.findByIdAndUpdate(userId, { $push: { tasks: newTask._id } });

    return newTask;
  },

  // Check if task already exists for today
  taskExists: async (userId, task) => {
    const today = new Date().toISOString().split("T")[0];
    return await DailyTask.findOne({ user: userId, date: today, task });
  },

  // Update an existing task
  updateTask: async (taskId, updatedTask) => {
    return await DailyTask.findByIdAndUpdate(taskId, { task: updatedTask }, { new: true });
  },

  // Delete a task (mark complete)
  deleteTask: async (taskId) => {
    const task = await DailyTask.findById(taskId);
    if (!task) return null;

    // Remove task reference from User model
    await User.findByIdAndUpdate(task.user, { $pull: { tasks: taskId } });

    await DailyTask.findByIdAndDelete(taskId);
    return task;
  },
};

module.exports = DailyTaskRepository;
