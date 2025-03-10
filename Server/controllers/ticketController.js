// controllers/ticketController.js
const TicketService = require('../services/ticketService');

const raiseTicket = async (req, res, next) => {
  try {
    const userId = req.user.userId;  // Using req.user.userId as per your middleware
    const { questionIdentifier } = req.body;
    const ticket = await TicketService.raiseTicket(userId, questionIdentifier);
    // Emit real-time update
    const io = req.app.get('socketio');
    io.emitTicketsUpdated();
    res.status(201).json({ success: true, ticket });
  } catch (error) {
    next(error);
  }
};

const getAvailableTickets = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const tickets = await TicketService.getAvailableTickets(userId);
    res.status(200).json({ success: true, tickets });
  } catch (error) {
    next(error);
  }
};

const provideTextSolution = async (req, res, next) => {
  try {
    const solverUserId = req.user.userId;
    const { solutionText } = req.body;
    const ticketId = req.params.ticketId;
    const ticket = await TicketService.provideTextSolution(ticketId, solutionText, solverUserId);
    // Emit real-time update
    const io = req.app.get('socketio');
    io.emitTicketsUpdated();
    res.status(200).json({ success: true, ticket });
  } catch (error) {
    next(error);
  }
};

const acceptSolution = async (req, res, next) => {
  try {
    const raiserUserId = req.user.userId;
    const { ticketId, solutionId } = req.body;
    const ticket = await TicketService.acceptSolution(ticketId, solutionId, raiserUserId);
    // Emit real-time update
    const io = req.app.get('socketio');
    io.emitTicketsUpdated();
    res.status(200).json({ success: true, ticket });
  } catch (error) {
    next(error);
  }
};

const closeTicket = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const ticketId = req.params.ticketId;
    const ticket = await TicketService.closeTicket(ticketId, userId);
    // Emit real-time update
    const io = req.app.get('socketio');
    io.emitTicketsUpdated();
    res.status(200).json({ success: true, ticket });
  } catch (error) {
    next(error);
  }
};

const requestVideoMeet = async (req, res, next) => {
  try {
    const solverUserId = req.user.userId;
    const ticketId = req.params.ticketId;
    const ticket = await TicketService.requestVideoMeet(ticketId, solverUserId);
    // Emit real-time update
    const io = req.app.get('socketio');
    io.emitTicketsUpdated();
    res.status(200).json({ success: true, ticket });
  } catch (error) {
    next(error);
  }
};

const acceptVideoMeetRequest = async (req, res, next) => {
  try {
    const raiserUserId = req.user.userId;
    const ticketId = req.params.ticketId;
    const { meetingLink } = req.body;
    const ticket = await TicketService.acceptVideoMeetRequest(ticketId, raiserUserId, meetingLink);
    // Emit real-time update
    const io = req.app.get('socketio');
    io.emitTicketsUpdated();
    res.status(200).json({ success: true, ticket });
  } catch (error) {
    next(error);
  }
};

const getMyTickets = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    // Return only the tickets that user raised
    const tickets = await TicketService.getTicketsRaisedByUser(userId);
    res.status(200).json({ success: true, tickets });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  raiseTicket,
  getAvailableTickets,
  provideTextSolution,
  requestVideoMeet,
  acceptVideoMeetRequest,
  closeTicket,
  acceptSolution,
  getMyTickets,
};
