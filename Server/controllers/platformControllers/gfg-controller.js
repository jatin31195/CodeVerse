const { getGFGPOTDByDate } = require('../../services/platformServices/gfg-service');

async function getGFGPOTDByDateHandler(req, res) {
  try {
   
    const { date } = req.params;
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'Invalid date format. Expected YYYY-MM-DD' });
    }

    const question = await getGFGPOTDByDate(date);
    return res.status(200).json({ status: 'success', data: question });
  } catch (err) {
    console.error('❌ Error fetching and storing GFG POTD:', err);

    const code = err.statusCode || 500;
    return res
      .status(code)
      .json({ status: 'fail', message: err.message || 'Internal server error' });
  }
}

module.exports = {
  getGFGPOTDByDateHandler
};
