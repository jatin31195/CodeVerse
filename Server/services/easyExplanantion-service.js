const { main } = require("../utils/OpenAi_API");

const getEasyExplanation = async (title, questionId, platform, link) => {
  const prompt = `Explain the coding problem titled "${title}". Provide a beginner-friendly explanation and a real-world analogy.
  
  Respond ONLY in valid JSON format (Do not include triple backticks):
  {
    "easyExplanation": "<beginner-friendly problem explanation>",
    "RealLifeExample": "<A simple real-world analogy related to the problem>"
  }

  Problem Platform: ${platform}
  Question Link: ${link}
  `;

  try {
      const response = await main(prompt);
      
      // Remove triple backticks and any leading/trailing spaces
      const cleanedResponse = response.replace(/```json|```/g, "").trim();

      return JSON.parse(cleanedResponse);
  } catch (error) {
      console.error("Error parsing explanation:", error);
      return { error: "Failed to parse response from OpenAI" };
  }
};

module.exports = { getEasyExplanation };
