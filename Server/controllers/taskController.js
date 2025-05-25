const DailyTaskService = require("../services/taskService");
const DAILY_TASK_TZ = 'Asia/Kolkata';

function parseDateField(value, fieldName, res) {
  if (value === undefined) return undefined;
  const d = new Date(value);
  if (isNaN(d.getTime())) {
    res.status(400).json({ error: `Invalid ${fieldName}` });
    throw new Error(`Validation failed: ${fieldName}`);
  }
  return d;
}


const getTasks = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      console.log("Unauthorized access - No userId found");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { date } = req.query;
    // We let service parse the date range; pass as string
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

    
    const now = new Date();

    
    const { task, endDateTime: endISO } = req.body;
    const endDateTime = new Date(endISO);
    if (isNaN(endDateTime)) {
      return res.status(400).json({ error: "Invalid endDateTime" });
    }

    
    const diff = endDateTime - now;
    let reminderTime = null;

    if (diff > 5 * 3600_000) {
      reminderTime = new Date(endDateTime - 2 * 3600_000); // >5hr → 2hr before
    } else if (diff > 2 * 3600_000) {
      reminderTime = new Date(endDateTime - 1 * 3600_000); // >2hr, <=5hr → 1hr before
    } else if (diff > 20 * 60_000) {
      reminderTime = new Date(endDateTime - 40 * 60_000); // >30min, <=2hr → 40min before
    } else if (diff <= 20 * 60_000) {
      reminderTime = new Date(endDateTime - 10 * 60_000); // <=20min → 10min before
    }

   
    const newTask = await DailyTaskService.addTask(userId, {
      task,
      date: now,
      endDateTime,
      reminderTime, 
    });

    return res.status(201).json(newTask);
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ error: err.message });
  }
};




const updateTask = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { taskId } = req.params;
    const { task, date, endDateTime } = req.body;

    
    const updateFields = {};
    if (task !== undefined) updateFields.task = task;
    if (date !== undefined) updateFields.date = parseDateField(date, "date", res);
    if (endDateTime !== undefined)
      updateFields.endDateTime = parseDateField(endDateTime, "endDateTime", res);

    const updatedTask = await DailyTaskService.updateTask(taskId, updateFields, userId);
    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found or unauthorized" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    if (error.message.startsWith("Validation failed")) return;
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Error updating task", details: error.message });
  }
};


const completeTask = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { taskId } = req.params;
    const deletedTask = await DailyTaskService.completeTask(taskId, userId);
    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found or unauthorized" });
    }
    res.status(200).json({ message: "Task completed and removed" });
  } catch (error) {
    console.error("Error completing task:", error);
    res.status(500).json({ error: "Error completing task", details: error.message });
  }
};


const toggleReminder = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { taskId } = req.params;
    const { enabled } = req.body;
    if (typeof enabled !== "boolean") {
      return res.status(400).json({ error: "`enabled` must be boolean" });
    }

    const updated = await DailyTaskService.setReminder(userId, taskId, enabled);
    if (!updated) {
      return res.status(404).json({ error: "Task not found or not yours" });
    }

    res.status(200).json({
      message: `Reminders ${enabled ? "enabled" : "disabled"} for task`,
      task: updated,
    });
  } catch (error) {
    console.error("Error toggling reminder:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

module.exports = {
  getTasks,
  addTask,
  updateTask,
  completeTask,
  toggleReminder,
};
