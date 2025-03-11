
const TicketRepository = require('../repositories/ticketRepository');
const Question = require('../models/Question');
const Ticket = require('../models/Ticket'); 
const mongoose=require('mongoose');
const raiseTicket = async (userId, questionIdentifier) => {
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
  try {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const tickets = await Ticket.find({ raisedBy: { $ne: userObjectId } })
      .populate("questionId raisedBy solutions.providedBy");

    // console.log("Filtered Tickets (Except Current User):", tickets);
    return tickets;
  } catch (error) {
    console.error("Error in getAvailableTickets:", error);
    throw new Error("Failed to fetch available tickets");
  }
};


const provideTextSolution = async (ticketId, solutionText, solverUserId) => {
  const ticket = await TicketRepository.getTicketById(ticketId);
  if (!ticket) throw new Error('Ticket not found');
  
  
  if (ticket.raisedBy.toString() === solverUserId) {
    throw new Error('Ticket raiser cannot provide a solution');
  }
  
  
  ticket.solutions.push({
    text: solutionText,
    providedBy: solverUserId,
  });
  
  const updatedTicket = await ticket.save();
  return updatedTicket;
};

const acceptSolution = async (ticketId, solutionId, raiserUserId) => {
  // console.log("🔍 Checking ticket and solution existence:", { ticketId, solutionId, raiserUserId });
  const ticket = await TicketRepository.getTicketById(ticketId);
  if (!ticket) {
    // console.error("Ticket not found:", ticketId);
    throw new Error("Ticket not found");
  }
  // console.log("Ticket found:", ticket);
  if (ticket.raisedBy.toString() !== raiserUserId) {
    console.error(" Unauthorized: Ticket raiser mismatch", { expected: ticket.raisedBy.toString(), actual: raiserUserId });
    throw new Error("Only the ticket raiser can accept a solution");
  }

  let solutionFound = false;
  ticket.solutions.forEach((sol) => {
    if (sol._id.toString() === solutionId) {
      solutionFound = true;
    }
  });

  if (!solutionFound) {
    console.error("❌ Solution not found:", solutionId);
    throw new Error("Solution not found");
  }
  // console.log("✅ Solution accepted. Deleting ticket:", ticketId);
  await TicketRepository.deleteTicket(ticketId);
  return { message: "Ticket deleted after solution acceptance" };
};



const requestVideoMeet = async (ticketId, solverUserId) => {
  const ticket = await TicketRepository.getTicketById(ticketId);
  if (!ticket) throw new Error('Ticket not found');
  
  if (ticket.raisedBy.toString() === solverUserId) {
    throw new Error('Ticket raiser cannot request a video meet on their own ticket');
  }
  
  const updatedTicket = await TicketRepository.updateTicket(ticketId, {
    videoMeetRequest: { requestedBy: solverUserId, status: 'pending' }
  });
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
  
  return updatedTicket;
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
  acceptSolution,
  getTicketsRaisedByUser,
};