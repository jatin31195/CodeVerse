import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PanelRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <header className="sticky top-0 z-50 border-b bg-white bg-opacity-95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        <div className="flex items-center gap-3">
          <button onClick={toggleSidebar} className="p-2">
            {!sidebarOpen && <PanelRight className="h-6 w-6" />}
          </button>
          <h1 className="text-xl font-bold">CodeVerse</h1>
        </div>

        
        <nav className="hidden md:flex gap-6">
          <Link to="/leetcode" className="text-gray-700 hover:text-gray-900 transition-colors">
            LeetCode
          </Link>
          <Link to="/gfg" className="text-gray-700 hover:text-gray-900 transition-colors">
            GFG
          </Link>
          <Link to="/codeforces" className="text-gray-700 hover:text-gray-900 transition-colors">
            Codeforces
          </Link>
        </nav>
      </div>

     
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
  );
};

export default Navbar;
