import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Plus,
  Check,
  FileText,
  ListChecks,
  Eye,
  EyeOff,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from './MainLayout';
import {toast} from 'react-toastify'

const navLinks = [
  { name: 'POTD Calendar', path: '/custom' },
  { name: 'My Problems', path: '/my-problems' },
  { name: 'Add Problem', path: '/add-problem' },
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function MyProblem() {
  const [problemLists, setProblemLists] = useState([]);
  const [currentListId, setCurrentListId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const raw = sessionStorage.getItem('token') || '';
  const token = (() => {
    try { return JSON.parse(raw).token; }
    catch { return raw; }
  })();

  const api = axios.create({
    baseURL: 'http://localhost:8080/api/custom/user-potd',
    headers: { Authorization: token },
  });

  // fetch own lists
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/lists');
        if (res.data.success) {
          setProblemLists(res.data.lists);
          if (!currentListId && res.data.lists.length) {
            setCurrentListId(res.data.lists[0]._id);
            localStorage.setItem('currentList', res.data.lists[0]._id);
          }
        }
      } catch (err) {
        toast.error('Error loading lists:', err);
      }
    })();
  }, []);

  const handleSelectList = (listId) => {
    setCurrentListId(listId);
    localStorage.setItem('currentList', listId);
    toast.success('Selected problem list changed');
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    const name = newListName.trim();
    if (name.length < 3){ toast.error('Name must be at least 3 characters');return; }
    try {
      const res = await api.post('/list', { name, isPublic });
      if (res.data.success) {
        const created = res.data.list;
        setProblemLists((prev) => [...prev, created]);
        setNewListName('');
        setIsDialogOpen(false);
        setCurrentListId(created._id);
        localStorage.setItem('currentList', created._id);
        toast.success('Problem list created successfully!');
      } else {
        toast.error(res.data.message || 'Error creating list');
      }
    } catch (err) {
      console.error('Create list failed:', err);
      toast.error('Could not create list');
    }
  };

  return (
    <MainLayout navLinks={navLinks}>
      <motion.div
        className="w-full mx-auto py-10"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div
          className="mb-8"
          variants={fadeIn}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center mb-2">
            <ListChecks className="mr-2 text-purple-600 h-7 w-7" />
            <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              My Problem Lists
            </h1>
          </div>
          <p className="text-gray-600">Manage your problem collections</p>
        </motion.div>

        {/* Create Button */}
        <motion.div
          className="flex justify-between items-center mb-6"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold">Your Lists</h2>
          <motion.button
            onClick={() => setIsDialogOpen(true)}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded"
          >
            <Plus className="h-4 w-4" /> Create New List
          </motion.button>
        </motion.div>

        {/* Create Modal */}
        <AnimatePresence>
          {isDialogOpen && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative bg-white rounded-lg p-6 w-full max-w-sm"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="absolute top-3 right-3 p-1 hover:bg-gray-200 rounded"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>

                <h2 className="text-xl font-bold mb-4">Create a new problem list</h2>
                <p className="mb-4 text-gray-600">
                  Give your problem list a name and visibility.
                </p>
                <form onSubmit={handleCreateList}>
                  <input
                    type="text"
                    placeholder="e.g. DP Problems"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                  />

                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Visibility
                  </label>
                  <select
                    value={isPublic ? 'public' : 'private'}
                    onChange={(e) => setIsPublic(e.target.value === 'public')}
                    className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                  >
                    <option value="private">Private</option>
                    <option value="public">Public</option>
                  </select>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsDialogOpen(false)}
                      className="px-4 py-2 border rounded"
                    >
                      Cancel
                    </button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded"
                    >
                      Create List
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* List Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {problemLists.map((list) => (
            <ListCard
              key={list._id}
              list={list}
              isCurrent={list._id === currentListId}
              onSelect={() => handleSelectList(list._id)}
              api={api}
            />
          ))}
        </div>
      </motion.div>
    </MainLayout>
  );
}

function ListCard({ list, isCurrent, onSelect, api }) {
  const [count, setCount] = useState(0);
  const [publicState, setPublicState] = useState(list.isPublic);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/list/${list._id}/questions`);
        setCount(Array.isArray(res.data.questions) ? res.data.questions.length : 0);
      } catch {
        setCount(0);
      }
    })();
  }, [list._id, api]);

  const toggleVisibility = async () => {
    try {
      const res = await api.patch(`/list/${list._id}/visibility`, {
        isPublic: !publicState
      });
      if (res.data.success) {
        setPublicState(res.data.list.isPublic);
        toast.success(`List is now ${res.data.list.isPublic ? 'Public' : 'Private'}`);
      }
    } catch (err) {
      console.error('Visibility update failed:', err);
      toast.error('Could not update visibility');
    }
  };

  return (
    <motion.div
      className={`shadow-xl rounded-lg p-4 border ${
        isCurrent ? 'border-purple-600' : 'border-gray-300'
      }`}
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02, boxShadow: '0px 8px 20px rgba(0,0,0,0.1)' }}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-bold flex items-center">
            {list.name}
          </h3>
          <p className="text-sm text-gray-500">
            Created on {format(new Date(list.createdAt), 'MMM d, yyyy')}
          </p>
        </div>
        <button
          onClick={toggleVisibility}
          title={publicState ? 'Public' : 'Private'}
          className="p-2 hover:bg-gray-100 rounded"
        >
          {publicState
            ? <Eye className="h-5 w-5 text-green-600" />
            : <EyeOff className="h-5 w-5 text-red-600" />}
        </button>
      </div>

      <div className="flex items-center text-sm text-gray-600 mb-4">
        <FileText className="mr-2 h-4 w-4 text-purple-600" />
        {count} {count === 1 ? 'problem' : 'problems'} assigned
      </div>

      <motion.button
        onClick={isCurrent ? undefined : onSelect}
        disabled={isCurrent}
        whileHover={!isCurrent ? { scale: 1.03 } : {}}
        className={`
          w-full flex items-center justify-center 
          px-4 py-2 rounded transition-all duration-200
          ${isCurrent
            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
            : 'border border-purple-600 text-purple-600 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 hover:text-white'
          }
        `}
      >
        {isCurrent
          ? <><Check className="mr-1 h-4 w-4" /> Current List</>
          : 'Select List'}
      </motion.button>
    </motion.div>
  );
}
