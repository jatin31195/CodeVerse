const { fetchGFGPOTDByDate } = require('../../services/platformServices/gfg-service');

async function getGFGPOTDByDate(req, res) {
  try {
    const { date } = req.params;

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ status: "fail", message: "Invalid date format. Expected format: YYYY-MM-DD" });
    }

    const data = await fetchGFGPOTDByDate(date);

    res.status(200).json({ status: "success", data });
  } catch (error) {
    res.status(404).json({ status: "fail", message: error.message });
  }
}

module.exports = { getGFGPOTDByDate };
