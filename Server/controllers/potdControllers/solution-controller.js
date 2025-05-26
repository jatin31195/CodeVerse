const Solution = require("../../models/Solution");
const Question = require("../../models/Question");
const CustomPotd = require("../../models/CustomUserPOTD");

const addSolution = async (req, res) => {
  try {
    const userId = req.user.userId; 
    const { questionId, type, language, content } = req.body;

    
    let question = await Question.findById(questionId);
    if (!question) {
      question = await CustomPotd.findById(questionId);
    }
    if (!question) {
      return res.status(404).json({ message: "Question not found in either collection" });
    }

    
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

const voteSolution = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { solutionId, vote } = req.body;

    if (!["up", "down"].includes(vote)) {
      return res.status(400).json({ message: "Invalid vote type" });
    }

    const solution = await Solution.findById(solutionId);
    if (!solution) {
      return res.status(404).json({ message: "Solution not found" });
    }

    const hasUpvoted = solution.upvotedBy.includes(userId);
    const hasDownvoted = solution.downvotedBy.includes(userId);

    
    if (vote === "up") {
      if (hasUpvoted) {
        return res.status(400).json({ message: "You already upvoted this solution" });
      }
      if (hasDownvoted) {
        
        solution.downvotedBy.pull(userId);
        solution.votes += 1; 
      }
      solution.upvotedBy.push(userId);
      solution.votes += 1; 
    } else if (vote === "down") {
      if (hasDownvoted) {
        return res.status(400).json({ message: "You already downvoted this solution" });
      }
      if (hasUpvoted) {
        
        solution.upvotedBy.pull(userId);
        solution.votes -= 1; 
      }
      solution.downvotedBy.push(userId);
      solution.votes -= 1; 
    }

    await solution.save();

    return res.json({
      message: `Successfully ${vote === "up" ? "upvoted" : "downvoted"} solution`,
      totalVotes: solution.votes,
      upvotes: solution.upvotedBy.length,
      downvotes: solution.downvotedBy.length,
    });
  } catch (error) {
    console.error("Error voting solution:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


module.exports = { addSolution, getSolutionsByQuestion, voteSolution };
