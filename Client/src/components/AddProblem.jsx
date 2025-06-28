import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, AlertTriangle, CalendarDays, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';
import MainLayout from './MainLayout';
import { toast } from 'react-toastify';
import { BASE_URL } from '../config';
import { apiRequest } from '../utils/api';

const navLinks = [
  { name: 'POTD Calendar', path: '/custom' },
  { name: 'My Lists', path: '/my-problems' },
  { name: 'Add Problem', path: '/add-problem' },
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.5, ease: 'easeOut' },
  }),
};

export default function AddProblem() {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState('');
  const [link, setLink] = useState('');
  const [date, setDate] = useState('');
  const [platform, setPlatform] = useState('');
  const [title, setTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const api = axios.create({
    baseURL: `${BASE_URL}/api/custom/user-potd`,
    withCredentials: true,
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await apiRequest(`${BASE_URL}/api/custom/user-potd/lists`, {
          method: 'GET',
        });
        setLists(res.data.lists || []);
        if (res.data.lists.length) {
          setSelectedList(res.data.lists[0]._id);
        }
      } catch (err) {
        console.error(err);
        toast.warning('Could not load your problem lists.');
      }
    })();
  }, []);

  useEffect(() => {
    let cancelled = false;
    setTitle('');
    setPlatform('');

    try {
      const url = new URL(link.trim());
      const host = url.hostname.toLowerCase();
      const path = url.pathname;

      if (host.includes('leetcode.com')) {
        setPlatform('LeetCode');

        const parts = path.split('/').filter(Boolean);
        const idx = parts.indexOf('problems');
        if (idx !== -1 && parts[idx + 1]) {
          const slug = parts[idx + 1];
          setTitle(
            slug
              .split('-')
              .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
              .join(' ')
          );
        }
      } else if (host.includes('geeksforgeeks.org')) {
        setPlatform('GeeksForGeeks');

        const parts = path.split('/').filter(Boolean);
        const idx = parts.indexOf('problems');
        if (idx !== -1 && parts[idx + 1]) {
          const slug = parts[idx + 1].replace(/\d+$/, '');
          setTitle(
            slug
              .split('-')
              .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
              .join(' ')
          );
        }
      } else if (host.includes('codeforces.com')) {
        setPlatform('Codeforces');

        const parts = path.split('/').filter(Boolean);
        let contestId, letter;
        const ci = parts.indexOf('problemset');
        const cj = parts.indexOf('contest');
        if (ci !== -1 && parts[ci + 2] && parts[ci + 3]) {
          contestId = parts[ci + 2];
          letter = parts[ci + 3];
        } else if (cj !== -1 && parts[cj + 1] && parts[cj + 3]) {
          contestId = parts[cj + 1];
          letter = parts[cj + 3];
        }

        if (contestId && letter) {
          fetch(link, {
            mode: 'cors',
          })
            .then((res) => res.text())
            .then((html) => {
              if (cancelled) return;
              const doc = new DOMParser().parseFromString(html, 'text/html');
              const titleDiv = doc.querySelector(
                '.problem-statement .header .title'
              );
              if (titleDiv) {
                setTitle(titleDiv.textContent.trim());
              } else {
                setTitle(`Problem ${contestId}${letter}`);
              }
            })
            .catch((err) => {
              console.error('CF fetch failed', err);
              if (!cancelled) {
                setTitle(`Problem ${contestId}${letter}`);
              }
            });
        } else {
          setTitle('');
        }
      } else {
        setPlatform('Other');
        setTitle('');
      }
    } catch {
      setPlatform('');
      setTitle('');
    }

    return () => {
      cancelled = true;
    };
  }, [link]);

  const handleAddProblem = async () => {
    if (!selectedList || !link || !date) {
      toast.warning('Please choose a list, paste the URL, and pick a date.');
      return;
    }
    try {
      await apiRequest(
        `${BASE_URL}/api/custom/user-potd/list/add-question`,
        {
          method: 'POST',
          data: {
            listId: selectedList,
            platform,
            title,
            link,
            date,
          },
        }
      );
      toast.success('Problem added successfully!');
      setLink('');
      setDate('');
      setIsEditingTitle(false);
    } catch (err) {
      console.error(err);
      toast.error(
        'Failed to add problem. Problem already exist or Internal Error'
      );
    }
  };

  return (
    <MainLayout navLinks={navLinks}>
      <div className="max-w-3xl mx-auto py-10">
        <motion.div
          className="mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: fadeIn.hidden,
            visible: fadeIn.visible(0),
          }}
        >
          <div className="flex items-center mb-2">
            <CalendarDays className="mr-2 text-purple-600 h-7 w-7" />
            <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Add Problem
            </h1>
          </div>
          <p className="text-gray-600">Just paste the URL and pick a date.</p>
        </motion.div>

        <motion.div
          className="shadow-2xl rounded-lg overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: fadeIn.hidden,
            visible: fadeIn.visible(0.2),
          }}
        >
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-purple-600" />
              Problem Details
            </h2>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label htmlFor="list" className="block text-base">
                Select List
              </label>
              <select
                id="list"
                value={selectedList}
                onChange={(e) => setSelectedList(e.target.value)}
                className="mt-1 h-11 w-full border border-gray-300 rounded px-3"
              >
                {lists.map((lst) => (
                  <option key={lst._id} value={lst._id}>
                    {lst.name} {lst.isPublic ? '(Public)' : '(Private)'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="link" className="block text-base">
                Problem URL
              </label>
              <input
                id="link"
                type="url"
                placeholder="https://codeforces.com/…"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="mt-1 h-11 w-full border border-gray-300 rounded px-3"
              />
              <div className="flex items-start gap-2 text-xs text-gray-500 mt-1">
                <AlertTriangle className="h-4 w-4" />
                <p>Paste a public problem link (CF, LC, GFG).</p>
              </div>
            </div>

            <div className="space-y-1 text-sm text-gray-600">
              <p>
                <strong>Platform:</strong> {platform || '—'}
              </p>
              <p className="flex items-center gap-2">
                <strong>Title:</strong>
                {isEditingTitle ? (
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={() => setIsEditingTitle(false)}
                    className="h-8 border border-gray-300 rounded px-2"
                    autoFocus
                  />
                ) : (
                  <>
                    <span>{title || '—'}</span>
                    {title && (
                      <Edit2
                        onClick={() => setIsEditingTitle(true)}
                        className="h-4 w-4 text-gray-500 cursor-pointer"
                      />
                    )}
                  </>
                )}
              </p>
            </div>

            <div>
              <label htmlFor="date" className="block text-base">
                Schedule Date
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 h-11 w-full border border-gray-300 rounded px-3"
              />
            </div>

            <div className="pt-4">
              <motion.button
                onClick={handleAddProblem}
                whileHover={{ scale: 1.03 }}
                className="flex items-center gap-2 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-3 rounded hover:opacity-90"
              >
                <Save className="h-5 w-5" />
                Save Problem
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
