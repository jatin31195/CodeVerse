import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Plus,
  Check,
  FileText,
  ListChecks,
  Eye,
  EyeOff,
  X,
  UserPlus,
  UserMinus
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
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
  visible: { opacity: 1, y: 0 }
};

export default function MyProblem() {
  const [problemLists, setProblemLists] = useState([]);
  const [currentListId, setCurrentListId] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [modalListId, setModalListId] = useState(null);
  const [newListName, setNewListName] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [removeEmail, setRemoveEmail] = useState('');

  const api = axios.create({ baseURL: `${BASE_URL}/api/custom/user-potd`, withCredentials: true });

  useEffect(() => {
    (async () => {
      try {
        const res = await apiRequest(`${BASE_URL}/api/custom/user-potd/lists`, { method: 'GET' });
        if (res.data.success) {
          setProblemLists(res.data.lists);
          if (!currentListId && res.data.lists.length) {
            setCurrentListId(res.data.lists[0]._id);
            localStorage.setItem('currentList', res.data.lists[0]._id);
          }
        } else {
          toast.error(res.data.message || 'Failed to load lists');
        }
      } catch (err) {
        toast.error('Error loading lists: ' + err.message);
      }
    })();
  }, []);

  const handleSelectList = (id) => {
    setCurrentListId(id);
    localStorage.setItem('currentList', id);
    toast.success('Selected problem list changed');
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    const name = newListName.trim();
    if (name.length < 3) {
      toast.error('Name must be at least 3 characters');
      return;
    }
    try {
      const res = await apiRequest(`${BASE_URL}/api/custom/user-potd/list`, {
        method: 'POST',
        body: { name, isPublic },
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.data.success) {
        const created = res.data.list;
        setProblemLists(prev => [...prev, created]);
        setNewListName('');
        setIsCreateOpen(false);
        setCurrentListId(created._id);
        localStorage.setItem('currentList', created._id);
        toast.success('Problem list created successfully!');
      } else {
        toast.error(res.data.message || 'Error creating list');
      }
    } catch {
      toast.error('Could not create list');
    }
  };

  const openAdminModal = (id) => {
    setModalListId(id);
    setIsAdminOpen(true);
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiRequest(`${BASE_URL}/api/custom/user-potd/list/admin`, {
        method: 'POST',
        body: { listId: modalListId, adminEmail: adminEmail.trim() },
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.data.success) {
        toast.success('Admin added successfully');
        setIsAdminOpen(false);
        setAdminEmail('');
      } else {
        toast.error(res.data.message || 'Could not add admin');
      }
    } catch {
      toast.error('Error adding admin');
    }
  };

  const openRemoveModal = (id) => {
    setModalListId(id);
    setIsRemoveOpen(true);
  };

  const handleRemoveSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiRequest(`${BASE_URL}/api/custom/user-potd/list/admin`, {
        method: 'DELETE',
        body: { listId: modalListId, adminEmail: removeEmail.trim() },
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.data.success) {
        toast.success('Admin removed successfully');
        setIsRemoveOpen(false);
        setRemoveEmail('');
      } else {
        toast.error(res.data.message || 'Could not remove admin');
      }
    } catch {
      toast.error('Error removing admin');
    }
  };

  return (
    <MainLayout navLinks={navLinks}>
      <motion.div className="w-full mx-auto py-10" initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5 }}>
        <motion.div className="mb-8" variants={fadeIn} transition={{ delay: 0.1 }}>
          <div className="flex items-center mb-2">
            <ListChecks className="mr-2 text-purple-600 h-7 w-7" />
            <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              My Custom POTD Lists
            </h1>
          </div>
          <p className="text-gray-600">Manage your problem collections</p>
        </motion.div>

        <motion.div className="flex justify-between items-center mb-6" variants={fadeIn} transition={{ delay: 0.2 }}>
          <h2 className="text-xl font-semibold">Your Lists</h2>
          <motion.button onClick={() => setIsCreateOpen(true)} whileHover={{ scale: 1.05 }} className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded">
            <Plus className="h-4 w-4" /> Create New List
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {isCreateOpen && (
            <motion.div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-lg z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div className="relative bg-white rounded-lg p-6 w-full max-w-sm" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} transition={{ type: 'spring', stiffness: 300 }}>
                <button onClick={() => setIsCreateOpen(false)} className="absolute top-3 right-3 p-1 hover:bg-gray-200 rounded">
                  <X className="h-5 w-5 text-gray-600" />
                </button>
                <form onSubmit={handleCreateList}>
                  <h2 className="text-xl font-bold mb-4">Create a new problem list</h2>
                  <input type="text" placeholder="e.g. DP Problems" value={newListName} onChange={e => setNewListName(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 mb-4" />
                  <select value={isPublic ? 'public' : 'private'} onChange={e => setIsPublic(e.target.value === 'public')} className="w-full border border-gray-300 rounded px-3 py-2 mb-4">
                    <option value="private">Private</option>
                    <option value="public">Public</option>
                  </select>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setIsCreateOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
                    <motion.button type="submit" whileHover={{ scale: 1.05 }} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded">Create List</motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isAdminOpen && (
            <motion.div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-lg z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div className="relative bg-white rounded-lg p-6 w-full max-w-sm" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} transition={{ type: 'spring', stiffness: 300 }}>
                <button onClick={() => setIsAdminOpen(false)} className="absolute top-3 right-3 p-1 hover:bg-gray-200 rounded">
                  <X className="h-5 w-5 text-gray-600" />
                </button>
                <form onSubmit={handleAdminSubmit}>
                  <h2 className="text-xl font-bold mb-4">Add admin by email</h2>
                  <input type="email" placeholder="user@example.com" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 mb-4" required />
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setIsAdminOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
                    <motion.button type="submit" whileHover={{ scale: 1.05 }} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded">Add Admin</motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isRemoveOpen && (
            <motion.div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-lg z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div className="relative bg-white rounded-lg p-6 w-full max-w-sm" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} transition={{ type: 'spring', stiffness: 300 }}>
                <button onClick={() => setIsRemoveOpen(false)} className="absolute top-3 right-3 p-1 hover:bg-gray-200 rounded">
                  <X className="h-5 w-5 text-gray-600" />
                </button>
                <form onSubmit={handleRemoveSubmit}>
                  <h2 className="text-xl font-bold mb-4">Remove admin by email</h2>
                  <input type="email" placeholder="user@example.com" value={removeEmail} onChange={e => setRemoveEmail(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 mb-4" required />
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setIsRemoveOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
                    <motion.button type="submit" whileHover={{ scale: 1.05 }} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded">Remove Admin</motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {problemLists.map(list => (
            <ListCard
              key={list._id}
              list={list}
              isCurrent={list._id === currentListId}
              onSelect={() => handleSelectList(list._id)}
              onAddAdmin={() => openAdminModal(list._id)}
              onRemoveAdmin={() => openRemoveModal(list._id)}
              api={api}
            />
          ))}
        </div>
      </motion.div>
    </MainLayout>
  );
}

