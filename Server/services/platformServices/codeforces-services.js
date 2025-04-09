const axios = require("axios");
const Question = require("../../models/Question");

// Codeforces API URL
const API_URL = "https://codeforces.com/api/problemset.problems";

const getTodayCodeforcesQuestions = async (req, res) => {
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setUTCDate(today.getUTCDate() + 1);

    console.log("Fetching Codeforces questions from:", today, "to", tomorrow);

    const questions = await Question.find({
      platform: "Codeforces",
      date: { $gte: today, $lt: tomorrow },
    });

    console.log("Questions fetched:", questions.length);

    // Send response properly
    return res.status(200).json({ success: true, questions });

  } catch (error) {
    console.error("Error fetching today's Codeforces questions:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


// Weekly difficulty structure
const difficultySchedule = [
  [800, 900, 1000],   // Week 1: Easy start
  [900, 1000, 1100],  // Week 2: Slight increase
  [1000, 1100, 1200], // Week 3: Mid-level
  [1100, 1200, 1300]  // Week 4: Harder start
];

// Function to determine today's difficulty
const getDifficultyForToday = () => {
  const today = new Date();
  const dayOfMonth = today.getDate();
  const week = Math.floor((dayOfMonth - 1) / 7); // Week 0 to 3
  const dayOfWeek = (dayOfMonth - 1) % 7; // Day 0 to 6

  let difficulty;
  if (dayOfWeek < 3) difficulty = difficultySchedule[week][0]; // Easy
  else if (dayOfWeek < 5) difficulty = difficultySchedule[week][1]; // Medium
  else difficulty = difficultySchedule[week][2]; // Hard

  return difficulty;
};

// Fetch and insert a unique Codeforces problem
const fetchDailyProblem = async (req, res) => {
  const rating = getDifficultyForToday();

  try {
    const response = await axios.get(API_URL);
    const problems = response.data.result.problems;

    // Filter problems by today's difficulty
    let filteredProblems = problems.filter((p) => p.rating === rating);

    if (filteredProblems.length === 0) {
      return res.status(404).json({ message: `No problems found for rating ${rating}` });
    }

    let randomProblem;
    let exists = true;
    let attempts = 0;

    // Keep selecting a new problem until we find one that isn't in the database
    while (exists && attempts < 10) { // Avoid infinite loops
      randomProblem = filteredProblems[Math.floor(Math.random() * filteredProblems.length)];

      const problemUrl = `https://codeforces.com/problemset/problem/${randomProblem.contestId}/${randomProblem.index}`;

      exists = await Question.exists({ link: problemUrl });
      attempts++;
    }

    if (exists) {
      return res.status(500).json({ error: "Unable to find a unique problem after multiple attempts." });
    }

    const problemData = {
      platform: "Codeforces",
      title: randomProblem.name,
      link: `https://codeforces.com/problemset/problem/${randomProblem.contestId}/${randomProblem.index}`,
      problem_id: `${randomProblem.contestId}${randomProblem.index}`,
      tags: randomProblem.tags || [],
      addedAt: new Date(),
    };

    return res.json(problemData);

  } catch (error) {
    console.error("Error fetching or inserting problem:", error);
    return res.status(500).json({ error: "Failed to fetch problems" });
  }
};

module.exports = { fetchDailyProblem , getTodayCodeforcesQuestions};
