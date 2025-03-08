const Solution = require("../../models/Solution");

async function submitSolution(req, res) {
  try {
    const { questionId, type, content } = req.body;
    const userId = req.user.id;

    const solution = new Solution({ _id: uuidv4(), question: questionId, user: userId, type, content });
    await solution.save();
    res.json({ message: "Solution submitted successfully", solution });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function voteSolution(req, res) {
  try {
    const { solutionId, vote } = req.body;
    const solution = await Solution.findById(solutionId);
    if (!solution) return res.status(404).json({ error: "Solution not found" });

    solution.votes += vote === "up" ? 1 : -1;
    await solution.save();
    res.json({ message: "Vote registered", votes: solution.votes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { submitSolution, voteSolution };