// services/ticketService.js
const TicketRepository = require('../repositories/ticketRepository');
const Question = require('../models/Question'); // Assuming you have a Question model
const Ticket = require('../models/Ticket'); 
const raiseTicket = async (userId, questionIdentifier) => {
  // Directly use the questionIdentifier (which is the question id) to search for the question
  const question = await Question.findById(questionIdentifier);
  
  if (!question) {
    throw new Error('Question not found');
  }
  
  const ticketData = {
    questionId: question._id,
    raisedBy: userId,
  };
  
  const ticket = await TicketRepository.createTicket(ticketData);
  return ticket;
};


const getAvailableTickets = async (userId) => {
  return await TicketRepository.getOpenTickets(userId);
};

const provideTextSolution = async (ticketId, solutionText, solverUserId) => {
  const ticket = await TicketRepository.getTicketById(ticketId);
  if (!ticket) throw new Error('Ticket not found');
  
  // Prevent the ticket raiser from submitting a solution on their own ticket.
  if (ticket.raisedBy.toString() === solverUserId) {
    throw new Error('Ticket raiser cannot provide a solution');
  }
  
  // Push the new solution to the solutions array.
  ticket.solutions.push({
    text: solutionText,
    providedBy: solverUserId,
  });
  
  const updatedTicket = await ticket.save();
  return updatedTicket;
};
const acceptSolution = async (ticketId, solutionId, raiserUserId) => {
  const ticket = await TicketRepository.getTicketById(ticketId);
  if (!ticket) throw new Error('Ticket not found');
  
  // Ensure only the ticket raiser can accept a solution.
  if (ticket.raisedBy.toString() !== raiserUserId) {
    throw new Error('Only the ticket raiser can accept a solution');
  }
  
  let solutionFound = false;
  ticket.solutions.forEach(sol => {
    if (sol._id.toString() === solutionId) {
      sol.accepted = true;
      solutionFound = true;
    } else {
      // Optionally, un-accept other solutions.
      sol.accepted = false;
    }
  });
  
  if (!solutionFound) {
    throw new Error('Solution not found');
  }
  
  // Update ticket status to "solved"
  ticket.status = 'solved';
  
  const updatedTicket = await ticket.save();
  return updatedTicket;
};

const requestVideoMeet = async (ticketId, solverUserId) => {
  const ticket = await TicketRepository.getTicketById(ticketId);
  if (!ticket) throw new Error('Ticket not found');
  
  if (ticket.raisedBy.toString() === solverUserId) {
    throw new Error('Ticket raiser cannot request a video meet on their own ticket');
  }
  
  // Update the ticket with a video meet request.
  const updatedTicket = await TicketRepository.updateTicket(ticketId, {
    videoMeetRequest: { requestedBy: solverUserId, status: 'pending' }
  });
  // NOTE: Here you could trigger a socket.io event to notify the ticket raiser.
  return updatedTicket;
};

const acceptVideoMeetRequest = async (ticketId, raiserUserId, meetingLink) => {
  const ticket = await TicketRepository.getTicketById(ticketId);
  if (!ticket) throw new Error('Ticket not found');
  
  if (ticket.raisedBy.toString() !== raiserUserId) {
    throw new Error('Only the ticket raiser can accept a video meet request');
  }
  
  if (!ticket.videoMeetRequest || ticket.videoMeetRequest.status !== 'pending') {
    throw new Error('No pending video meet request');
  }
  
  const updatedTicket = await TicketRepository.updateTicket(ticketId, {
    videoMeetRequest: { ...ticket.videoMeetRequest.toObject(), status: 'accepted' },
    videoMeetLink: meetingLink,
    status: 'solved'
  });
  // NOTE: Here you could trigger a socket.io event to notify the solver.
  return updatedTicket;
};

const closeTicket = async (ticketId, userId) => {
  const ticket = await TicketRepository.getTicketById(ticketId);
  if (!ticket) throw new Error('Ticket not found');
  
  // Check that a solution has been accepted.
  const acceptedSolution = ticket.solutions.find(sol => sol.accepted);
  if (!acceptedSolution) {
    throw new Error('No accepted solution. Cannot close ticket.');
  }
  
  // Delete the ticket from the database
  await TicketRepository.deleteTicket(ticketId);
  
  return { message: 'Ticket closed and removed from database' };
};
const getTicketsRaisedByUser = async (userId) => {
  return Ticket.find({ raisedBy: userId })
    .populate('questionId raisedBy solutions.providedBy');
};
module.exports = {
  raiseTicket,
  getAvailableTickets,
  provideTextSolution,
  requestVideoMeet,
  acceptVideoMeetRequest,
  closeTicket,
  acceptSolution,
  getTicketsRaisedByUser,
};
