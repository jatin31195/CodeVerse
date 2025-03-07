const { fetchLeetCodePOTD } = require("../../services/platformServices/leetcode-service");

getPOTDByDate = async (req, res) => {
    try {
        const { date } = req.params;
        console.log("Requested Date:", date);  // Debugging log

        const challenges = await fetchLeetCodePOTD();
        console.log("Fetched Challenges:", JSON.stringify(challenges, null, 2));  // Print full fetched data

        const potd = challenges.find(challenge => challenge.date === date);
        console.log("Matched POTD:", potd);  // Debugging log

        if (!potd) {
            return res.status(404).json({ status: "fail", message: "No POTD found for this date" });
        }

        res.status(200).json({
            status: "success",
            data: {
                platformName: "LEETCODE",
                date: potd.date,
                title: potd.question.title,
                link: `https://leetcode.com${potd.link}`
            }
        });
    } catch (error) {
        console.error("Server Error:", error.message);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};
module.exports={getPOTDByDate};