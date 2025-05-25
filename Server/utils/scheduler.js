const schedule = require('node-schedule');
const sendEmail = require('../utils/email');
const User = require('../models/User');

const jobs = new Map();



async function sendReminderEmail(user, taskName, end, mins) {
  const subject = `CodeVerse Reminder: Your task "${taskName}" ends in ~${mins} minutes`;

  const textContent = `
Hello ${user.username},

This is a friendly reminder from CodeVerse that your task "${taskName}" is scheduled to end at ${end.toLocaleTimeString()} (~${mins} minutes remaining).

Please make sure to complete your task on time.

Thank you for using CodeVerse — your trusted coding companion!

Best regards,
The CodeVerse Team
  `;

  const htmlContent = `
  <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://i.imghippo.com/files/piC6590Q.png" alt="CodeVerse Logo" style="height: 50px;"/>
    </div>
    <h2 style="color: #0070f3;">Task Reminder</h2>
    <p>Hello <strong>${user.username}</strong>,</p>
    <p>This is a friendly reminder from <strong>CodeVerse</strong> that your task:</p>
    <blockquote style="font-size: 1.1em; color: #555; margin: 15px 0; padding-left: 15px; border-left: 4px solid #0070f3;">
      "${taskName}"
    </blockquote>
    <p>is scheduled to end at <strong>${end.toLocaleTimeString()}</strong>, which is approximately <strong>${mins} minutes</strong> from now.</p>
    <p>Please make sure to complete your task on time to keep up your coding momentum!</p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
    <p style="font-size: 0.9em; color: #666;">
      Thank you for using CodeVerse — your trusted coding companion.<br>
      <em>The CodeVerse Team</em>
    </p>
  </div>
  `;

  await sendEmail(user.email, subject, textContent, htmlContent);
}

async function scheduleReminder(task) {
  const key = task._id.toString();

  
  if (jobs.has(key)) {
    jobs.get(key).cancel();
    jobs.delete(key);
  }

  if (!task.reminderEnabled || task.completed || !task.reminderTime) {
    console.log(`[INFO] Skipping scheduling for task "${task.task}" due to flags`);
    return;
  }

  const now = new Date();
  const remindAt = new Date(task.reminderTime);
  const end = new Date(task.endDateTime);

  // console.log(`Scheduling reminder for task "${task.task}"`);
  // console.log(`Reminder time (ISO): ${remindAt.toISOString()}`);
  // console.log(`End time (ISO): ${end.toISOString()}`);
  // console.log(`[INFO] Now: ${now.toISOString()}, RemindAt: ${remindAt.toISOString()}`);

  if (remindAt <= now) {
    console.log(`[SKIPPED] ReminderTime already passed for task "${task.task}"`);
    return;
  }

  
  const job = schedule.scheduleJob(remindAt, async () => {
    try {
      // console.log(`[TRIGGERED] Sending reminder for task "${task.task}" at ${new Date().toISOString()}`);

      const user = await User.findById(task.user);
      if (!user) {
        console.log(`[ERROR] User not found for task "${task.task}"`);
        return;
      }

      const mins = Math.round((end - new Date()) / 60000);
      await sendReminderEmail(user, task.task, end, mins);

      // console.log(`[SUCCESS] Reminder email sent to ${user.email} for task "${task.task}"`);
    } catch (error) {
      console.error(`[ERROR] Failed to send reminder email:`, error);
    }
  });

  jobs.set(key, job);
}

function cancelReminder(taskId) {
  const key = taskId.toString();
  if (jobs.has(key)) {
    jobs.get(key).cancel();
    jobs.delete(key);
    console.log(`[INFO] Cancelled reminder job for taskId ${taskId}`);
  }
}

module.exports = { scheduleReminder, cancelReminder };
