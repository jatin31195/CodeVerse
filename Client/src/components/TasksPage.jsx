import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Plus,
  Edit,
  Calendar,
  SquareCheck,
  PanelRight,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:8080/api';


const ToggleSwitch = ({ enabled, onChange }) => {
  return (
    <div
      onClick={() => onChange(!enabled)}
      className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors ${
        enabled ? 'bg-blue-500' : 'bg-gray-300'
      }`}
    >
      <motion.div
        layout
        className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow"
        animate={{ x: enabled ? 24 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />
    </div>
  );
};


const TaskCard = ({ task, onTaskUpdated, onEdit }) => {
  const now = new Date();
  const dueDate = new Date(task.endDateTime);
  const hoursUntilDue = (dueDate - now) / 36e5;
  const isDueSoon = !task.completed && hoursUntilDue <= 24 && hoursUntilDue > 0;
  const [reminderEnabled, setReminderEnabled] = useState(Boolean(task.reminderEnabled));
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    setReminderEnabled(Boolean(task.reminderEnabled));
  }, [task.reminderEnabled]);

  
  const completeTask = async () => {
    await fetch(`${API_BASE}/tasks/${task._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: sessionStorage.getItem('token') || '',
      },
    });
    onTaskUpdated();
  };

  
  const toggleReminder = async (newVal) => {
    setReminderEnabled(newVal); 
    const res = await fetch(`${API_BASE}/tasks/${task._id}/reminder`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: sessionStorage.getItem('token') || '',
      },
      body: JSON.stringify({ enabled: newVal }),
    });
    if (!res.ok) {
      setReminderEnabled(prev => !prev);
      console.error('Failed toggling reminder');
    } else {
      onTaskUpdated();
    }
  };

  const dateString = new Date(task.date).toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const endTimeString = dueDate.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className="border rounded-lg p-4 mb-4 relative">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={completeTask}
          className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded"
        />

        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">
            {task.task ?? 'Untitled Task'}
          </h3>

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{dateString}</span>
            <span>•</span>
            <span>{endTimeString}</span>
            {isDueSoon && (
              <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <Bell className="w-3 h-3" />
                Due soon
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <ToggleSwitch
              enabled={reminderEnabled}
              onChange={toggleReminder}
            />
            <span className="text-sm text-gray-600">Email notification</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 absolute bottom-3 right-3">
        <button
          onClick={() => onEdit(task)}
          className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <Edit className="w-5 h-5" />
        </button>
        {!task.completed && (
          <div className="relative group">
            <button
              onClick={completeTask}
              className="p-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <SquareCheck className="w-6 h-6" />
            </button>
            <span className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-700 text-white text-xs px-2 py-1 rounded transition-opacity">
              Mark as complete
            </span>
          </div>
        )}
      </div>
    </div>
  );
};


const NewTaskForm = ({ task, onSuccess }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    if (task) {
      setTaskTitle(task.task || '');
      const end = new Date(task.endDateTime);
      setDate(end.toISOString().slice(0, 10));
      setTime(end.toTimeString().slice(0, 5));
    } else {
      setTaskTitle('');
      setDate('');
      setTime('');
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endISO = new Date(`${date}T${time}`).toISOString();

    const method = task ? 'PUT' : 'POST';
    const url = task
      ? `${API_BASE}/tasks/${task._id}`
      : `${API_BASE}/tasks/`;

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: sessionStorage.getItem('token') || '',
      },
      body: JSON.stringify({
        task: taskTitle,
        endDateTime: endISO,
      }),
    });

    if (!res.ok) {
      console.error('Failed to save task', await res.json());
      return;
    }

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Task Title</label>
        <input
          type="text"
          placeholder="Enter your task"
          value={taskTitle}
          onChange={e => setTaskTitle(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Time</label>
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-md hover:shadow-md transition-all"
      >
        {task ? 'Update Task' : 'Add Task'}
      </button>
    </form>
  );
};



const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="relative bg-white p-6 rounded-md shadow-lg max-w-lg w-full"
      >
        {children}
      </motion.div>
    </div>
  );
};


