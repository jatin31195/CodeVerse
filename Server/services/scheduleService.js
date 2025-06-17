const axios = require('axios');
const moment = require('moment');
const openAiApi = require('../utils/OpenAi_API');

const generateDayTimetable = async (userSchedule) => {
  const codeforcesPromise = axios.get('http://localhost:8080/api/contest/c');
  const leetcodePromise = axios.get('http://localhost:8080/api/contest/l');
  const gfgPromise = axios.get('http://localhost:8080/api/contest/g');

  const [cfRes, lcRes, gfgRes] = await Promise.allSettled([
    codeforcesPromise,
    leetcodePromise,
    gfgPromise,
  ]);

  const cfContests = cfRes.status === 'fulfilled' ? cfRes.value.data.contests || [] : [];
  const lcContests = lcRes.status === 'fulfilled' ? lcRes.value.data.contests || [] : [];
  const gfgContests = gfgRes.status === 'fulfilled' ? gfgRes.value.data.contests || [] : [];

  const allContests = [...cfContests, ...lcContests, ...gfgContests];

  const today = moment().format('YYYY-MM-DD');
  const tomorrow = moment().add(1, 'days').format('YYYY-MM-DD');

  const todaysContests = allContests.filter(
    contest => contest.startTimeIST && contest.startTimeIST.startsWith(today)
  );
  const tomorrowsContests = allContests.filter(
    contest => contest.startTimeIST && contest.startTimeIST.startsWith(tomorrow)
  );

  let prompt = `You are an expert in hour-by-hour timetables for technical interview prep.

User's Daily Schedule:
${userSchedule.dailySchedule}

Instructions for DSA Practice:
${userSchedule.currentTopic ?
  `Solve medium problems on ${userSchedule.currentTopic}, then 1–2 hard ones.` :
  `Solve medium DSA problems, then 1–2 hard ones.`}

Academics and Development:
Keep academics minimal.
Spend good time on development.
${(userSchedule.dsaSkill && userSchedule.devSkill && userSchedule.dsaSkill.toLowerCase() === 'good' && userSchedule.devSkill.toLowerCase() === 'bad') ?
  "Boost development learning time since you're weak in it." : ""}

Contest Info:
`;

  if (todaysContests.length > 0) {
    const contestList = todaysContests.map(c => `${c.name} on ${c.platform}`).join(', ');
    prompt += `Today: ${contestList}. Allocate time for contest.\n`;
  } else if (tomorrowsContests.length > 0) {
    const contestList = tomorrowsContests.map(c => `${c.name} on ${c.platform}`).join(', ');
    prompt += `Tomorrow: ${contestList}. Reserve time for revision.\n`;
  } else {
    prompt += `No contests today or tomorrow. Focus on regular DSA.\n`;
  }

  prompt += `
Generate an hour-by-hour day timetable in JSON array format.
Each object must have:
- "time": e.g., "8:00 AM - 9:00 AM"
- "class": e.g., "DSA Practice", "Development"
- "description": detailed actions

Strictly return only the JSON array.`;

  const withTimeout = (promise, timeout = 30000) => {
    return Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout)),
    ]);
  };

  const timetable = await withTimeout(openAiApi.main(prompt, { response_format: 'json' }));
  return timetable;
};

module.exports = { generateDayTimetable };
