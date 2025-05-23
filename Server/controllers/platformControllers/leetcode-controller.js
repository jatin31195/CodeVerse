const { getLeetCodePOTDByDate } = require("../../services/platformServices/leetcode-service");

async function getPOTDByDate(req, res) {
  try {
    const { date } = req.params;
    if (!date) {
      return res.status(400).json({ status: "fail", message: "Date is required" });
    }

    const question = await getLeetCodePOTDByDate(date);
    return res.status(200).json({ status:"success", data: question });
  } catch (err) {
    const code = err.statusCode || 500;
    return res.status(code).json({ status:"error", message: err.message });
  }
}

module.exports = { getPOTDByDate };
