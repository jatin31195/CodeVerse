const { codeforcesService, } = require('../../services/platformServices');
const fetchDailyProblem = codeforcesService.fetchDailyProblem;
const currentQues = codeforcesService.getTodayCodeforcesQuestions

module.exports = {
    fetchDailyProblem ,
    currentQues
};
