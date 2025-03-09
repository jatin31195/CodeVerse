const axios = require("axios");

async function fetchLeetCodeGraphQL(query, variables) {
    try {
        const response = await axios.post("https://leetcode.com/graphql/", {
            query,
            variables,
        }, {
            headers: { "Content-Type": "application/json" }
        });

        return response.data.data;
    } catch (error) {
        console.error("Error fetching LeetCode data:", error.message);
        return null;
    }
}

exports.fetchLeetCodeUserData = async (username) => {
    const query = `
        query userPublicProfile($username: String!) {
          matchedUser(username: $username) {
            username
            profile {
              ranking
              userAvatar
            }
            submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
              totalSubmissionNum {
                count
              }
            }
            languageProblemCount {
              languageName
            }
            userCalendar {
              streak
              submissionCalendar
              totalActiveDays
            }
            tagProblemCounts {
              advanced {
                tagName
                problemsSolved
              }
            }
          }
          userContestRanking(username: $username) {
            attendedContestsCount
            rating
            globalRanking
          }
          userContestRankingHistory(username: $username) {
            attended
            rating
            ranking
            contest {
              title
              startTime
            }
          }
        }
    `;

    const data = await fetchLeetCodeGraphQL(query, { username });

    if (!data || !data.matchedUser) return null;

    // Extract user profile data
    const matchedUser = data.matchedUser;
    const profile = matchedUser.profile || {};
    const submissions = matchedUser.submitStatsGlobal || { acSubmissionNum: [], totalSubmissionNum: { count: 0 } };
    const languagesUsed = matchedUser.languageProblemCount || [];
    const userCalendar = matchedUser.userCalendar || { streak: 0, submissionCalendar: "{}", totalActiveDays: 0 };
    const dsaTopics = matchedUser.tagProblemCounts?.advanced || [];

    // Extract contest data
    const contestRanking = data.userContestRanking || { attendedContestsCount: 0, rating: 0, globalRanking: 0 };
    const contestHistory = data.userContestRankingHistory || [];

    // Filter only attended contests
    const attendedContests = contestHistory.filter(contest => contest.attended);

    return {
        username: matchedUser.username,
        profilePic: profile.userAvatar || "",
        ranking: profile.ranking || 0,
        contest: {
            rating: contestRanking.rating || 0,
            globalRanking: contestRanking.globalRanking || 0,
            totalContests: contestRanking.attendedContestsCount || 0,
            history: attendedContests.map(contest => ({
                title: contest.contest?.title || "Unknown",
                startTime: contest.contest?.startTime || 0,
                rating: contest.rating || 0,
                ranking: contest.ranking || 0
            }))
        },
        submissions: {
            total: submissions.totalSubmissionNum?.count || 0,
            difficultyBreakdown: submissions.acSubmissionNum || []
        },
        languagesUsed: languagesUsed.map(lang => lang.languageName),
        heatmap: JSON.parse(userCalendar.submissionCalendar || "{}"),
        streak: userCalendar.streak || 0,
        totalActiveDays: userCalendar.totalActiveDays || 0,
        dsaTopics: dsaTopics.map(topic => ({
            tag: topic.tagName || "Unknown",
            problemsSolved: topic.problemsSolved || 0
        }))
    };
};
