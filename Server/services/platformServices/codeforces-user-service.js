const { JSDOM } = require("jsdom");

// Function to safely extract text content from an element
const getTextContent = (element) => (element ? element.textContent.trim() : "0");

// ✅ Fetch Codeforces user profile data
exports.fetchUserDetails = async (username) => {
    const profileLink = `https://codeforces.com/profile/${username}`;
    const userInfoAPI = `https://codeforces.com/api/user.info?handles=${username}`;
    const userSubmissionsAPI = `https://codeforces.com/api/user.status?handle=${username}&from=1&count=99999999`;

    try {
        // Fetch user details from Codeforces API
        const userInfoResponse = await fetch(userInfoAPI);
        const userInfo = await userInfoResponse.json();

        if (userInfo.status !== "OK" || !userInfo.result.length) {
            throw new Error("User not found!");
        }

        const user = userInfo.result[0];

        // ✅ Get user creation year from registrationTimeSeconds
        const creationYear = new Date(user.registrationTimeSeconds * 1000).getFullYear();

        // Fetch user profile page for additional data (streak, total submissions, etc.)
        const profileResponse = await fetch(profileLink);
        const profileHTML = await profileResponse.text();
        const dom = new JSDOM(profileHTML);
        const document = dom.window.document;

        // ✅ Extract total problems solved
        const totalQuestions = parseInt(getTextContent(document.querySelector("._UserActivityFrame_footer div span")), 10) || 0;

        // ✅ Extract streak
        const streak = parseInt(getTextContent(document.querySelector("div._UserStreak div")), 10) || 0;

        // ✅ Fetch submission data for difficulty-wise count and languages used
        const submissionResponse = await fetch(userSubmissionsAPI);
        const submissionData = await submissionResponse.json();

        if (submissionData.status !== "OK") {
            throw new Error("Failed to fetch submission data!");
        }

        const submissions = submissionData.result;
        const difficultyWiseSolved = { easy: 0, medium: 0, hard: 0 };
        const languagesUsed = new Set();
        const activeDays = new Set();

        submissions.forEach((submission) => {
            if (submission.verdict === "OK") {
                // ✅ Get submission date for active days calculation
                const date = new Date(submission.creationTimeSeconds * 1000);
                date.setHours(0, 0, 0, 0);
                activeDays.add(date.getTime());

                // ✅ Track languages used
                if (submission.programmingLanguage) {
                    languagesUsed.add(submission.programmingLanguage);
                }

                // ✅ Classify difficulty-wise problems solved (Assumption: Based on problem index)
                if (submission.problem.index.match(/^[A-B]$/)) {
                    difficultyWiseSolved.easy += 1;
                } else if (submission.problem.index.match(/^[C-D]$/)) {
                    difficultyWiseSolved.medium += 1;
                } else {
                    difficultyWiseSolved.hard += 1;
                }
            }
        });

        return {
            username: user.handle,
            contestRating: user.rating || 0,
            totalQuestionsSolved: totalQuestions,
            difficultyWiseSolved,
            languagesUsed: Array.from(languagesUsed),
            totalActiveDays: activeDays.size,
            streak,
            profileLink,
            creationYear,
        };
    } catch (error) {
        throw new Error(error.message.includes("403") ? "Codeforces API is blocking requests. Try again later." : error.message);
    }
};

// ✅ Fetch user heatmap data (for all years since account creation)
exports.fetchUserHeatmap = async (username, startYear) => {
    try {
        const response = await fetch(`https://codeforces.com/api/user.status?handle=${username}&from=1&count=99999999`);
        const data = await response.json();

        if (data.status !== "OK") {
            throw new Error("User not found!");
        }

        const submissions = data.result.filter((submission) => submission.verdict === "OK");
        const heatmap = {};

        submissions.forEach((submission) => {
            const date = new Date(submission.creationTimeSeconds * 1000);
            if (date.getFullYear() >= startYear) {
                date.setHours(0, 0, 0, 0);
                const key = Math.floor(date.getTime() / 1000);
                heatmap[key] = (heatmap[key] || 0) + 1;
            }
        });

        return heatmap;
    } catch (error) {
        throw new Error(error.message.includes("403") ? "Codeforces API is blocking requests. Try again later." : error.message);
    }
};

// ✅ Fetch contest rating graph data
exports.fetchContestGraph = async (username) => {
    try {
        const response = await fetch(`https://codeforces.com/api/user.rating?handle=${username}`);
        const data = await response.json();

        if (data.status !== "OK") {
            throw new Error("User not found!");
        }

        return data.result.length
            ? data.result.map((contest) => ({
                  contestId: contest.contestId,
                  contestName: contest.contestName,
                  rank: contest.rank,
                  oldRating: contest.oldRating,
                  newRating: contest.newRating,
                  date: contest.ratingUpdateTimeSeconds * 1000,
              }))
            : [];
    } catch (error) {
        throw new Error(error.message.includes("403") ? "Codeforces API is blocking requests. Try again later." : error.message);
    }
};
