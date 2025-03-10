// repositories/ticketRepository.js
const Ticket = require('../models/Ticket');

const createTicket = async (ticketData) => {
  const ticket = new Ticket(ticketData);
  return await ticket.save();
};

const getOpenTickets = async (excludeUserId) => {
  // Only show tickets that are open and not raised by the current user.
  return await Ticket.find({ status: 'open', raisedBy: { $ne: excludeUserId } })
    .populate('questionId raisedBy');
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
