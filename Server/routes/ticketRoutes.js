const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const authMiddleware = require('../middlewares/authMiddlewares'); 

router.post('/raise', authMiddleware, ticketController.raiseTicket);
router.get('/', authMiddleware, ticketController.getAvailableTickets);
router.post('/:ticketId/solution', authMiddleware, ticketController.provideTextSolution);
router.post('/:ticketId/request-video', authMiddleware, ticketController.requestVideoMeet);
router.put('/:ticketId/accept-video', authMiddleware, ticketController.acceptVideoMeetRequest);
router.put('/:ticketId/close', authMiddleware, ticketController.closeTicket);
router.post('/accept-solution', authMiddleware, ticketController.acceptSolution);
router.get('/my', authMiddleware, ticketController.getMyTickets); 
module.exports = router;
