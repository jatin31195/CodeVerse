import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CalendarDays, Plus, List, Menu, X, PanelRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './Sidebar'; 

const MainLayout = ({ children, title, fullPage = false, navLinks = [] }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-white ">

      <header className="sticky top-0 z-50  bg-white bg-opacity-95 backdrop-blur-sm shadow-md">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button onClick={toggleSidebar} className="p-2" aria-label="Toggle sidebar">
              {!sidebarOpen ? <PanelRight className="h-8 w-8" /> : <X className="h-6 w-6" />}
            </button>
            <Link to="/home" className="text-xl font-bold">CodeVerse</Link>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative py-2 transition-colors hover:text-purple-600 ${
                  isActive(link.path)
                    ? "text-purple-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-purple-600"
                    : "text-gray-700"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="md:hidden">
            <button
              className="p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
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
                      ? "bg-purple-100 text-purple-600"
                      : "hover:bg-gray-100 text-gray-700"
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

      
      <main className={`${fullPage ? '' : 'container mx-auto px-4'} pb-20`}>
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
                    ? "text-purple-600"
                    : "text-gray-500 hover:text-gray-700"
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
