const Solution = require("../../models/Solution");
const Question = require("../../models/Question");
const CustomPotd = require("../../models/CustomUserPOTD");

// Add a solution
const addSolution = async (req, res) => {
  try {
    const { questionId, userId, type, language, content } = req.body;

    // Check if the question exists in the main Question collection
    // If not, check in the CustomUserPOTD collection
    let question = await Question.findById(questionId);
    if (!question) {
      question = await CustomPotd.findById(questionId);
    }
    if (!question) {
      return res.status(404).json({ message: "Question not found in either collection" });
    }

    // Save the solution linked to the found question
    const newSolution = new Solution({
      question: questionId,
      user: userId,
      type,
      language,
      content,
    });

    await newSolution.save();
    return res.status(201).json({ message: "Solution added successfully", solution: newSolution });
  } catch (error) {
    console.error("Error adding solution:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get solutions for a question
const getSolutionsByQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const solutions = await Solution.find({ question: questionId }).populate("user", "username");
    return res.json(solutions);
  } catch (error) {
    console.error("Error fetching solutions:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Upvote or Downvote a solution
const voteSolution = async (req, res) => {
  try {
    const { solutionId, vote } = req.body; // vote should be 'up' or 'down'
    const solution = await Solution.findById(solutionId);
    if (!solution) {
      return res.status(404).json({ message: "Solution not found" });
    }
    solution.votes += vote === "up" ? 1 : (vote === "down" ? -1 : 0);
    await solution.save();
    return res.json({ message: "Vote updated successfully", votes: solution.votes });
  } catch (error) {
    console.error("Error voting solution:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addSolution, getSolutionsByQuestion, voteSolution };
