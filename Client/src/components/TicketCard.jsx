import React, { useState } from 'react';
import {
  MessageSquare,
  Video,
  VideoOff,
  Check,
  X,
  Clock,
  AlertCircle,
  Code,
} from 'lucide-react';

const getRaisedByInitial = (raisedBy) => {
  if (typeof raisedBy === 'string') return raisedBy.charAt(0);
  if (raisedBy && raisedBy.username) return raisedBy.username.charAt(0);
  return '?';
};

const TicketCard = ({
  ticket,
  isMyTicket,
  onAcceptMeet,
  onJoinMeet,
  onCloseMeet,
  onCloseTicket,
  onOpenTextSolution,
  currentTicket,
  solutionText,
  onSolutionTextChange,
  onSubmitSolution,
  onRequestMeet,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const cardBackgroundClass =
    ticket.status.toLowerCase() === 'open'
      ? 'from-codeverse-cyan/10 to-codeverse-purple/10'
      : ticket.status.toLowerCase() === 'in progress'
      ? 'from-amber-500/10 to-orange-500/10'
      : ticket.status.toLowerCase() === 'resolved'
      ? 'from-green-500/10 to-emerald-500/10'
      : 'from-gray-500/10 to-gray-700/10';

  const displaySolutions =
    ticket.solutions && ticket.solutions.length > 0 ? (
      ticket.solutions.map((sol) => (
        <div
          key={sol._id}
          className="bg-white/5 rounded-lg p-2 text-xs text-gray-300 border border-white/10 mb-1 relative"
        >
          {sol.text}
          {isMyTicket && (
            <button
              onClick={onCloseMeet}
              className="absolute bottom-1 right-1"
              title="Accept and Close Ticket"
            >
              <Check className="h-4 w-4 text-green-500" />
            </button>
          )}
        </div>
      ))
    ) : ticket.solution ? (
      <div className="bg-white/5 rounded-lg p-2 text-xs text-gray-300 border border-white/10 relative">
        {ticket.solution}
        {isMyTicket && (
          <button
            onClick={onCloseMeet}
            className="absolute bottom-1 right-1"
            title="Accept and Close Ticket"
          >
            <Check className="h-4 w-4 text-green-500" />
          </button>
        )}
      </div>
    ) : null;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br ${cardBackgroundClass} backdrop-blur-md transition-all duration-300 ${
        isHovered
          ? 'translate-y-[-4px] shadow-lg shadow-codeverse-purple/20'
          : 'shadow-md shadow-black/20'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-r from-codeverse-cyan via-codeverse-purple to-codeverse-blue opacity-0 transition-opacity duration-300 ${
          isHovered ? 'opacity-20' : ''
        }`}
      ></div>

      <div className="p-4 relative z-10">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="h-7 w-7 flex items-center justify-center rounded-full bg-gradient-to-r from-codeverse-cyan to-codeverse-purple text-white">
              <Code className="h-3.5 w-3.5" />
            </div>
            {ticket.questionUrl ? (
              <a
                href={ticket.questionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-base text-white hover:underline flex items-center"
              >
                {ticket.questionName}
                {ticket.questionPlatform && (
                  <span className="ml-2 px-2 py-0.5 bg-codeverse-purple/20 text-xs text-codeverse-purple rounded">
                    {ticket.questionPlatform}
                  </span>
                )}
              </a>
            ) : (
              <h3 className="font-medium text-base text-white">
                {ticket.questionName}
                {ticket.questionPlatform && (
                  <span className="ml-2 px-2 py-0.5 bg-codeverse-purple/20 text-xs text-codeverse-purple rounded">
                    {ticket.questionPlatform}
                  </span>
                )}
              </h3>
            )}
          </div>

          {isMyTicket && (
            <div className="flex items-center text-xs text-gray-400">
              <Clock className="h-3 w-3 mr-1" />
              <span>{ticket.timeAgo}</span>
            </div>
          )}

          {!isMyTicket && (
            <div className="relative group">
              <div className="flex items-center text-xs bg-black/30 px-2 py-1 rounded-full border border-white/10 hover:bg-black/50 transition-colors cursor-pointer">
                <span className="font-medium text-gray-400">By:</span>
                <span className="ml-1 text-white">
                  {ticket.raisedBy && ticket.raisedBy.username
                    ? ticket.raisedBy.username
                    : ticket.raisedBy}
                </span>
              </div>
              <div className="absolute left-0 bottom-[-70px] w-48 p-2 bg-black/80 border border-white/10 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-codeverse-cyan to-codeverse-purple flex items-center justify-center">
                    {getRaisedByInitial(ticket.raisedBy)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {ticket.raisedBy && ticket.raisedBy.username
                        ? ticket.raisedBy.username
                        : ticket.raisedBy}
                    </p>
                    <p className="text-xs text-gray-400">
                      Active Contributor
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 mb-3 line-clamp-2">
          {ticket.description}
        </p>

        <div className="mb-3">
          <div className="flex items-center mb-2">
            <div className="h-px flex-1 bg-white/10"></div>
            <span className="px-2 text-xs uppercase tracking-wider text-gray-400 font-medium">
              Solution
            </span>
            <div className="h-px flex-1 bg-white/10"></div>
          </div>
          {displaySolutions ? (
            <div>{displaySolutions}</div>
          ) : (
            <div className="bg-black/20 rounded-lg p-2 text-xs text-gray-400 flex items-center justify-center border border-white/5">
              <AlertCircle className="h-3 w-3 mr-1" />
              <span>No solution provided yet</span>
            </div>
          )}
        </div>

        <div className="mt-3 space-y-2">
          {isMyTicket && ticket.status.toLowerCase() === 'open' && (
            <button
              onClick={() => onCloseTicket(ticket._id)}
              className="bg-red-600 text-white rounded-md px-3 py-1 text-xs hover:bg-red-700 transition-colors flex items-center"
            >
              <X className="h-3 w-3 mr-1" /> Close Ticket
            </button>
          )}
          {isMyTicket ? (
            ticket.videoMeetRequest && ticket.videoMeetRequest.status === 'pending' ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onAcceptMeet}
                  className="bg-gradient-to-r from-green-600 to-green-500 text-white rounded-md px-3 py-1 text-xs hover:opacity-90 transition-opacity flex items-center"
                >
                  <Check className="h-3 w-3 mr-1 " /> Accept Request
                </button>
                <button
                  onClick={onCloseMeet}
                  className="bg-black/30 text-white rounded-md px-3 py-1 text-xs hover:bg-black/50 transition-colors flex items-center border border-white/10"
                >
                  <X className="h-3 w-3 mr-1 " /> Decline
                </button>
              </div>
            ) : ticket.status === 'video-accepted' ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onJoinMeet}
                  className="relative overflow-hidden group bg-gradient-to-r from-codeverse-cyan to-codeverse-blue text-white rounded-md px-3 py-1 text-xs hover:shadow-lg hover:shadow-codeverse-cyan/30 transition-all duration-300 flex items-center"
                >
                  <Video className="h-3 w-3 mr-1" /> Join Meet
                </button>
                <button
                  onClick={onCloseMeet}
                  className="bg-gradient-to-r from-red-600 to-red-500 text-white rounded-md px-3 py-1 text-xs hover:opacity-90 transition-opacity flex items-center"
                >
                  <VideoOff className="h-3 w-3 mr-1" /> Close Meet
                </button>
              </div>
            ) : ticket.status === 'video-active' ? (
              <button
                onClick={onCloseMeet}
                className="bg-gradient-to-r from-red-600 to-red-500 text-white rounded-md px-3 py-1 text-xs hover:opacity-90 transition-opacity flex items-center"
              >
                <VideoOff className="h-3 w-3 mr-1" /> End Meet
              </button>
            ) : null
          ) : ticket.videoMeetRequest && ticket.videoMeetRequest.status === 'pending' ? (
            <div className="text-xs text-gray-400">
              Waiting for ticket raiser to accept the video meet request...
            </div>
          ) : ticket.status === 'video-accepted' ? (
            <button
              onClick={onJoinMeet}
              className="relative overflow-hidden group bg-gradient-to-r from-codeverse-cyan to-codeverse-blue text-white rounded-md px-3 py-1 text-xs hover:shadow-lg hover:shadow-codeverse-cyan/30 transition-all duration-300 flex items-center"
            >
              <Video className="h-3 w-3 mr-1" /> Join Meet
            </button>
          ) : (
            <div className="space-y-2">
              <div className="flex space-x-2">
                <button
                  onClick={() => onOpenTextSolution && onOpenTextSolution(ticket)}
                  className="w-1/2 bg-black/30 border border-white/10 text-white rounded-md px-3 py-1 text-xs hover:bg-black/50 transition-colors flex items-center justify-center"
                >
                  <MessageSquare className="h-3 w-3 mr-1" /> Provide Text Solution
                </button>
                <button
                  onClick={() => onRequestMeet && onRequestMeet(ticket._id)}
                  className="w-1/2 bg-black/30 border border-white/10 relative overflow-hidden group bg-gradient-to-r from-codeverse-cyan to-codeverse-purple text-white rounded-md px-3 py-1 text-xs hover:shadow-lg hover:shadow-codeverse-purple/30 transition-all duration-300 flex items-center justify-center"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-codeverse-purple to-codeverse-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <Video className="h-3 w-3 mr-1" /> Request Video Meet
                </button>
              </div>
              {currentTicket && currentTicket._id === ticket._id && (
                <div className="mt-2">
                  <textarea
                    placeholder="Enter text solution"
                    value={solutionText}
                    onChange={onSolutionTextChange}
                    className="w-full p-2 rounded-md bg-black/20 border border-white/10 text-white"
                  ></textarea>
                  <button
                    onClick={() => onSubmitSolution(ticket._id)}
                    className="mt-2 bg-gradient-to-r from-codeverse-cyan to-codeverse-purple text-white px-3 py-1 rounded-md text-xs"
                  >
                    Submit Solution
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
