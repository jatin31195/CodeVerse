const leetcodeUserService = require("../../services/platformServices/leetcode-user-service");

exports.getLeetCodeUserData = async (req, res) => {
    try {
        const username = req.params.username;
        const data = await leetcodeUserService.fetchLeetCodeUserData(username);

        if (!data) {
            return res.status(404).json({ status: "fail", message: "User not found" });
        }
        return res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching LeetCode user data:", error);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
};
