import React, { Fragment, useState, useEffect } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ChevronDown, Search, Shuffle, ExternalLink, Code } from 'lucide-react';
import { motion } from 'framer-motion';
import {toast} from 'react-toastify'
import MainLayout from './MainLayout';
import POTDCalendar from './POTDCalendar';
import { BASE_URL } from '../config';
import { apiRequest } from '../utils/api';
const navLinks = [
  { name: 'POTD Calendar', path: '/custom' },
  { name: 'My Problems', path: '/my-problems' },
  { name: 'Add Problem', path: '/add-problem' },
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function CustomPOTD() {
 
  const [allLists, setAllLists] = useState([]);

  const [filteredLists, setFilteredLists] = useState([]);

  const [currentList, setCurrentList] = useState(null);
  const [problemsMap, setProblemsMap] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [loadingLists, setLoadingLists] = useState(true);
  const [loadingProblems, setLoadingProblems] = useState(false);
  useEffect(() => {
  const fetchLists = async () => {
    setLoadingLists(true);
    try {
      const own = await apiRequest(`${BASE_URL}/api/custom/user-potd/lists`, { method: 'GET' });
      const pub = await apiRequest(`${BASE_URL}/api/custom/user-potd/lists/public`, { method: 'GET' });

      const combined = [...own.data.lists, ...pub.data.lists];

      setAllLists(combined);
      setFilteredLists(combined);

      if (combined.length) {
        selectList(combined[0]._id);
      }
    } catch (err) {
      toast.error('Failed to fetch lists: ' + (err.message || err));
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
    const res = await apiRequest(`${BASE_URL}/api/custom/user-potd/list/${listId}/questions`, { method: 'GET' });
    const map = res.data.questions.reduce((acc, q) => {
      acc[format(new Date(q.date), 'yyyy-MM-dd')] = q;
      return acc;
    }, {});
    setProblemsMap(map);
  } catch (err) {
    toast.error('Failed to fetch list questions: ' + (err.message || err));
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
    if (!allLists.length) return;
    const pick = allLists[Math.floor(Math.random() * allLists.length)];
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
                className="cursor-pointer flex items-center gap-2 border border-purple-600 text-purple-600 px-5 py-2 rounded-lg font-semibold"
              >
                <Code size={18} /> Add Problem
              </motion.button>
            </Link>
            <motion.button
              onClick={handleRandomize}
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-5 py-2 rounded-lg font-semibold"
            >
              <Shuffle size={18} /> Randomize
            </motion.button>
          </div>
        </motion.div>

        
        <motion.div
          className="mb-8 md:w-1/3 relative"
          variants={fadeIn}
          transition={{ delay: 0.4 }}
        >
          <Combobox value={currentList} onChange={selectList}>
            <label className="block text-gray-700 mb-2 font-medium">
              Choose List
            </label>
            <div className="relative">
              <Combobox.Input
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                placeholder="Search or select a list..."
                onChange={(e) => {
                  const q = e.target.value.toLowerCase();
                  if (!q) {
                    setFilteredLists(allLists);
                    return;
                  }
                  const filtered = allLists.filter((l) =>
                    l.name.toLowerCase().includes(q)
                  );
                  setFilteredLists(filtered);
                }}
                displayValue={(id) =>
                  allLists.find((l) => l._id === id)?.name || ''
                }
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </Combobox.Button>
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setFilteredLists(allLists)}
            >
              <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {loadingLists ? (
                  <div className="px-4 py-2 text-gray-400">Loading...</div>
                ) : filteredLists.length === 0 ? (
                  <div className="px-4 py-2 text-gray-400">No lists found.</div>
                ) : (
                  filteredLists.map((lst) => (
                    <Combobox.Option
                      key={lst._id}
                      value={lst._id}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-4 pr-10 ${
                          active
                            ? 'bg-purple-100 text-purple-900'
                            : 'text-gray-800'
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? 'font-semibold' : ''
                            }`}
                          >
                            {lst.name}{' '}
                            {lst.isPublic ? '(Public)' : '(Private)'}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 right-3 flex items-center text-purple-600">
                              ✓
                            </span>
                          )}
                        </>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Transition>
          </Combobox>
        </motion.div>

      
        <div className="grid gap-8 md:grid-cols-3">
          <motion.div
            className="md:col-span-2"
            variants={fadeIn}
            transition={{ delay: 0.6 }}
          >
            <POTDCalendar
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              platform={
                selectedProblem
                  ? selectedProblem.platform.toLowerCase()
                  : 'other'
              }
              showAddIcon={false}
            />
          </motion.div>

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
                {selectedProblem
                  ? 'Problem details'
                  : 'No problem assigned'}
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
                      Add problem for{' '}
                      {format(selectedDate, 'MMMM d, yyyy')}
                    </h3>
                    <Link
                      to={`/add-problem?date=${format(
                        selectedDate,
                        'yyyy-MM-dd'
                      )}`}
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="cursor-pointer flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-5 py-2 rounded-lg font-semibold"
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
                    className="cursor-pointer w-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
                  >
                    <ExternalLink className="mr-2" /> Solve on{' '}
                    {selectedProblem.platform}
                  </motion.button>
                </Link>
              ) : (
                <Link to="/my-problems">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    className="cursor-pointer w-full border border-purple-600 text-purple-600 px-4 py-2 rounded-lg font-semibold"
                  >
                    Browse My Problem Lists
                  </motion.button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>

        
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
                whileHover={{
                  y: -5,
                  boxShadow: '0px 10px 25px rgba(0,0,0,0.1)',
                }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <h3 className="text-lg font-semibold mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  {card.desc}
                </p>
                {card.to ? (
                  <Link to={card.to}>
                    <button className="cursor-pointer flex items-center gap-2 border border-purple-600 text-purple-600 px-4 py-2 rounded-lg font-medium">
                      {card.icon}{' '}
                      {card.title.includes('Add') ? 'Add' : 'Go'}
                    </button>
                  </Link>
                ) : (
                  <button
                    onClick={card.onClick}
                    className="cursor-pointer flex items-center gap-2 border border-purple-600 text-purple-600 px-4 py-2 rounded-lg font-medium"
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
