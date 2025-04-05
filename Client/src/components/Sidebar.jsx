import React,{useState} from 'react';
import { Link } from 'react-router-dom';
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
  const [isOpen, setIsOpen] = useState(true);
  const navigationItems = [
    { title: "Home", icon: Home, path: "/home" },
    { title: "POTD", icon: Calendar, path: "/potd" },
    { title: "Custom POTD", icon: PlusCircle, path: "/custom-potd" },
    { title: "Favorites", icon: Star, path: "/fav" },
    { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { title: "Daily Tasks", icon: BookOpen, path: "/task" },
    { title: "Time Table", icon: Clock, path: "/schedule" },
    { title: "Doubt Support", icon: Users, path: "/community" },
  ];

 
  const resourceItems = [
    { title: "Discussions", icon: MessageSquare, path: "/discussions" },
    { title: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <motion.div 
      className="fixed top-0 left-0 bg-white border-r border-gray-200 h-screen w-64 flex flex-col overflow-y-auto scrollbar-thin"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
     
     <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <img src="/org_codeverse.png" alt="CodeVerse Logo" className="w-10 h-10" />
          <div>
            <h3 className="font-semibold text-gray-800">CodeVerse</h3>
            <p className="text-xs text-gray-500">Improve your coding skills</p>
          </div>
        </div>
        <button onClick={toggleSidebar} className="text-gray-600 hover:text-black transition">
          <PanelLeftClose className="w-5 h-5" />
        </button>
      </div>

      
      
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="mt-4">
         
          <ul>
            {navigationItems.map((item) => (
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
        
     
      </div>
      
  
      <div className="px-4 py-3 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">GS</span>
          </div>
          <div>
            <p className="text-xs text-gray-500">Guest User</p>
            <p className="text-sm font-medium text-gray-700">Sign in to track progress</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Sidebar;
