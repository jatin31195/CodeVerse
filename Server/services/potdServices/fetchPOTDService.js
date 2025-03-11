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
  
  // LeetCode date adjustment for before 5:30 AM
  let leetCodeDate;
  if (isBeforeLeetCodeChangeTime(now)) {
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    leetCodeDate = yesterday;
  } else {
    leetCodeDate = now;
  }

  // Format dates
  const leetCodeDateFormatted = getLocalDateString(leetCodeDate);
  const todayFormatted = getLocalDateString(now);

  console.log("Fetching and storing POTD...");
  console.log("Local time:", now);
  console.log("LeetCode date (local):", leetCodeDateFormatted);
  console.log("Today (local):", todayFormatted);

  try {
    // ✅ Fetch & Store LeetCode POTD
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

    // ✅ Fetch & Store GFG POTD
    const gfgData = await axios.get(`http://localhost:8080/api/ques/gfg/potd/${todayFormatted}`);

    // Extract required fields
    let { problem_name, problem_url, problem_id, date } = gfgData.data.data;

    // Convert GFG date format to YYYY-MM-DD
    date = date.split(" ")[0]; 

    console.log("GFG Date from response:", date);
    
    // Check if GFG POTD already exists
    const existingGfgQuestion = await Question.findOne({ date: date, platform: "GFG" });
    console.log("Existing GFG Question:", existingGfgQuestion);

    if (existingGfgQuestion) {
      console.log("GFG POTD for today already exists, skipping...");
    } else {
      console.log("Storing GFG POTD...");
      
      if (!problem_name || !problem_url) {
        console.log("Warning: Missing required GFG fields (problem_name or problem_url). Skipping storage.");
      } else {
        const gfgQuestion = {
          _id: uuidv4(),
          platform: "GFG",
          title: problem_name,
          link: problem_url,
          problem_id: problem_id,
          date: date,
        };
        await Question.insertMany([gfgQuestion]);
        console.log("GFG POTD stored.");
      }
    }

    // ✅ Fetch & Store Codeforces POTD
    // Fetch Codeforces POTD if not already stored
const existingCodeforces = await Question.findOne({ date: todayFormatted, platform: "Codeforces" });

if (existingCodeforces) {
  console.log("Codeforces POTD for today already exists, skipping...");
} else {
  console.log("Fetching Codeforces POTD...");

  try {
    // Fetch Codeforces problem data
    const codeforcesResponse = await axios.get(`http://localhost:8080/api/ques/codeforces/problem`);
    console.log("Raw Codeforces API Response:", JSON.stringify(codeforcesResponse.data, null, 2));

    // Extract required fields
    const { title, link, problem_id, tags, addedAt } = codeforcesResponse.data || {};

    // Validate required fields
    if (!title || !link || !problem_id) {
      console.error("❌ Missing required Codeforces fields: title, link, or problem_id.");
      return;
    }

    // Prepare Codeforces question object
    const codeforcesQuestion = {
      _id: uuidv4(),
      platform: "Codeforces",
      title: title,
      link: link,
      problem_id: problem_id,
      date: new Date(todayFormatted), // Ensure it's stored as Date
      tags: tags || [],
      addedAt: addedAt ? new Date(addedAt) : new Date(), // Store added time if available
    };

    console.log("✅ Storing Codeforces Question:", codeforcesQuestion);

    // Insert into database
    await Question.insertMany([codeforcesQuestion]);
    console.log("✅ Codeforces POTD stored successfully.");

  } catch (error) {
    console.error("❌ Error fetching and storing Codeforces POTD:", error.message);
  }
}


  } catch (error) {
    console.error("Error fetching and storing POTD:", error.message);
  }
}

module.exports = { fetchAndStorePOTD };
