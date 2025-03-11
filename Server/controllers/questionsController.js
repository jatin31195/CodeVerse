// controllers/questionController.js
const Question = require('../models/Question');

getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find({});
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
module.exports={getAllQuestions};
