import React, { useState, useEffect } from 'react';
import { MessageSquarePlus, Code, Brain, PanelRight, LayoutPanelLeft, LogOut } from 'lucide-react';
import Sidebar from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Header = ({ onNewTicket }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const getInitials = (name = '') =>
    name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();

  // Fetch profile once
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) return;
    fetch('http://localhost:8080/api/auth/profile', {
      headers: { Authorization: token },
    })
      .then(res => res.json())
      .then(json => setUser(json.data.user))
      .catch(() => {
        sessionStorage.removeItem('token');
        setUser(null);
      });
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    setUser(null);
    setShowUserMenu(false);
    navigate('/login');
  };

  return (
    <>
      <header className="py-6 mb-8 relative z-30 backdrop-blur-sm bg-black/30">
        <div className="flex items-center justify-between max-w-3xl mx-1">
          <button
            onClick={toggleSidebar}
            className="p-2 text-purple-500 bg-codeverse-gradient bg-clip-text hover:text-purple-300 fixed left-0 top-8 z-40 ml-10 px-20"
          >
            <PanelRight className="h-8 w-9" />
          </button>

          <div className="flex items-center gap-4 pl-10 w-full justify-center">
            <img
              src="/org_codeverse.png"
              alt="CodeVerse Logo"
              className="h-12 w-12 animate-float"
            />
            <div>
              <h1 className="text-3xl font-bold bg-codeverse-gradient bg-clip-text text-transparent">
                CodeVerse Doubt Support
              </h1>
              <p className="text-gray-300">
  Welcome to the{' '}
  <span className="font-semibold  bg-gradient-to-r from-blue-200 via-purple-300 to-pink-200 text-transparent bg-clip-text">
    MultiVerse
  </span>{' '}
  of Coding
</p>

            </div>
          </div>
        </div>

       
        {user && (
          <div className="absolute top-6 right-25">
            <button
              onClick={() => setShowUserMenu(v => !v)}
              className="w-12 h-12 rounded-full hover:border-green-400 bg-gray-100 cursor-pointer flex items-center justify-center overflow-hidden  border-blue-600 border-3"
            >
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user.name}
                  className="w-full h-full object-cover"
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
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden z-50"
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

        <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-codeverse-cyan via-codeverse-purple to-codeverse-blue" />
      </header>

      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-40">
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-40"
              onClick={toggleSidebar}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl z-50"
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
    </>
  );
};

export default Header;
