const { getEasyExplanation } = require("../services/easyExplanantion-service");
const Question = require("../models/Question");
const CustomPotd = require("../models/CustomUserPOTD");

const getEasyExplanationController = async (req, res) => {
    try {
        const { questionId } = req.body;

        if (!questionId) {
            return res.status(400).json({ error: "Question ID is required" });
        }

        let question = await Question.findById(questionId);
        if (!question) {
            question = await CustomPotd.findById(questionId);
        }

        if (!question) {
            return res.status(404).json({ error: "Question not found" });
        }

        const { title, platform, link } = question;

        const result = await getEasyExplanation(title, platform, link);

        res.json({
            questionTitle: title,
            platform,
            link,
            ...result,
        });
    } catch (error) {
        console.error("Error fetching explanation:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports =  getEasyExplanationController ;
