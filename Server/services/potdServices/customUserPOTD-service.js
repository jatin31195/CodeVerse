const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const Question = require("../../models/Question");
const CustomUserPOTDRepository = require("../../repositories/customUserPOTD-repository");

// Normalize the link: remove trailing parts for consistency.
const normalizeLink = (link) => {
  let normalized = link.trim();
  if (normalized.includes("leetcode.com")) {
    normalized = normalized.replace(/\/description\/?$/, "").replace(/\/+$/, "");
    return normalized + "/";
  } else if (normalized.includes("codeforces.com")) {
    normalized = normalized.replace(/\/+$/, "");
    return normalized;
  } else if (normalized.includes("geeksforgeeks.org")) {
    normalized = normalized.split("?")[0].replace(/\/+$/, "");
    return normalized;
  } else {
    return normalized;
  }
};

// Hash a string to a 32-bit integer; used for converting LeetCode slugs into numeric IDs.
function hashStringToInt(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

async function addCustomUserPOTD(userId, questionLink) {
  try {
    if (!userId || !questionLink) {
      return { success: false, message: "User ID and question link are required." };
    }

    // Step 1: Check if the user has already added a custom POTD today.
    const existingToday = await CustomUserPOTDRepository.findCustomPOTDToday(userId);
    if (existingToday) {
      return { success: false, message: "User can add only one custom POTD per day." };
    }

    // Step 2: Normalize the link.
    const normalizedLink = normalizeLink(questionLink);
    console.log("Normalized Link:", normalizedLink);

    // Step 3: Check if the question exists in the main Question collection.
    const existingQuestion = await Question.findOne({ link: normalizedLink });
    if (existingQuestion) {
      return { success: false, message: "Question already exists in the POTD." };
    }

    // Step 4: Determine the platform.
    let platform = "";
    if (normalizedLink.includes("leetcode.com")) {
      platform = "LeetCode";
    } else if (normalizedLink.includes("codeforces.com")) {
      platform = "Codeforces";
    } else if (normalizedLink.includes("geeksforgeeks.org")) {
      platform = "GeeksforGeeks";
    } else {
      return { success: false, message: "Unsupported platform." };
    }

    // Step 5: Extract the key segment used for title and problem ID.
    const segments = normalizedLink.split("/");
    // Assume the key segment is the second-to-last segment.
    const keySegment = segments.slice(-2, -1)[0];

    // For title: For Codeforces, use the key segment as-is; for others, replace hyphens with spaces.
    const title = (platform === "Codeforces") ? keySegment : keySegment.replace(/-/g, " ");

    // Step 6: Determine problem_id.
    let problem_id;
    if (platform === "LeetCode") {
      // For LeetCode, hash the key segment to get a numeric ID.
      problem_id = hashStringToInt(keySegment);
    } else if (platform === "Codeforces") {
      // For Codeforces, keep the key segment as a string (e.g., "435A")
      problem_id = keySegment;
    } else { // For GeeksforGeeks
      const problemIdString = keySegment.replace(/[^0-9]/g, "");
      problem_id = parseInt(problemIdString, 10);
    }

    // Validate extracted problem_id for LeetCode and GFG.
    if ((platform === "LeetCode" || platform === "GeeksforGeeks") && (isNaN(problem_id) || problem_id === 0)) {
      console.error("Failed to extract valid problem_id for:", normalizedLink);
      return { success: false, message: "Could not extract a valid numeric problem ID." };
    }
    // For Codeforces, problem_id remains a string.

    // IMPORTANT: Set question_id to the extracted problem_id.
    const question_id = problem_id;

    const customData = { platform, title, link: normalizedLink, problem_id, question_id };

    console.log("Attempting to insert:", { user_id: userId, ...customData });

    const newCustomPOTD = await CustomUserPOTDRepository.addCustomPOTD(userId, customData);
    return { success: true, message: "Custom POTD added successfully!", customPOTD: newCustomPOTD };
  } catch (error) {
    console.error("Error in addCustomUserPOTD service:", error);
    return { success: false, message: "Internal server error." };
  }
}

module.exports = { addCustomUserPOTD };
