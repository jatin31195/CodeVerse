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

const Codeforces = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [question, setQuestion] = useState(null);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [questionError, setQuestionError] = useState(null);

  
  const [explanation, setExplanation] = useState(null);
  const [explanationLoading, setExplanationLoading] = useState(false);
  const [explanationError, setExplanationError] = useState(null);

  
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');

  
  const dateKey = format(selectedDate, 'yyyy-MM-dd');

  
  useEffect(() => {
    const fetchQuestion = async () => {
      setQuestionLoading(true);
      setQuestionError(null);
      setExplanation(null);
      try {
        const res = await fetch(`http://localhost:8080/api/ques/codeforces/potd/${dateKey}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Error fetching question');
        }

        
        if (data.questions && data.questions.length > 0) {
          setQuestion(data.questions[0]);
        } else {
          setQuestion(null);
        }
      } catch (err) {
        setQuestion(null);
        setQuestionError(err.message);
      } finally {
        setQuestionLoading(false);
      }
    };

    fetchQuestion();
  }, [dateKey]);

 
  useEffect(() => {
    const fetchExplanation = async () => {
      if (!question || !question._id) return;
      setExplanationLoading(true);
      setExplanationError(null);
      try {
        const res = await fetch('http://localhost:8080/api/ques/easy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questionId: question._id }),
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
  }, [question]);

  
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
            text: `Thanks for your message about "${question ? question.title : 'the problem'}". This is a simulated response.`,
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
        <h1 className="text-3xl font-bold text-center mb-6">
          Codeforces Problem of the Day
        </h1>

        
        <POTDCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />

        
        <div>
          {question ? (
            <h2
              className="text-2xl font-semibold mb-4 cursor-pointer text-blue-600 hover:underline"
              onClick={() => window.open(question.link, '_blank')}
              title="Click to open the problem link"
            >
              Problem for {format(selectedDate, 'MMMM d, yyyy')}
            </h2>
          ) : (
            <h2 className="text-2xl font-semibold mb-4">
              Problem for {format(selectedDate, 'MMMM d, yyyy')}
            </h2>
          )}

          {questionLoading && <p>Loading question...</p>}
          {questionError && (
            <p className="text-red-500">Error: {questionError}</p>
          )}
          {!questionLoading && !question && !questionError && (
            <div
              className="p-4 bg-yellow-100 text-yellow-800 rounded cursor-help"
              title="Question not available"
            >
              Question not available for this date.
            </div>
          )}

          
          {question && (
            <>
              <SolutionCard problem={question} explanation={explanation} />


             
              
            </>
          )}
        </div>

       
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
              <div className="p-4 border-b">
                <h2 className="font-bold text-lg">
                  Chat - {question ? question.title : 'No Question'} (
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
                {!(messages[dateKey] && messages[dateKey].length) && (
                  <p className="text-center text-gray-500">
                    No messages yet. Start a conversation!
                  </p>
                )}
                {messages[dateKey] &&
                  messages[dateKey].map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${
                        msg.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`rounded-lg p-2 text-xs max-w-[80%] ${
                          msg.sender === 'user'
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-200 text-gray-800'
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
                  className="bg-red-500 text-white rounded px-3 py-2 text-sm flex items-center gap-1"
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

export default Codeforces;
