

const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const Question = require("../../models/Question");
const { parseISO, startOfDay, endOfDay } = require("date-fns");


async function fetchEasyExplanation({ title, platform, link, questionId }) {
  try {
    const resp = await axios.post("http://localhost:8080/api/ques/easy", {
      questionId, title, platform, link
    });
    return resp.data;
  } catch (err) {
    console.error("❌ Easy Explanation API Error:", err?.response?.data || err.message);
    return null;
  }
}


async function fetchLeetCodePOTD() {
  const today = new Date();
  const year  = today.getFullYear();
  const month = today.getMonth() + 1;

  const query = `
    query dailyPOTD($year: Int!, $month: Int!) {
      dailyCodingChallengeV2(year: $year, month: $month) {
        challenges {
          date
          link
          question {
            questionFrontendId
            title
            difficulty
            topicTags { name }
          }
        }
      }
    }
  `;

  const { data } = await axios.post(
    "https://leetcode.com/graphql/",
    { query, variables: { year, month } },
    { headers: { "Content-Type": "application/json" } }
  );

  const challenges = data.data?.dailyCodingChallengeV2?.challenges || [];
  return challenges.map((c) => ({
    _id:       uuidv4(),
    platform:  "LeetCode",
    title:     c.question.title,
    link:      `https://leetcode.com${c.link}`,
    problem_id:c.question.questionFrontendId,
    date:      c.date,                   
    difficulty:c.question.difficulty,
    topics:    c.question.topicTags.map(t => t.name).join(", ")
  }));
}


async function getLeetCodePOTDByDate(dateStr) {
  const date     = new Date(dateStr + "T00:00:00.000Z");
  const dayStart = startOfDay(date);
  const dayEnd   = endOfDay(date);

  let question = await Question.findOne({
    platform: "LeetCode",
    date:     { $gte: dayStart, $lte: dayEnd },
  });

  
  if (!question) {
    const all     = await fetchLeetCodePOTD();
    const potd    = all.find((c) => c.date === dateStr);
    if (!potd) {
      const e = new Error(`No LeetCode POTD for ${dateStr}`);
      e.statusCode = 404;
      throw e;
    }
    question = new Question(potd);
    await question.save();
  }

 
  const missingCore =
    !question.title ||
    !question.link ||
    !question.problem_id ||
    !question.difficulty ||
    !question.topics;
  if (missingCore) {
    console.log("⏳ Filling missing core fields from GraphQL…");
    const all  = await fetchLeetCodePOTD();
    const potd = all.find((c) => c.date === dateStr);
    if (potd) {
      question.title      = potd.title;
      question.link       = potd.link;
      question.problem_id = potd.problem_id;
      question.difficulty = potd.difficulty;
      question.topics     = potd.topics;
      await question.save();
      console.log("✅ Core fields updated.");
    }
  }

 
  const needsExplanation =
    !question.easyExplanation || !question.realLifeExample;
  if (needsExplanation) {
    const expl = await fetchEasyExplanation({
      title:      question.title,
      platform:   question.platform,
      link:       question.link,
      questionId: question._id,
    });
    if (expl?.easyExplanation && expl?.RealLifeExample) {
      question.easyExplanation   = expl.easyExplanation;
      question.realLifeExample   = expl.RealLifeExample;
      await question.save();
    }
  }

  
  return question;
}


module.exports = {
  getLeetCodePOTDByDate,
};
