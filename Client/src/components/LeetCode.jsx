import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { MessageCircle, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SocketContext } from './SocketContext';
import SolutionCard from './SolutionCard';
import POTDCalendar from './POTDCalendar';
import MainLayout from './MainLayout';
import { toast } from 'react-toastify';
import { BASE_URL } from '../config';
import { apiRequest } from '../utils/api';

const navLinks = [
  { name: 'LeetCode', path: '/leetcode' },
  { name: 'CodeForces', path: '/codeforces' },
  { name: 'Geeks for Geeks', path: '/gfg' },
];

const fadeIn = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const slideIn = { hidden: { x: 300 }, show: { x: 0 } };

const getInitialDate = () => new Date();
const getDisplayDate = (selectedDate) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const cutoff = new Date(today);
  cutoff.setHours(5, 30, 0, 0);

  const selMidnight = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate()
  );

  if (selMidnight.getTime() === today.getTime() && now < cutoff) {
    selMidnight.setDate(selMidnight.getDate() - 1);
  }

  return selMidnight;
};

const getCurrentUserId = async () => {
  try {
    const res = await apiRequest(`${BASE_URL}/api/auth/profile`);
    return res.data?.data?.user?._id || null;
  } catch {
    return null;
  }
};

export default function LeetCode() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(getInitialDate());
  const [problem, setProblem] = useState(null);
  const [problemLoading, setProblemLoading] = useState(false);
  const [problemError, setProblemError] = useState(null);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const socket = useContext(SocketContext);
  const [sendTrigger, setSendTrigger] = useState(false);
  const messagesEndRef = useRef(null);

  const questionId = problem?._id || null;

  useEffect(() => {
    (async () => {
      const id = await getCurrentUserId();
      setCurrentUserId(id);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await apiRequest(`${BASE_URL}/api/auth/profile`);
      } catch {
        navigate('/login');
      }
    })();
  }, [navigate]);

  useEffect(() => {
    if (chatOpen && questionId) {
      apiRequest(`${BASE_URL}/api/chat/${questionId}`, { method: 'GET' })
        .then((res) => {
          const msgs = res.data.messages.map((m) => ({
            ...m,
            userId: String(m.userId),
          }));
          setChatMessages(msgs);
        })
        .catch(console.error);
    }
  }, [chatOpen, questionId]);

  useEffect(() => {
    const onChatMessage = (msg) => {
      msg.userId = String(msg.userId);
      setChatMessages((prev) =>
        prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]
      );
    };
    socket.on('chatMessage', onChatMessage);
    return () => socket.off('chatMessage', onChatMessage);
  }, [socket]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    setSendTrigger(true);
  };

  useEffect(() => {
    const sendMessage = async () => {
      if (!sendTrigger || !newMessage.trim() || !questionId || !currentUserId) return;
      const text = newMessage.trim();
      setNewMessage('');
      const optimisticMessage = {
        _id: `${Date.now()}`,
        questionId,
        text,
        userId: String(currentUserId),
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, optimisticMessage]);
      try {
        const res = await apiRequest(`${BASE_URL}/api/chat/${questionId}/message`, {
          method: 'POST',
          body: { text },
          headers: { 'Content-Type': 'application/json' },
        });
        const saved = {
          _id: res.data.message._id,
          questionId,
          text: res.data.message.text,
          userId: String(res.data.message.userId),
          timestamp: res.data.message.timestamp,
        };
        setChatMessages((prev) =>
          prev.map((msg) =>
            msg._id === optimisticMessage._id ? saved : msg
          )
        );
        socket.emit('sendChatMessage', saved);
      } catch {
        toast.error('Error sending message');
      } finally {
        setSendTrigger(false);
      }
    };
    sendMessage();
  }, [sendTrigger, newMessage, questionId, currentUserId, socket]);

  useEffect(() => {
    setProblemLoading(true);
    setProblemError(null);
    const displayDate = getDisplayDate(selectedDate);
    const ds = format(displayDate, 'yyyy-MM-dd');
    apiRequest(`${BASE_URL}/api/ques/leetcode/potd/${encodeURIComponent(ds)}`, {
      method: 'GET',
    })
      .then((res) => setProblem(res.data?.data || null))
      .catch((e) => {
        setProblemError(e.message);
        setProblem(null);
      })
      .finally(() => setProblemLoading(false));
  }, [selectedDate]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  return (
    <MainLayout navLinks={navLinks}>
      <div className="fixed top-25 left-6 bg-white/80 backdrop-blur-md shadow-md rounded-full px-4 py-2 text-sm text-gray-800 flex flex-col gap-1 border border-gray-300 hover:shadow-lg transition-all duration-400 z-40 animate-pulse">
  <div>
    <span className="text-blue-600 font-semibold">Tip1:</span> Click + to add question to Task or Favourites
  </div>
  <div>
  <span className="text-blue-600 font-semibold">Tip2:</span> Use the Chat button to ask doubts or discuss the POTD with your friends
</div>
</div>


      <motion.div
        className="container mx-auto py-8 px-4 max-w-screen-xl"
        initial="hidden"
        animate="show"
        variants={fadeIn}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-center text-3xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-6"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          LeetCode POTD
        </motion.h1>

        <motion.div variants={fadeIn} transition={{ delay: 0.3 }}>
          <POTDCalendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            platform="leetcode"
          />
        </motion.div>

        <motion.section className="mb-8" variants={fadeIn} transition={{ delay: 0.4 }}>
          <h2 className="text-2xl font-semibold mb-4">
            Problem for {format(getDisplayDate(selectedDate), 'MMMM d, yyyy')}
          </h2>
          {problemLoading ? (
            <motion.p variants={fadeIn} transition={{ delay: 0.5 }}>
              Loading problem…
            </motion.p>
          ) : problemError ? (
            <motion.p className="text-red-500" variants={fadeIn} transition={{ delay: 0.5 }}>
              Error: {problemError}
            </motion.p>
          ) : problem ? (
            <motion.div variants={fadeIn} transition={{ delay: 0.5 }}>
              <SolutionCard
                problem={problem}
                explanation={{
                  easyExplanation: problem.easyExplanation || 'No explanation.',
                  realLifeExample: problem.realLifeExample || '',
                }}
                explanationLoading={false}
                explanationError={null}
              />
            </motion.div>
          ) : (
            <motion.div
              className="p-4 bg-yellow-100 text-yellow-800 rounded"
              variants={fadeIn}
              transition={{ delay: 0.5 }}
            >
              No problem available.
            </motion.div>
          )}
        </motion.section>

        <motion.button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 flex items-center justify-center shadow-lg bg-gradient-to-r from-red-500 to-yellow-500 text-white"
          whileHover={{ scale: 1.1 }}
        >
          <MessageCircle size={24} />
        </motion.button>

        <AnimatePresence>
          {chatOpen && (
            <motion.div
              className="fixed right-0 top-0 bottom-0 bg-white shadow-lg w-80 z-50 flex flex-col"
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={slideIn}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex justify-between items-center rounded-b-lg">
                <h2
                  className="text-white font-semibold text-lg truncate"
                  title={problem?.title || 'Discussion'}
                >
                  {problem?.title ? `Discussion: ${problem.title}` : 'Discussion'}
                </h2>
                <button onClick={() => setChatOpen(false)} className="cursor-pointer text-white">
                  <X size={20} />
                </button>
              </div>

              <motion.div
                className="flex-1 p-4 overflow-y-auto space-y-4"
                initial="hidden"
                animate="show"
                variants={fadeIn}
                transition={{ delay: 0.2 }}
              >
                {chatMessages.length === 0 ? (
                  <p className="text-center text-gray-500">
                    No messages yet. Start the conversation.
                  </p>
                ) : (
                  chatMessages.map((msg, i) => {
                    const isMe = msg.userId === currentUserId;
                    return (
                      <div
                        key={msg._id || i}
                        className={`flex ${isMe ? 'justify-end pr-2' : 'justify-start pl-2'}`}
                      >
                        <motion.div
                          className={`rounded-lg p-2 text-xs max-w-[80%] ${
                            isMe
                              ? 'bg-red-500 text-white text-right'
                              : 'bg-gray-200 text-gray-800 text-left'
                          }`}
                          whileHover={{ scale: 1.02 }}
                        >
                          <p className="font-semibold mb-1">{isMe ? 'You' : 'Anonymous'}</p>
                          <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                          <span
                            className={`text-gray-600 mt-1 block ${
                              isMe ? 'text-right' : 'text-left'
                            }`}
                          >
                            {!isNaN(new Date(msg.timestamp))
                              ? format(new Date(msg.timestamp), 'h:mm a')
                              : '—'}
                          </span>
                        </motion.div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </motion.div>

              <motion.form
                onSubmit={handleSendMessage}
                className="p-4 border-t flex gap-2"
                initial="hidden"
                animate="show"
                variants={fadeIn}
                transition={{ delay: 0.4 }}
              >
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  placeholder="Type your message..."
                  className="flex-1 border rounded p-2 text-xs resize-none focus:outline-none"
                  rows="2"
                />
                <motion.button
                  type="submit"
                  disabled={!newMessage.trim()}
                  whileHover={newMessage.trim() ? { scale: 1.05 } : {}}
                  className={`bg-red-500 text-white rounded px-3 py-2 text-sm flex items-center gap-1 ${
                    !newMessage.trim() ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Send <ArrowRight size={16} />
                </motion.button>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </MainLayout>
  );
}
