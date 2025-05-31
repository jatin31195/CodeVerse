import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  CalendarDays, Plus, List, Menu, X, PanelRight, LogOut, LayoutPanelLeft
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './Sidebar';
import {toast} from 'react-toastify'
import '../App.css'
const MainLayout = ({ children, title, fullPage = false, navLinks = [] }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const isActive = (path) => location.pathname === path;

  useEffect(() => {

    fetch('http://localhost:8080/api/auth/profile', {
       credentials:"include",
    })
      .then((res) => res.json())
      .then((json) => {
        setUser(json.data.user);
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  const handleLogout = async () => {
  try {
    await fetch('http://localhost:8080/api/auth/logout', {
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

  const getInitials = (name) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white bg-opacity-95 backdrop-blur-sm shadow-md">
  <div className="container mx-auto relative flex h-20 items-center justify-between px-4">
    
    <div className="flex items-center gap-3">
  <div className="relative inline-block group">
    <button
      onClick={toggleSidebar}
      className="p-2"
      aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
    >
      {!sidebarOpen && (
        <PanelRight className="h-8 w-8 hover:text-blue-600 cursor-pointer" />
      )}
    </button>
    <div className="absolute left-1/2 top-0 ml-10 mt-4 -translate-x-1/2 translate-y-full rounded bg-white px-6 py-1 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow w-max">
      {sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
    </div>
  </div>
</div>


    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <Link to="/home" className="flex-shrink-0">
        <img
          src="/codelogo1.png"
          alt="CodeVerse"
          className="h-12 w-auto"
        />
      </Link>
    </div>

    <div className="flex items-center gap-6">
      <nav className="hidden md:flex items-center gap-6">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`relative py-2 transition-colors hover:text-purple-600 ${
              isActive(link.path)
                ? 'text-purple-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-purple-600'
                : 'text-gray-700'
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>

     

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

  
  {isMenuOpen && (
    <div className="md:hidden animate-fade-in bg-white border-t">
      <div className="container mx-auto py-4 px-4 flex flex-col gap-4">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            onClick={() => setIsMenuOpen(false)}
            className={`py-3 px-4 rounded-md transition-colors ${
              isActive(link.path)
                ? 'bg-purple-100 text-purple-600'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  )}

 
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
</header>


      <main className={`${fullPage ? '' : 'container mx-auto px-4 scrollbar-hide overflow-x-hidden'} pb-20`}>
        {title && !fullPage && (
          <h1 className="text-3xl font-bold mb-6 font-display bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {title}
          </h1>
        )}
        {children}
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden">
        <div className="grid grid-cols-3 gap-1 p-2">
          {navLinks.map((link, index) => {
            let Icon;
            if (index === 0) Icon = CalendarDays;
            else if (index === 1) Icon = List;
            else if (index === 2) Icon = Plus;
            else Icon = Menu;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex flex-col items-center p-2 ${
                  isActive(link.path)
                    ? 'text-purple-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs mt-1">{link.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
