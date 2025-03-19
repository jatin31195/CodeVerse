const codeforcesService = require('../services/contestService');

const CodeforcesgetUpcomingContests = async (req, res) => {
    try {
        const contests = await codeforcesService.fetchUpcomingContests();
        res.json({ contests });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const LeetCodegetUpcomingContests = async (req, res) => {
    try {
        const contests = await codeforcesService.fetchUpcomingLeetCodeContests();
        res.json({ contests });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const getUpcomingGFGContests = async (req, res) => {
    try {
        const contests = await codeforcesService.fetchUpcomingGFGContests();
        res.json({ contests });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
module.exports = { CodeforcesgetUpcomingContests,LeetCodegetUpcomingContests,getUpcomingGFGContests};