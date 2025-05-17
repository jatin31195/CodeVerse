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


async function fetchAndStoreLeetCodePOTD() {
  const now = new Date();
  
  let leetCodeDate;
  if (isBeforeLeetCodeChangeTime(now)) {
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    leetCodeDate = yesterday;
  } else {
    leetCodeDate = now;
  }
  const leetCodeDateFormatted = getLocalDateString(leetCodeDate);
  
  console.log("Storing LeetCode POTD for:", leetCodeDateFormatted);
  
  try {
    const existingLeetCode = await Question.findOne({ date: leetCodeDateFormatted, platform: "LeetCode" });
    if (existingLeetCode) {
      console.log("LeetCode POTD for today already exists, skipping...");
      return;
    }

    const leetCodeData = await axios.get(`http://localhost:8080/api/ques/leetcode/potd/${leetCodeDateFormatted}`);
    const leetCodeQuestion = {
      _id: uuidv4(),
      platform: "LeetCode",
      title: leetCodeData.data.data.title,
      link: leetCodeData.data.data.link,
      problem_id: leetCodeData.data.data.problem_id,
      date: leetCodeDateFormatted,
      difficulty: leetCodeData.data.data.difficulty,
      topics: leetCodeData.data.data.topics,
    };
    await Question.insertMany([leetCodeQuestion]);
    console.log("LeetCode POTD stored.");
  } catch (error) {
    console.error("Error storing LeetCode POTD:", error.message);
  }
}

const now = new Date();
const todayFormatted = getLocalDateString(now);

async function fetchAndStoreGFGPOTD() {
  try {
    const date = todayFormatted.split(" ")[0]; 
    const queryDate = new Date(date + "T00:00:00.000Z");

    const existingGfgQuestion = await Question.findOne({
      date: queryDate,
      platform: "GFG",
    });

    if (existingGfgQuestion) {
      console.log("✅ GFG POTD for today already exists in DB:", existingGfgQuestion.title);
      return;
    }

    console.log("📡 Fetching GFG POTD from route...");

    const gfgData = await axios.get(`http://localhost:8080/api/ques/gfg/potd/${date}`);
    console.log("✅ GFG POTD fetched and stored via API route.");
    console.log("📄 Response:", JSON.stringify(gfgData.data.data, null, 2));

  } catch (error) {
    console.error("❌ Error fetching and storing GFG POTD:", error.message);
  }
}


async function fetchAndStoreCodeforcesPOTD() {
    
    try {
      date = todayFormatted.split(" ")[0];
      const existingCodeforces = await Question.findOne({ date: todayFormatted, platform: "Codeforces" });

      if (existingCodeforces) {
        console.log("Codeforces POTD for today already exists, skipping...");
      } else {
        console.log("Fetching Codeforces POTD...");
      
        try {
       
          const codeforcesResponse = await axios.get(`http://localhost:8080/api/ques/codeforces/problem`);
          console.log("Raw Codeforces API Response:", JSON.stringify(codeforcesResponse.data, null, 2));
      
         
          const { title, link, problem_id, tags, addedAt } = codeforcesResponse.data || {};
      
          
          if (!title || !link || !problem_id) {
            console.error("❌ Missing required Codeforces fields: title, link, or problem_id.");
            return;
          }
      
        
          const codeforcesQuestion = {
            _id: uuidv4(),
            platform: "Codeforces",
            title: title,
            link: link,
            problem_id: problem_id,
            date: new Date(todayFormatted), 
            tags: tags || [],
          };
      
          console.log("✅ Storing Codeforces Question:", codeforcesQuestion);
      
          Question.insertMany([codeforcesQuestion]);
          console.log("✅ Codeforces POTD stored successfully.");
      
        } catch (error) {
          console.error("❌ Error fetching and storing Codeforces POTD:", error.message);
        }
      }
      
      
        } catch (error) {
          console.error("Error fetching and storing POTD:", error.message);
        }
}



module.exports = {
  fetchAndStoreLeetCodePOTD,
  fetchAndStoreGFGPOTD,
  fetchAndStoreCodeforcesPOTD,
};
