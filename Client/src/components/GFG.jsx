import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ArrowRight } from 'lucide-react';
import SolutionCard from './SolutionCard';
import POTDCalendar from './POTDCalendar';
import Navbar from './Navbar';
import MainLayout from './MainLayout';

const navLinks = [
  { name: 'LeetCode', path: '/leetcode' },
  { name: 'CodeForces', path: '/codeforces' },
  { name: 'Geeks for Geeks', path: '/gfg' },
];

const GFG = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [problemData, setProblemData] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [explanationLoading, setExplanationLoading] = useState(false);
const [explanationError, setExplanationError] = useState(null);

  const [loading, setLoading] = useState(true);

  
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');

 
  const dateKey = format(selectedDate, 'yyyy-MM-dd');

  
  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const dateParam = format(selectedDate, 'yyyy-MM-dd');
        const response = await fetch(
          `http://localhost:8080/api/ques/gfg/potd/${dateParam}`
        );
        const json = await response.json();
        if (json.status === 'success') {
          const data = json.data;
          const mappedProblem = {
            id: data.id,
            title: data.problem_name,
            url: data.problem_url,
            difficulty: data.difficulty,
            tags: data.tags,
            remaining_time: data.remaining_time,
            accuracy: data.accuracy,
            total_submissions: data.total_submissions,
            is_solved: data.is_solved,
          };
          setProblemData(mappedProblem);
          
          setExplanation(null);
        } else {
          console.error('API responded with an error:', json);
        }
      } catch (error) {
        console.error('Error fetching problem:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [selectedDate]);

  
  useEffect(() => {
    const fetchExplanation = async () => {
      if (!problemData) return;
      setExplanationLoading(true);
      setExplanationError(null);
      try {
        const res = await fetch('http://localhost:8080/api/ques/easy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: problemData.title,
            platform: 'GeeksForGeeks',
            link: problemData.url,
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
  }, [problemData]);
  

  
  const onExplanationClick = () => {
    if (problemData) {
      console.log("onExplanationClick triggered for:", problemData.title);
      fetchSolutionExplanation(problemData);
    }
  };


  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const timestamp = new Date();
    const newMsg = { text: newMessage, sender: 'user', timestamp };

    setMessages(prev => {
      const prevMessages = prev[dateKey] || [];
      return { ...prev, [dateKey]: [...prevMessages, newMsg] };
    });

    setNewMessage('');
  };

  return (
    <MainLayout navLinks={navLinks}>
      <div className="container mx-auto py-8 px-4 max-w-screen-xl">
        <h1 className="text-3xl font-bold text-center mb-6">
          GeeksforGeeks Problem of the Day
        </h1>
        <POTDCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
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
                  Chat - {problemData ? problemData.title : 'No Problem'} ({format(selectedDate, 'MMM d, yyyy')})
                </h2>
                <button onClick={() => setChatOpen(false)} className="text-sm text-blue-500">
                  Close
                </button>
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {!(messages[dateKey] && messages[dateKey].length) && (
                  <p className="text-center text-gray-500">
                    No messages yet. Start a conversation!
                  </p>
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
                        <span className="text-gray-600 mt-1 block text-right">
                          {format(msg.timestamp, 'h:mm a')}
                        </span>
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

export default GFG;
