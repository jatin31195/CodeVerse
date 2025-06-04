import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home, Calendar, Star, Users, LayoutDashboard,
  Clock, BookOpen, PlusCircle, Bug, PanelLeftClose,HelpCircle
} from 'lucide-react';
import { BASE_URL } from '../config';
import { apiRequest } from '../utils/api';

const Sidebar = ({ toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const getInitials = (name) =>
    name?.split(' ').map((n) => n[0]).join('').toUpperCase();

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
      await apiRequest(`${BASE_URL}/api/auth/logout`, {
        method: 'POST',
      });
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      setUser(null);
      navigate('/login');
    }
  };

  const menuItems = [
    { title: 'Home', path: '/home', icon: Home },
    { title: 'POTD', path: '/potd', icon: Calendar },
    { title: 'Custom POTD', path: '/custom', icon: PlusCircle },
    { title: 'Favorites', path: '/fav', icon: Star },
    { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { title: 'Daily Tasks', path: '/task', icon: BookOpen },
    { title: 'Time Table', path: '/schedule', icon: Clock },
    { title: 'Doubt Support', path: '/community', icon: Users },
    { title: 'Report Issue', path: '/report-issue', icon: Bug },
    { title: 'New User Guide', path: '/new-user-guide', icon: HelpCircle },
  ];

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      transition={{ duration: 0.3 }}
      className="w-72 h-screen bg-white shadow-xl flex flex-col"
    >
    
      <div className="flex items-center justify-between px-4 py-4 border-b">
        <div className="flex items-center gap-2">
          <img src="/org_codeverse.png" className="w-10 h-10" alt="logo" />
          <div>
            <p className="text-sm font-semibold text-gray-800">CodeVerse</p>
            <p className="text-xs text-gray-500">Your coding buddy</p>
          </div>
        </div>
        <PanelLeftClose onClick={toggleSidebar} className="w-6 h-6 cursor-pointer text-gray-600 hover:text-blue-600" />
      </div>

      
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {menuItems.map(({ title, path, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition ${
              location.pathname === path
                ? 'bg-purple-100 text-purple-700'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <Icon className="w-5 h-5" />
            {title}
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t px-4 py-3">
        {user ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 text-center rounded-full flex items-center justify-center font-bold text-gray-700">
                  {getInitials(user.username)}
                </div>
              )}
              <div className="text-sm">
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 w-28 truncate">{user.email}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="text-xs text-red-600 hover:underline">
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              toggleSidebar();
              navigate('/login');
            }}
            className="w-full text-center border border-purple-600 text-purple-600 py-2 rounded font-medium transition hover:bg-purple-50"
          >
            Sign In
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Sidebar;
