const codeforcesUserService = require("../../services/platformServices/codeforces-user-service");

const handleError = (res, error) => {
    const statusCode = error.message.includes("User not found") ? 404 : 500;
    res.status(statusCode).json({ status: "error", message: error.message || "An unexpected error occurred!" });
};

// ✅ Get Codeforces Full User Data
exports.getUserFullData = async (req, res) => {
    try {
        const { username } = req.params;
        if (!username) {
            return res.status(400).json({ status: "fail", message: "Username is required!" });
        }

        // Fetch user details (includes creation year)
        const userData = await codeforcesUserService.fetchUserDetails(username);

        // Fetch heatmap from the year user joined
        const heatmapData = await codeforcesUserService.fetchUserHeatmap(username, userData.creationYear);

        // Fetch contest graph data
        const contestGraph = await codeforcesUserService.fetchContestGraph(username);

        res.status(200).json({
            status: "success",
            data: {
                platformName: "CODEFORCES",
                ...userData,
                heatmapData,
                contestGraph,
            },
        });
    } catch (error) {
        handleError(res, error);
    }
};
