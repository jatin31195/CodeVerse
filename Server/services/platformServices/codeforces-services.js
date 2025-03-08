const axios = require("axios");

// Codeforces API URL
const API_URL = "https://codeforces.com/api/problemset.problems";

// Weekly difficulty structure
const difficultySchedule = [
  [800, 900, 1000],   // Week 1: Easy start
  [900, 1000, 1100],  // Week 2: Slight increase
  [1000, 1100, 1200], // Week 3: Mid-level
  [1100, 1200, 1300]  // Week 4: Harder start
];

// Function to determine the difficulty for today
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

// Fetch a random Codeforces problem based on difficulty
const fetchDailyProblem = async (req, res) => {
  const rating = getDifficultyForToday();

  try {
    const response = await axios.get(API_URL);
    const problems = response.data.result.problems;

    // Filter problems by today's difficulty
    const filteredProblems = problems.filter((p) => p.rating === rating);
    
    if (filteredProblems.length === 0) {
      return res.status(404).json({ message: `No problems found for rating ${rating}` });
    }

    // Select a random problem
    const randomProblem = filteredProblems[Math.floor(Math.random() * filteredProblems.length)];
    
    const problemData = {
      rating: rating,
      name: randomProblem.name,
      url: `https://codeforces.com/problemset/problem/${randomProblem.contestId}/${randomProblem.index}`,
      contestId: randomProblem.contestId,
      index: randomProblem.index,
      tags: randomProblem.tags,
      points: randomProblem.points || 500, // Default points if not present
    };
  
    // Print the problem details to the terminal
    console.log("Today's Codeforces Problem:");
    console.log(problemData);
  
    // Send response
    return res.json(problemData);

  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch problems" });
  }
};

module.exports = { fetchDailyProblem };
