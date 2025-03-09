const { fetchLeetCodePOTD } = require("../../services/platformServices/leetcode-service");

getPOTDByDate = async (req, res) => {
    try {
        const { date } = req.params;
        console.log("Requested Date:", date);  // Debugging log

        // Fetch the challenges from LeetCode
        const challenges = await fetchLeetCodePOTD();
        // console.log("Fetched Challenges:", JSON.stringify(challenges, null, 2)); 

        // Find the challenge that matches the requested date
        const potd = challenges.find(challenge => challenge.date === date);
        // console.log("Matched POTD:", JSON.stringify(potd, null, 2)); 

        // If no POTD is found for the requested date, return a 404
        if (!potd) {
            return res.status(404).json({ status: "fail", message: "No POTD found for this date" });
        }

        // Access the necessary fields directly from potd
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

module.exports = { getPOTDByDate };
