
const axios = require('axios');
const moment = require('moment');
const openAiApi = require('../utils/OpenAi_API'); 


const generateDayTimetable = async (userSchedule) => {
    
    const codeforcesPromise = axios.get('http://localhost:8080/api/contest/c');
    const leetcodePromise = axios.get('http://localhost:8080/api/contest/l');
    const gfgPromise = axios.get('http://localhost:8080/api/contest/g');
  
    const [cfRes, lcRes, gfgRes] = await Promise.all([
      codeforcesPromise,
      leetcodePromise,
      gfgPromise,
    ]);
  
    const cfContests = cfRes.data.contests || [];
    const lcContests = lcRes.data.contests || [];
    const gfgContests = gfgRes.data.contests || [];
  
    const allContests = [...cfContests, ...lcContests, ...gfgContests];
  
    
    const today = moment().format('YYYY-MM-DD');
    const tomorrow = moment().add(1, 'days').format('YYYY-MM-DD');
  

    const todaysContests = allContests.filter(contest =>
      contest.startTimeIST && contest.startTimeIST.startsWith(today)
    );
    const tomorrowsContests = allContests.filter(contest =>
      contest.startTimeIST && contest.startTimeIST.startsWith(tomorrow)
    );
  
    let prompt = `You are an expert in creating detailed, hour-by-hour daily timetables for technical interview preparation.
  
  User's Daily Schedule:
  ${userSchedule.dailySchedule}
  
  Instructions for DSA Practice:
  - Ensure daily DSA practice is incorporated.
  ${userSchedule.currentTopic ? 
    `Focus on solving medium-level problems related to ${userSchedule.currentTopic}, then attempt 1-2 challenging problems on that topic.` : 
    `Focus on solving medium-level DSA problems relevant to your current studies, then attempt 1-2 hard problems.`}
  
  Academic and Development Time:
  - Allocate a minimal, focused slot for academic study since academics are a lower priority.
  - Allocate a fair time slot for development learning.
  ${(userSchedule.dsaSkill && userSchedule.devSkill && userSchedule.dsaSkill.toLowerCase() === 'good' && userSchedule.devSkill.toLowerCase() === 'bad') ? 
    "Since you are good in DSA but need improvement in development, please increase the development learning time." : ""}
  
  Contest Information:
  `;
    if (todaysContests.length > 0) {
      const contestList = todaysContests.map(c => `${c.name} on ${c.platform}`).join(', ');
      prompt += `Note: Today, there is a contest: ${contestList}. Allocate a dedicated slot for contest participation.\n`;
    } else if (tomorrowsContests.length > 0) {
      const contestList = tomorrowsContests.map(c => `${c.name} on ${c.platform}`).join(', ');
      prompt += `Note: Tomorrow, there is a contest: ${contestList}. Reserve some time for contest revision.\n`;
    } else {
      prompt += `Note: There are no contests scheduled for today or tomorrow. Focus on regular DSA practice.\n`;
    }
  
    prompt += `
  Based on the above details, generate a clear, hour-by-hour timetable for the day.
  Ensure that the user's fixed commitments are respected.
  Prioritize daily DSA practice, allocate appropriate time for contest preparation, reserve a small slot for academics, and include a fair (or increased, if needed) slot for development learning.
  Include breaks and ensure the schedule is balanced.
  
  IMPORTANT: Return your response strictly as a JSON array. 
  Each element of the array must be an object with the following keys:
    - "time": A string representing the time range (e.g., "8:00 AM - 5:00 PM")
    - "class": A short label indicating the activity type (e.g., "Classes", "DSA Practice", "Mess Time", "Development", "Academic", "Break")
    - "description": A detailed description (with newline characters as needed) explaining what to do during that time slot.
  Do not include any additional text outside the JSON array.
  `;
  

    const timetable = await openAiApi.main(prompt);
    return timetable;
  };
  
  module.exports = { generateDayTimetable };
