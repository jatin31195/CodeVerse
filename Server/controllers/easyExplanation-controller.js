const { getEasyExplanation } = require("../services/easyExplanantion-service");
const Question = require("../models/Question");

const getEasyExplanationController = async (req, res) => {
  try {
    const { questionId, title, platform, link } = req.body;

    let questionTitle, questionPlatform, questionLink;

   
    if (questionId) {
      let question = await Question.findById(questionId);
      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }
      
      
      questionTitle = question.title;
      questionPlatform = question.platform;
      questionLink = question.link;
    } 

    else if (title && platform) {
      questionTitle = title;
      questionPlatform = platform;
      questionLink = link || ''; 
    } 
  
    else {
      return res.status(400).json({ error: "Provide either questionId or { title, platform, link }" });
    }


    const result = await getEasyExplanation({
      title: questionTitle,
      platform: questionPlatform,
      link: questionLink
    });


    res.json({
      questionTitle: questionTitle,
      platform: questionPlatform,
      link: questionLink,
      ...result
    });
  } catch (error) {
    console.error("Error fetching explanation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getEasyExplanationController;
