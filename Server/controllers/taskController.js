const DailyTaskService = require("../services/taskService");

const getTasks = async (req, res) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        console.log("Unauthorized access - No userId found");
        return res.status(401).json({ error: "Unauthorized" });
      }
  
      const { date } = req.query;
    //   console.log("User ID:", userId);
    //   console.log("Requested Date:", date);
  
      const tasks = await DailyTaskService.getTasks(userId, date);
  
    //   console.log("Fetched Tasks:", tasks);
  
      res.status(200).json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ error: "Error fetching tasks", details: error.message });
    }
  };
  
  
  
const addTask = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { task } = req.body;
    const newTask = await DailyTaskService.addTask(userId, task);

    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { taskId } = req.params;
    const { task } = req.body;

    const updatedTask = await DailyTaskService.updateTask(taskId, task, userId);
    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found or unauthorized" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Error updating task" });
  }
};

const completeTask = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { taskId } = req.params;

    const deletedTask = await DailyTaskService.completeTask(taskId, userId);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    res.status(200).json({ message: "Task completed and removed" });
  } catch (error) {
    res.status(500).json({ error: "Error completing task" });
  }
};

module.exports = { getTasks, addTask, updateTask, completeTask };
