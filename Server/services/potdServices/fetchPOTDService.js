const axios = require("axios");
const Question = require("../../models/Question");

// Helper function to get local date in YYYY-MM-DD format
const getLocalDateString = (dateObj) => {
  const year  = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day   = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper: before LeetCode day‑rollover (5:30 AM)
const isBeforeLeetCodeChangeTime = (now) => {
  const h = now.getHours(), m = now.getMinutes();
  return h < 5 || (h === 5 && m < 30);
};

async function fetchAndStoreLeetCodePOTD() {
  try {
    
    const now = new Date();
    let targetDate = isBeforeLeetCodeChangeTime(now)
      ? new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
      : now;
    const dateStr = getLocalDateString(targetDate);
    const queryDate = new Date(dateStr + "T00:00:00.000Z");

    
    const existing = await Question.findOne({
      date:     queryDate,
      platform: "LeetCode",
    });
    if (existing) {
      console.log(
        "✅ LeetCode POTD for",
        dateStr,
        "already exists in DB:",
        existing.title
      );
      return;
    }

    
    console.log("📡 Fetching LeetCode POTD from route...");
    const resp = await axios.get(
      `http://localhost:8080/api/ques/leetcode/potd/${dateStr}`
    );
    console.log("✅ LeetCode POTD fetched and stored via API route.");
    

  } catch (error) {
    console.error("❌ Error fetching and storing LeetCode POTD:", error.message);
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


async function fetchAndStoreCodeforcesPOTD(dateStr) {
  try {
    
    if (!dateStr) {
      dateStr = getLocalDateString(new Date());
    }

    
    const queryDate = new Date(dateStr + "T00:00:00.000Z");
    if (isNaN(queryDate)) {
      throw new Error(`Invalid date passed to Codeforces POTD fetcher: "${dateStr}"`);
    }

    
    const existing = await Question.findOne({
      platform: "Codeforces",
      date:     queryDate,
    });

    if (existing) {
      console.log("✅ Codeforces POTD already in DB for", dateStr, ":", existing.title);
      return existing;
    }

    
    console.log("📡 Fetching Codeforces POTD from route for:", dateStr);
    const resp = await axios.get(
      `http://localhost:8080/api/ques/codeforces/potd/${dateStr}`
    );

    console.log(
      "📄 Raw Codeforces API Response:",
      JSON.stringify(resp.data.data, null, 2)
    );

    

    return resp.data.data;

  } catch (err) {
    console.error("❌ Error in Codeforces POTD fetcher:", err.message);
    throw err;
  }
}

module.exports = { fetchAndStoreCodeforcesPOTD };




module.exports = {
  fetchAndStoreLeetCodePOTD,
  fetchAndStoreGFGPOTD,
  fetchAndStoreCodeforcesPOTD,
};
