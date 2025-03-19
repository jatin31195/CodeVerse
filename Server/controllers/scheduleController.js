const scheduleService = require('../services/scheduleService');

const createTimetable = async (req, res) => {
  try {
 
    const userSchedule = req.body;
    const timetable = await scheduleService.generateDayTimetable(userSchedule);
    res.json({ timetable });
  } catch (error) {
    console.error('Error generating timetable:', error);
    res.status(500).json({ error: 'Failed to generate timetable' });
  }
};

module.exports = { createTimetable };