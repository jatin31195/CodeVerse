import React, { useState, useEffect } from 'react';

import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Shuffle, ExternalLink, Code } from 'lucide-react';
import { motion } from 'framer-motion';
import MainLayout from './MainLayout';
import POTDCalendar from './POTDCalendar';

const navLinks = [
  { name: 'POTD Calendar', path: '/custom' },
  { name: 'My Problems', path: '/my-problems' },
  { name: 'Add Problem', path: '/add-problem' },
];

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function CustomPOTD() {
  const [lists, setLists] = useState([]);
  const [currentList, setCurrentList] = useState(null);
  const [problemsMap, setProblemsMap] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [loadingLists, setLoadingLists] = useState(true);
  const [loadingProblems, setLoadingProblems] = useState(false);

  const token = sessionStorage.getItem('token');
  const api = axios.create({
    baseURL: 'http://localhost:8080/api/custom/user-potd',
    headers: { Authorization: token },
  });

  useEffect(() => {
    const fetchLists = async () => {
      setLoadingLists(true);
      try {
        const own = await api.get('/lists');
        const pub = await api.get('/lists/public');
        const all = [...own.data.lists, ...pub.data.lists];
        setLists(all);
        if (all.length) selectList(all[0]._id);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingLists(false);
      }
    };
    fetchLists();
  }, []);

  const selectList = async (listId) => {
    setCurrentList(listId);
    setLoadingProblems(true);
    try {
      const res = await api.get(`/list/${listId}/questions`);
      const map = res.data.questions.reduce((acc, q) => {
        acc[format(new Date(q.date), 'yyyy-MM-dd')] = q;
        return acc;
      }, {});
      setProblemsMap(map);
    } catch {
      setProblemsMap({});
    } finally {
      setLoadingProblems(false);
    }
  };

  useEffect(() => {
    const key = format(selectedDate, 'yyyy-MM-dd');
    setSelectedProblem(problemsMap[key] || null);
  }, [selectedDate, problemsMap]);

  const handleRandomize = () => {
    if (!lists.length) return;
    const pick = lists[Math.floor(Math.random() * lists.length)];
    selectList(pick._id);
  };

  return (
    <MainLayout navLinks={navLinks}>
      <motion.div
        className="font-poppins py-10 mx-auto w-full"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.6 }}
      >

        {/* HEADER */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center mb-10"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          <div>
            <h1 className="text-5xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Problem of the Day
            </h1>
            <p className="text-gray-500 text-lg">
              Elevate your daily coding ritual
            </p>
          </div>
          <div className="flex gap-4 mt-6 md:mt-0">
            <Link to="/add-problem">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 border border-purple-600 text-purple-600 px-5 py-2 rounded-lg font-semibold"
              >
                <Code size={18} /> Add Problem
              </motion.button>
            </Link>
            <motion.button
              onClick={handleRandomize}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-5 py-2 rounded-lg font-semibold"
            >
              <Shuffle size={18} /> Randomize
            </motion.button>
          </div>
        </motion.div>

        {/* LIST SELECTOR */}
        <motion.div
          className="mb-8 md:w-1/3"
          variants={fadeIn}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-gray-700 mb-2 font-medium">
            Choose List:
          </label>
          {loadingLists ? (
            <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
          ) : (
            <select
              value={currentList || ''}
              onChange={(e) => selectList(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              {lists.map((lst) => (
                <option key={lst._id} value={lst._id}>
                  {lst.name} {lst.isPublic ? '(Public)' : '(Private)'}
                </option>
              ))}
            </select>
          )}
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">

          {/* CALENDAR */}
          <motion.div
            className="md:col-span-2"
            variants={fadeIn}
            transition={{ delay: 0.6 }}
          >
            <POTDCalendar
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              platform={selectedProblem ? selectedProblem.platform.toLowerCase() : 'other'}
            />
          </motion.div>

          {/* PROBLEM DETAIL */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl"
            whileHover={{ scale: 1.02 }}
            variants={fadeIn}
            transition={{ delay: 0.8 }}
          >
            <div
              className={`p-4 rounded-t-2xl ${
                selectedProblem
                  ? 'bg-gradient-to-r from-purple-100 to-blue-100'
                  : 'bg-gradient-to-r from-gray-100 to-gray-200'
              }`}
            >
              <h2 className="text-xl font-semibold">
                {format(selectedDate, 'MMMM d, yyyy')}
              </h2>
              <p className="text-gray-600">
                {selectedProblem ? 'Problem details' : 'No problem assigned'}
              </p>
            </div>

            {loadingProblems ? (
              <div className="p-6 animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {selectedProblem ? (
                  <>
                    <h3 className="text-2xl font-bold">
                      {selectedProblem.title}
                    </h3>
                    <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-medium">
                      {selectedProblem.platform}
                    </span>
                    {selectedProblem.tags?.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-600 mb-2">
                          Topics:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {selectedProblem.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-gray-200 text-gray-800 rounded-full text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold">
                      Add problem for {format(selectedDate, 'MMMM d, yyyy')}
                    </h3>
                    <Link to={`/add-problem?date=${format(selectedDate, 'yyyy-MM-dd')}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-5 py-2 rounded-lg font-semibold"
                      >
                        <Code size={18} /> Add Problem
                      </motion.button>
                    </Link>
                  </>
                )}
              </div>
            )}

            <div className="p-4">
              {selectedProblem ? (
                <Link to={selectedProblem.link} target="_blank">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    className="w-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
                  >
                    <ExternalLink className="mr-2" /> Solve on{' '}
                    {selectedProblem.platform}
                  </motion.button>
                </Link>
              ) : (
                <Link to="/my-problems">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    className="w-full border border-purple-600 text-purple-600 px-4 py-2 rounded-lg font-semibold"
                  >
                    Browse My Problem Lists
                  </motion.button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>

        {/* GETTING STARTED CARDS */}
        <motion.div
          className="mt-12"
          variants={fadeIn}
          transition={{ delay: 1.0 }}
        >
          <h2 className="text-2xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Getting Started
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Create Problem List',
                desc: 'Organize your daily practice',
                to: '/my-problems',
                icon: null,
              },
              {
                title: 'Add Problems',
                desc: 'Pull from LeetCode, GFG, CF…',
                to: '/add-problem',
                icon: <Code size={16} />,
              },
              {
                title: 'Start Practicing',
                desc: 'Jump right into problems',
                to: null,
                icon: <Shuffle size={16} />,
                onClick: handleRandomize,
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                className="p-6 bg-white rounded-2xl shadow-lg"
                whileHover={{ y: -5, boxShadow: '0px 10px 25px rgba(0,0,0,0.1)' }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{card.desc}</p>
                {card.to ? (
                  <Link to={card.to}>
                    <button className="flex items-center gap-2 border border-purple-600 text-purple-600 px-4 py-2 rounded-lg font-medium">
                      {card.icon} {card.title.includes('Add') ? 'Add' : 'Go'}
                    </button>
                  </Link>
                ) : (
                  <button
                    onClick={card.onClick}
                    className="flex items-center gap-2 border border-purple-600 text-purple-600 px-4 py-2 rounded-lg font-medium"
                  >
                    {card.icon} Randomize
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </MainLayout>
  );
}
