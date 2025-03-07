const { codeforcesService } = require('../../services/platformServices');
const fun = codeforcesService.fetchDailyProblem;

module.exports = {
    fetchDailyProblem: fun 
};
