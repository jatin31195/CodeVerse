import React, {
  useState,
  useEffect,
  useContext,
  useCallback
} from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { SocketContext } from './SocketContext';
import SolutionCard from './SolutionCard';
import POTDCalendar from './POTDCalendar';
import MainLayout from './MainLayout';
import {toast} from 'react-toastify'
const navLinks = [
  { name: 'LeetCode', path: '/leetcode' },
  { name: 'CodeForces', path: '/codeforces' },
  { name: 'Geeks for Geeks', path: '/gfg' },
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};
const slideIn = {
  hidden: { x: 300 },
  show: { x: 0 }
};

const getCurrentUserId = async () => {
  try {
    const res = await fetch('http://localhost:8080/api/auth/profile', {
      credentials: 'include',
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data?.user?._id || null;
  } catch {
    return null;
  }
};

export default function GFG() {
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const id = await getCurrentUserId();
      setCurrentUserId(id);
    })();
  }, []);
  
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://localhost:8080/api/auth/profile', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Not authenticated');
      } catch (err) {
        navigate('/login');
      }
    })();
  }, [navigate]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [problemData, setProblemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const socket = useContext(SocketContext);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const questionId = problemData?._id || null;
  
  useEffect(() => {
    (async () => {
      const id = await getCurrentUserId();
      setCurrentUserId(id);
    })();
  }, []);
  // === Fetch GFG POTD ===
  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const ds = format(selectedDate, 'yyyy-MM-dd');
        const res = await fetch(`http://localhost:8080/api/ques/gfg/potd/${ds}`,{
          credentials:'include',
        });
        const json = await res.json();

        if (json.status !== 'success' || !json.data) {
          setProblemData(null);
        } else {
          const data = json.data;
          setProblemData({
            _id: String(data.problem_id),
            title: data.title || '',
            link: data.link || '',
            date: data.date,
            difficulty: data.difficulty || '',
            tags: data.tags || [],
            easyExplanation: data.easyExplanation || '',
            realLifeExample: data.realLifeExample || ''
          });
        }
      } catch (err) {
        toast.error('Error fetching POTD:', err);
        setProblemData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedDate]);

 
  useEffect(() => {
    if (!questionId) return;
    (async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/chat/${questionId}`, {
          credentials:'include',
        });
        const body = await res.json();
        if (!res.ok) throw new Error(body.message);
        setChatMessages(
          body.messages.map((m) => ({
            ...m,
            userId: String(m.userId)
          }))
        );
      } catch (err) {
        toast.error('Error loading chat history:', err);
      }
    })();
  }, [questionId]);


  useEffect(() => {
    const onHistory = (msgs) =>
      setChatMessages(msgs.map((m) => ({ ...m, userId: String(m.userId) })));
    socket.on('chatHistory', onHistory);
    return () => socket.off('chatHistory', onHistory);
  }, [socket]);

  useEffect(() => {
    const onMessage = (msg) => {
      msg.userId = String(msg.userId);
      setChatMessages((prev) =>
        prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]
      );
    };
    socket.on('chatMessage', onMessage);
    return () => socket.off('chatMessage', onMessage);
  }, [socket]);

  useEffect(() => {
    if (chatOpen && questionId && currentUserId) {
      socket.emit('joinChat', { questionId, userId: currentUserId });
    }
  }, [chatOpen, questionId, currentUserId, socket]);

  const handleSendMessage = useCallback(
    async (e) => {
      e.preventDefault();
      const text = newMessage.trim();
      if (!text || !questionId || !currentUserId) return;

      try {
        const res = await fetch(
          `http://localhost:8080/api/chat/${questionId}/message`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials:'include',
            body: JSON.stringify({ text })
          }
        );
        const body = await res.json();
        if (!res.ok) throw new Error(body.message);

        const saved = {
          _id: body.message._id,
          questionId,
          text: body.message.text,
          userId: String(body.message.userId),
          timestamp: body.message.timestamp
        };
        socket.emit('sendChatMessage', saved);
        setNewMessage('');
      } catch (err) {
        toast.error('Error sending message:', err);
      }
    },
    [newMessage, questionId, currentUserId, socket]
  );

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
          className="text-center text-3xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-6"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          GeeksforGeeks Problem of the Day
        </motion.h1>

        <motion.div variants={fadeIn} transition={{ delay: 0.3 }}>
          <POTDCalendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </motion.div>

        <motion.section className="mt-8" variants={fadeIn} transition={{ delay: 0.4 }}>
          {loading ? (
            <motion.p variants={fadeIn} transition={{ delay: 0.5 }}>
              Loading problem…
            </motion.p>
          ) : problemData ? (
            <>
              <h2 className="text-2xl font-semibold mb-4">
                Problem for {format(selectedDate, 'MMMM d, yyyy')}
              </h2>
              <SolutionCard
                problem={problemData}
                explanation={{
                  easyExplanation: problemData.easyExplanation,
                  realLifeExample: problemData.realLifeExample
                }}
              />
            </>
          ) : (
            <motion.div
              className="text-center py-6 text-gray-500"
              variants={fadeIn}
              transition={{ delay: 0.5 }}
            >
              No problem available for this date.
            </motion.div>
          )}
        </motion.section>

        {/* Chat Launcher */}
        <motion.button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 flex items-center justify-center shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white"
          whileHover={{ scale: 1.1 }}
        >
          <MessageCircle size={24} className='cursor-pointer'/>
        </motion.button>

        {/* Chat Panel */}
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
                  Chat – {problemData?.title || 'No Problem'} (
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
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <motion.div
                          className={`rounded-lg p-3 text-sm max-w-[75%] ${
                            isMe
                              ? 'bg-purple-600 text-white text-right'
                              : 'bg-gray-100 text-gray-900 text-left'
                          }`}
                          whileHover={{ scale: 1.02 }}
                        >
                          <p className="font-semibold mb-1">
                            {isMe ? 'You' : 'Anonymous'}
                          </p>
                          <p>{msg.text}</p>
                          <span
                            className={`block text-xs mt-1 ${
                              isMe ? 'text-gray-200' : 'text-gray-500'
                            }`}
                          >
                            {format(new Date(msg.timestamp), 'h:mm a')}
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
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border rounded p-2 text-sm resize-none"
                  rows="2"
                />
                <motion.button
                  type="submit"
                  disabled={!newMessage.trim()}
                  whileHover={newMessage.trim() ? { scale: 1.05 } : {}}
                  className={`bg-purple-600 text-white rounded px-4 py-2 flex items-center gap-1 ${
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
