import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../config';
import { apiRequest } from '../utils/api';
import {toast} from 'react-toastify'
export default function DailyGoalsCard() {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');

const loadGoals = async () => {
  try {
    const res = await apiRequest(`${BASE_URL}/api/tasks/`, { method: 'GET' });
    const data = res.data;

    if (Array.isArray(data)) {
      const sorted = data
        .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
        .slice(0, 3);
      setGoals(sorted);
    }
  } catch (err) {
    toast.error('Error loading goals');
  }
};


useEffect(() => {
  loadGoals();
}, []);

const addGoal = async () => {
  if (!newGoal.trim()) return;
  try {
    await apiRequest(`${BASE_URL}/api/tasks/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        task: newGoal,
        date: new Date().toISOString().slice(0, 10),
        endDateTime: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      }),
    });
    setNewGoal('');
    loadGoals();
  } catch (err) {
    toast.error('Error adding goal');
  }
};

const toggleGoal = async (id) => {
  try {
    await apiRequest(`${BASE_URL}/api/tasks/${id}`, {
      method: 'DELETE',
    });
    loadGoals();
  } catch (err) {
    toast.error('Error toggling goal');
  }
};


  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
      <h2 className="text-2xl font-bold mb-3">Today's Coding Goals</h2>
      <p className="text-gray-600 mb-6">Set and track your daily programming goals</p>

      {/* Add new */}
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Add a new goal..."
          value={newGoal}
          onChange={e => setNewGoal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addGoal()}
          className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none"
        />
        <button
          onClick={addGoal}
          className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition"
        >
          Add
        </button>
      </div>

      {/* Top 3 tasks */}
      <div className="space-y-3 max-h-60 overflow-y-auto mb-6">
        {goals.map(goal => (
          <div
            key={goal._id}
            className={`flex justify-between items-center p-3 border rounded-md ${
              goal.completed
                ? 'bg-green-50 border-green-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              <button onClick={() => toggleGoal(goal._id)} className="focus:outline-none">
                <Star
                  className={`h-5 w-5 ${
                    goal.completed ? 'text-green-500' : 'text-gray-400'
                  }`}
                />
              </button>
              <span className={goal.completed ? 'line-through text-gray-500' : 'text-gray-800'}>
                {goal.task}
              </span>
            </div>
          </div>
        ))}
      </div>

      
      <Link
        to="/task"
        className="w-full inline-block text-center border border-blue-600 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white transition"
      >
        Manage All Tasks
      </Link>
    </div>
  );
}
