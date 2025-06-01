import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SocketContext } from './SocketContext';
import SolutionCard from './SolutionCard';
import POTDCalendar from './POTDCalendar';
import MainLayout from './MainLayout';
import {toast} from 'react-toastify'
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
    } catch (err) {
      navigate('/login');
    }
  })();
}, [navigate]);


  const questionId = problem?._id || null;
  

  useEffect(() => {
  if (!questionId) return;
  (async () => {
    try {
      const res = await apiRequest(`${BASE_URL}/api/chat/${questionId}`);
      const body = res.data;
      setChatMessages((body.messages || []).map(m => ({
        ...m,
        userId: String(m.userId),
      })));
    } catch (err) {
      toast.error('Error loading history:', err);
    }
  })();
}, [questionId]);


  useEffect(() => {
    const onHistory = msgs => setChatMessages(msgs.map(m => ({ ...m, userId: String(m.userId) })));
    socket.on('chatHistory', onHistory);
    return () => socket.off('chatHistory', onHistory);
  }, [socket]);

  useEffect(() => {
    const handler = msg => {
      msg.userId = String(msg.userId);
      setChatMessages(prev => prev.some(m => m._id === msg._id) ? prev : [...prev, msg]);
    };
    socket.on('chatMessage', handler);
    return () => socket.off('chatMessage', handler);
  }, [socket]);

  useEffect(() => {
    if (chatOpen && questionId && currentUserId) {
      socket.emit('joinChat', { questionId, userId: currentUserId });
    }
  }, [chatOpen, questionId, currentUserId, socket]);

  const handleSendMessage = useCallback(async e => {
  e.preventDefault();
  const text = newMessage.trim();
  if (!text || !questionId || !currentUserId) return;
  try {
    const res = await apiRequest(
      `${BASE_URL}/api/chat/${questionId}/message`,
      {
        method: 'POST',
        body: { text },
        headers: { 'Content-Type': 'application/json' },
      }
    );
    const body = res.data;
    const saved = {
      _id: body.message._id,
      questionId,
      text: body.message.text,
      userId: String(body.message.userId),
      timestamp: body.message.timestamp,
    };
    socket.emit('sendChatMessage', saved);
    setNewMessage('');
  } catch (err) {
    toast.error('Error sending message:', err);
  }
}, [newMessage, questionId, currentUserId, socket]);


useEffect(() => {
  setProblemLoading(true);
  setProblemError(null);
  const displayDate = getDisplayDate(selectedDate);
  const ds = format(displayDate, 'yyyy-MM-dd');

  apiRequest(
    `${BASE_URL}/api/ques/leetcode/potd/${encodeURIComponent(ds)}`,
    { method: 'GET' }
  )
    .then(res => setProblem(res.data?.data || null))
    .catch(e => {
      setProblemError(e.message);
      setProblem(null);
    })
    .finally(() => setProblemLoading(false));
}, [selectedDate]);




  return (
    <MainLayout navLinks={navLinks}>
      <div className="fixed top-25 left-6 bg-white/80 backdrop-blur-md shadow-md rounded-full px-4 py-2 text-sm text-gray-800 flex items-center gap-2 border border-gray-300 hover:shadow-lg transition-all duration-400 z-40 animate-pulse">
  <span className="text-blue-600 font-semibold">💡 Tip:</span>
  Click + to add question to Task or Favourites
</div>
      <motion.div
        className="container mx-auto py-8 px-4 max-w-screen-xl"
        initial="hidden"
        animate="show"
        variants={fadeIn}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-center text-3xl sm:text-3xl md:text-3xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-6"
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
          <MessageCircle size={24} className='cursor-pointer'/>
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
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-bold text-lg">
                  Chat – {problem?.title || 'No Question'} (
                  {format(selectedDate, 'MMM d, yyyy')})
                </h2>
                <button
                  onClick={() => setChatOpen(false)}
                  className="text-gray-600 hover:text-gray-800 transition"
                >
                  Close
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
                    No messages yet. Start a conversation!
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
                          <p className="font-semibold mb-1">
                            {isMe ? 'You' : 'Anonymous'}
                          </p>
                          <p>{msg.text}</p>
                          <span
                            className={`text-gray-600 mt-1 block ${isMe ? 'text-right' : 'text-left'}`}
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
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border rounded p-2 text-xs resize-none"
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
        {/* Floating helper badge in bottom right */}


      </motion.div>
    </MainLayout>
  );
}
