import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Star, MessageSquare, TrendingUp, Calendar, Trophy, PanelRight 
} from 'lucide-react';
import Sidebar from './Sidebar';

const ProblemCard = ({ title, description, platform, difficulty, timeComplexity, spaceComplexity, discussionCount, link }) => {
  return (
    <div className="border-t-4 rounded-lg shadow-md p-6 mb-6 hover:shadow-xl transition" 
         style={{ borderTopColor: platform === 'leetcode' ? '#FFA116' : platform === 'gfg' ? '#2F8D46' : '#1890FF' }}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex space-x-2">
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
            {platform === 'leetcode' ? 'LeetCode' : platform === 'gfg' ? 'GeeksForGeeks' : 'CodeForces'}
          </span>
          <span className={`px-2 py-1 rounded ${difficulty === 'easy' ? 'bg-green-100 text-green-800' : difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
            {difficulty}
          </span>
        </div>
        <button className="text-yellow-500 hover:text-yellow-600">
          <Star className="h-5 w-5" />
        </button>
      </div>
      <h3 className="text-xl font-bold mb-6">{title}</h3>
      <p className="text-sm text-gray-600 mb-6">{description}</p>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center text-sm text-gray-500">
          <MessageSquare className="h-4 w-4 mr-1" />
          <span> discussions</span>
        </div>
        <a href={link} target="_blank" rel="noopener noreferrer">
          <button className="px-8 py-2 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition">
            Solve 
          </button>
        </a>
      </div>
    </div>
  );
};

const DailyGoalsCard = () => {
  const [goals, setGoals] = useState([
    { id: '1', text: 'Solve at least 2 POTD', completed: false },
    { id: '2', text: 'Learn about hash maps', completed: true },
    { id: '3', text: 'Practice DP problems', completed: false },
  ]);
  const [newGoal, setNewGoal] = useState('');

  const addGoal = () => {
    if (newGoal.trim() === '') return;
    const goal = { id: Date.now().toString(), text: newGoal, completed: false };
    setGoals([...goals, goal]);
    setNewGoal('');
  };

  const toggleGoal = id => {
    setGoals(goals.map(goal => goal.id === id ? { ...goal, completed: !goal.completed } : goal));
  };

  const removeGoal = id => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const completedCount = goals.filter(g => g.completed).length;
  const progress = goals.length ? Math.round((completedCount / goals.length) * 100) : 0;

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border mb-12">
      <h2 className="text-2xl font-bold mb-3">Today's Coding Goals</h2>
      <p className="text-gray-600 mb-6">Set and track your daily programming goals</p>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Add a new goal..."
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addGoal()}
          className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none"
        />
        <button onClick={addGoal} className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition">
          Add
        </button>
      </div>
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Progress</span>
          <span>{completedCount} of {goals.length} completed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {goals.map(goal => (
          <div
            key={goal.id}
            className={`flex justify-between items-center p-3 border rounded-md ${goal.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}
          >
            <div className="flex items-center space-x-3">
              <button onClick={() => toggleGoal(goal.id)} className="focus:outline-none">
                <Star className={`h-5 w-5 ${goal.completed ? 'text-green-500' : 'text-gray-400'}`} />
              </button>
              <span className={goal.completed ? 'line-through text-gray-500' : 'text-gray-800'}>
                {goal.text}
              </span>
            </div>
            <button onClick={() => removeGoal(goal.id)} className="text-red-500 hover:text-red-600 focus:outline-none">
              X
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <button className="w-full border border-blue-600 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white transition">
          Save Goals
        </button>
      </div>
    </div>
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
              className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-lg z-30"
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

      <header className="sticky top-0 z-10 flex items-center justify-between bg-white p-4 border-b">
        <button onClick={toggleSidebar} className="p-2">
          {!sidebarOpen && <PanelRight className="h-6 w-6" />}
        </button>
        <h1 className="text-xl font-bold">CodeVerse</h1>
        <div></div>
      </header>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
       
        <section className="relative bg-gray-50 overflow-hidden p-12">
          <div className="absolute inset-0 bg-noise opacity-30"></div>
          <div className="relative max-w-full mx-auto flex flex-col lg:flex-row items-center gap-12">
            <div className="space-y-8 w-full lg:w-1/2">
              <div className="space-y-4">
                <span className="ml-auto inline-flex items-center gap-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-md hover:shadow-md transition-all">
                  Daily Coding Problems
                </span>
                <h1 className="text-5xl font-bold">
                  Elevate Your <span className="relative inline-block">
                    <span className="relative z-10">Coding</span>
                    <span className="absolute bottom-2 left-0 w-full h-3 bg-yellow-300 -z-10"></span>
                  </span> Skills
                </h1>
                <p className="text-xl text-gray-600 max-w-md">
                  Master algorithms and data structures with our curated daily problems.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link to="/potd" className="bg-blue-600 text-white px-6 py-3 rounded-full flex items-center gap-2 transition hover:shadow-md">
                  Get Started <ArrowRight className="h-5 w-5" />
                </Link>
                <Link to="/dashboard" className="border border-blue-600 text-blue-600 px-6 py-3 rounded-full flex items-center gap-2 transition hover:bg-blue-600 hover:text-white">
                  Explore Dashboard
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium">
                      U{i}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">2,500+</span> programmers solving problems daily
                </p>
              </div>
            </div>
            <div className="relative w-full lg:w-1/2">
              <div className="absolute -inset-4 bg-black/5 rounded-3xl rotate-3"></div>
              <div className="relative bg-white rounded-2xl border shadow-lg overflow-hidden">
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
                    <button className="bg-black text-white px-3 py-1 rounded text-sm flex items-center gap-1">
                      Solve Now <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 text-xs font-mono border-t overflow-x-auto">
                  <pre>
                    <code>{`function maxSubArray(nums) {
  let maxSum = nums[0];
  let currentSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        
        <section className="max-w-7xl mx-auto px-4">
          <DailyGoalsCard />
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-4">Problems from Top Coding Platforms</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Daily challenges from industry-recognized platforms to help you prepare for interviews
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-lg font-bold text-yellow-600">LC</span>
                </div>
                <h3 className="text-xl font-bold mb-2">LeetCode</h3>
                <p className="text-gray-600 mb-4">
                  Master algorithm patterns with focused problems widely used in technical interviews.
                </p>
                <ProblemCard {...problems.leetcode} />
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-lg font-bold text-green-600">GFG</span>
                </div>
                <h3 className="text-xl font-bold mb-2">GeeksForGeeks</h3>
                <p className="text-gray-600 mb-4">
                  Comprehensive problems covering core computer science fundamentals and advanced topics.
                </p>
                <ProblemCard {...problems.gfg} />
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-lg font-bold text-blue-600">CF</span>
                </div>
                <h3 className="text-xl font-bold mb-2">CodeForces</h3>
                <p className="text-gray-600 mb-4">
                  Competitive programming challenges that enhance problem-solving speed and efficiency.
                </p>
                <ProblemCard {...problems.codeforces} />
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <span className="ml-auto inline-flex items-center gap-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-md hover:shadow-md transition-all mb-8">
                How It Works
              </span>
              <h2 className="text-4xl font-bold mb-4">Simple Steps to Improve Your Coding Skills</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Following a structured approach to tackle daily problems effectively
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { number: "01", title: "Solve Daily", description: "Tackle curated problems from top platforms every day", icon: Calendar },
                { number: "02", title: "Track Progress", description: "Monitor your improvement with detailed statistics", icon: TrendingUp },
                { number: "03", title: "Join Discussions", description: "Participate in community discussions about solutions", icon: MessageSquare },
                { number: "04", title: "Build Streaks", description: "Maintain consistency and build solid coding habits", icon: Trophy }
              ].map((item, index) => (
                <div key={index} className="relative p-6 bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">
                    {item.number}
                  </div>
                  <div className="w-12 h-12 mb-4 bg-gray-100 rounded-xl flex items-center justify-center transition-colors duration-300">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="ml-auto inline-flex items-center gap-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-md hover:shadow-md transition-all mb-8">Features</span>
                <h2 className="text-4xl font-bold mb-6">Why Use CodeVerse?</h2>
                <p className="text-xl text-gray-600 mb-8">
                CodeVerse offers a comprehensive solution to help you master coding challenges and ace technical interviews.
                </p>
                <div className="space-y-6">
                  {[
                    { title: "Track Your Progress", description: "Visualize your improvement over time with detailed statistics.", icon: TrendingUp },
                    { title: "Join Discussions", description: "Share your solution approach and learn from others.", icon: MessageSquare },
                    { title: "Create Favorites", description: "Save interesting problems for future practice.", icon: Star }
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex-shrink-0 flex items-center justify-center">
                        <feature.icon className="h-5 w-5 text-black" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-1">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-black/5 rounded-3xl -rotate-2"></div>
                <div className="relative bg-white rounded-2xl border shadow-lg overflow-hidden">
                  <div className="p-4 border-b flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">Dashboard Analytics</span>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="p-3 bg-blue-50 rounded-xl">
                        <h4 className="text-xs text-gray-500 mb-1">Solved</h4>
                        <p className="text-2xl font-bold">124</p>
                        <p className="text-xs text-green-600">↑ 8% this week</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-xl">
                        <h4 className="text-xs text-gray-500 mb-1">Streak</h4>
                        <p className="text-2xl font-bold">16</p>
                        <p className="text-xs text-green-600">↑ 2 days</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-xl">
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
                        ].map((activity, i) => (
                          <div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <p className="text-xs font-medium">{activity.text}</p>
                            <span className="text-xs text-gray-500">{activity.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-black text-white text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl font-bold mb-6">Ready to level up your coding skills?</h2>
            <p className="text-xl mb-10 text-gray-300">
              Join thousands of developers who solve daily coding challenges and prepare for technical interviews.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/potd" className="bg-white text-black px-6 py-3 rounded-full flex items-center gap-2 transition hover:shadow-md">
                Start Solving <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/dashboard" className="border border-white text-white px-6 py-3 rounded-full flex items-center gap-2 transition hover:bg-white hover:text-black">
                Explore Dashboard
              </Link>
            </div>
          </div>
        </section>
      </motion.div>
    </>
  );
};

export default Home;
