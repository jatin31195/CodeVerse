
import React, {
  useState,
  useEffect,
  useContext,
  useCallback
} from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { SocketContext } from './SocketContext';
import SolutionCard from './SolutionCard';
import POTDCalendar from './POTDCalendar';
import MainLayout from './MainLayout';

const navLinks = [
  { name: 'LeetCode', path: '/leetcode' },
  { name: 'CodeForces', path: '/codeforces' },
  { name: 'Geeks for Geeks', path: '/gfg' },
];

const getCurrentUserId = () => {
  const token = sessionStorage.getItem('token');
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1])).id;
  } catch {
    return null;
  }
};

const GFG = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [problemData, setProblemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [explanation, setExplanation] = useState(null);
  const [explanationLoading, setExplanationLoading] = useState(false);
  const [explanationError, setExplanationError] = useState(null);

  
  const socket = useContext(SocketContext);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');


  const questionId = problemData?._id || null;
  const rawUserId = getCurrentUserId();
  const currentUserId = rawUserId != null ? String(rawUserId) : null;

  
  useEffect(() => {
    if (!questionId) return;
    (async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) throw new Error('No token');
        const res = await fetch(
          `http://localhost:8080/api/chat/${questionId}`,
          { headers: { Authorization: token } }
        );
        const body = await res.json();
        if (!res.ok) throw new Error(body.message);
        setChatMessages(
          (body.messages || []).map((m) => ({
            ...m,
            userId: String(m.userId),
          }))
        );
      } catch (err) {
        console.error('Error loading chat history:', err);
      }
    })();
  }, [questionId]);


  useEffect(() => {
    const onHistory = (msgs) => {
      setChatMessages(
        (msgs || []).map((m) => ({ ...m, userId: String(m.userId) }))
      );
    };
    socket.on('chatHistory', onHistory);
    return () => void socket.off('chatHistory', onHistory);
  }, [socket]);

  
  useEffect(() => {
    const onMessage = (msg) => {
      msg.userId = String(msg.userId);
      setChatMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };
    socket.on('chatMessage', onMessage);
    return () => void socket.off('chatMessage', onMessage);
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

      console.log('→ sending', { questionId, text });

      try {
        const token = sessionStorage.getItem('token');
        if (!token) throw new Error('No token');
        const res = await fetch(
          `http://localhost:8080/api/chat/${questionId}/message`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
            body: JSON.stringify({ text }),
          }
        );
        const body = await res.json();
        if (!res.ok) throw new Error(body.message || 'Failed to send');

        const savedMsg = {
          _id: body.message._id,
          questionId,
          text: body.message.text,
          userId: String(body.message.userId),
          timestamp: body.message.timestamp,
        };

        
        socket.emit('sendChatMessage', savedMsg);

        setNewMessage('');
      } catch (err) {
        console.error('Error sending message:', err);
      }
    },
    [newMessage, questionId, currentUserId, socket]
  );

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const ds = format(selectedDate, 'yyyy-MM-dd');
        const res = await fetch(
          `http://localhost:8080/api/ques/gfg/potd/${ds}`
        );
        const json = await res.json();
        if (json.status !== 'success') throw new Error(json.message);

        
        setProblemData({
          ...json.data,
          date: json.data.date?.$date || json.data.date,
        });

        setExplanation(null);
      } catch (err) {
        console.error(err);
        setProblemData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [selectedDate]);

  useEffect(() => {
    if (!problemData) return;
    (async () => {
      setExplanationLoading(true);
      try {
        const res = await fetch('http://localhost:8080/api/ques/easy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: problemData.title,
            platform: 'GeeksForGeeks',
            link: problemData.url,
          }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message);
        setExplanation({
          easyExplanation: json.easyExplanation || 'No explanation.',
          realLifeExample: json.RealLifeExample || '',
        });
      } catch (err) {
        setExplanationError(err.message);
      } finally {
        setExplanationLoading(false);
      }
    })();
  }, [problemData]);

  return (
    <MainLayout navLinks={navLinks}>
      <div className="container mx-auto py-8 px-4 max-w-screen-xl">
        <h1 className="text-3xl font-bold text-center mb-6">
          GeeksforGeeks Problem of the Day
        </h1>

        <POTDCalendar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        <div className="mt-8">
          {loading ? (
            <div>Loading...</div>
          ) : problemData ? (
            <>
              <h2 className="text-2xl font-semibold mb-4">
                Problem for {format(selectedDate, 'MMMM d, yyyy')}
              </h2>
              <SolutionCard
                problem={problemData}
                explanation={explanation}
                loading={explanationLoading}
                error={explanationError}
              />
            </>
          ) : (
            <div>No problem available for this date.</div>
          )}
        </div>

     
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 flex items-center justify-center shadow-lg bg-gradient-to-r from-blue-500 to-green-500 text-white"
        >
          <MessageCircle size={24} />
        </button>

       
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              className="fixed right-0 top-0 bottom-0 bg-white shadow-lg w-80 z-50 flex flex-col"
            >
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-bold text-lg">
                  Chat – {problemData?.title || 'No Problem'} (
                  {format(selectedDate, 'MMM d, yyyy')})
                </h2>
                <button
                  onClick={() => setChatOpen(false)}
                  className="text-sm text-blue-500"
                >
                  Close
                </button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-4">
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
                        className={`flex ${
                          isMe ? 'justify-end pr-2' : 'justify-start pl-2'
                        }`}
                      >
                        <div
                          className={`rounded-lg p-2 text-xs max-w-[80%] ${
                            isMe
                              ? 'bg-blue-500 text-white text-right'
                              : 'bg-gray-200 text-gray-800 text-left'
                          }`}
                        >
                          <p className="font-semibold mb-1">
                            {isMe ? 'You' : msg.userId}
                          </p>
                          <p>{msg.text}</p>
                          <span
                            className={`text-gray-600 mt-1 block ${
                              isMe ? 'text-right' : 'text-left'
                            }`}
                          >
                            {format(new Date(msg.timestamp), 'h:mm a')}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t flex gap-2"
              >
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border rounded p-2 text-xs resize-none"
                  rows="2"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className={`bg-blue-500 text-white rounded px-3 py-2 text-sm flex items-center gap-1 ${
                    !newMessage.trim() ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Send <ArrowRight size={16} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
};

export default GFG;
