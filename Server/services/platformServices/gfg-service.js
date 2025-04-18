const Question = require('../../models/Question');

const fetchGFGPOTDByDate = async (dateString) => {
  try {
    const inputDate = new Date(dateString); 

    if (isNaN(inputDate.getTime())) {
      throw new Error("Invalid date format.");
    }

   
    const startOfDayUTC = new Date(Date.UTC(
      inputDate.getUTCFullYear(),
      inputDate.getUTCMonth(),
      inputDate.getUTCDate()
    ));

    const endOfDayUTC = new Date(startOfDayUTC);
    endOfDayUTC.setUTCDate(endOfDayUTC.getUTCDate() + 1);

    const problem = await Question.findOne({
      platform: "GFG",
      date: { $gte: startOfDayUTC, $lt: endOfDayUTC }
    });

    if (!problem) {
      throw new Error("No problem found for this date.");
    }

    return problem;
  } catch (error) {
    throw error;
  }
};

module.exports = { fetchGFGPOTDByDate };