const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [dueSoonCount, setDueSoonCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [showUserMenu, setShowUserMenu] = useState(false);
  const toggleSidebar = () => setSidebarOpen(prev => !prev);
   const handleLogout = () => {
    sessionStorage.removeItem('token');
    setUser(null);
    setShowUserMenu(false);
    navigate('/login');
  };

  const getInitials = (name) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  const loadTasks = async () => {
    const token = sessionStorage.getItem('token');
    const res = await fetch(`${API_BASE}/tasks/`, {
      headers: { Authorization: token || '' },
    });
    const data = await res.json();
    if (!Array.isArray(data)) return;

    data.sort(
      (a, b) =>
        new Date(a.endDateTime).getTime() -
        new Date(b.endDateTime).getTime()
    );
    setTasks(data);

    const now = new Date();
    const soonCount = data.filter(t => {
      const diff = new Date(t.endDateTime) - now;
      return diff <= 24 * 60 * 60 * 1000 && diff > 0 && !t.completed;
    }).length;
    setDueSoonCount(soonCount);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    const intv = setInterval(loadTasks, 60_000);
    return () => clearInterval(intv);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
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

      <header className="sticky top-0 z-50 bg-white bg-opacity-95 backdrop-blur-sm shadow-md">
  <div className="container mx-auto relative flex h-16 items-center px-6">
    
    <div className="flex items-center">
      <button
        onClick={toggleSidebar}
        className="p-2 rounded hover:bg-gray-100 transition"
        aria-label="Toggle sidebar"
      >
        <PanelRight className="w-6 h-6 text-gray-700" />
      </button>
    </div>

    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Link to="/home" className="flex-shrink-0">
            <img
              src="/codelogo1.png"
              alt="CodeVerse"
              className="h-12 w-auto"
            />
          </Link>
      <p className="text-xs text-gray-500 -mt-1 ml-6">Task Management</p>
        </div>

   
    <div className="ml-auto flex items-center gap-4">
      
      <button className="flex items-center gap-2 text-sm bg-yellow-100 text-yellow-700 px-3 py-2 rounded-md hover:bg-yellow-200 transition-all">
        <Bell className="w-4 h-4" />
        {dueSoonCount} task{dueSoonCount !== 1 && 's'} due soon
      </button>

     
      {user && (
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(prev => !prev)}
            className="w-10 h-10 rounded-full border-2 border-blue-500 hover:border-green-400 transition overflow-hidden flex items-center justify-center bg-gray-100"
            aria-label="User menu"
          >
            {user.profilePic ? (
              <img
                src={user.profilePic}
                alt={user.name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-sm font-semibold text-gray-700">
                {getInitials(user.name)}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden z-50"
              >
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    toggleSidebar();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm"
                >
                  <LayoutPanelLeft className="w-4 h-4" />
                  Open Sidebar
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  </div>
</header>


      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold">Your Tasks</h2>
          <button
            onClick={() => setAddTaskOpen(true)}
            className="ml-auto inline-flex items-center gap-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-md hover:shadow-md transition-all"
          >
            <Plus className="w-4 h-4 cursor-pointer" />
            Add New Task
          </button>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center p-8 border border-dashed border-gray-300 rounded-md bg-gray-50">
            <Bell className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No tasks found
            </h3>
            <p className="text-gray-500 mb-4">
              You don't have any tasks yet.
            </p>
            <button
              onClick={() => setAddTaskOpen(true)}
              className="cursor-pointer inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-md hover:shadow-lg transition-all"
            >
              <Plus className="mr-2 h-4 w-4 cursor-pointer" />
              Add Your First Task
            </button>
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard
              key={task._id}
              task={task}
              onTaskUpdated={loadTasks}
              onEdit={t => setEditTask(t)}
            />
          ))
        )}
      </main>

     
      <Modal open={addTaskOpen} onClose={() => setAddTaskOpen(false)}>  
        <h2 className="text-xl font-bold mb-4 cursor-pointer">Add New Task</h2>
        <NewTaskForm
          onSuccess={() => {
            setAddTaskOpen(false);
            loadTasks();
          }}
        />
      </Modal>

     
      <Modal open={Boolean(editTask)} onClose={() => setEditTask(null)}>
        {editTask && (
          <>
            <h2 className="text-xl font-bold mb-4 cursor-pointer">Edit Task</h2>
            <NewTaskForm
              task={editTask}
              onSuccess={() => {
                setEditTask(null);
                loadTasks();
              }}
            />
          </>
        )}
      </Modal>
    </div>
  );
};

export default TasksPage;