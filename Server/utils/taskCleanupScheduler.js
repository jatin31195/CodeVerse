const schedule = require('node-schedule');
const DailyTaskService = require('../services/taskService');

function startCleanupJob() {
  console.log("running cleanuop")
  schedule.scheduleJob('*/2 * * * *', async () => {
    try {
      const count = await DailyTaskService.deleteOverdueIncompleteTasks();
      if (count > 0) {
        console.log(`Auto cleanup: deleted ${count} overdue incomplete tasks.`);
      }
    } catch (err) {
      console.error('Error in auto cleanup job:', err);
    }
  });
}

module.exports = { startCleanupJob };
