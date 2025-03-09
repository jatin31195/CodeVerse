const CustomUserPOTD = require("../models/CustomUserPOTD");

class CustomUserPOTDRepository {
  async addCustomPOTD(userId, customData) {
    // customData should include platform, title, link, and problem_id.
    return await CustomUserPOTD.create({ user_id: userId, ...customData });
  }

  // Finds a custom POTD added by the user today
  async findCustomPOTDToday(userId) {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    return await CustomUserPOTD.findOne({
      user_id: userId,
      addedAt: { $gte: startOfToday, $lte: endOfToday }
    });
  }
}

module.exports = new CustomUserPOTDRepository();
