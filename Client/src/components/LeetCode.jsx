import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SocketContext } from './SocketContext';
import SolutionCard from './SolutionCard';
import POTDCalendar from './POTDCalendar';
import MainLayout from './MainLayout';

const navLinks = [
  { name: 'LeetCode', path: '/leetcode' },
  { name: 'CodeForces', path: '/codeforces' },
  { name: 'Geeks for Geeks', path: '/gfg' },
];

// animation variants
const fadeIn = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const slideIn = { hidden: { x: 300 }, show: { x: 0 } };

const getInitialDate = () => new Date();
const getCurrentUserId = () => {
  const token = sessionStorage.getItem('token');
  if (!token) return null;
  try { return JSON.parse(atob(token.split('.')[1])).id; }
  catch { return null; }
};

export default function LeetCode() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(getInitialDate());
  const [problem, setProblem] = useState(null);
  const [problemLoading, setProblemLoading] = useState(false);
  const [problemError, setProblemError] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [explanationLoading, setExplanationLoading] = useState(false);
  const [explanationError, setExplanationError] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socket = useContext(SocketContext);

  // redirect if not auth
  useEffect(() => {
    if (!sessionStorage.getItem('token')) navigate('/login');
  }, [navigate]);

  const questionId = problem?._id || null;
  const rawUserId = getCurrentUserId();
  const currentUserId = rawUserId != null ? String(rawUserId) : null;

  // load chat history
  useEffect(() => {
    if (!questionId) return;
    (async () => {
      try {
        const token = sessionStorage.getItem('token');
        const res = await fetch(`http://localhost:8080/api/chat/${questionId}`, {
          headers: { Authorization: token },
        });
        const body = await res.json();
        if (!res.ok) throw new Error(body.message);
        setChatMessages((body.messages || []).map(m => ({
          ...m, userId: String(m.userId)
        })));
      } catch (err) {
        console.error('Error loading history:', err);
      }
    })();
  }, [questionId]);

  // socket listeners
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

  // join socket room
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
      const token = sessionStorage.getItem('token');
      const res = await fetch(
        `http://localhost:8080/api/chat/${questionId}/message`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: token },
          body: JSON.stringify({ text }),
        }
      );
      const body = await res.json();
      if (!res.ok) throw new Error(body.message);
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
      console.error('Error sending message:', err);
    }
  }, [newMessage, questionId, currentUserId, socket]);

  // fetch problem of the day
  useEffect(() => {
    setProblemLoading(true);
    setProblemError(null);
    setExplanation(null);
    const ds = format(selectedDate, 'yyyy-MM-dd');
    fetch(`http://localhost:8080/api/ques/leetcode/potd/today/${encodeURIComponent(ds)}`)
      .then(r => r.json().then(data => {
        if (!r.ok) throw new Error(data.message || 'Fetch failed');
        return data.data;
      }))
      .then(q => setProblem(q || null))
      .catch(e => { setProblemError(e.message); setProblem(null); })
      .finally(() => setProblemLoading(false));
  }, [selectedDate]);

  // fetch explanation
  useEffect(() => {
    if (!problem) return;
    setExplanationLoading(true);
    setExplanationError(null);
    fetch('http://localhost:8080/api/ques/easy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: problem.title,
        platform: 'LeetCode',
        link: problem.link,
      }),
    })
      .then(r => r.json().then(data => {
        if (!r.ok) throw new Error(data.message || 'Fetch failed');
        return data;
      }))
      .then(data => setExplanation({
        easyExplanation: data.easyExplanation || 'No explanation.',
        realLifeExample: data.RealLifeExample || ''
      }))
      .catch(e => setExplanationError(e.message))
      .finally(() => setExplanationLoading(false));
  }, [problem]);

  return (
    <MainLayout navLinks={navLinks}>
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

        <motion.div
          variants={fadeIn}
          transition={{ delay: 0.3 }}
        >
          <POTDCalendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            platform="leetcode"
          />
        </motion.div>

        <motion.section
          className="mb-8"
          variants={fadeIn}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold mb-4">
            Problem for {format(selectedDate, 'MMMM d, yyyy')}
          </h2>
          {problemLoading ? (
            <motion.p
              variants={fadeIn}
              transition={{ delay: 0.5 }}
            >
              Loading problem…
            </motion.p>
          ) : problemError ? (
            <motion.p
              className="text-red-500"
              variants={fadeIn}
              transition={{ delay: 0.5 }}
            >
              Error: {problemError}
            </motion.p>
          ) : problem ? (
            <motion.div
              variants={fadeIn}
              transition={{ delay: 0.5 }}
            >
              <SolutionCard
                problem={problem}
                explanation={explanation}
                explanationLoading={explanationLoading}
                explanationError={explanationError}
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
                            {isMe ? 'You' : msg.userId}
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
      </motion.div>
    </MainLayout>
  );
}
