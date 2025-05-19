
const { getCodeforcesPOTDByDate } = require("../../services/platformServices/codeforces-services");

async function getPOTDByDate(req, res) {
  try {
    const { date } = req.params;
    if (!date) {
      return res.status(400).json({ success: false, message: "Date parameter is required" });
    }

    const question = await getCodeforcesPOTDByDate(date);
    return res.status(200).json({ success: true, data: question });

  } catch (err) {
    console.error("❌ Codeforces POTD error:", err.message);
    const code = err.statusCode || 500;
    return res.status(code).json({ success: false, message: err.message });
  }
}

module.exports = { getPOTDByDate };
