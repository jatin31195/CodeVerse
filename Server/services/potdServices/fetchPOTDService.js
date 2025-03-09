const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const Question = require("../../models/Question");

// Helper function to get local date in YYYY-MM-DD format
const getLocalDateString = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const day = dateObj.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper function to check if it's before 5:30 AM
const isBeforeLeetCodeChangeTime = (now) => {
  const hours = now.getHours();
  const minutes = now.getMinutes();
  return hours < 5 || (hours === 5 && minutes < 30);
};

async function fetchAndStorePOTD() {
  const now = new Date();
  
  // For LeetCode: if local time is before 5:30 AM, use yesterday’s date
  let leetCodeDate;
  if (isBeforeLeetCodeChangeTime(now)) {
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    leetCodeDate = yesterday;
  } else {
    leetCodeDate = now;
  }

  // For GFG: the date changes at midnight (12 AM), so use today
  const today = now;

  // Format dates using local time
  const leetCodeDateFormatted = getLocalDateString(leetCodeDate); // LeetCode uses its own rollover time
  const todayFormatted = getLocalDateString(today); // GFG and Codeforces

  console.log("LeetCode date (local):", leetCodeDateFormatted);
  console.log("Today (local):", todayFormatted);

  try {
    // Store LeetCode POTD if not already stored (unique by date & platform)
    const existingLeetCode = await Question.findOne({ date: leetCodeDateFormatted, platform: "LeetCode" });
    if (existingLeetCode) {
      console.log("LeetCode POTD for today already exists, skipping...");
    } else {
      console.log("Storing LeetCode POTD...");
      const leetCodeData = await axios.get(`http://localhost:8080/api/ques/leetcode/potd/${leetCodeDateFormatted}`);
      const leetCodeQuestion = {
        _id: uuidv4(),
        platform: "LeetCode",
        title: leetCodeData.data.data.title,
        link: `${leetCodeData.data.data.link}`,
        problem_id: leetCodeData.data.data.problem_id,
        date: leetCodeDateFormatted,
        difficulty: leetCodeData.data.data.difficulty,
        topics: leetCodeData.data.data.topics,
      };
      await Question.insertMany([leetCodeQuestion]);
      console.log("LeetCode POTD stored.");
    }

// Store GFG POTD if not already stored
const gfgData = await axios.get(`http://localhost:8080/api/ques/gfg/potd/${todayFormatted}`);

// Extract the required fields from the GFG data
const { problem_name, problem_url, problem_id, date } = gfgData.data.data;

// Validate that both `problem_name` and `problem_url` are present
if (!problem_name || !problem_url) {
  console.log("Missing required GFG fields: problem_name or problem_url.");
  return;
}

// Validate the date to be stored is in the format "YYYY-MM-DD HH:mm:ss"
console.log("GFG Date from response:", date); // Ensure the date is in the correct format

// Check if the GFG problem for this date already exists in the database
const existingGfgQuestion = await Question.findOne({ date: date, platform: "GFG" });
console.log('Existing GFG Question:', existingGfgQuestion);

if (existingGfgQuestion) {
  console.log("GFG POTD for today already exists, skipping...");
} else {
  console.log("Storing GFG POTD...");

  // Create the question object for GFG
  const gfgQuestion = {
    _id: uuidv4(),
    platform: "GFG",
    title: problem_name,
    link: problem_url,
    problem_id: problem_id,
    date: date,  // Use the date as returned in the response
  };console.log("Fetching and storing POTD...");
console.log("Local time:", now);
console.log("LeetCode date (local):", leetCodeDateFormatted);
console.log("Today (local):", todayFormatted);
console.log("GFG Date from response:", date);
console.log('Existing GFG Question:', existingGfgQuestion);
console.log('Existing LeetCode Question:', existingLeetCode);
console.log('Existing Codeforces Question:', existingCodeforces);

  // Insert the question into the database
  await Question.insertMany([gfgQuestion]);
  console.log("GFG POTD stored.");
}



    // Store Codeforces POTD if not already stored
    const existingCodeforces = await Question.findOne({ date: todayFormatted, platform: "Codeforces" });
    if (existingCodeforces) {
      console.log("Codeforces POTD for today already exists, skipping...");
    } else {
      console.log("Storing Codeforces POTD...");
      const codeforcesData = await axios.get(`http://localhost:8080/api/ques/codeforces/problem`);
      // Extract fields from Codeforces response
      const { rating, name, url, contestId, index, tags, points } = codeforcesData.data;
      // Create unique problem_id using contestId and index
      const problem_id = `${contestId}_${index}`;
      const codeforcesQuestion = {
        _id: uuidv4(),
        platform: "Codeforces",
        title: name,
        link: url,
        problem_id: problem_id,
        date: todayFormatted,
        rating: rating,
        tags: tags,
        points: points,
      };
      await Question.insertMany([codeforcesQuestion]);
      console.log("Codeforces POTD stored.");
    }

  } catch (error) {
    console.error("Error fetching and storing POTD:", error.message);
  }
}

module.exports = { fetchAndStorePOTD };
