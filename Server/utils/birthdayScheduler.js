const schedule = require('node-schedule');
const User = require('../models/User');
const sendEmail = require('./email'); 

const startBirthdayScheduler = () => {
  
  schedule.scheduleJob({  hour: 3, minute: 30, tz: 'Etc/UTC'}, async () => {
    try {
      const now = new Date();
      const day = now.getUTCDate();
      const month = now.getUTCMonth() + 1;

      
      const birthdayUsers = await User.find({
        isVerified: true,
        $expr: {
          $and: [
            { $eq: [{ $dayOfMonth: '$dateOfBirth' }, day] },
            { $eq: [{ $month: '$dateOfBirth' }, month] },
          ],
        },
      });

      for (const user of birthdayUsers) {
        const subject = `🎉 Happy Birthday, ${user.username}! 🎂`;

const text = `
Dear ${user.username},

Wishing you a fantastic birthday filled with joy, success, and new milestones!

The entire CodeVerse Team is cheering you on — may your year be full of accepted solutions, green checkmarks, and endless motivation.

Keep conquering challenges — both on screen and in life.

With best wishes,
Team CodeVerse
`;

const html = `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; border-radius: 8px;">
    <h2 style="color: #4A90E2;">🎉 Happy Birthday, ${user.username}!</h2>
    <p style="font-size: 16px;">
      Wishing you a joyful birthday and a year full of victories — both in life and on the leaderboard! 💻💡<br/><br/>
      May your day be as special as your first <strong>AC</strong> on a hard problem! 🚀
    </p>
    <p style="font-size: 16px;">
      Stay inspired. Keep solving. And remember — CodeVerse is always here cheering you on! 🎯
    </p>
    <p style="font-size: 16px; margin-top: 20px;">
      With best wishes,<br/>
      <strong>- Team CodeVerse 💙</strong>
    </p>
  </div>
`;


        await sendEmail(user.email, subject, text, html);
        console.log(`🎂 Sent birthday email to: ${user.email}`);
      }

      if (birthdayUsers.length === 0) {
        console.log('🎂 No birthdays today.');
      }
    } catch (err) {
      console.error('🎂 Birthday scheduler error:', err.message);
    }
  });
};

module.exports = startBirthdayScheduler;
