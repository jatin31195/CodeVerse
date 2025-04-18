// src/LeetCode.jsx
import React, { useState, useEffect, useContext, useCallback } from 'react';
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

const getInitialDate = () => new Date();

const getCurrentUserId = () => {
  const token = sessionStorage.getItem('token');
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1])).id;
  } catch {
    return null;
  }
};

const LeetCode = () => {
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
  const questionId = problem?._id || null;
  const rawUserId = getCurrentUserId();
  const currentUserId = rawUserId != null ? String(rawUserId) : null;

  
  useEffect(() => {
    if (!questionId) return;
    (async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) throw new Error('No token');
        const res = await fetch(`http://localhost:8080/api/chat/${questionId}`, {
          headers: { Authorization: token },
        });
        const body = await res.json();
        if (!res.ok) throw new Error(body.message);
        setChatMessages(
          (body.messages || []).map(m => ({
            ...m,
            userId: String(m.userId),
          }))
        );
      } catch (err) {
        console.error('Error loading history:', err);
      }
    })();
  }, [questionId]);

 
  useEffect(() => {
    const onHistory = msgs => {
      
      setChatMessages(
        (msgs || []).map(m => ({ ...m, userId: String(m.userId) }))
      );
    };
    
    socket.on('chatHistory', onHistory);
    return () => {
      socket.off('chatHistory', onHistory);
    };
  }, [socket]);

  
  useEffect(() => {
    const handleChatMessage = msg => {
      msg.userId = String(msg.userId);
      setChatMessages(prev => {
        if (prev.some(m => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };
    socket.on('chatMessage', handleChatMessage);
    return () => {
      socket.off('chatMessage', handleChatMessage);
    };
  }, [socket]);

  
  useEffect(() => {
    if (chatOpen && questionId && currentUserId) {
      socket.emit('joinChat', { questionId, userId: currentUserId });
    }
  }, [chatOpen, questionId, currentUserId, socket]);

  
  const handleSendMessage = useCallback(
    async e => {
      e.preventDefault();
      const text = newMessage.trim();
      if (!text || !questionId || !currentUserId) return;

      try {
        const token = sessionStorage.getItem('token');
        if (!token) throw new Error('No token found');

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
        console.error('Error sending message:', err.message);
      }
    },
    [newMessage, questionId, currentUserId, socket]
  );

  
  useEffect(() => {
    setProblemLoading(true);
    setProblemError(null);
    setExplanation(null);
    const ds = format(selectedDate, 'yyyy-MM-dd');
    fetch(
      `http://localhost:8080/api/ques/leetcode/potd/today/${encodeURIComponent(
        ds
      )}`
    )
      .then(r =>
        r.json().then(data => {
          if (!r.ok) throw new Error(data.message || 'Fetch failed');
          return data.data;
        })
      )
      .then(q => setProblem(q || null))
      .catch(e => {
        setProblemError(e.message);
        setProblem(null);
      })
      .finally(() => setProblemLoading(false));
  }, [selectedDate]);

 
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
      .then(r =>
        r.json().then(data => {
          if (!r.ok) throw new Error(data.message || 'Fetch failed');
          return data;
        })
      )
      .then(data =>
        setExplanation({
          easyExplanation: data.easyExplanation || 'No explanation.',
          realLifeExample: data.RealLifeExample || '',
        })
      )
      .catch(e => setExplanationError(e.message))
      .finally(() => setExplanationLoading(false));
  }, [problem]);

  return (
    <MainLayout navLinks={navLinks}>
      <div className="container mx-auto py-8 px-4 max-w-screen-xl">
        <h1 className="text-3xl font-bold text-center mb-6">
          LeetCode POTD
        </h1>

        <POTDCalendar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          platform="leetcode"
        />

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Problem for {format(selectedDate, 'MMMM d, yyyy')}
          </h2>
          {problemLoading ? (
            <p>Loading problem…</p>
          ) : problemError ? (
            <p className="text-red-500">Error: {problemError}</p>
          ) : problem ? (
            <SolutionCard
              problem={problem}
              explanation={explanation}
              explanationLoading={explanationLoading}
              explanationError={explanationError}
            />
          ) : (
            <div className="p-4 bg-yellow-100 text-yellow-800 rounded">
              No problem available.
            </div>
          )}
        </section>

        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 flex items-center justify-center shadow-lg bg-gradient-to-r from-red-500 to-yellow-500 text-white"
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
                  Chat – {problem?.title || 'No Question'} (
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
                              ? 'bg-red-500 text-white text-right'
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
                            {!isNaN(new Date(msg.timestamp))
                              ? format(new Date(msg.timestamp), 'h:mm a')
                              : '—'}
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
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border rounded p-2 text-xs resize-none"
                  rows="2"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className={`bg-red-500 text-white rounded px-3 py-2 text-sm flex items-center gap-1 ${
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

export default LeetCode;
