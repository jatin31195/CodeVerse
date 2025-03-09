const { addCustomUserPOTD } = require("../../services/potdServices/customUserPOTD-service");

const handleCustomUserPOTD = async (req, res) => {
  try {
    const { userId, questionLink } = req.body;
    if (!userId || !questionLink) {
      return res.status(400).json({ success: false, message: "User ID and question link are required." });
    }
    const result = await addCustomUserPOTD(userId, questionLink);
    if (result.success) {
      return res.status(201).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error("Error in custom POTD controller:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

module.exports = { handleCustomUserPOTD };
