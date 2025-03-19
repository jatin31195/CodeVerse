const { generateDayTimetable } = require("../services/scheduleService");
const timetableService = require("../services/timetableService");


function extractTimetable(timetableString) {
  const regex = /```json\s*([\s\S]*?)\s*```/;
  const match = timetableString.match(regex);
  if (!match || !match[1]) {
    throw new Error("Could not extract timetable JSON from response");
  }
  return JSON.parse(match[1]);
}

const createTimetable = async (req, res) => {
    try {
      const { dailySchedule } = req.body;

      const generatedResponse = await generateDayTimetable({ dailySchedule });
      console.log("Generated Response:", generatedResponse);
      
    
      const timetableString =
        typeof generatedResponse === "string"
          ? generatedResponse
          : generatedResponse.timetable;
      
      if (!timetableString) {
        throw new Error("Timetable property is missing in the generated response.");
      }
      
    
      const schedule = extractTimetable(timetableString);
      const userId = req.user.userId;
      
      const newTimetable = await timetableService.createTimetable(userId, schedule);
      
      res.json({ timetable: newTimetable.schedule });
    } catch (error) {
      console.error("Error in createTimetable controller:", error);
      res.status(500).json({ error: "Failed to generate timetable" });
    }
  };
  

const getTimetable = async (req, res) => {
  try {
    const userId = req.user.userId;
    const timetable = await timetableService.getTimetableByUser(userId);
    if (!timetable) return res.status(404).json({ error: "No timetable found" });
    res.json({ timetable: timetable.schedule });
  } catch (error) {
    console.error("Error in getTimetable controller:", error);
    res.status(500).json({ error: "Failed to retrieve timetable" });
  }
};


const deleteTimetable = async (req, res) => {
  try {
    const userId = req.user.userId;
    await timetableService.deleteTimetableByUser(userId);
    res.json({ message: "Timetable removed" });
  } catch (error) {
    console.error("Error in deleteTimetable controller:", error);
    res.status(500).json({ error: "Failed to delete timetable" });
  }
};

module.exports = {
  createTimetable,
  getTimetable,
  deleteTimetable,
};
