const cheerio = require("cheerio");

const fetchEditorialSolutions = async (problemLink) => {
  try {
    // Use dynamic import for node-fetch (ESM)
    const fetch = (await import("node-fetch")).default;

    // Use the URL constructor to parse the provided problem link
    let problemSlug;
    try {
      const urlObj = new URL(problemLink);
      // Ensure the hostname is "leetcode.com" and pathname follows the expected structure
      if (urlObj.hostname === "leetcode.com" && urlObj.pathname.startsWith("/problems/")) {
        const parts = urlObj.pathname.split("/");
        // parts[2] should be the problem slug
        problemSlug = parts[2];
      }
    } catch (err) {
      console.error("Invalid URL:", err);
      return { error: "Invalid problem link" };
    }

    if (!problemSlug) {
      console.error("Problem slug not extracted from link:", problemLink);
      return { error: "Could not extract problem slug" };
    }

    // Build the correct editorial URL using the extracted problem slug
    const url = `https://leetcode.com/problems/${problemSlug}/editorial/`;
    console.log("Fetching editorial from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://leetcode.com/",
        "Connection": "keep-alive",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch editorial: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    let solutions = { cpp: [], java: [] };

    $("pre code").each((index, element) => {
      const code = $(element).text();
      if (code.includes("#include")) {
        solutions.cpp.push(code);
      } else if (code.includes("public class") || code.includes("System.out.println")) {
        solutions.java.push(code);
      }
    });

    return {
      cpp: solutions.cpp.slice(0, 3),
      java: solutions.java.slice(0, 3),
    };
  } catch (error) {
    console.error("Error fetching editorial:", error.message);
    return { error: "Failed to fetch editorial solutions" };
  }
};

module.exports = fetchEditorialSolutions;