function ListCard({ list, isCurrent, onSelect, onAddAdmin, onRemoveAdmin, api }) {
  const [count, setCount] = useState(0);
  const [publicState, setPublicState] = useState(list.isPublic);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiRequest(`${BASE_URL}/api/custom/user-potd/list/${list._id}/questions`, { method: 'GET' });
        const total = Array.isArray(res.data.questions)
          ? res.data.questions.reduce((sum, entry) => sum + (Array.isArray(entry.problems) ? entry.problems.length : 0), 0)
          : 0;
        setCount(total);
      } catch {
        setCount(0);
      }
    })();
  }, [list._id]);

  const toggleVisibility = async () => {
    try {
      const res = await apiRequest(`${BASE_URL}/api/custom/user-potd/list/${list._id}/visibility`, {
        method: 'PATCH',
        body: { isPublic: !publicState },
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.data.success) {
        setPublicState(res.data.list.isPublic);
        toast.success(`List is now ${res.data.list.isPublic ? 'Public' : 'Private'}`);
      }
    } catch {
      toast.error('Could not update visibility');
    }
  };

  return (
    <motion.div className={`shadow-xl rounded-lg p-4 border ${isCurrent ? 'border-purple-600' : 'border-gray-300'}`} variants={fadeIn} initial="hidden" animate="visible" transition={{ duration: 0.4 }} whileHover={{ scale: 1.02, boxShadow: '0px 8px 20px rgba(0,0,0,0.1)' }}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-bold flex items-center">{list.name}</h3>
          <p className="text-sm text-gray-500">Created on {format(new Date(list.createdAt), 'MMM d, yyyy')}</p>
        </div>
        <div className="flex gap-2">
          <div className="relative group">
            <button onClick={toggleVisibility} className="p-2 hover:bg-gray-100 rounded">
              {publicState ? <Eye className="h-5 w-5 text-green-600" /> : <EyeOff className="h-5 w-5 text-red-600" />}
            </button>
            <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-white text-gray-800 text-xs px-2 py-1 rounded shadow">
              Change Visibility
            </span>
          </div>
          <div className="relative group">
            <button onClick={onAddAdmin} className="p-2 hover:bg-gray-100 rounded">
              <UserPlus className="h-5 w-5 text-blue-600" />
            </button>
            <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-white text-gray-800 text-xs px-2 py-1 rounded shadow">
              Add Admin
            </span>
          </div>
          <div className="relative group">
            <button onClick={onRemoveAdmin} className="p-2 hover:bg-gray-100 rounded">
              <UserMinus className="h-5 w-5 text-red-600" />
            </button>
            <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-white text-gray-800 text-xs px-2 py-1 rounded shadow">
              Remove Admin
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <FileText className="mr-2 h-4 w-4 text-purple-600" />
        {count} {count === 1 ? 'problem' : 'problems'} assigned
      </div>
      <motion.button onClick={isCurrent ? undefined : onSelect} disabled={isCurrent} whileHover={!isCurrent ? { scale: 1.03 } : {}} className={`w-full flex items-center justify-center px-4 py-2 rounded transition-all duration-200 ${isCurrent ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'border border-purple-600 text-purple-600 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 hover:text-white'}`}>
        {isCurrent ? <><Check className="mr-1 h-4 w-4" /> Current List</> : 'Select List'}
      </motion.button>
    </motion.div>
  );
}
