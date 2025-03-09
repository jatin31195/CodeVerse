const Question = require("../../models/Question");
const CustomUserPOTDRepository = require("../../repositories/customUserPOTD-repository");

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
      platform = "GFG";
    } else {
      return { success: false, message: "Unsupported platform." };
    }

    // Step 5: Extract key segment (used for title and problem_id).
    const segments = normalizedLink.split("/");
    // Assume the key segment is the second-to-last segment.
    const keySegment = segments.slice(-2, -1)[0];

    // For title: for Codeforces, use the key segment; otherwise, replace hyphens with spaces.
    const title = (platform === "Codeforces") ? keySegment : keySegment.replace(/-/g, " ");

    // Extract a numeric problem_id by removing non-digit characters.
    const problemIdString = keySegment.replace(/[^0-9]/g, "");
    const problem_id = parseInt(problemIdString, 10);
    if (isNaN(problem_id)) {
      console.error("Failed to extract valid problem_id for:", normalizedLink);
      return { success: false, message: "Could not extract a valid numeric problem ID." };
    }

    const customData = { platform, title, link: normalizedLink, problem_id };

    console.log("Attempting to insert:", { user_id: userId, ...customData });

    const newCustomPOTD = await CustomUserPOTDRepository.addCustomPOTD(userId, customData);
    return { success: true, message: "Custom POTD added successfully!", customPOTD: newCustomPOTD };
  } catch (error) {
    console.error("Error adding custom POTD:", error);
    return { success: false, message: "Internal server error." };
  }
}

module.exports = { addCustomUserPOTD };
