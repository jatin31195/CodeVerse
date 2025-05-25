const mongoose = require("mongoose");
const DailyTaskRepository = require("../repositories/taskRepository");
const DailyTask = require("../models/Task");
const { scheduleReminder, cancelReminder } = require('.././utils/scheduler');
const DailyTaskService = {

   setReminder: async (userId, taskId, enabled) => {
    
    const updated = await DailyTaskRepository.updateTask(
      taskId,
      { reminderEnabled: enabled },
      userId
    );
    if (!updated) return null;

    if (enabled && !updated.completed) {
      await scheduleReminder(updated);
    } else {
      cancelReminder(taskId);
    }
    return updated;
  },
   getTasks : async (userId, date) => {
    try {
      
      
 
      let query = {
        user: new mongoose.Types.ObjectId(userId)
      };
  
      
      if (date) {
        const queryDate = new Date(date);
        if (isNaN(queryDate.getTime())) {
          throw new Error("Invalid date provided");
        }
        const startOfDay = new Date(queryDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(queryDate);
        endOfDay.setHours(23, 59, 59, 999);
        query.date = { $gte: startOfDay, $lte: endOfDay };
      }
  
      const tasks = await DailyTask.find(query);
      return tasks;
    } catch (error) {
      console.error("Error in getTasks service:", error);
      throw new Error("Error fetching tasks");
    }
  },
  

  addTask: async (userId, taskData) => {
    const existingTask = await DailyTaskRepository.taskExists(userId, taskData);
    if (existingTask) {
      throw new Error("Task already exists for today");
    }
    return await DailyTaskRepository.addTask(userId, taskData);
  },

  updateTask: async (taskId, updatedTask,userId) => {
    return await DailyTaskRepository.updateTask(taskId, updatedTask,userId);
  },

  completeTask: async (taskId,userId) => {
    return await DailyTaskRepository.deleteTask(taskId,userId);
  },
  deleteOverdueIncompleteTasks: async () => {
    return await DailyTaskRepository.deleteOverdueIncompleteTasks();
  },
};

module.exports = DailyTaskService;
