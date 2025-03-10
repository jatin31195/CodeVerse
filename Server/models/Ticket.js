// models/Ticket.js
const mongoose = require('mongoose');

const SolutionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  providedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  accepted: { type: Boolean, default: false }
}, { timestamps: true });

const VideoMeetRequestSchema = new mongoose.Schema({
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
}, { _id: false });

const TicketSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  solutions: { type: [SolutionSchema], default: [] },  // New field for multiple solutions
  videoMeetLink: { type: String, default: '' },
  videoMeetRequest: VideoMeetRequestSchema,
  status: { type: String, enum: ['open', 'solved', 'closed'], default: 'open' },
}, { timestamps: true });

module.exports = mongoose.model('Ticket', TicketSchema);
