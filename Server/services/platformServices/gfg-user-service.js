const axios = require("axios");
const cheerio = require("cheerio");
const { JSDOM } = require("jsdom");


function getElementByXpath(document, path) {

  const result = document.evaluate(path, document, null, 9, null);
  const el     = result.singleNodeValue;
  return el
    ? el.textContent.replace(/\D/g, "") 
    : "0";
}



function extractLanguagesUsed(document) {
  const langs = [];
  document.querySelectorAll('.educationDetails_head_right--text__lLOHI').forEach(el => {
    const txt = el.textContent.trim();
    if (txt && !txt.includes("Languages Used")) langs.push(txt);
  });
  return langs.length ? langs : ["Unknown"];
}

const fetchGfgProblemHeatmap = async (username) => {
  try {
    const currentYear = new Date().getFullYear();
    const heatmapData = {};
    for (let year = currentYear; year <= currentYear; year++) {
      const resp = await axios.post(
        "https://practiceapi.geeksforgeeks.org/api/v1/user/problems/submissions/",
        { handle: username, requestType: "getYearwiseUserSubmissions", year, month: "" }
      );
      const yearly = resp.data.result || {};
      for (const date in yearly) {
        heatmapData[Math.floor(new Date(date).getTime() / 1000)] = yearly[date];
      }
    }
    return { platformName: "GFG", heatmapData };
  } catch (err) {
    console.error(`Error fetching problem heatmap for ${username}:`, err.message);
    return { platformName: "GFG", heatmapData: {} };
  }
};


const fetchGfgContestHeatmap = async (username) => {
  try {
    const profileUrl = `https://auth.geeksforgeeks.org/user/${username}`;
    const { data } = await axios.get(profileUrl);
    const { document } = new JSDOM(data).window;

    const contestDates = [];
    document.querySelectorAll("rect[data-date]").forEach(rect => {
      const date = rect.getAttribute("data-date");
      const count = parseInt(rect.getAttribute("data-count"), 10);
      if (date && count > 0) {
        contestDates.push({
          timestamp: Math.floor(new Date(date).getTime() / 1000),
          count
        });
      }
    });
    return { platformName: "GFG", contestHeatmap: contestDates };
  } catch (err) {
    console.error(`Error fetching contest heatmap for ${username}:`, err.message);
    return { platformName: "GFG", contestHeatmap: [] };
  }
};


exports.fetchGfgUserDetails = async (username) => {
  try {
  
    const apiUrl = `https://authapi.geeksforgeeks.org/api-get/user-profile-info/?handle=${username}`;
    const apiRes = await axios.get(apiUrl);
    const data = apiRes.data?.data;
    if (!data) throw new Error("Invalid API response");

    
    const authUrl = `https://auth.geeksforgeeks.org/user/${username}`;
    const authPage = await axios.get(authUrl);
    const dom = new JSDOM(authPage.data);
    const document = dom.window.document;

    
    const submissionCount = [
      { difficulty: "All",    count: data.total_problems_solved || 0 },
      { difficulty: "School", count: getElementByXpath(document, "//div[contains(text(),'SCHOOL')]") },
      { difficulty: "Basic",  count: getElementByXpath(document, "//div[contains(text(),'BASIC')]") },
      { difficulty: "Easy",   count: getElementByXpath(document, "//div[contains(text(),'EASY')]") },
      { difficulty: "Medium", count: getElementByXpath(document, "//div[contains(text(),'MEDIUM')]") },
      { difficulty: "Hard",   count: getElementByXpath(document, "//div[contains(text(),'HARD')]") }
    ];

    const languagesUsed    = extractLanguagesUsed(document);
    const problemHeatmap  = await fetchGfgProblemHeatmap(username);
    const contestHeatmap  = await fetchGfgContestHeatmap(username);

  
    const wwwUrl = `https://www.geeksforgeeks.org/user/${username}/`;
    const wwwRes = await axios.get(wwwUrl);
    const $ = cheerio.load(wwwRes.data);
    
const script = $("script#__NEXT_DATA__").html() || "";
let rating = 0, totalContests = 0;

if (script) {
  const jsonData = JSON.parse(script);
  const cData    = jsonData.props.pageProps.contestData || {};

  
  rating = cData.user_contest_data?.current_rating || 0;

  
  totalContests = cData.user_contest_data?.no_of_participated_contest || 0;
}


   
    return {
      username: data.name || username,
      profilePic: "",
      ranking: data.institute_rank || "N/A",
      contest: {
        rating,
        totalContests
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
      profileLink: authUrl
    };
  } catch (error) {
    console.error(`Error fetching GFG user details for ${username}:`, error.message);
    return null;
  }
};
