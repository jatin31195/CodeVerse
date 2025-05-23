const axios    = require("axios");
const { v4: uuidv4 } = require("uuid");
const Question = require("../../models/Question");

// ————————————————
// Weekly difficulty structure
const difficultySchedule = [
  [800,  900,  1000],  // Week 1
  [900,  1000, 1100],  // Week 2
  [1000, 1100, 1200],  // Week 3
  [1100, 1200, 1300]   // Week 4
];

function getDifficultyForToday() {
  const today      = new Date();
  const dayOfMonth = today.getDate();
  const week       = Math.floor((dayOfMonth - 1) / 7);  // 0–3
  const dayOfWeek  = (dayOfMonth - 1) % 7;              // 0–6

  if (dayOfWeek < 3)        return difficultySchedule[week][0];
  else if (dayOfWeek < 5)   return difficultySchedule[week][1];
  else                      return difficultySchedule[week][2];
}


async function fetchEasyExplanation({ title, platform, link, questionId }) {
  try {
    const resp = await axios.post("http://localhost:8080/api/ques/easy", {
      title, platform, link, questionId
    });
    return resp.data;
  } catch (err) {
    console.error("❌ Easy Explanation API Error:", err?.response?.data || err.message);
    return null;
  }
}


async function fetchDailyCodeforcesProblem() {
  const API_URL = "https://codeforces.com/api/problemset.problems";
  const rating  = getDifficultyForToday();

  const { data } = await axios.get(API_URL);
  const allProblems = data.result.problems;

  
  const filtered = allProblems.filter(p => p.rating === rating);
  if (filtered.length === 0) throw new Error(`No Codeforces problems at rating ${rating}`);

  
  let problem, tries = 0;
  do {
    problem = filtered[Math.floor(Math.random() * filtered.length)];
    const link = `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`;
    const exists = await Question.exists({ link });
    if (!exists) break;
    tries++;
  } while (tries < 10);

  if (tries >= 10) throw new Error("Could not find a unique Codeforces problem after 10 tries");

  return {
    _id:        uuidv4(),
    platform:   "Codeforces",
    title:      problem.name,
    link:       `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`,
    problem_id:`${problem.contestId}${problem.index}`,
    tags:       problem.tags || [],
    date:       null
  };
}

async function getCodeforcesPOTDByDate(dateStr) {
 
  const date = new Date(dateStr + "T00:00:00.000Z");

  
  let question = await Question.findOne({
    platform: "Codeforces",
    date
  });

  
  if (question && question.easyExplanation && question.realLifeExample) {
    return question;
  }

  
  if (question) {
    const expl = await fetchEasyExplanation({
      title:      question.title,
      platform:   question.platform,
      link:       question.link,
      questionId: question._id
    });
    if (expl?.easyExplanation && expl?.RealLifeExample) {
      question.easyExplanation = expl.easyExplanation;
      question.realLifeExample = expl.RealLifeExample;
      await question.save();
    }
    return question;
  }

  
  const probData = await fetchDailyCodeforcesProblem();
  probData.date = date;
  question = new Question(probData);
  await question.save();

  
  const expl = await fetchEasyExplanation({
    title:      question.title,
    platform:   question.platform,
    link:       question.link,
    questionId: question._id
  });
  if (expl?.easyExplanation && expl?.RealLifeExample) {
    question.easyExplanation = expl.easyExplanation;
    question.realLifeExample = expl.RealLifeExample;
    await question.save();
  }

  return question;
}

module.exports = { getCodeforcesPOTDByDate };
