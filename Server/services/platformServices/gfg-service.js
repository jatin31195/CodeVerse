const axios = require('axios');
const Question = require('../../models/Question');

const GFG_TODAY_API = 'https://practiceapi.geeksforgeeks.org/api/vr/problems-of-day/problem/today/';
const GFG_PREVIOUS_API = 'https://practiceapi.geeksforgeeks.org/api/vr/problems-of-day/problems/previous/';

async function fetchGFGPOTD() {
  const resp = await axios.get(GFG_TODAY_API);
  return resp.data;
}

async function fetchPreviousGFGPOTD(year, month) {
  const url = `${GFG_PREVIOUS_API}?year=${year}&month=${String(month).padStart(2, '0')}`;
  const resp = await axios.get(url);
  return resp.data.results || [];
}

async function fetchEasyExplanation({ title, platform, link, questionId }) {
  try {
    const resp = await axios.post('http://localhost:8080/api/ques/easy', {
      title,
      platform,
      link,
      questionId
    });
    return resp.data;
  } catch (err) {
    console.error('❌ Error calling easy explanation API:', err?.response?.data || err.message);
    return null;
  }
}

async function getGFGPOTDByDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00.000Z');

  
  let question = await Question.findOne({ platform: 'GFG', date });

  if (question) {
    const needsExplanation = !question.easyExplanation || !question.realLifeExample;
    if (needsExplanation) {
      const explanation = await fetchEasyExplanation({
        title: question.title,
        platform: question.platform,
        link: question.link,
        questionId: question._id
      });
      if (explanation?.easyExplanation && explanation?.RealLifeExample) {
        question.easyExplanation = explanation.easyExplanation;
        question.realLifeExample = explanation.RealLifeExample;
        await question.save();
      }
    }
    return question;
  }

  
  const todayStr = new Date().toISOString().split('T')[0];
  let problemData = null;

  if (dateStr === todayStr) {
    try {
      problemData = await fetchGFGPOTD();
    } catch (err) {
      console.error('❌ GFG today API error:', err);
      throw new Error('Failed to fetch today\'s POTD from GFG');
    }
  } else {
    const [year, month, day] = dateStr.split('-').map(Number);

    let y = year;
    let m = month;
    while (!problemData && (y > 2021 || (y === 2021 && m >= 1))) {
      try {
        const results = await fetchPreviousGFGPOTD(y, m);
        problemData = results.find(p => p.date.startsWith(dateStr));
        if (!problemData) {
          m -= 1;
          if (m === 0) {
            m = 12;
            y -= 1;
          }
        }
      } catch (err) {
        console.error(`❌ Error fetching previous GFG POTD for ${y}-${m}:`, err.message);
        break;
      }
    }

    if (!problemData) {
      throw new Error(`No GFG POTD found for ${dateStr}`);
    }
  }

  const { problem_name, problem_url, problem_id } = problemData;
  if (!problem_name || !problem_url || !problem_id) {
    console.error('❌ Missing data in GFG response:', problemData);
    throw new Error('Incomplete problem data received from GFG');
  }

  question = new Question({
    platform: 'GFG',
    title: problem_name,
    link: problem_url,
    problem_id: String(problem_id),
    date
  });

  try {
    await question.save();
  } catch (dbErr) {
    console.error('❌ DB save error:', dbErr);
    throw new Error('Failed to save POTD to database');
  }

  const explanation = await fetchEasyExplanation({
    title: question.title,
    platform: question.platform,
    link: question.link,
    questionId: question._id
  });

  if (explanation?.easyExplanation && explanation?.RealLifeExample) {
    question.easyExplanation = explanation.easyExplanation;
    question.realLifeExample = explanation.RealLifeExample;
    await question.save();
  }

  return question;
}

module.exports = { getGFGPOTDByDate };
