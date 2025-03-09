const axios = require("axios");
const cheerio = require("cheerio");

/**
 * Extracts title from a question link (Leetcode, GFG, Codeforces)
 * @param {string} url - The question URL
 */
async function extractTitle(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    if (url.includes("leetcode.com")) {
      return $("title").text().split("|")[0].trim();
    }
    if (url.includes("geeksforgeeks.org")) {
      return $("title").text().split("|")[0].trim();
    }
    if (url.includes("codeforces.com")) {
      return $(".title").first().text().trim();
    }
    return null;
  } catch (error) {
    console.error("Error fetching title:", error.message);
    return null;
  }
}

module.exports = { extractTitle };
