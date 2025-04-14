import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SolutionCard from './SolutionCard';
import POTDCalendar from './POTDCalendar';
import MainLayout from './MainLayout';

const navLinks = [
  { name: 'LeetCode', path: '/leetcode' },
  { name: 'CodeForces', path: '/codeforces' },
  { name: 'Geeks for Geeks', path: '/gfg' },
];

// 👇 Set selectedDate once with 5:30 AM logic
const getInitialDate = () => {
  const now = new Date();
  const fiveThirty = new Date();
  fiveThirty.setHours(5, 30, 0, 0);
  return now < fiveThirty ? new Date(now.setDate(now.getDate() - 1)) : now;
};

const LeetCode = () => {
  const [selectedDate, setSelectedDate] = useState(getInitialDate);
  const [problem, setProblem] = useState(null);
  const [problemLoading, setProblemLoading] = useState(false);
  const [problemError, setProblemError] = useState(null);

  const [explanation, setExplanation] = useState(null);
  const [explanationLoading, setExplanationLoading] = useState(false);
  const [explanationError, setExplanationError] = useState(null);

  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');


  const adjustedDate = selectedDate ? new Date(selectedDate) : null;
  const dateKey = adjustedDate ? format(adjustedDate, 'yyyy-MM-dd') : null;


  useEffect(() => {
    if (!dateKey) return;
    const fetchProblem = async () => {
      setProblemLoading(true);
      setProblemError(null);
      setExplanation(null);
      try {
        const res = await fetch(`http://localhost:8080/api/ques/leetcode/potd/${dateKey}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Error fetching problem');

        if (data.data) {
          setProblem({
            title: data.data.title,
            link: data.data.link,
            problem_id: data.data.problem_id,
            difficulty: data.data.difficulty,
            topics: data.data.topics,
          });
        } else {
          setProblem(null);
        }
      } catch (err) {
        setProblemError(err.message);
        setProblem(null);
      } finally {
        setProblemLoading(false);
      }
    };
    fetchProblem();
  }, [dateKey]);

  
  useEffect(() => {
    const fetchExplanation = async () => {
      if (!problem?.title || !problem?.link) return;
      setExplanationLoading(true);
      setExplanationError(null);
      try {
        const res = await fetch('http://localhost:8080/api/ques/easy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: problem.title,
            platform: 'LeetCode',
            link: problem.link,
          }),
        });
  
        const data = await res.json();
  
        if (!res.ok) {
          throw new Error(data.message || 'Error fetching explanation');
        }
  
        setExplanation({
          easyExplanation: data.easyExplanation || 'No explanation available.',
          realLifeExample: data.RealLifeExample || '',
        });
      } catch (err) {
        setExplanationError(err.message);
      } finally {
        setExplanationLoading(false);
      }
    };
  
    fetchExplanation();
  }, [problem]);
  

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const dateMessages = messages[dateKey] || [];
    const updated = {
      ...messages,
      [dateKey]: [
        ...dateMessages,
        { text: newMessage, sender: 'user', timestamp: new Date() },
      ],
    };
    setMessages(updated);
    setNewMessage('');

    setTimeout(() => {
      const resp = updated[dateKey] || [];
      setMessages({
        ...updated,
        [dateKey]: [
          ...resp,
          {
            text: `Thanks for your message about "${problem ? problem.title : 'the problem'}". This is a simulated response.`,
            sender: 'other',
            timestamp: new Date(),
          },
        ],
      });
    }, 1000);
  };

  return (
    <MainLayout navLinks={navLinks}>
      <div className="container mx-auto py-8 px-4 max-w-screen-xl">
        <h1 className="text-3xl font-bold text-center mb-6">LeetCode Problem of the Day</h1>

        <POTDCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} platform="leetcode" />

        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Problem for {adjustedDate ? format(adjustedDate, 'MMMM d, yyyy') : 'No Date'}
          </h2>
          {problemLoading ? (
            <p>Loading problem...</p>
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
            <div
              className="p-4 bg-yellow-100 text-yellow-800 rounded cursor-help"
              title="Problem not available for this date"
            >
              Problem not available for this date.
            </div>
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
              <div className="p-4 border-b">
                <h2 className="font-bold text-lg">
                  Chat - {problem ? problem.title : 'No Problem'} ({format(adjustedDate, 'MMM d, yyyy')})
                </h2>
                <button onClick={() => setChatOpen(false)} className="text-sm text-blue-500">
                  Close
                </button>
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {!(messages[dateKey] && messages[dateKey].length) && (
                  <p className="text-center text-gray-500">No messages yet. Start a conversation!</p>
                )}
                {messages[dateKey] &&
                  messages[dateKey].map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`rounded-lg p-2 text-xs max-w-[80%] ${
                          msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <span className="text-gray-600 mt-1 block text-right">{format(msg.timestamp, 'h:mm a')}</span>
                      </div>
                    </div>
                  ))}
              </div>
              <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border rounded p-2 text-xs"
                  rows="2"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white rounded px-3 py-2 text-sm flex items-center gap-1"
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
