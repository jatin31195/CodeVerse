import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Star,
  MessageSquare,
  TrendingUp,
  Calendar,
  Trophy,
  PanelRight,
  X,
  LayoutPanelLeft,
  LogOut
} from 'lucide-react';
import Sidebar from './Sidebar';
import GoalsPanel from './GoalsPanel';

export const PLATFORM_CONFIG = {
  leetcode: {
    label: 'LeetCode',
    color: 'border-yellow-400',
    badge: 'bg-yellow-100 text-yellow-800',
  },
  gfg: {
    label: 'GeeksForGeeks',
    color: 'border-green-500',
    badge: 'bg-green-100 text-green-800',
  },
  codeforces: {
    label: 'Codeforces',
    color: 'border-blue-500',
    badge: 'bg-blue-100 text-blue-800',
  },
};


const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
const cardHover = {
  hover: { scale: 1.02, y: -4, boxShadow: '0px 10px 20px rgba(0,0,0,0.1)' },
};

const ProblemCard = ({ title, description, platform, link }) => {
  const config = PLATFORM_CONFIG[platform];
  return (
    <motion.div
      variants={cardHover}
      whileHover="hover"
      initial="hidden"
      animate="visible"
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`
        rounded-2xl p-6 border-t-4 transition-all duration-200
        ${config.color} bg-white shadow-lg
      `}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex space-x-2 text-xs font-semibold uppercase tracking-wide">
          <span className={`px-2 py-1 rounded-full ${config.badge}`}>
            {config.label}
          </span>
        </div>
      </div>
      <h3 className="text-xl font-bold leading-tight mb-3">{title}</h3>
      <p className="text-sm text-gray-600 mb-5 line-clamp-3">{description}</p>
      <div className="flex justify-between items-center mt-auto">
        <div className="flex items-center text-sm text-gray-500">
          <MessageSquare className="h-4 w-4 mr-1" />
          Discussions
        </div>
        <a href={link} target="_blank" rel="noopener noreferrer">
          <button className="
            px-5 py-2 rounded-full border border-blue-600
            font-medium text-blue-600
            transition-all duration-200 ease-in-out
            hover:bg-blue-600 hover:text-white
          ">
            Solve
          </button>
        </a>
      </div>
    </motion.div>
  );
};

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [leetProblem, setLeetProblem] = useState(null);
  
  const handleLogout = () => {
    sessionStorage.removeItem('token');
    setUser(null);
    setShowUserMenu(false);
    navigate('/login');
  };

  useEffect(() => {
  const token = sessionStorage.getItem('token');
  if (!token) return;

  fetch('http://localhost:8080/api/auth/profile', {
    headers: {
      'Authorization': token,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error('Not authenticated');
      return res.json();
    })
    .then((json) => {
      setUser(json.data.user);
      console.log('Fetched user:', json.data.user);
    })
    .catch((err) => {
      console.error('Authentication error:', err);
      sessionStorage.removeItem('token');
      setUser(null);
    });
}, []);
   const getInitials = (name) =>
    name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  
  useEffect(() => {
    const now = new Date();
    const istOffset = 5 * 60 + 30;
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const ist = new Date(utc + istOffset * 60000);
    const target = new Date(ist);
    if (ist.getHours() < 5 || (ist.getHours() === 5 && ist.getMinutes() < 30)) {
      target.setDate(target.getDate() - 1);
    }
    const yyyy = target.getFullYear();
    const mm = String(target.getMonth() + 1).padStart(2, '0');
    const dd = String(target.getDate()).padStart(2, '0');
    const dateKey = `${yyyy}-${mm}-${dd}`;
    const url = `http://localhost:8080/api/ques/leetcode/potd/${encodeURIComponent(dateKey)}`;
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(json => {
        if (json.status === 'success' && json.data) {
          setLeetProblem(json.data);
        }
      })
      .catch(console.error);
  }, []);

  const problems = {
    leetcode: {
      title: "Maximum Subarray",
      description: "Find the contiguous subarray with the largest sum.",
      platform: "leetcode",
      link: "#"
    },
    gfg: {
      title: "Merge Without Extra Space",
      description: "Merge two sorted arrays without extra space.",
      platform: "gfg",
      link: "#"
    },
    codeforces: {
      title: "K-th Beautiful String",
      description: "Find the k-th lexicographically smallest beautiful string.",
      platform: "codeforces",
      link: "#"
    }
  };

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-20">
            <motion.div
              className="absolute inset-0 bg-black opacity-50"
              onClick={toggleSidebar}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl z-30"
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ duration: 0.3 }}
            >
              <Sidebar toggleSidebar={toggleSidebar} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <header className="sticky top-0 z-10 bg-white px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between shadow-md">
  
  <button
    onClick={toggleSidebar}
    aria-label="Open Sidebar"
    className="cursor-pointer group flex flex-col items-center p-2 rounded-md hover:bg-gray-100"
  >
    <PanelRight className="h-6 w-6 text-gray-700" />
    <span className="cursor-pointer mt-1 text-xs text-gray-500 group-hover:text-purple-600">
      Open Sidebar
    </span>
  </button>

 
  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Link to="/home" className="flex-shrink-0">
          <img
            src="/codelogo1.png"
            alt="CodeVerse"
            className="h-12 w-auto"
          />
        </Link>
      </div>

  
  {user && (
                <div className="relative ml-3">
                  <button
                    onClick={() => setShowUserMenu((prev) => !prev)}
                    className="w-12 h-12 cursor-pointer rounded-full border-3 border-blue-500 hover:border-green-400  transition overflow-hidden flex items-center justify-center bg-gray-100"
                  >
                    {user.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt={user.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-lg font-semibold text-black">
                        {getInitials(user.username)}
                      </span>
                    )}
                  </button>
  
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden z-50"
                      >
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            toggleSidebar();
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm"
                        >
                          <LayoutPanelLeft className="w-4 h-4" />
                          Open Sidebar
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm text-red-600"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
</header>


      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUpVariant}
        transition={{ staggerChildren: 0.1 }}
        className="space-y-16"
      >
        <motion.section
          variants={fadeUpVariant}
          transition={{ duration: 0.6 }}
          className="relative bg-gray-50 p-6 sm:p-12 rounded-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-noise opacity-20"></div>
          <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-3/5 space-y-6">
              <span className="inline-flex items-center gap-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md uppercase tracking-widest shadow-md">
                Daily Coding Problems
              </span>
              <motion.h1
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="overflow-hidden text-5xl sm:text-6xl font-extrabold leading-tight"
              >
                Elevate Your Coding Skills
              </motion.h1>
              <p className="text-xl text-gray-600 max-w-md">
                Master algorithms and data structures with our curated daily problems.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/potd" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg">
                  Get Started <ArrowRight className="h-5 w-5" />
                </Link>
                <Link to="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white">
                  Explore Dashboard <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>

            <div className="relative w-full lg:w-1/2">
              <div className="absolute -inset-4 bg-black/5 rounded-3xl transform rotate-3" />
              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-400 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                    <div className="w-3 h-3 bg-green-400 rounded-full" />
                  </div>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">Today's Problem</span>
                </div>

                {leetProblem ? (
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="px-2 py-1 bg-yellow-50 text-yellow-600 rounded border">
                        LeetCode
                      </span>
                    </div>

                    <h3 className="text-lg font-bold mb-2">{leetProblem.title}</h3>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-xs text-gray-500">Time Complexity</p>
                        <p className="text-sm font-medium">{leetProblem.timeComplexity || 'O(n)'}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-xs text-gray-500">Space Complexity</p>
                        <p className="text-sm font-medium">{leetProblem.spaceComplexity || 'O(1)'}</p>
                      </div>
                    </div>

                    <h4 className="font-semibold mb-2">Real‑Life Example</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4">
                      {leetProblem.realLifeExample.split('\n').map((line, i) =>
                        line.trim() ? <li key={i}>{line.trim()}</li> : null
                      )}
                    </ul>

                    <div className="flex justify-between items-center">
                      <MessageSquare className="h-4 w-4 text-gray-500" />
                      <a href={leetProblem.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1 bg-black text-white rounded text-sm hover:shadow-lg">
                        Solve Now <ArrowRight className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500">Loading problem…</div>
                )}
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section variants={fadeUpVariant} transition={{ duration: 0.6 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GoalsPanel />
        </motion.section>

        <motion.section variants={fadeUpVariant} transition={{ duration: 0.6 }} className="py-16 bg-white">
          <div className="text-center max-w-7xl mx-auto mb-12">
            <h2 className="text-4xl font-semibold mb-2">Problems from Top Platforms</h2>
            <p className="text-gray-600">Daily challenges from industry-recognized platforms.</p>
          </div>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-8">
            <ProblemCard {...problems.leetcode} />
            <ProblemCard {...problems.gfg} />
            <ProblemCard {...problems.codeforces} />
          </div>
        </motion.section>

        <motion.section variants={fadeUpVariant} transition={{ duration: 0.6 }} className="py-16 bg-gray-50">
          <div className="text-center max-w-7xl mx-auto mb-12 px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-4">Simple Steps to Improve Your Coding Skills</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Following a structured approach to tackle daily problems effectively
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {[
              { number: "01", title: "Solve Daily", description: "Tackle curated problems from top platforms every day", icon: Calendar },
              { number: "02", title: "Track Progress", description: "Monitor your improvement with detailed statistics", icon: TrendingUp },
              { number: "03", title: "Join Discussions", description: "Participate in community discussions about solutions", icon: MessageSquare },
              { number: "04", title: "Build Streaks", description: "Maintain consistency and build solid coding habits", icon: Trophy }
            ].map((item, idx) => (
              <motion.div key={idx} variants={cardHover} whileHover="hover" className="relative bg-white rounded-2xl shadow-lg p-6">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">
                  {item.number}
                </div>
                <div className="w-12 h-12 mb-4 bg-gray-100 rounded-xl flex items-center justify-center">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section variants={fadeUpVariant} transition={{ duration: 0.6 }} className="py-16 bg-white">
          <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md uppercase tracking-wide mb-8">
                Features
              </span>
              <h2 className="text-4xl font-bold mb-6">Why Use CodeVerse?</h2>
              <p className="text-xl text-gray-600 mb-8">
                CodeVerse offers a comprehensive solution to help you master coding challenges and ace technical interviews.
              </p>
              <div className="space-y-6">
                {[
                  { title: "Track Your Progress", description: "Visualize your improvement over time with detailed statistics.", icon: TrendingUp },
                  { title: "Join Discussions",  description: "Share your solution approach and learn from others.", icon: MessageSquare },
                  { title: "Create Favorites",   description: "Save interesting problems for future practice.", icon: Star }
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <motion.div variants={cardHover} whileHover="hover" className="relative bg-white rounded-2xl shadow-xl p-6">
              <div className="absolute -inset-4 bg-black/5 rounded-3xl transform -rotate-2" />
              <div className="relative">
                <div className="flex justify-between items-center p-4 border-b">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-400 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                    <div className="w-3 h-3 bg-green-400 rounded-full" />
                  </div>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">Dashboard Analytics</span>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Solved", value: "124", diff: "↑ 8% this week", bg: "bg-blue-50", color: "text-green-600" },
                      { label: "Streak", value: "16", diff: "↑ 2 days", bg: "bg-green-50", color: "text-green-600" },
                      { label: "Rank", value: "#215", diff: "↑ 23 spots", bg: "bg-purple-50", color: "text-green-600" }
                    ].map((stat, i) => (
                      <div key={i} className={`${stat.bg} p-3 rounded-xl text-center`}>
                        <h4 className="text-xs text-gray-500 mb-1">{stat.label}</h4>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className={`text-xs ${stat.color}`}>{stat.diff}</p>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Recent Activity</h4>
                    <div className="space-y-3">
                      {[
                        { text: "Solved 'Maximum Subarray'", time: "2h ago" },
                        { text: "Commented on 'Dynamic Programming Approach'", time: "4h ago" },
                        { text: "Added 'Binary Tree Traversal' to favorites", time: "1d ago" }
                      ].map((act, i) => (
                        <div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <p className="text-xs font-medium">{act.text}</p>
                          <span className="text-xs text-gray-500">{act.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        
        <motion.section variants={fadeUpVariant} transition={{ duration: 0.6 }} className="py-16 bg-black text-white text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-6">Ready to level up your coding skills?</h2>
            <p className="text-xl mb-10 text-gray-300">
              Join thousands of developers who solve daily coding challenges and prepare for technical interviews.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/potd" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-semibold hover:shadow-lg">
                Start Solving <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white text-white rounded-full hover:bg-white hover:text-black">
                Explore Dashboard <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </>
  );
};

export default Home;
