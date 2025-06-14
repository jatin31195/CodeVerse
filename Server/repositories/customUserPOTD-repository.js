const CustomUserPOTD = require("../models/CustomUserPOTD");

class CustomUserPOTDRepository {
  async addCustomPOTD(listId, customData) {
    const inputDate = new Date(customData.date);
    const targetDate = new Date(Date.UTC(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate()));
    return await CustomUserPOTD.findOneAndUpdate(
      { list_id: listId, date: targetDate },
      { $push: { problems: { platform: customData.platform, title: customData.title, link: customData.link } } },
      { upsert: true, new: true }
    );
  }

  async findCustomPOTDToday(listId) {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    return await CustomUserPOTD.findOne({
      list_id: listId,
      date: { $gte: startOfToday, $lte: endOfToday }
    });
  }
}

module.exports = new CustomUserPOTDRepository();
