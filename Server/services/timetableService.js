const Timetable = require("../models/Timetable");

const createTimetable = async (userId, schedule) => {

  await Timetable.deleteMany({ user: userId });
  
  const newTimetable = await Timetable.create({
    user: userId,
    schedule,
  });
  return newTimetable;
};

const getTimetableByUser = async (userId) => {
  return await Timetable.findOne({ user: userId }).sort({ createdAt: -1 });
};

const deleteTimetableByUser = async (userId) => {
  return await Timetable.deleteMany({ user: userId });
};

module.exports = {
  createTimetable,
  getTimetableByUser,
  deleteTimetableByUser,
};
