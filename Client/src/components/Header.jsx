import React, { useState, useEffect } from 'react';
import {
  PanelRight,
  LayoutPanelLeft,
  LogOut,
} from 'lucide-react';
import Sidebar from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';
import { apiRequest } from '../utils/api';
const Header = ({ onNewTicket }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const getInitials = (name = '') =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
useEffect(() => {
  apiRequest(`${BASE_URL}/api/auth/profile`, { method: 'GET' })
    .then((res) => {
      setUser(res.data?.data?.user);
    })
    .catch(() => {
      setUser(null);
      navigate('/login');
    });
}, [navigate]);



  const handleLogout = async () => {
  try {
    await apiRequest(`${BASE_URL}/api/auth/logout`, {
      method: 'POST',
    });
  } catch (err) {
    console.error('Logout failed', err);
  } finally {
    setUser(null);
    setShowUserMenu(false);
    navigate('/login');
  }
};


  return (
    <>
      <header className="bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="p-2 text-purple-500 hover:text-purple-300"
              >
                <PanelRight className="h-6 w-6 sm:h-7 sm:w-7" />
              </button>

              <img
                src="/org_codeverse.png"
                alt="CodeVerse Logo"
                className="h-8 w-8 sm:h-10 sm:w-10 ml-4 animate-float"
              />

              <div className="ml-14 flex flex-col sm:flex-col text-center sm:text-left">
                
                <div className="block sm:hidden">
                  <h1 className="text-xl font-bold bg-codeverse-gradient bg-clip-text text-transparent">
                    CodeVerse
                  </h1>
                  <span className="text-sm font-light bg-codeverse-gradient bg-clip-text text-transparent ">
                    Doubt Support
                  </span>
                </div>

             
                <div className="hidden sm:block">
                  <h1 className="text-2xl md:text-2xl font-bold bg-codeverse-gradient bg-clip-text text-transparent">
                    CodeVerse Doubt Support
                  </h1>
                  <p className="text-gray-300 text-sm md:text-base">
                    Welcome to the{' '}
                    <span className="font-semibold bg-gradient-to-r from-blue-200 via-purple-300 to-pink-200 text-transparent bg-clip-text">
                      MultiVerse
                    </span>{' '}
                    of Coding
                  </p>
                </div>
              </div>
            </div>

           
            {user && (
                    <div className="relative ml-3">
                      <button
                        onClick={() => setShowUserMenu((prev) => !prev)}
                        className="w-12 h-12 cursor-pointer rounded-full border-3 border-blue-500 hover:border-green-400 transition overflow-hidden flex items-center justify-center bg-gray-100"
                      >
                        {user.profilePic ? (
                          <img
                            src={user.profilePic}
                            alt={user.name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <span className="text-sm font-semibold text-gray-700">
                            {getInitials(user.username)}
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
                              <LayoutPanelLeft className="w-4 h-4 hover:text-blue-600 cursor-pointer" />
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

       
        <div className="h-1 bg-gradient-to-r from-codeverse-cyan via-codeverse-purple to-codeverse-blue" />
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
