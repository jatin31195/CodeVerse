import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Star, MessageSquare, TrendingUp,
  Calendar, Trophy, PanelRight
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

// 🔑 **Variants**: Reusable fade-up animation for consistency
const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// 🔑 **Hover Lift**: Card hover effect variant
const cardHover = {
  hover: { scale: 1.02, y: -4, boxShadow: '0px 10px 20px rgba(0,0,0,0.1)' },
};

const ProblemCard = ({ title, description, platform, difficulty, link }) => {
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

  const problems = {
    leetcode: {
      title: "Maximum Subarray",
      description: "Find the contiguous subarray with the largest sum.",
      platform: "leetcode",
      difficulty: "medium",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      discussionCount: 243,
      link: "#"
    },
    gfg: {
      title: "Merge Without Extra Space",
      description: "Merge two sorted arrays without extra space.",
      platform: "gfg",
      difficulty: "hard",
      timeComplexity: "O((n+m)log(n+m))",
      spaceComplexity: "O(1)",
      discussionCount: 152,
      link: "#"
    },
    codeforces: {
      title: "K-th Beautiful String",
      description: "Find the k-th lexicographically smallest beautiful string.",
      platform: "codeforces",
      difficulty: "easy",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      discussionCount: 87,
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
    aria-label="Open Features"
    className="
      group flex flex-col items-center p-2
      rounded-md transition-all duration-150
      hover:bg-gray-100
    "
  >
    <PanelRight className="h-6 w-6 text-gray-700" />
    <span className="
      mt-1 text-xs text-gray-500
      group-hover:text-purple-600
      select-none
    ">
      Open Sidebar
    </span>
  </button>
  <h1 className="text-xl font-bold">CodeVerse</h1>
  <div />
</header>


      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUpVariant}
        transition={{ staggerChildren: 0.1 }}
        className="space-y-16"
      >
        {/* 🔑 **Hero Section** */}
        <motion.section
  variants={fadeUpVariant}
  transition={{ duration: 0.6 }}
  className="relative bg-gray-50 overflow-hidden p-6 sm:p-12 rounded-2xl"
>
  <div className="absolute inset-0 bg-noise opacity-20"></div>
  <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
    {/* Text Block */}
    <div className="space-y-6 w-full lg:w-3/5">
      <span className="
        inline-flex items-center gap-2 text-sm font-medium
        bg-gradient-to-r from-blue-600 to-purple-600 text-white
        px-4 py-2 rounded-md uppercase tracking-widest
        shadow-md transition-all duration-200
      ">
        Daily Coding Problems
      </span>

      {/* ✍️ Two-line typing animation */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="relative overflow-hidden text-5xl sm:text-6xl font-extrabold leading-tight"
      >
        <div className="h-[1.2em] overflow-hidden">
          <motion.span
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 1.0, duration: 1.5, ease: 'easeInOut' }}
            className="inline-block whitespace-nowrap"
          >
            Elevate Your{' '}
            <span className="relative inline-block">
              <span className="relative z-10">Coding</span>
              <span className="absolute bottom-0 left-0 w-full h-2 bg-yellow-300 -z-10"></span>
            </span>
          </motion.span>
        </div>
        <div className="h-[1.2em] overflow-hidden">
          <motion.span
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 1.8, duration: 1.2, ease: 'easeInOut' }}
            className="inline-block whitespace-nowrap"
          >
            Skills
          </motion.span>
        </div>
      </motion.h1>

      <p className="text-xl text-gray-600 max-w-md">
        Master algorithms and data structures with our curated daily problems.
      </p>

      <div className="flex flex-wrap gap-4">
        <Link
          to="/potd"
          className="
            inline-flex items-center gap-2 px-6 py-3
            bg-gradient-to-r from-blue-600 to-purple-600
            text-white rounded-full font-semibold
            transition-all duration-200 ease-in-out
            hover:shadow-lg
          "
        >
          Get Started <ArrowRight className="h-5 w-5" />
        </Link>
        <Link
          to="/dashboard"
          className="
            inline-flex items-center gap-2 px-6 py-3
            border-2 border-blue-600 text-blue-600
            rounded-full font-semibold
            transition-all duration-200 ease-in-out
            hover:bg-blue-600 hover:text-white
          "
        >
          Explore Dashboard
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex -space-x-2">
          {['J','A','B','G'].map(char => (
            <div
              key={char}
              className="
                w-8 h-8 bg-gray-300 rounded-full
                border-2 border-white flex items-center
                justify-center text-xs font-medium
              "
            >
              {char}
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Many</span> of your friends are solving problems daily
        </p>
      </div>
    </div>

    {/* Code Preview Block */}
    <div className="relative w-full lg:w-1/2">
      <div className="absolute -inset-4 bg-black/5 rounded-3xl transform rotate-3" />
      <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">Today's Problem</span>
        </div>
        <div className="p-6">
          <div className="mb-4 flex justify-between items-center">
            <span className="px-2 py-1 bg-yellow-50 text-yellow-600 rounded border">LeetCode</span>
            <span className="px-2 py-1 bg-yellow-50 text-yellow-600 rounded border">Medium</span>
          </div>
          <h3 className="text-lg font-bold mb-2">{problems.leetcode.title}</h3>
          <p className="text-gray-600 text-sm mb-4">{problems.leetcode.description}</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-xs text-gray-500">Time Complexity</p>
              <p className="text-sm font-medium">{problems.leetcode.timeComplexity}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-xs text-gray-500">Space Complexity</p>
              <p className="text-sm font-medium">{problems.leetcode.spaceComplexity}</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-500">
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs">{problems.leetcode.discussionCount} Discussions</span>
            </div>
            <button className="
              inline-flex items-center gap-1 px-3 py-1
              bg-black text-white rounded text-sm
              transition-all duration-200 ease-in-out
              hover:shadow-lg
            ">
              Solve Now <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
        <div className="bg-gray-50 p-4 text-xs font-mono border-t overflow-x-auto">
          <pre><code>{`
function maxSubArray(nums) {
  let maxSum = nums[0];
  let currentSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}
            `}</code></pre>
        </div>
      </div>
    </div>
  </div>
</motion.section>


        {/* 🔑 Goals Panel */}
        <motion.section
          variants={fadeUpVariant}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <GoalsPanel />
        </motion.section>

        {/* 🔑 Top Platforms Grid */}
        <motion.section
          variants={fadeUpVariant}
          transition={{ duration: 0.6 }}
          className="py-16 bg-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
            <h2 className="text-4xl font-semibold mb-2">Problems from Top Platforms</h2>
            <p className="text-gray-600">Daily challenges from industry-recognized platforms.</p>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {['leetcode','gfg','codeforces'].map(key => (
              <ProblemCard
                key={key}
                title={problems[key].title}
                description={problems[key].description}
                platform={key}
                difficulty={problems[key].difficulty}
                link={problems[key].link}
              />
            ))}
          </div>
        </motion.section>

        {/* 🔑 How It Works */}
        <motion.section
          variants={fadeUpVariant}
          transition={{ duration: 0.6 }}
          className="py-16 bg-gray-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Simple Steps to Improve Your Coding Skills</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Following a structured approach to tackle daily problems effectively
            </p>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: "01", title: "Solve Daily", description: "Tackle curated problems from top platforms every day", icon: Calendar },
              { number: "02", title: "Track Progress", description: "Monitor your improvement with detailed statistics", icon: TrendingUp },
              { number: "03", title: "Join Discussions", description: "Participate in community discussions about solutions", icon: MessageSquare },
              { number: "04", title: "Build Streaks", description: "Maintain consistency and build solid coding habits", icon: Trophy }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={cardHover}
                whileHover="hover"
                className="relative bg-white rounded-2xl shadow-lg p-6 transition-all duration-200"
              >
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

        {/* 🔑 Features & Analytics */}
        <motion.section
          variants={fadeUpVariant}
          transition={{ duration: 0.6 }}
          className="py-16 bg-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Features List */}
            <div>
              <span className="
                inline-flex items-center gap-2 text-sm font-medium
                bg-gradient-to-r from-blue-600 to-purple-600 text-white
                px-4 py-2 rounded-md uppercase tracking-wide
                shadow-md transition-all duration-200 mb-8
              ">
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

            {/* Right Dashboard Analytics */}
            <motion.div
              variants={cardHover}
              whileHover="hover"
              className="relative bg-white rounded-2xl shadow-xl p-6 transition-all duration-200"
            >
              <div className="absolute -inset-4 bg-black/5 rounded-3xl transform -rotate-2" />
              <div className="relative">
                <div className="p-4 border-b flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">Dashboard Analytics</span>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl text-center">
                      <h4 className="text-xs text-gray-500 mb-1">Solved</h4>
                      <p className="text-2xl font-bold">124</p>
                      <p className="text-xs text-green-600">↑ 8% this week</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-xl text-center">
                      <h4 className="text-xs text-gray-500 mb-1">Streak</h4>
                      <p className="text-2xl font-bold">16</p>
                      <p className="text-xs text-green-600">↑ 2 days</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-xl text-center">
                      <h4 className="text-xs text-gray-500 mb-1">Rank</h4>
                      <p className="text-2xl font-bold">#215</p>
                      <p className="text-xs text-green-600">↑ 23 spots</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Recent Activity</h4>
                    <div className="space-y-3">
                      {[ 
                        { text: "Solved 'Maximum Subarray'", time: "2h ago" },
                        { text: "Commented on 'Dynamic Programming Approach'", time: "4h ago" },
                        { text: "Added 'Binary Tree Traversal' to favorites", time: "1d ago" }
                      ].map((activity, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <p className="text-xs font-medium">{activity.text}</p>
                          <span className="text-xs text-gray-500">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* 🔑 Call to Action */}
        <motion.section
          variants={fadeUpVariant}
          transition={{ duration: 0.6 }}
          className="py-16 bg-black text-white text-center"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-6">Ready to level up your coding skills?</h2>
            <p className="text-xl mb-10 text-gray-300">
              Join thousands of developers who solve daily coding challenges and prepare for technical interviews.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                to="/potd"
                className="
                  inline-flex items-center gap-2 px-6 py-3
                  bg-white text-black rounded-full font-semibold
                  transition-all duration-200 ease-in-out
                  hover:shadow-lg
                "
              >
                Start Solving <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/dashboard"
                className="
                  inline-flex items-center gap-2 px-6 py-3
                  border-2 border-white text-white rounded-full
                  transition-all duration-200 ease-in-out
                  hover:bg-white hover:text-black
                "
              >
                Explore Dashboard
              </Link>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </>
  );
};

export default Home;
