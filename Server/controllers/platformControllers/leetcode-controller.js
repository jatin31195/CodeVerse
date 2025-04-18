const { fetchLeetCodePOTD } = require("../../services/platformServices/leetcode-service");
const Question = require("../../models/Question"); 
const { parseISO, startOfDay, endOfDay } = require('date-fns');


const getTodayLeetCodePOTD = async (req, res) => {
  try {
    const dateStr = req.params.date;

    
    if (!dateStr) {
      return res.status(400).json({
        status: "fail",
        message: "Date parameter is required",
      });
    }

    
    const parsedDate = parseISO(dateStr);
    const now = new Date();
    const fiveThirty = new Date();
    fiveThirty.setHours(5, 30, 0, 0);

    
    if (now < fiveThirty) {
      parsedDate.setDate(parsedDate.getDate() - 1);  
    }

    const dateStart = startOfDay(parsedDate);  
    const dateEnd = endOfDay(parsedDate);      

    
    const question = await Question.findOne({
      platform: "LeetCode",
      date: {
        $gte: dateStart,  
        $lte: dateEnd,   
      },
    });

    
    if (!question) {
      return res.status(404).json({
        status: "fail",
        message: `No LeetCode POTD found for ${dateStr}`,
      });
    }

    
    const { _id, title, link, problem_id, date, difficulty, topics } = question;

    return res.status(200).json({
      status: "success",
      data: {
        _id,
        platform: "LeetCode",
        title,
        link,
        problem_id,
        date,
        difficulty,
        topics,
      },
    });
  } catch (err) {
    console.error("Error fetching POTD by date:", err.message);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};


  
  
getPOTDByDate = async (req, res) => {
    try {
        const { date } = req.params;
        console.log("Requested Date:", date);  

        const challenges = await fetchLeetCodePOTD();

        const potd = challenges.find(challenge => challenge.date === date);

        if (!potd) {
            return res.status(404).json({ status: "fail", message: "No POTD found for this date" });
        }

        const { title, link, problem_id, date: potdDate, difficulty, topics } = potd;

        if (!title || !link || !problem_id) {
            return res.status(400).json({ status: "fail", message: "Incomplete POTD data", data: potd });
        }

        res.status(200).json({
            status: "success",
            data: {
                platformName: "LEETCODE",
                date: potdDate,
                title: title,
                link: link,
                problem_id: problem_id,
                difficulty: difficulty,
                topics: topics
            }
        });
    } catch (error) {
        console.error("Server Error:", error.message);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};

module.exports = { getPOTDByDate,
    getTodayLeetCodePOTD, 

};
