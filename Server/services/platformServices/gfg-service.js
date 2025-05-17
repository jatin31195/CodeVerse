
const axios = require('axios');
const Question = require('../../models/Question');

const GFG_API_URL =
  'https://practiceapi.geeksforgeeks.org/api/vr/problems-of-day/problem/today/';

async function fetchGFGPOTD() {
  const resp = await axios.get(GFG_API_URL);
  
  return resp.data;
}

async function getGFGPOTDByDate(dateStr) {
  
  const date = new Date(dateStr + 'T00:00:00.000Z');

  
  const existing = await Question.findOne({
    platform: 'GFG',
    date
  });
  if (existing) return existing;

  
  let apiData;
  try {
    apiData = await fetchGFGPOTD();
  } catch (err) {
    console.error('❌ GFG API error:', err);
    const e = new Error('Failed to fetch from GFG API');
    e.statusCode = 502;
    throw e;
  }

  
  const { problem_name, problem_url, problem_id } = apiData;
  if (!problem_name || !problem_url || !problem_id) {
    console.error('❌ Unexpected GFG API data:', apiData);
    const e = new Error('GFG returned unexpected data');
    e.statusCode = 502;
    throw e;
  }

  const q = new Question({
    platform: 'GFG',
    title: problem_name,
    link: problem_url,
    problem_id: String(problem_id),
    date
  });

  try {
    await q.save();
  } catch (dbErr) {
    console.error('❌ DB save error:', dbErr);
    const e = new Error('Failed to save POTD to database');
    e.statusCode = 500;
    throw e;
  }

  return q;
}

module.exports = { getGFGPOTDByDate };
