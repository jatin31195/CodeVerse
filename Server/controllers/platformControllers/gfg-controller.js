const { fetchGFGPOTDByDate } = require('../../services/platformServices/gfg-service');

async function getGFGPOTDByDate(req, res) {
    try {
        const { date } = req.params; // Format: YYYY-MM-DD
        const data = await fetchGFGPOTDByDate(date);
        res.status(200).json({ status: "success", data });
    } catch (error) {
        res.status(404).json({ status: "fail", message: error.message });
    }
}

module.exports = { getGFGPOTDByDate };
