
import React,{useState} from 'react';
import { MessageSquarePlus, Code, Brain,PanelRight } from 'lucide-react';
import Sidebar from './Sidebar';
import {motion,AnimatePresence} from 'framer-motion';
const Header = ({ onNewTicket }) => {
   const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(prev => !prev);
    return (
      <>
     
        <header className="py-6 mb-8 relative z-30 backdrop-blur-sm bg-black/30 ">
          <div className="flex items-center justify-between max-w-3xl mx-1 ">
         
            <button
              onClick={toggleSidebar}
              className="p-2 text-purple-500 bg-codeverse-gradient bg-clip-text hover:text-purple-300 fixed left-0 top-8 z-40 ml-10 "
            >
              <PanelRight className="h-8 w-9 " />
            </button>
  

            <div className="flex items-center gap-4 pl-10 w-full justify-center">
              <img 
                src="/org_codeverse.png" 
                alt="CodeVerse Logo" 
                className="h-12 w-12 animate-float"
              />
              <div>
                <h1 className="text-3xl font-bold bg-codeverse-gradient bg-clip-text text-transparent">
                  CodeVerse Support
                </h1>
                <p className="text-gray-300">Welcome to the MultiVerse of Code</p>
              </div>
            </div>
          </div>
  
          <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-codeverse-cyan via-codeverse-purple to-codeverse-blue"></div>
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
