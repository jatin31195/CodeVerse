const DailyTaskService = require("../services/taskService");

const getTasks = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      console.log("Unauthorized access - No userId found");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { date } = req.query;
    const tasks = await DailyTaskService.getTasks(userId, date);
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

    
    const { task, date, endDateTime } = req.body;
    const newTask = await DailyTaskService.addTask(userId, { task, date, endDateTime });
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
    const { task, date, endDateTime } = req.body;
    
    // console.log("Authenticated User ID:", req.user?.userId);
    // Removed: console.log("Task's User ID:", task.user.toString());

    const updatedTask = await DailyTaskService.updateTask(
      taskId,
      { task, date, endDateTime },
      userId
    );
    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found or unauthorized" });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Error updating task", details: error.message });
  }
};


const completeTask = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { taskId } = req.params;
    // console.log("Completing task for user:", userId, "with taskId:", taskId);

    const deletedTask = await DailyTaskService.completeTask(taskId, userId);
    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found or unauthorized" });
    }
    res.status(200).json({ message: "Task completed and removed" });
  } catch (error) {
    // console.error("Error in completeTask:", error);
    res.status(500).json({ error: "Error completing task", details: error.message });
  }
};


module.exports = { getTasks, addTask, updateTask, completeTask };
