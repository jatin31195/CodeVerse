const mongoose = require("mongoose");
const DailyTaskRepository = require("../repositories/taskRepository");
const DailyTask = require("../models/Task");

const DailyTaskService = {
    getTasks: async (userId, date) => {
        try {
          console.log(`Service: Fetching tasks for user: ${userId} on date: ${date}`);
    
          // Ensure date is in the correct format (YYYY-MM-DD)
        //   const queryDate = new Date(date).toISOString().split("T")[0]; 
    
          console.log(`Query Date after conversion: ${queryDate}`);
    
          const tasks = await DailyTask.find({
            user: new mongoose.Types.ObjectId(userId),
            date: queryDate, // Match the stored date format
          });
    
        //   console.log(`Tasks found in DB: ${tasks}`);
          return tasks;
        } catch (error) {
          console.error("Error in getTasks service:", error);
          throw new Error("Error fetching tasks");
        }
      },

  addTask: async (userId, task) => {
    const existingTask = await DailyTaskRepository.taskExists(userId, task);
    if (existingTask) {
      throw new Error("Task already exists for today");
    }

    return await DailyTaskRepository.addTask(userId, task);
  },

  updateTask: async (taskId, updatedTask) => {
    return await DailyTaskRepository.updateTask(taskId, updatedTask);
  },

  completeTask: async (taskId) => {
    return await DailyTaskRepository.deleteTask(taskId);
  },
};

module.exports = DailyTaskService;
