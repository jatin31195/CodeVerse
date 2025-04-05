import React, { useState } from 'react';
import { format } from 'date-fns';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SolutionCard from './SolutionCard';
import POTDCalendar from './POTDCalendar';
import Sidebar from './Sidebar';
import Navbar from './Navbar'
const LeetCode = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');

  const getProblemForDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth();
    const problemIndex = (day + month) % 5;
    const problems = [
      {
        id: "leetcode-1",
        title: "Two Sum",
        platform: "leetcode",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/two-sum/",
        date: format(date, 'MMMM d, yyyy')
      },
      {
        id: "leetcode-2",
        title: "Add Two Numbers",
        platform: "leetcode",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/add-two-numbers/",
        date: format(date, 'MMMM d, yyyy')
      },
      {
        id: "leetcode-3",
        title: "Longest Substring Without Repeating Characters",
        platform: "leetcode",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
        date: format(date, 'MMMM d, yyyy')
      },
      {
        id: "leetcode-4",
        title: "Median of Two Sorted Arrays",
        platform: "leetcode",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
        date: format(date, 'MMMM d, yyyy')
      },
      {
        id: "leetcode-5",
        title: "Longest Palindromic Substring",
        platform: "leetcode",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/longest-palindromic-substring/",
        date: format(date, 'MMMM d, yyyy')
      }
    ];
    return problems[problemIndex];
  };

  const problem = getProblemForDate(selectedDate);
  const dateKey = format(selectedDate, 'yyyy-MM-dd');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const dateMessages = messages[dateKey] || [];
    const updated = {
      ...messages,
      [dateKey]: [
        ...dateMessages,
        { text: newMessage, sender: 'user', timestamp: new Date() }
      ]
    };
    setMessages(updated);
    setNewMessage('');
    setTimeout(() => {
      const resp = updated[dateKey] || [];
      setMessages({
        ...updated,
        [dateKey]: [
          ...resp,
          { text: `Thanks for your message about "${problem.title}". This is a simulated response.`, sender: 'other', timestamp: new Date() }
        ]
      });
    }, 1000);
  };

  return (
    <>
    <Navbar/>
    <div className="container mx-auto py-8 px-4 max-w-screen-xl">
      <h1 className="text-3xl font-bold text-center mb-6">LeetCode Problem of the Day</h1>
      
     <POTDCalendar/>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Problem for {format(selectedDate, 'MMMM d, yyyy')}</h2>
        <SolutionCard problem={problem} />
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
              <h2 className="font-bold text-lg">Chat - {problem.title} ({format(selectedDate, 'MMM d, yyyy')})</h2>
              <button onClick={() => setChatOpen(false)} className="text-sm text-blue-500">Close</button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {!(messages[dateKey] && messages[dateKey].length) && (
                <p className="text-center text-gray-500">No messages yet. Start a conversation!</p>
              )}
              {messages[dateKey] && messages[dateKey].map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`rounded-lg p-2 text-xs max-w-[80%] ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
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
              <button type="submit" className="bg-blue-500 text-white rounded px-3 py-2 text-sm flex items-center gap-1">
                Send <ArrowRight size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
};

export default LeetCode;
