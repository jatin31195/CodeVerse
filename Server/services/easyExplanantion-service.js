const { main } = require("../utils/OpenAi_API");
const Question = require("../models/Question"); 

const getEasyExplanation = async ({ questionId, title, platform, link }) => {
  try {
  
    if (questionId) {
      const question = await Question.findById(questionId);
      if (!question) {
        return { error: "Question not found in the database using questionId" };
      }

      title = question.title;
      platform = question.platform;
      link = question.link;
    }

    if (!title || !platform) {
      return { error: "Missing required fields: title and platform are needed" };
    }

    const prompt = `Explain the coding problem titled "${title}". Provide a beginner-friendly explanation and a real-world analogy.
  
Respond ONLY in valid JSON format (Do not include triple backticks):
{
  "easyExplanation": "<Beginner-friendly 100 words Point wise explanation of the problem. Explain like you're teaching someone new to DSA.>",
  "RealLifeExample": "<A simple,Point wise everyday real-world analogy that relates to the problem's logic. Keep it short and intuitive.>"
}

Problem Platform: ${platform}
Question Link: ${link || "N/A"}
`;

    const response = await main(prompt);

    
    const cleanedResponse = response.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanedResponse);

  } catch (error) {
    console.error("Error in getEasyExplanation:", error);
    return { error: "Failed to generate or parse explanation" };
  }
};

module.exports = { getEasyExplanation };
