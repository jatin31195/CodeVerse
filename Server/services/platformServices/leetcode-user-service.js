const axios = require("axios");
async function fetchLeetCodeGraphQL(query, variables) {
  try {
    const response = await axios.post(
      "https://leetcode.com/graphql/",
      { query, variables },
      {
        headers: {
          "Content-Type": "application/json",
          Referer: "https://leetcode.com"
        },
      }
    );
    if (response.data.errors) {
      console.error("GraphQL errors:", response.data.errors);
      return null;
    }
    return response.data.data;
  } catch (error) {
    console.error("Error fetching LeetCode data:", error.message);
    return null;
  }
}

async function fetchLeetCodeUserCalendar(username) {
  const query = `
    query userCalendarData($username: String!) {
      matchedUser(username: $username) {
        userCalendar {
          streak
          submissionCalendar
          totalActiveDays
        }
      }
    }
  `;
  const data = await fetchLeetCodeGraphQL(query, { username });
  if (!data || !data.matchedUser) {
    return { streak: 0, totalActiveDays: 0, submissionCalendar: "{}" };
  }
  const userCal = data.matchedUser.userCalendar || {};
  return {
    streak: userCal.streak || 0,
    totalActiveDays: userCal.totalActiveDays || 0,
    submissionCalendar: userCal.submissionCalendar || "{}",
  };
}

exports.fetchLeetCodeUserData = async (username) => {
  const [
    calendarData,
    mainData
  ] = await Promise.all([
    fetchLeetCodeUserCalendar(username),
    (async () => {
      const query = `
        query userPublicProfile($username: String!) {
          allQuestionsCount {
            difficulty
            count
          }
          matchedUser(username: $username) {
            username
            profile {
              ranking
              userAvatar
              reputation
            }
            contributions {
              points
            }
            submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
              totalSubmissionNum {
                difficulty
                count
              }
            }
            languageProblemCount {
              languageName
              problemsSolved
            }
            # We do NOT request userCalendar here
            submissionCalendar
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
          recentSubmissionList(username: $username) {
            title
            titleSlug
            timestamp
            statusDisplay
            lang
          }
        }
      `;
      const d = await fetchLeetCodeGraphQL(query, { username });
      return d;
    })()
  ]);

  if (!mainData || !mainData.matchedUser) {
    return { status: "error", message: "Failed to fetch LeetCode data" };
  }

  const {
    matchedUser,
    allQuestionsCount,
    userContestRanking,
    userContestRankingHistory,
    recentSubmissionList,
  } = mainData;
  const profile = matchedUser.profile || {};
  const contributions = matchedUser.contributions || { points: 0 };
  const statsGlobal = matchedUser.submitStatsGlobal || {
    acSubmissionNum: [],
    totalSubmissionNum: [],
  };
  const acArray = Array.isArray(statsGlobal.acSubmissionNum)
    ? statsGlobal.acSubmissionNum
    : [];
  const totalArray = Array.isArray(statsGlobal.totalSubmissionNum)
    ? statsGlobal.totalSubmissionNum
    : [];

  function getCount(arr, diff) {
    const obj = arr.find((o) => o.difficulty === diff);
    return obj ? obj.count : 0;
  }

  const langsRaw = Array.isArray(matchedUser.languageProblemCount)
    ? matchedUser.languageProblemCount
    : [];
  const languagesUsed = langsRaw.map((lang) => ({
    languageName: lang.languageName || "Unknown",
    solved: lang.problemsSolved || 0,
  }));

  let heatmap = {};
  try {
    heatmap = JSON.parse(matchedUser.submissionCalendar || "{}");
  } catch {
    heatmap = {};
  }

  const tagsRaw = matchedUser.tagProblemCounts?.advanced || [];
  const dsaTopics = tagsRaw.map((t) => ({
    tagName: t.tagName || "Unknown",
    problemsSolved: t.problemsSolved || 0,
  }));

  const contestInfo = userContestRanking || {
    attendedContestsCount: 0,
    rating: 0,
    globalRanking: 0,
  };
  const historyRaw = Array.isArray(userContestRankingHistory)
    ? userContestRankingHistory
    : [];
  const attendedHistory = historyRaw
    .filter((c) => c.attended)
    .map((c) => ({
      title: c.contest?.title || "Unknown",
      startTime: c.contest?.startTime || 0,
      rating: c.rating || 0,
      ranking: c.ranking || 0,
    }));

  const countsArr = Array.isArray(allQuestionsCount) ? allQuestionsCount : [];
  const totalAll = getCount(countsArr, "All");
  const totalEasy = getCount(countsArr, "Easy");
  const totalMedium = getCount(countsArr, "Medium");
  const totalHard = getCount(countsArr, "Hard");
  return {
    status: "success",
    username: matchedUser.username || username,
    profilePic: profile.userAvatar || "",
    ranking: profile.ranking || 0,
    reputation: profile.reputation || 0,
    contributionPoint: contributions.points || 0,
    totalSolved: getCount(acArray, "All"),
    totalSubmissions: totalArray,
    totalQuestions: totalAll,
    easySolved: getCount(acArray, "Easy"),
    totalEasy,
    mediumSolved: getCount(acArray, "Medium"),
    totalMedium,
    hardSolved: getCount(acArray, "Hard"),
    totalHard,
    heatmap,
    streak: calendarData.streak,
    totalActiveDays: calendarData.totalActiveDays,
    languagesUsed,
    dsaTopics,
    recentSubmissions: Array.isArray(recentSubmissionList)
      ? recentSubmissionList
      : [],
    contest: {
      totalContests: contestInfo.attendedContestsCount || 0,
      rating: contestInfo.rating || 0,
      globalRanking: contestInfo.globalRanking || 0,
      history: attendedHistory,
    },
  };
};
