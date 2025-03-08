const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const Question = require("../../models/Question");

async function fetchAndStorePOTD() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  let leetCodeDate;

  // LeetCode fetch logic: If time is before 5:30 AM, fetch yesterday's problem
  if (hours < 5 || (hours === 5 && minutes < 30)) {
    leetCodeDate = new Date(now.setDate(now.getDate() - 1));
  } else {
    leetCodeDate = now;
  }

  const leetCodeDateFormatted = new Date(leetCodeDate.setHours(0, 0, 0, 0)).toISOString().split("T")[0]; // Format to YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0]; // Today's date for GFG and Codeforces

  try {
    // Check and store LeetCode POTD if not already stored
    const existingLeetCodeQuestion = await Question.findOne({ date: leetCodeDateFormatted, platform: "LeetCode" });
    if (existingLeetCodeQuestion) {
      console.log("LeetCode POTD for today already exists, skipping...");
    } else {
      console.log("Storing LeetCode POTD...");
      const leetCodeData = await axios.get(`http://localhost:8080/api/ques/leetcode/potd/${leetCodeDateFormatted}`);
      const leetCodeQuestion = {
        _id: uuidv4(),
        platform: "LeetCode",
        title: leetCodeData.data.data.title,
        link: `https://leetcode.com${leetCodeData.data.data.link}`,
        problem_id: leetCodeData.data.data.problem_id,
        date: leetCodeDateFormatted,
        difficulty: leetCodeData.data.data.difficulty,
        topics: leetCodeData.data.data.topics,
      };
      await Question.insertMany([leetCodeQuestion]);
      console.log("LeetCode POTD stored.");
    }

    // Check and store GFG POTD if not already stored
    const existingGfgQuestion = await Question.findOne({ date: today, platform: "GFG" });
    if (existingGfgQuestion) {
      console.log("GFG POTD for today already exists, skipping...");
    } else {
      console.log("Storing GFG POTD...");
      const gfgData = await axios.get(`http://localhost:8080/api/ques/gfg/potd/${today}`);
      
      // Extract the required fields from the GFG data
      const { problem_name, problem_url, problem_id, date } = gfgData.data.data;

      // Validate that both `problem_name` and `problem_url` are present
      if (!problem_name || !problem_url) {
        console.log("Missing required GFG fields: problem_name or problem_url.");
        return;
      }

      // Ensure the date is in the correct format (YYYY-MM-DD)
      let gfgDate = new Date(date); // Example: "2025-03-09 00:00:00"
      
      // If the date is not valid, use today's date
      if (isNaN(gfgDate)) {
        console.log(`Invalid date format for GFG: ${date}, using today's date instead.`);
        gfgDate = new Date();  // Use today's date if invalid
      }

      // Format the date as YYYY-MM-DD
      const gfgDateFormatted = gfgDate.toISOString().split("T")[0];

      // Create the question object for GFG
      const gfgQuestion = {
        _id: uuidv4(),
        platform: "GFG",
        title: problem_name,
        link: problem_url,
        problem_id: problem_id,
        date: gfgDateFormatted,  // Use the valid date
      };

      // Insert the question into the database
      await Question.insertMany([gfgQuestion]);
      console.log("GFG POTD stored.");
    }

    // Check and store Codeforces POTD if not already stored
    const existingCodeforcesQuestion = await Question.findOne({ date: today, platform: "Codeforces" });
    if (existingCodeforcesQuestion) {
      console.log("Codeforces POTD for today already exists, skipping...");
    } else {
      console.log("Storing Codeforces POTD...");
      const codeforcesData = await axios.get(`http://localhost:8080/api/ques/codeforces/problem`);

      // Extract fields from the Codeforces data
      const { rating, name, url, contestId, index, tags, points } = codeforcesData.data;
      
      // Combine contestId and index to create a unique problem_id
      const problem_id = `${contestId}_${index}`;

      // Create the Codeforces question object
      const codeforcesQuestion = {
        _id: uuidv4(),
        platform: "Codeforces",
        title: name,
        link: url,
        problem_id: problem_id,  // Unique problem identifier
        date: today,
        rating: rating,
        tags: tags,
        points: points,
      };

      // Insert the question into the database
      await Question.insertMany([codeforcesQuestion]);
      console.log("Codeforces POTD stored.");
    }

  } catch (error) {
    console.error("Error fetching and storing POTD:", error.message);
  }
}

module.exports = { fetchAndStorePOTD };
