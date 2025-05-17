import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Code, Save, AlertTriangle, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';
import MainLayout from './MainLayout';

const navLinks = [
  { name: 'POTD Calendar', path: '/custom' },
  { name: 'My Problems', path: '/my-problems' },
  { name: 'Add Problem', path: '/add-problem' },
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.5, ease: 'easeOut' }
  })
};

export default function AddProblem() {
  // form state
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState('');
  const [platform, setPlatform] = useState('Codeforces');
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [date, setDate] = useState('');

  const token = sessionStorage.getItem('token');
  const api = axios.create({
    baseURL: 'http://localhost:8080/api/custom/user-potd',
    headers: { Authorization: token },
  });

  // Load lists on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/lists');
        setLists(res.data.lists);
        if (res.data.lists.length) {
          setSelectedList(res.data.lists[0]._id);
        }
      } catch {
        alert('Could not load problem lists.');
      }
    })();
  }, []);

  // Save problem
  const handleAddProblem = async () => {
    if (!selectedList || !title || !link || !platform || !date) {
      return alert('Please fill in all required fields.');
    }
    try {
      await api.post('/list/add-question', {
        listId: selectedList,
        platform,
        title,
        link,
        date,
      });
      alert('Problem added successfully!');
      setTitle(''); setLink(''); setPlatform('Codeforces'); setDate('');
    } catch {
      alert('Failed to add problem. Check console for details.');
    }
  };

  return (
    <MainLayout navLinks={navLinks}>
      <div className="max-w-3xl mx-auto py-10">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: fadeIn.hidden,
            visible: fadeIn.visible(0)
          }}
        >
          <div className="flex items-center mb-2">
            <Code className="mr-2 text-purple-600 h-7 w-7" />
            <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Add Problem
            </h1>
          </div>
          <p className="text-gray-600">Add a coding challenge to your calendar</p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          className="shadow-2xl rounded-lg overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: fadeIn.hidden,
            visible: fadeIn.visible(0.2)
          }}
        >
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4">
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <CalendarDays className="h-5 w-5 text-purple-600" />
              <h2 className="text-xl font-bold">Problem Details</h2>
            </motion.div>
            <motion.p
              className="text-gray-600 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Fill in the information about the problem
            </motion.p>
          </div>

          <div className="p-6 space-y-6">
            {/* Select List */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={{
                hidden: fadeIn.hidden,
                visible: fadeIn.visible(0.5)
              }}
            >
              <label htmlFor="list" className="block text-base">Select List</label>
              <select
                id="list"
                value={selectedList}
                onChange={e => setSelectedList(e.target.value)}
                className="mt-1 h-11 w-full border border-gray-300 rounded px-3"
              >
                {lists.map(lst => (
                  <option key={lst._id} value={lst._id}>
                    {lst.name} {lst.isPublic ? '(Public)' : '(Private)'}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Platform */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={{
                hidden: fadeIn.hidden,
                visible: fadeIn.visible(0.6)
              }}
            >
              <label htmlFor="platform" className="block text-base">Platform</label>
              <select
                id="platform"
                value={platform}
                onChange={e => setPlatform(e.target.value)}
                className="mt-1 h-11 w-full border border-gray-300 rounded px-3"
              >
                <option>LeetCode</option>
                <option>GeeksForGeeks</option>
                <option>Codeforces</option>
                <option>Other</option>
              </select>
            </motion.div>

            {/* Title */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={{
                hidden: fadeIn.hidden,
                visible: fadeIn.visible(0.7)
              }}
            >
              <label htmlFor="title" className="block text-base">Problem Title</label>
              <input
                id="title"
                type="text"
                placeholder="E.g. Two Sum"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="mt-1 h-11 w-full border border-gray-300 rounded px-3"
              />
            </motion.div>

            {/* Link */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={{
                hidden: fadeIn.hidden,
                visible: fadeIn.visible(0.8)
              }}
            >
              <label htmlFor="link" className="block text-base">Problem URL</label>
              <input
                id="link"
                type="url"
                placeholder="https://leetcode.com/problems/two-sum/"
                value={link}
                onChange={e => setLink(e.target.value)}
                className="mt-1 h-11 w-full border border-gray-300 rounded px-3"
              />
              <div className="flex items-start gap-2 text-xs text-gray-500 mt-1">
                <AlertTriangle className="h-4 w-4" />
                <p>Make sure the URL is correct and points directly to the problem</p>
              </div>
            </motion.div>

            {/* Date */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={{
                hidden: fadeIn.hidden,
                visible: fadeIn.visible(0.9)
              }}
            >
              <label htmlFor="date" className="block text-base">Schedule Date</label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="mt-1 h-11 w-full border border-gray-300 rounded px-3"
              />
            </motion.div>

            {/* Save Button */}
            <motion.div
              className="pt-4"
              initial="hidden"
              whileInView="visible"
              variants={{
                hidden: fadeIn.hidden,
                visible: fadeIn.visible(0.8)
              }}
            >
              <motion.button
                onClick={handleAddProblem}
                whileHover={{ scale: 1.03 }}
                className="flex items-center gap-2 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-3 rounded hover:opacity-90"
              >
                <Save className="h-5 w-5" />
                Save Problem
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
