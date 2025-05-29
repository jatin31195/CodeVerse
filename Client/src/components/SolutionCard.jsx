import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ThumbsUp,
  ThumbsDown,
  Clock,
  ChevronDown,
  Code,
  BookOpen,
  Activity,
  LifeBuoy,
} from 'lucide-react';
import { format } from 'date-fns';

const SolutionCard = ({ problem, explanation }) => {
  const [currentTab, setCurrentTab] = useState('All');
  const [expandedSolutionIds, setExpandedSolutionIds] = useState(new Set());
  const [userSolution, setUserSolution] = useState('');
  const [solutions, setSolutions] = useState([]);
  const [userSolutionsExpanded, setUserSolutionsExpanded] = useState(false);
  const [explanationExpanded, setExplanationExpanded] = useState(false);
  const [realLifeUseCaseExpanded, setRealLifeUseCaseExpanded] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const authConfig = { withCredentials:true };

  useEffect(() => {
    if (!problem?._id) return;
    axios
      .get(`http://localhost:8080/api/solutions/${problem._id}`, authConfig)
      .then(res => setSolutions(res.data))
      .catch(console.error);
  }, [problem]);

  const getPlatformColor = () => {
    switch ((problem?.platform || '').toLowerCase()) {
      case 'leetcode':
        return 'bg-gradient-to-r from-orange-400 to-yellow-500';
      case 'gfg':
        return 'bg-gradient-to-r from-green-500 to-emerald-400';
      case 'codeforces':
        return 'bg-gradient-to-r from-pink-500 to-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const voteSolution = (solutionId, vote) => {
    axios
      .post('http://localhost:8080/api/solutions/vote', { solutionId, vote }, authConfig)
      .then(res => {
        setSolutions(sols =>
          sols.map(s =>
            s._id === solutionId
              ? {
                  ...s,
                  votes: res.data.totalVotes,
                  upvotedBy: Array(res.data.upvotes).fill(true),
                  downvotedBy: Array(res.data.downvotes).fill(true),
                }
              : s
          )
        );
      })
      .catch(console.error);
  };

  const toggleSolutionExpansion = id => {
    setExpandedSolutionIds(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const getPreview = text => {
    const lines = text.split('\n');
    return lines.slice(0, 3).join('\n') + (lines.length > 3 ? '\n...' : '');
  };

  const handleSubmitSolution = () => {
    if (!userSolution.trim()) return setError('Please enter a solution.');
    setLoading(true);
    axios
      .post(
        'http://localhost:8080/api/solutions/add',
        {
          questionId: problem._id,
          type: 'optimal',
          language: currentTab,
          content: userSolution,
        },
        authConfig
      )
      .then(() => axios.get(`http://localhost:8080/api/solutions/${problem._id}`, authConfig))
      .then(res => {
        setSolutions(res.data);
        setUserSolution('');
        setError('');
      })
      .catch(() => setError('Failed to submit.'))
      .finally(() => setLoading(false));
  };
const raiseTicket = () => {
  navigate('/community', {
  state: {
    problemId: problem._id,
    title: problem.title,
    platform: problem.platform,
  },
});
}

  return (
    <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl bg-white border border-gray-200">
      <div className="bg-gradient-to-br from-white to-gray-100 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800">{problem?.title}</h2>
            <div className="mt-2 flex items-center gap-3">
              <span className={`text-xs px-2 py-1 rounded-full text-white ${getPlatformColor()}`}>
                {problem?.platform}
              </span>
              <span className="text-sm text-gray-600">
                {problem?.date ? format(new Date(problem.date), 'PPP') : 'No Date'}
              </span>
            </div>
          </div>
          <button
            onClick={raiseTicket}
            className="cursor-pointer flex items-center gap-2 text-sm px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition"
          >
            <LifeBuoy size={18} className='cursor-pointer'/>
            Raise Ticket
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200 bg-white">
        
        <SectionToggle
          title="View User Solutions"
          icon={<Code size={20} className="text-blue-600" />}
          expanded={userSolutionsExpanded}
          setExpanded={setUserSolutionsExpanded}
        >
          <div className="pb-4">
            <div className=" flex gap-2 mb-4">
              {['All', 'C++', 'Java'].map(lang => (
                <button
                  key={lang}
                  onClick={() => setCurrentTab(lang)}
                  className={`cursor-pointer px-3 py-1 text-sm rounded-full border ${
                    currentTab === lang
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-100 text-gray-700 border-gray-300'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {solutions
              .filter(
                sol =>
                  currentTab === 'All' ||
                  sol.language.toLowerCase() === currentTab.toLowerCase()
              )
              .map(sol => {
                const isOpen = expandedSolutionIds.has(sol._id);
                return (
                  <motion.div
                    key={sol._id}
                    layout
                    className={`mb-4 rounded-xl border ${
                      isOpen ? 'border-blue-400 shadow-md' : 'border-gray-200'
                    }`}
                  >
                    <button
                      onClick={() => toggleSolutionExpansion(sol._id)}
                      className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-blue-100 text-blue-700 font-bold rounded-full flex items-center justify-center">
                          {sol.user.username.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">
                          {sol.user.username}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded border border-blue-300">
                          {sol.language}
                        </span>
                      </div>
                      <ChevronDown
                        size={20}
                        className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    <motion.pre
                      layout
                      className={`px-4 py-2 font-mono text-sm ${
                        isOpen
                          ? 'bg-gray-900 text-gray-100 rounded-b-lg'
                          : 'bg-gray-100 text-gray-800 max-h-24 overflow-hidden rounded-b-lg'
                      }`}
                    >
                      <code>{isOpen ? sol.content : getPreview(sol.content)}</code>
                    </motion.pre>

                    <div className="flex gap-3 items-center px-4 py-2 bg-white border-t">
                      <button
                        onClick={() => voteSolution(sol._id, 'up')}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                      >
                        <ThumbsUp size={16} className='cursor-pointer'/>
                        {sol.upvotedBy.length}
                      </button>
                      <button
                        onClick={() => voteSolution(sol._id, 'down')}
                        className="flex items-center gap-1 text-red-600 hover:text-red-800"
                      >
                        <ThumbsDown size={16} className='cursor-pointer'/>
                        {sol.downvotedBy.length}
                      </button>
                      <span className="ml-auto text-sm text-gray-500">
                        Score: {sol.votes}
                      </span>
                    </div>
                  </motion.div>
                );
              })}

            <textarea
              value={userSolution}
              onChange={e => setUserSolution(e.target.value)}
              rows={4}
              className="w-full p-3 mt-4 border border-gray-300 rounded-lg"
              placeholder="Share your optimal solution here..."
            />
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
            <button
              onClick={handleSubmitSolution}
              disabled={loading}
              className="mt-2 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Solution'}
            </button>
          </div>
        </SectionToggle>

        
        <SectionToggle
          title="Problem Explanation (AI Based)"
          icon={<BookOpen size={20} className="text-green-600" />}
          expanded={explanationExpanded}
          setExpanded={setExplanationExpanded}
        >
          <p className="text-gray-700">{explanation?.easyExplanation || 'Not available.'}</p>
        </SectionToggle>

        
        <SectionToggle
          title="Real-life Use Case (AI Based)"
          icon={<Activity size={20} className="text-purple-600" />}
          expanded={realLifeUseCaseExpanded}
          setExpanded={setRealLifeUseCaseExpanded}
        >
          <p className="text-gray-700">{explanation?.realLifeExample || 'Not available.'}</p>
        </SectionToggle>
      </div>

      
      <div className="p-4 bg-white border-t border-gray-200">
        <a
          href={problem?.link || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          {problem?.platform
            ? `Solve on ${problem.platform[0].toUpperCase() + problem.platform.slice(1)}`
            : 'Solve'}
        </a>
      </div>
    </div>
  );
};

const SectionToggle = ({ title, icon, expanded, setExpanded, children }) => (
  <div className="bg-white">
    <button
      onClick={() => setExpanded(prev => !prev)}
      className="w-full flex justify-between items-center px-6 py-4 bg-white hover:bg-gray-100 transition"
    >
      <div className="flex items-center gap-3 font-semibold text-gray-800">
        {icon}
        {title}
      </div>
      <ChevronDown
        size={20}
        className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
      />
    </button>
    <AnimatePresence>
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-6 pb-4"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default SolutionCard;
