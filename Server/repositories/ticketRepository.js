// repositories/ticketRepository.js
const Ticket = require('../models/Ticket');

const createTicket = async (ticketData) => {
  const ticket = new Ticket(ticketData);
  return await ticket.save();
};

const getOpenTickets = async (userId) => {
  return await Ticket.find({ status: 'open', raisedBy: { $ne: userId } }) 
    .populate('questionId raisedBy solutions.providedBy');
};


const getTicketById = async (ticketId) => {
  return await Ticket.findById(ticketId);
};

const updateTicket = async (ticketId, updateData) => {
  return await Ticket.findByIdAndUpdate(ticketId, updateData, { new: true });
};
const deleteTicket = async (ticketId) => {
  return await Ticket.findByIdAndDelete(ticketId);
};
module.exports = {
  createTicket,
  getOpenTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
};
