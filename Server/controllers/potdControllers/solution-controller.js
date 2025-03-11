const Solution = require("../../models/Solution");
const Question = require("../../models/Question");

// Add a solution
const addSolution = async (req, res) => {
    try {
        const { questionId, userId, type, language, content } = req.body;

        // Check if the question exists
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        // Save the solution
        const newSolution = new Solution({
            question: questionId,
            user: userId,
            type,
            language,
            content
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
        const { solutionId, vote } = req.body; // vote = 'up' or 'down'

        const solution = await Solution.findById(solutionId);
        if (!solution) {
            return res.status(404).json({ message: "Solution not found" });
        }

        // Update vote count
        solution.votes += vote === "up" ? 1 : (vote === "down" ? -1 : 0);
        await solution.save();

        return res.json({ message: "Vote updated successfully", votes: solution.votes });

    } catch (error) {
        console.error("Error voting solution:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = { addSolution, getSolutionsByQuestion, voteSolution };
