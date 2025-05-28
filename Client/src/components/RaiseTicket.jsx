import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { motion } from 'framer-motion';
import { useNavigate,useLocation } from 'react-router-dom';
import Header from '../components/Header';
import TicketCard from '../components/TicketCard';
import { Combobox } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';
const getUserId = (user) => {
  if (!user) return "";
  if (typeof user === "string") return user;
  if (user._id) return user._id.toString();
  if (user.$oid) return user.$oid.toString();
  return "";
};

const socket = io('http://localhost:8080', {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

const RaiseTicket = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredQuestions, setFilteredQuestions] = useState(questions);
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [myTickets, setMyTickets] = useState([]);
  const [otherTickets, setOtherTickets] = useState([]);
  const [ticketRaised, setTicketRaised] = useState(false);
  const [solutionText, setSolutionText] = useState('');
  const [currentTicket, setCurrentTicket] = useState(null);
  const [query, setQuery]             = useState('');
  const [isOpen, setIsOpen]           = useState(false);
  const currentUserId = sessionStorage.getItem('userId');
  useEffect(() => {
  if (location.state && location.state.problemId) {
    setSelectedQuestion(location.state.problemId);
    setTicketRaised(false); 
  }
}, [location.state]);

  const getAuthConfig = () => {
    const token = sessionStorage.getItem('token');
    return {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    };
  };

  // 1) Initial data fetch
  useEffect(() => {
    fetchQuestions();
    fetchMyTickets();
    fetchOtherTickets();
  }, []);

  // 2) Sync dropdown selection when both questions & navigation state arrive
  useEffect(() => {
    if (location.state?.problemId && questions.length > 0) {
      const match = questions.find((q) => q._id === location.state.problemId);
      if (match) {
        setSelectedQuestion(match._id);
        setTicketRaised(false);
        // Optionally scroll the form into view:
        document
          .getElementById("raise-ticket-section")
          ?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.state, questions]);

  // 3) Socket listener to refresh tickets
  useEffect(() => {
    socket.on("ticketsUpdated", refreshTickets);
    return () => socket.off("ticketsUpdated", refreshTickets);
  }, []);

  useEffect(() => {
    if (location.state?.problemId && questions.length) {
      const match = questions.find(q => q._id === location.state.problemId);
      if (match) {
        setSelectedQuestion(match);
        setSearchTerm(match.title);
        setTicketRaised(false);
      }
    }
  }, [location.state, questions]);
  // 4) Filter questions as user types
  useEffect(() => {
    setFilteredQuestions(
      !searchTerm
        ? questions
        : questions.filter(q =>
            q.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
    );
  }, [searchTerm, questions]);
  const fetchQuestions = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/questions', {
        ...getAuthConfig(),
        withCredentials: true,
      });
      const fetched = Array.isArray(res.data)
        ? res.data
        : res.data.questions || [];
      setQuestions(fetched);
    } catch (err) {
      console.error('Error fetching questions:', err);
    }
  };

  const fetchMyTickets = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/ticket-Raise/my', getAuthConfig());
      setMyTickets(res.data.tickets || []);
    } catch (err) {
      console.error('Error fetching my tickets:', err);
    }
  };

  const fetchOtherTickets = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/ticket-Raise', getAuthConfig());
      const all = res.data.tickets || res.data || [];
      setOtherTickets(all.filter((t) => getUserId(t.raisedBy) !== currentUserId));
    } catch (err) {
      console.error('Error fetching other tickets:', err);
    }
  };

  const refreshTickets = async () => {
    await fetchMyTickets();
    await fetchOtherTickets();
  };

  const handleRaiseTicket = async (e) => {
    e.preventDefault();
    if (!selectedQuestion) {
      toast.warning('Please select a question.');
      return;
    }
    try {
      await axios.post(
        'http://localhost:8080/api/ticket-Raise/raise',
        { questionIdentifier: selectedQuestion },
        getAuthConfig()
      );
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
      await axios.post(
        `http://localhost:8080/api/ticket-Raise/${ticketId}/solution`,
        { solutionText },
        getAuthConfig()
      );
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
      await axios.post(
        `http://localhost:8080/api/ticket-Raise/${ticketId}/request-video`,
        {},
        getAuthConfig()
      );
      toast.success('Video meet request sent');
      refreshTickets();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error requesting video meet');
    }
  };

  const handleAcceptVideoMeet = async (ticketId) => {
    try {
      const res = await axios.put(
        `http://localhost:8080/api/ticket-Raise/${ticketId}/accept-video`,
        {},
        getAuthConfig()
      );
      toast.success('Video meet accepted. Meeting room created.');
      refreshTickets();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error accepting video meet request');
    }
  };

  const handleCloseVideoMeet = async (ticketId) => {
    try {
      await axios.put(
        `http://localhost:8080/api/ticket-Raise/${ticketId}/close-video`,
        {},
        getAuthConfig()
      );
      toast.success('Video meet closed and ticket updated.');
      refreshTickets();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error closing video meet');
    }
  };

  
  const handleJoinOrCreateVideoMeet = async (ticket, isMyTicket) => {
    if (ticket.videoMeetRoom && ticket.videoMeetRoom.trim() !== "") {
     
      window.location.href = `/video-meeting/${ticket.videoMeetRoom}`;
      return;
    }
    
    if (isMyTicket) {
      try {
        const res = await axios.put(
          `http://localhost:8080/api/ticket-Raise/${ticket._id}/accept-video`,
          {},
          getAuthConfig()
        );
        const updatedTicket = res.data.ticket || res.data;
        if (updatedTicket.videoMeetRoom && updatedTicket.videoMeetRoom.trim() !== "") {
          window.location.href = `/video-meeting/${updatedTicket.videoMeetRoom}`;
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
        className="fixed inset-0 bg-[url('code1.png')] bg-center opacity-5 bg-no-repeat pointer-events-none"
        aria-hidden="true"
      />
      <Header onNewTicket={() => {}} />
      <main className="container pb-12 max-w-4xl mx-auto">
        {/* Raise Ticket Section */}
        <motion.section
          id="raise-ticket-section"
          className="mb-8 animate-slide-up"
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
              onChange={q => {
                setSelectedQuestion(q);
                setIsOpen(false);
                setSearchTerm(q.title);
              }}
            >
              <div className="relative">
                <Combobox.Input
                  className="w-full p-2 pl-3 pr-10 rounded-md bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-codeverse-purple"
                  displayValue={q => q?.title || ''}
                  onChange={e => {
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
                    {filteredQuestions.map(q => (
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
            disabled={!selectedQuestion}
            className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-1 rounded-lg font-medium hover:scale-105 transition-transform duration-300 "
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

        {/* My Tickets */}
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
            myTickets.map((ticket) => (
              <TicketCard
                key={ticket._id}
                ticket={ticket}
                isMyTicket
                onAcceptMeet={() => handleAcceptVideoMeet(ticket._id)}
                onJoinMeet={() =>
                  handleJoinOrCreateVideoMeet(ticket, true)
                }
                onCloseMeet={() => handleCloseVideoMeet(ticket._id)}
              />
            ))
          ) : (
            <p className="bg-black/30 p-4 rounded-lg text-gray-300">
              No tickets raised by you.
            </p>
          )}
        </motion.section>

        {/* Community Tickets */}
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
            otherTickets.map((ticket) => (
              <TicketCard
                key={ticket._id}
                ticket={ticket}
                isMyTicket={false}
                onAcceptMeet={() => handleAcceptVideoMeet(ticket._id)}
                onJoinMeet={() =>
                  handleJoinOrCreateVideoMeet(ticket, false)
                }
                onCloseMeet={() => handleCloseVideoMeet(ticket._id)}
                onOpenTextSolution={handleOpenTextSolution}
                currentTicket={currentTicket}
                solutionText={solutionText}
                onSolutionTextChange={(e) => setSolutionText(e.target.value)}
                onSubmitSolution={handleProvideTextSolution}
                onRequestMeet={() => handleRequestVideoMeet(ticket._id)}
              />
            ))
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
