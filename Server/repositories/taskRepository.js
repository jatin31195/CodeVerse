const DailyTask = require("../models/Task");
const User = require("../models/User");
const mongoose = require("mongoose");
const DailyTaskRepository = {
  
  getTasksByDate: async (userId, date) => {
    if (!date) {
      throw new Error("Please provide a date (YYYY-MM-DD).");
    }
    const queryDate = new Date(date);
    if (isNaN(queryDate.getTime())) {
      throw new Error("Invalid date provided.");
    }
    const startOfDay = new Date(queryDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(queryDate);
    endOfDay.setHours(23, 59, 59, 999);
    const tasks = await DailyTask.find({
      user: userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });
    return tasks; 
  },

  
  addTask: async (userId, { task, date, endDateTime }) => {
    const newTask = await DailyTask.create({
      user: userId,
      task, 
      date: new Date(date),         
      endDateTime: new Date(endDateTime), 
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
    const queryDate = new Date(date);
    const startOfDay = new Date(queryDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(queryDate);
    endOfDay.setHours(23, 59, 59, 999);
    return await DailyTask.findOne({
      user: userId,
      task,
      date: { $gte: startOfDay, $lte: endOfDay },
    });
  },

 
  updateTask: async (taskId, { task, date, endDateTime }, userId) => {
   
    const updatedTask = await DailyTask.findOneAndUpdate(
      { _id: taskId, user: userId },
      { task, date: new Date(date), endDateTime: new Date(endDateTime) },
      { new: true }
    );
  
    return updatedTask;
  },
  

  
  deleteTask: async (taskId, userId) => {
    
    const taskObjectId = new mongoose.Types.ObjectId(taskId);
    const userObjectId = new mongoose.Types.ObjectId(userId);
    
    const task = await DailyTask.findOne({ _id: taskObjectId, user: userObjectId });
    
    if (!task) return null;
  
 
    await User.findByIdAndUpdate(task.user, { $pull: { tasks: taskId } });
    await DailyTask.findByIdAndDelete(taskId);
    return task;
  },
  
};

module.exports = DailyTaskRepository;
