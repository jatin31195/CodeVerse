const gfgUserService = require("../../services/platformServices/gfg-user-service");

exports.getGfgUserDetails = async (req, res) => {
    try {
        const { username } = req.params;
        const userDetails = await gfgUserService.fetchGfgUserDetails(username);

        if (!userDetails) {
            return res.status(404).json({ status: "fail", message: "User not found" });
        }

        res.status(200).json({ status: "success", data: userDetails });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

exports.getGfgUserHeatmap = async (req, res) => {
    try {
        const { username, year } = req.body;

        if (!username || !year) {
            return res.status(400).json({ status: "fail", message: "Username or year not provided" });
        }

        const heatmapData = await gfgUserService.fetchGfgUserHeatmap(username, year);
        res.status(200).json({ status: "success", data: heatmapData });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
