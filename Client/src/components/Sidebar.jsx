import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home, Calendar, Star, Users, MessageSquare, Settings, LayoutDashboard,
  Clock, BookOpen, PlusCircle, PanelLeftClose,Bug
} from "lucide-react";
import { BASE_URL } from '../config';
import { apiRequest } from '../utils/api';
export function Sidebar({ toggleSidebar }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

 useEffect(() => {
  (async () => {
    try {
      const res = await apiRequest(`${BASE_URL}/api/auth/profile`, {
        method: 'GET',
      });
      setUser(res.data.data.user);
    } catch {
      setUser(null);
    }
  })();
}, []);


const handleLogout = async () => {
  try {
    document.cookie = 'token=; Max-Age=0; path=/;';
    await fetch(`${BASE_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include', 
    });
  } catch (err) {
    console.error('Logout failed', err);
  } finally {
    setUser(null);
    navigate('/login');
  }
};


  const navigationItems = [
    { title: "Home", icon: Home, path: "/home" },
    { title: "POTD", icon: Calendar, path: "/potd" },
    { title: "Custom POTD", icon: PlusCircle, path: "/custom" },
    { title: "Favorites", icon: Star, path: "/fav" },
    { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { title: "Daily Tasks", icon: BookOpen, path: "/task" },
    { title: "Time Table", icon: Clock, path: "/schedule" },
    { title: "Doubt Support", icon: Users, path: "/community" },
    { title: "Report Issue", icon: Bug, path: "/report-issue" },
  ];

  return (
    <motion.div
      className="fixed top-0 left-0 h-screen w-72 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 shadow-lg z-40 flex flex-col"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/org_codeverse.png" alt="CodeVerse Logo" className="w-10 h-10 rounded-lg" />
          <div>
            <h3 className="font-semibold text-gray-900 text-base tracking-wide">CodeVerse</h3>
            <p className="text-xs text-gray-500">Improve your coding skills</p>
          </div>
        </div>
        <button onClick={toggleSidebar} className="text-gray-600 hover:text-gray-900 transition">
          <PanelLeftClose className="w-8 h-8 cursor-pointer hover:text-blue-600" />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
        {navigationItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.title}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-md font-medium  transition-all duration-200
                ${isActive
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-purple-700'}
              `}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-purple-700' : 'text-gray-500'}`} />
              {item.title}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-3 border-t border-gray-200 bg-white">
        {user ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={user.profilePic}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover shadow-sm"
              />
              <div className="text-sm">
                <p className="font-semibold text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-700 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => { toggleSidebar(); navigate('/login'); }}
            className="w-full text-center border border-purple-600 text-purple-600 px-4 py-2 rounded hover:bg-purple-50 font-medium transition-all"
          >
            Sign In
          </button>
        )}
      </div>
    </motion.div>
  );
}
export default Sidebar;
