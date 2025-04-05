import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Clock, Plus, ChevronDown, Code, BookOpen, Activity } from 'lucide-react';
import { format } from 'date-fns';

const SolutionCard = ({ problem }) => {
  const [solutionOpen, setSolutionOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('cpp');
  const [userVotes, setUserVotes] = useState({ upvotes: 25, downvotes: 3 });
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [timeComplexityOpen, setTimeComplexityOpen] = useState(false);

  const [userSolutionsExpanded, setUserSolutionsExpanded] = useState(false);
  const [explanationExpanded, setExplanationExpanded] = useState(false);
  const [realLifeUseCaseExpanded, setRealLifeUseCaseExpanded] = useState(false);
  const [userSolution, setUserSolution] = useState('');

  const userSolutions = [
    {
      id: 1,
      username: "johndoe123",
      language: "cpp",
      code: `// My optimized solution
vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> hash;
    for (int i = 0; i < nums.size(); ++i) {
        int diff = target - nums[i];
        if (hash.count(diff)) {
            return {hash[diff], i};
        }
        hash[nums[i]] = i;
    }
    return {};
}`,
      postedDaysAgo: 2,
      upvotes: 42,
      downvotes: 5
    }
  ];

  const getPlatformColor = () => {
    switch (problem.platform) {
      case 'leetcode': return 'bg-blue-500';
      case 'gfg': return 'bg-green-500';
      case 'codeforces': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleSubmitSolution = () => {
    if (userSolution.trim()) {
      alert("Your solution has been submitted!");
      setUserSolution('');
    } else {
      alert("Please enter a solution before submitting");
    }
  };

  const handleAddToFavorites = () => {
    alert(`${problem.title} added to favorites!`);
    setFavoritesOpen(false);
  };

  return (
    <div className="mb-6 border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      
      <div className="p-4 flex justify-between items-start bg-white">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{problem.title}</h2>
          <div className="flex gap-2 mt-2">
            <span className={`px-2 py-1 rounded text-white ${getPlatformColor()}`}>{problem.platform}</span>
            <span className={`px-2 py-1 rounded text-white ${problem.difficulty === 'Easy' ? 'bg-green-500' : problem.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'}`}>
              {problem.difficulty}
            </span>
            <span className="px-2 py-1 rounded bg-gray-200 text-gray-700">{problem.date}</span>
          </div>
        </div>
        <button
          onClick={() => setFavoritesOpen(true)}
          className="p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 rounded"
        >
          <Plus size={20} />
        </button>
      </div>

     
      <div className="p-4 space-y-4 bg-gray-50">
       
        <div className="border border-gray-200 rounded">
          <button
            onClick={() => setUserSolutionsExpanded(!userSolutionsExpanded)}
            className="w-full flex justify-between items-center p-3 bg-white hover:bg-gray-100"
          >
            <div className="flex items-center gap-2 text-gray-800">
              <Code size={20} className="text-blue-500" />
              <span>View User Solutions</span>
            </div>
            <ChevronDown
              size={20}
              className={`transform transition-transform ${userSolutionsExpanded ? 'rotate-180' : ''}`}
            />
          </button>
          <AnimatePresence>
            {userSolutionsExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="p-4 bg-white"
              >
                {userSolutions.map(solution => (
                  <div key={solution.id} className="p-3 bg-gray-50 border border-gray-100 rounded mb-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">User: {solution.username}</span>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="px-2 py-1 rounded bg-blue-100 text-blue-700">{solution.language.toUpperCase()}</span>
                        <span>Posted {solution.postedDaysAgo} {solution.postedDaysAgo === 1 ? 'day' : 'days'} ago</span>
                      </div>
                    </div>
                    <pre className="mt-3 bg-white border border-gray-100 p-3 rounded overflow-x-auto text-gray-800">
                      <code>{solution.code}</code>
                    </pre>
                    <div className="mt-3 flex items-center gap-4">
                      <button className="flex items-center gap-1 px-2 py-1 border rounded hover:bg-gray-100">
                        <ThumbsUp size={16} className="text-blue-500" />
                        <span className="text-gray-700">{solution.upvotes}</span>
                      </button>
                      <button className="flex items-center gap-1 px-2 py-1 border rounded hover:bg-gray-100">
                        <ThumbsDown size={16} className="text-red-500" />
                        <span className="text-gray-700">{solution.downvotes}</span>
                      </button>
                      <button
                        onClick={() => setTimeComplexityOpen(true)}
                        className="ml-auto flex items-center gap-1 px-2 py-1 border rounded hover:bg-gray-100"
                      >
                        <Clock size={16} className="text-purple-500" />
                        <span>Time Complexity</span>
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setSolutionOpen(true)}
                  className="w-full border border-blue-500 text-blue-500 py-2 rounded hover:bg-blue-50"
                >
                  Show All Solutions
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="border border-gray-200 rounded">
          <button
            onClick={() => setExplanationExpanded(!explanationExpanded)}
            className="w-full flex justify-between items-center p-3 bg-white hover:bg-gray-100"
          >
            <div className="flex items-center gap-2 text-gray-800">
              <BookOpen size={20} className="text-green-500" />
              <span>Problem Explanation</span>
            </div>
            <ChevronDown
              size={20}
              className={`transform transition-transform ${explanationExpanded ? 'rotate-180' : ''}`}
            />
          </button>
          <AnimatePresence>
            {explanationExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="p-4 bg-white"
              >
                <div className="mb-4">
                  <h3 className="font-bold text-gray-900">Problem Statement:</h3>
                  <p className="mt-2 text-gray-700">
                    Given an array of integers and a target value, return the indices of the two numbers that add up to the target.
                  </p>
                </div>
                <div className="mb-4">
                  <h3 className="font-bold text-gray-900">Example:</h3>
                  <pre className="mt-2 bg-gray-50 p-3 border border-gray-100 rounded text-gray-800">
                    <code>
                      {`Input: nums = [2,7,11,15], target = 9
Output: [0,1]`}
                    </code>
                  </pre>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Approach:</h3>
                  <p className="mt-2 text-gray-700">
                    Use a hash map to store each number and its index. For each element, check if its complement exists in the map.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="border border-gray-200 rounded">
          <button
            onClick={() => setRealLifeUseCaseExpanded(!realLifeUseCaseExpanded)}
            className="w-full flex justify-between items-center p-3 bg-white hover:bg-gray-100"
          >
            <div className="flex items-center gap-2 text-gray-800">
              <Activity size={20} className="text-green-500" />
              <span>Real-life Use Case</span>
            </div>
            <ChevronDown
              size={20}
              className={`transform transition-transform ${realLifeUseCaseExpanded ? 'rotate-180' : ''}`}
            />
          </button>
          <AnimatePresence>
            {realLifeUseCaseExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="p-4 bg-white"
              >
                <div className="mb-4">
                  <h3 className="font-bold text-gray-900">Financial Analysis:</h3>
                  <p className="mt-2 text-gray-700">
                    Identifying pairs of numbers that sum to a target is similar to reconciling financial transactions.
                  </p>
                </div>
                <div className="mb-4">
                  <h3 className="font-bold text-gray-900">Database Queries:</h3>
                  <p className="mt-2 text-gray-700">
                    The hashing approach is analogous to how database indexes speed up join operations.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Recommendation Systems:</h3>
                  <p className="mt-2 text-gray-700">
                    Matching complementary products uses similar pair-finding logic.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <a href={problem.link} target="_blank" rel="noopener noreferrer">
          <button className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Solve on {problem.platform.charAt(0).toUpperCase() + problem.platform.slice(1)}
          </button>
        </a>
      </div>

      <AnimatePresence>
        {timeComplexityOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
              <h3 className="text-xl font-bold text-gray-900">Time Complexity Analysis</h3>
              <p className="mt-2 text-gray-700">
                The solution uses a hash map for O(1) lookups resulting in an overall time complexity of O(n).
              </p>
              <p className="mt-2 text-gray-700">
                Space Complexity is O(n) in the worst-case scenario.
              </p>
              <button onClick={() => setTimeComplexityOpen(false)} className="mt-4 py-2 px-4 bg-gray-200 rounded hover:bg-gray-300">
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      
      <AnimatePresence>
        {favoritesOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white rounded-lg p-6 max-w-xs mx-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Add to Favorites</h3>
              <div className="flex flex-col gap-2">
                {["⭐ My Favorite Problems", "📚 Study List", "🔄 Revisit Later", "🧠 Algorithm Patterns"].map((list, idx) => (
                  <button
                    key={idx}
                    onClick={handleAddToFavorites}
                    className="text-left px-3 py-2 border rounded hover:bg-gray-100"
                  >
                    {list}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => setFavoritesOpen(false)} className="py-2 px-4 border rounded hover:bg-gray-100">
                  Cancel
                </button>
                <button onClick={handleAddToFavorites} className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Add to Selected List
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

   
      <AnimatePresence>
        {solutionOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 overflow-y-auto max-h-[90vh]">
              <h3 className="text-xl font-bold text-gray-900 mb-2">User Solutions for {problem.title}</h3>
              <p className="text-gray-600 mb-4">Browse all community solutions or submit your own.</p>
              {userSolutions.map(sol => (
                <div key={sol.id} className="p-3 bg-gray-50 border border-gray-100 rounded mb-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">User: {sol.username}</span>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="px-2 py-1 rounded bg-blue-100 text-blue-700">{sol.language.toUpperCase()}</span>
                      <span>Posted {sol.postedDaysAgo} {sol.postedDaysAgo === 1 ? 'day' : 'days'} ago</span>
                    </div>
                  </div>
                  <pre className="mt-3 bg-white border border-gray-100 p-3 rounded overflow-x-auto text-gray-800">
                    <code>{sol.code}</code>
                  </pre>
                  <div className="mt-3 flex items-center gap-4">
                    <button className="flex items-center gap-1 px-2 py-1 border rounded hover:bg-gray-100">
                      <ThumbsUp size={16} className="text-blue-500" />
                      <span>{sol.upvotes}</span>
                    </button>
                    <button className="flex items-center gap-1 px-2 py-1 border rounded hover:bg-gray-100">
                      <ThumbsDown size={16} className="text-red-500" />
                      <span>{sol.downvotes}</span>
                    </button>
                    <button
                      onClick={() => setTimeComplexityOpen(true)}
                      className="ml-auto flex items-center gap-1 px-2 py-1 border rounded hover:bg-gray-100"
                    >
                      <Clock size={16} className="text-purple-500" />
                      <span>Time Complexity</span>
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={() => setSolutionOpen(false)} className="mt-4 py-2 px-4 bg-gray-200 rounded hover:bg-gray-300">
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SolutionCard;
