const axios = require("axios");
const { JSDOM } = require("jsdom");

// Function to extract data using XPath
function getElementByXpath(document, path) {
    const element = document.evaluate(path, document, null, 9, null).singleNodeValue;
    return element ? element.textContent.replace(/\D/g, "") : "0"; // Extract numbers or return "0"
}

// Function to extract languages used
function extractLanguagesUsed(document) {
    let languagesUsed = [];
    const languageElements = document.querySelectorAll('.educationDetails_head_right--text__lLOHI');

    languageElements.forEach(el => {
        const text = el.textContent.trim();
        if (text && !text.includes("Languages Used")) { // Avoid headings
            languagesUsed.push(text);
        }
    });

    return languagesUsed.length > 0 ? languagesUsed : ["Unknown"];
}

// Function to fetch user's yearly problem-solving heatmap
const fetchGfgProblemHeatmap = async (username) => {
    try {
        let currentYear = new Date().getFullYear();
        let heatmapData = {};
        let firstActiveYear = currentYear; // Assume the user started in the current year

        // Start from the earliest year and fetch all data
        for (let year = firstActiveYear; year <= currentYear; year++) {
            const response = await axios.post(
                "https://practiceapi.geeksforgeeks.org/api/v1/user/problems/submissions/",
                { handle: username, requestType: "getYearwiseUserSubmissions", year, month: "" }
            );

            if (!response.data || !response.data.result) continue;

            const yearlyData = response.data.result;
            if (Object.keys(yearlyData).length > 0) {
                firstActiveYear = Math.min(firstActiveYear, year); // Update first active year dynamically
                for (const key in yearlyData) {
                    heatmapData[Math.floor(new Date(key).getTime() / 1000)] = yearlyData[key];
                }
            }
        }

        return { platformName: "GFG", heatmapData };
    } catch (error) {
        console.error(`Error fetching GFG problem heatmap for ${username}:`, error.message);
        return { platformName: "GFG", heatmapData: {} };
    }
};

// Function to scrape contest heatmap from profile
const fetchGfgContestHeatmap = async (username) => {
    try {
        const profileUrl = `https://auth.geeksforgeeks.org/user/${username}`;
        const pageResponse = await axios.get(profileUrl);
        const dom = new JSDOM(pageResponse.data);
        const document = dom.window.document;

        let contestDates = [];
        const contestElements = document.querySelectorAll(".calendar-heatmap rect");

        contestElements.forEach((el) => {
            const date = el.getAttribute("data-date");
            const count = el.getAttribute("data-count");

            if (date && count && parseInt(count) > 0) {
                contestDates.push({ timestamp: Math.floor(new Date(date).getTime() / 1000), count: parseInt(count) });
            }
        });

        return { platformName: "GFG", contestHeatmap: contestDates };
    } catch (error) {
        console.error(`Error fetching GFG contest heatmap for ${username}:`, error.message);
        return { platformName: "GFG", contestHeatmap: [] };
    }
};

// Fetch user profile details
exports.fetchGfgUserDetails = async (username) => {
    try {
        const response = await axios.get(`https://authapi.geeksforgeeks.org/api-get/user-profile-info/?handle=${username}`);

        if (!response.data || !response.data.data) {
            throw new Error("Invalid API response");
        }

        const data = response.data.data;
        const profileLink = `https://auth.geeksforgeeks.org/user/${username}`;

        // Fetch and parse the user's profile page for additional details
        const pageResponse = await axios.get(profileLink);
        const dom = new JSDOM(pageResponse.data);
        const document = dom.window.document;

        // Extract difficulty-wise solved problem counts
        const submissionCount = [
            { difficulty: "All", count: data.total_problems_solved || 0 },
            { difficulty: "School", count: getElementByXpath(document, "//div[contains(text(), 'SCHOOL')]") },
            { difficulty: "Basic", count: getElementByXpath(document, "//div[contains(text(), 'BASIC')]") },
            { difficulty: "Easy", count: getElementByXpath(document, "//div[contains(text(), 'EASY')]") },
            { difficulty: "Medium", count: getElementByXpath(document, "//div[contains(text(), 'MEDIUM')]") },
            { difficulty: "Hard", count: getElementByXpath(document, "//div[contains(text(), 'HARD')]") }
        ];

        // Extract languages used dynamically using class selector
        const languagesUsed = extractLanguagesUsed(document);

        // Fetch heatmaps
        const problemHeatmap = await fetchGfgProblemHeatmap(username);
        const contestHeatmap = await fetchGfgContestHeatmap(username);

        return {
            username: data.name || username,
            profilePic: "", // GFG API does not provide profile pictures
            ranking: data.institute_rank || "N/A",
            contest: {
                rating: data.score || 0,
                totalContests: data.monthly_score || 0
            },
            submissions: {
                total: data.total_problems_solved || 0,
                difficultyBreakdown: submissionCount
            },
            languagesUsed,
            streak: data.pod_solved_longest_streak || 0,
            totalActiveDays: Object.keys(problemHeatmap.heatmapData).length,
            heatmaps: {
                problems: problemHeatmap,
                contests: contestHeatmap
            },
            profileLink
        };
    } catch (error) {
        console.error(`Error fetching GFG user details for ${username}:`, error.message);
        return null;
    }
};
