const express = require('express');
const router = express.Router();
const codeforcesController = require('../controllers/contestController');

router.get('/c', codeforcesController.CodeforcesgetUpcomingContests);
router.get('/l',codeforcesController.LeetCodegetUpcomingContests);
router.get('/g',codeforcesController.getUpcomingGFGContests)
module.exports = router;