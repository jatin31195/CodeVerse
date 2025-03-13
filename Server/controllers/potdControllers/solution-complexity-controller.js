const { main: analyzeComplexityAI } = require("../../utils/OpenAi_API");
const Solution = require("../../models/Solution");

const analyzeComplexity = async (req, res) => {
    try {
        const { solutionId } = req.body;  // Receiving solutionId from request body
        if (!solutionId) {
            return res.status(400).json({ error: "Solution ID is required" });
        }

        const solution = await Solution.findById(solutionId).populate("question", "title");
        if (!solution) {
            return res.status(404).json({ error: "Solution not found" });
        }

        const code = solution.content; // Fetching the actual code content
        const problemName = solution.question?.title || "";

        // Build the prompt with JSON output format
        const finalPrompt = `Analyze the following code and provide ONLY its Time and Space Complexity in JSON format:\n
\`\`\`json
{
  "ProblemName": "${problemName}",
  "Language": "Java",
  "TimeComplexity": "O(...)",
  "SpaceComplexity": "<space complexity>"
}
\`\`\`

Code:
\`\`\`java
${code}
\`\`\`
`;

        // Send the prompt to OpenAI.
        const openaiResponse = await analyzeComplexityAI(finalPrompt);

        // Extract JSON from response, remove markdown artifacts
        const jsonMatch = openaiResponse.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : "{}"; // Extract JSON part

        try {
            const complexityData = JSON.parse(jsonString);
            return res.status(200).json(complexityData);
        } catch (error) {
            console.error("Failed to parse OpenAI response:", openaiResponse);
            return res.status(500).json({
                error: "Failed to parse complexity analysis output. Response was not valid JSON.",
                rawResponse: openaiResponse,
            });
        }
    } catch (error) {
        console.error("Error analyzing solution complexity:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = analyzeComplexity ;
