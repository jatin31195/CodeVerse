// src/pages/RaiseTicket.jsx
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import TicketCard from '../components/TicketCard';
import { Combobox } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';
import { BASE_URL } from '../config';
import { apiRequest } from '../utils/api';

const getUserId = (user) => {
  if (!user) return "";
  if (typeof user === "string") return user;
  if (user._id) return user._id.toString();
  if (user.$oid) return user.$oid.toString();
  return "";
};

const socket = io('https://www.codeverse.solutions', {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

const RaiseTicket = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [myTickets, setMyTickets] = useState([]);
  const [otherTickets, setOtherTickets] = useState([]);
  const [ticketRaised, setTicketRaised] = useState(false);
  const [solutionText, setSolutionText] = useState('');
  const [currentTicket, setCurrentTicket] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const currentUserId = sessionStorage.getItem('userId');

  useEffect(() => {
    if (location.state && location.state.problemId) {
      setSelectedQuestion(location.state.problemId);
      setTicketRaised(false);
    }
  }, [location.state]);

  const getAuthConfig = () => ({
    headers: { "Content-Type": "application/json" },
  });

  useEffect(() => {
    fetchQuestions();
    fetchMyTickets();
    fetchOtherTickets();
  }, []);

  useEffect(() => {
    if (location.state?.problemId && questions.length > 0) {
      const match = questions.find((q) => q._id === location.state.problemId);
      if (match) {
        setSelectedQuestion(match);
        setTicketRaised(false);
        document
          .getElementById("raise-ticket-section")
          ?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.state, questions]);

  useEffect(() => {
    socket.on("ticketsUpdated", refreshTickets);
    return () => socket.off("ticketsUpdated", refreshTickets);
  }, []);

  useEffect(() => {
    setFilteredQuestions(
      !searchTerm
        ? questions
        : questions.filter((q) =>
            q.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
    );
  }, [searchTerm, questions]);

  useEffect(() => {
    if (reload) {
      fetchMyTickets();
      fetchOtherTickets();
      setReload(false);
    }
  }, [reload]);

  const fetchQuestions = async () => {
    try {
      const res = await apiRequest(`${BASE_URL}/api/questions`, {
        method: 'GET',
        headers: getAuthConfig().headers,
        withCredentials: true,
      });
      const fetched = Array.isArray(res.data) ? res.data : res.data.questions || [];
      setQuestions(fetched);
    } catch (err) {
      console.error('Error fetching questions:', err);
    }
  };

  const fetchMyTickets = async () => {
    try {
      const res = await apiRequest(`${BASE_URL}/api/ticket-Raise/my`, {
        method: 'GET',
        headers: getAuthConfig().headers,
        withCredentials: true,
      });
      setMyTickets(res.data.tickets || []);
    } catch (err) {
      console.error('Error fetching my tickets:', err);
    }
  };

  const fetchOtherTickets = async () => {
    try {
      const res = await apiRequest(`${BASE_URL}/api/ticket-Raise`, {
        method: 'GET',
        headers: getAuthConfig().headers,
        withCredentials: true,
      });
      const all = Array.isArray(res.data?.tickets)
        ? res.data.tickets
        : Array.isArray(res.data)
        ? res.data
        : [];
      setOtherTickets(all.filter((t) => getUserId(t.raisedBy) !== currentUserId));
    } catch (err) {
      console.error('Error fetching other tickets:', err);
    }
  };

  const refreshTickets = () => {
    setReload(true);
  };

  const handleRaiseTicket = async (e) => {
    e.preventDefault();
    if (!selectedQuestion || !selectedQuestion._id) {
      toast.warning('Please select a question.');
      return;
    }
    try {
      await apiRequest(`${BASE_URL}/api/ticket-Raise/raise`, {
        method: 'POST',
        headers: getAuthConfig().headers,
        withCredentials: true,
        body: { questionIdentifier: selectedQuestion._id },
      });
      setTicketRaised(true);
      toast.success('Ticket raised successfully');
      refreshTickets();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error raising ticket');
    }
  };

  const handleProvideTextSolution = async (ticketId) => {
    if (!solutionText) {
      toast.info('Enter a solution text');
      return;
    }
    try {
      await apiRequest(`${BASE_URL}/api/ticket-Raise/${ticketId}/solution`, {
        method: 'POST',
        headers: getAuthConfig().headers,
        withCredentials: true,
        body: { solutionText },
      });
      toast.success('Solution submitted successfully');
      setSolutionText('');
      setCurrentTicket(null);
      refreshTickets();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error submitting solution');
    }
  };

  const handleRequestVideoMeet = async (ticketId) => {
    try {
      await apiRequest(`${BASE_URL}/api/ticket-Raise/${ticketId}/request-video`, {
        method: 'POST',
        headers: getAuthConfig().headers,
        withCredentials: true,
        body: {},
      });
      toast.success('Video meet request sent');
      refreshTickets();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error requesting video meet');
    }
  };

  const handleAcceptVideoMeet = async (ticketId) => {
    try {
      await apiRequest(`${BASE_URL}/api/ticket-Raise/${ticketId}/accept-video`, {
        method: 'PUT',
        headers: getAuthConfig().headers,
        withCredentials: true,
        body: {},
      });
      toast.success('Video meet accepted. Meeting room created.');
      refreshTickets();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error accepting video meet request');
    }
  };

  const handleCloseVideoMeet = async (ticketId) => {
    try {
      await apiRequest(`${BASE_URL}/api/ticket-Raise/${ticketId}/close-video`, {
        method: 'PUT',
        headers: getAuthConfig().headers,
        withCredentials: true,
        body: {},
      });
      toast.success('Video meet closed and ticket updated.');
      refreshTickets();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error closing video meet');
    }
  };

  const handleCloseTicket = async (ticketId) => {
    try {
      await apiRequest(`${BASE_URL}/api/ticket-Raise/${ticketId}/close-video`, {
        method: 'PUT',
        headers: getAuthConfig().headers,
        withCredentials: true,
        body: {},
      });
      toast.success('Ticket closed successfully');
      refreshTickets();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error closing ticket');
    }
  };

  const handleJoinOrCreateVideoMeet = async (ticket, isMyTicket) => {
    if (ticket.videoMeetRoom && ticket.videoMeetRoom.trim() !== "") {
      navigate(`/video-meeting/${ticket.videoMeetRoom}`);
      return;
    }
    if (isMyTicket) {
      try {
        const res = await apiRequest(`${BASE_URL}/api/ticket-Raise/${ticket._id}/accept-video`, {
          method: 'PUT',
          headers: getAuthConfig().headers,
          withCredentials: true,
          body: {},
        });
        const updatedTicket = res.data.ticket || res.data;
        if (updatedTicket.videoMeetRoom && updatedTicket.videoMeetRoom.trim() !== "") {
          navigate(`/video-meeting/${updatedTicket.videoMeetRoom}`);
        } else {
          toast.error("Failed to create meeting room. Please try again later.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error creating meeting room.");
      }
    } else {
      toast.warning("Meeting room not available. Please wait for the ticket raiser to accept the video meet request.");
    }
  };

  const handleOpenTextSolution = (ticket) => {
    setCurrentTicket(ticket);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#000] text-white">
      <div
        className="fixed inset-0 bg-[url('/code1.png')] bg-center opacity-5 bg-no-repeat pointer-events-none"
        aria-hidden="true"
      />
      <Header onNewTicket={() => {}} />
      <main className="container pb-12 max-w-4xl mx-auto">
        <div className="mb-4 bg-white/80 backdrop-blur-md shadow-md rounded-full px-4 py-2 text-sm text-gray-800 flex flex-col gap-1 border border-gray-300 hover:shadow-lg transition-all duration-400 animate-pulse">
          <div>
            <span className="text-blue-600 font-semibold">Tip:</span> If you have doubts on any recent POTD question, search for it first. Then, raise a ticket to request a video or text solution via VideoMeeting.
          </div>
        </div>
        <motion.section
          id="raise-ticket-section"
          className="mb-8 animate-slide-up mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-2xl font-bold bg-codeverse-gradient bg-clip-text text-transparent mb-4">
            Raise Ticket
          </h2>
          {!ticketRaised ? (
            <form
              id="raise-ticket-section"
              onSubmit={handleRaiseTicket}
              className="bg-black/30 p-6 rounded-xl backdrop-blur-sm border border-white/10 shadow-xl space-y-5"
            >
              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">
                  Search & Select Question:
                </label>
                <Combobox
                  value={selectedQuestion}
                  onChange={(q) => {
                    setSelectedQuestion(q);
                    setIsOpen(false);
                    setSearchTerm(q.title);
                  }}
                >
                  <div className="relative">
                    <Combobox.Input
                      className="w-full p-2 pl-3 pr-10 rounded-md bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-codeverse-purple"
                      displayValue={(q) => q?.title || ''}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                      }}
                      onFocus={() => setIsOpen(true)}
                      placeholder="Search question by title..."
                    />
                    <Combobox.Button className="absolute inset-y-0 right-2 flex items-center text-gray-400">
                      <ChevronDown className="h-4 w-4" />
                    </Combobox.Button>
                    {isOpen && filteredQuestions.length > 0 && (
                      <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-black/80 text-white ring-1 ring-white/10 shadow-lg z-10">
                        {filteredQuestions.map((q) => (
                          <Combobox.Option
                            key={q._id}
                            value={q}
                            className={({ active }) =>
                              `cursor-pointer select-none relative px-4 py-2 ${
                                active ? 'bg-codeverse-purple/20 text-codeverse-purple' : ''
                              }`
                            }
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? 'font-medium' : 'font-normal'
                                  }`}
                                >
                                  {q.title}
                                </span>
                                {selected && (
                                  <span className="absolute inset-y-0 right-4 flex items-center">
                                    <Check className="w-4 h-4" />
                                  </span>
                                )}
                              </>
                            )}
                          </Combobox.Option>
                        ))}
                      </Combobox.Options>
                    )}
                  </div>
                </Combobox>
              </div>
              <button
                type="submit"
                disabled={!selectedQuestion?._id}
                className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-1 rounded-lg font-medium hover:scale-105 transition-transform duration-300"
              >
                Raise Ticket
              </button>
            </form>
          ) : (
            <p className="bg-black/30 p-4 rounded-lg text-gray-300">
              You have already raised a ticket.
            </p>
          )}
        </motion.section>
        <motion.section
          className="mb-8 animate-slide-up"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold bg-codeverse-gradient bg-clip-text text-transparent mb-4">
            My Tickets
          </h2>
          {myTickets.length > 0 ? (
            myTickets.map((ticket) => {
              const question = questions.find((q) => q._id === ticket.questionId);
              const ticketWithQuestion = {
                ...ticket,
                questionName: question?.title || 'Unknown Question',
                questionPlatform: question?.platform || '',
                questionUrl: question?.link || '',
              };
              return (
                <TicketCard
                  key={ticket._id}
                  ticket={ticketWithQuestion}
                  isMyTicket
                  onAcceptMeet={() => handleAcceptVideoMeet(ticket._id)}
                  onJoinMeet={() =>
                    handleJoinOrCreateVideoMeet(ticket, true)
                  }
                  onCloseMeet={() => handleCloseVideoMeet(ticket._id)}
                  onCloseTicket={() => handleCloseTicket(ticket._id)}
                  onOpenTextSolution={handleOpenTextSolution}
                  currentTicket={currentTicket}
                  solutionText={solutionText}
                  onSolutionTextChange={(e) => setSolutionText(e.target.value)}
                  onSubmitSolution={handleProvideTextSolution}
                  onRequestMeet={() => handleRequestVideoMeet(ticket._id)}
                />
              );
            })
          ) : (
            <p className="bg-black/30 p-4 rounded-lg text-gray-300">
              No tickets raised by you.
            </p>
          )}
        </motion.section>
        <motion.section
          className="animate-slide-up"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold bg-codeverse-gradient bg-clip-text text-transparent mb-4">
            Community Tickets
          </h2>
          {otherTickets.length > 0 ? (
            otherTickets.map((ticket) => {
              const question = questions.find((q) => q._id === ticket.questionId);
              const ticketWithQuestion = {
                ...ticket,
                questionName: question?.title || 'Unknown Question',
                questionPlatform: question?.platform || '',
                questionUrl: question?.link || '',
              };
              return (
                <TicketCard
                  key={ticket._id}
                  ticket={ticketWithQuestion}
                  isMyTicket={false}
                  onAcceptMeet={() => handleAcceptVideoMeet(ticket._id)}
                  onJoinMeet={() =>
                    handleJoinOrCreateVideoMeet(ticket, false)
                  }
                  onCloseMeet={() => handleCloseVideoMeet(ticket._id)}
                  onCloseTicket={() => handleCloseTicket(ticket._id)}
                  onOpenTextSolution={handleOpenTextSolution}
                  currentTicket={currentTicket}
                  solutionText={solutionText}
                  onSolutionTextChange={(e) => setSolutionText(e.target.value)}
                  onSubmitSolution={handleProvideTextSolution}
                  onRequestMeet={() => handleRequestVideoMeet(ticket._id)}
                />
              );
            })
          ) : (
            <p className="bg-black/30 p-4 rounded-lg text-gray-300">
              No tickets available.
            </p>
          )}
        </motion.section>
      </main>
    </div>
  );
};

export default RaiseTicket;
