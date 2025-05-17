import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Calendar, 
  Star, 
  Users, 
  MessageSquare, 
  Settings, 
  LayoutDashboard,
  Clock,
  BookOpen,
  PlusCircle,
  PanelLeftClose
} from "lucide-react";

export function Sidebar({ toggleSidebar }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) return;
    fetch('http://localhost:8080/api/auth/profile', {
      headers: { 'Authorization': token }
    })
      .then(res => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then(json => {
        setUser(json.data.user);
      })
      .catch(() => {
        sessionStorage.removeItem('token');
        setUser(null);
      });
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    setUser(null);
    toggleSidebar();
    navigate('/login');
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
  ];

  return (
    <motion.div 
      className="fixed top-0 left-0 bg-white border-r border-gray-200 h-screen w-70 flex flex-col overflow-y-auto scrollbar-thin"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <img src="/org_codeverse.png" alt="CodeVerse Logo" className="w-10 h-10" />
          <div>
            <h3 className="font-semibold text-gray-800">CodeVerse</h3>
            <p className="text-xs text-gray-500">Improve your coding skills</p>
          </div>
        </div>
        <button onClick={toggleSidebar} className="text-gray-600 hover:text-black transition">
          <PanelLeftClose className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <ul className="mt-4">
          {navigationItems.map(item => (
            <li key={item.title}>
              <Link 
                to={item.path} 
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-50"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer - User Info */}
      <div className="px-4 py-3 border-t border-gray-200 bg-white">
        {user ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={user.profilePic}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-800 transition cursor-pointer"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => { toggleSidebar(); navigate('/login'); }}
            className="w-full text-center border border-purple-600 text-purple-600 px-4 py-2 rounded hover:bg-purple-50 transition-all duration-150"
          >
            Sign In
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default Sidebar;
