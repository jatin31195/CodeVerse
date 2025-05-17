import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, UserCircle2 } from "lucide-react";


const DashboardLayout = ({
  children,
  activeTab,
  onTabChange,
  sidebarOpen,
  toggleSidebar,
}) => (
  <div className="min-h-screen w-full bg-white my-0">

    
    <div className="flex relative">
    
      
      <main className="flex-1 container mx-auto py-8 ">
      
        <div className="hidden md:flex justify-center mb-6 mt-4">
          <div className="bg-white/70 dark:bg-white-900/70 backdrop-blur-md rounded-full shadow-sm border border-purple-100 dark:border-purple-900/30 p-1">
            <div className="grid grid-cols-4">
              {["all", "leetcode", "codeforces", "gfg"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => onTabChange(tab)}
                  className={`py-2 px-6 rounded-full transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-gray-100 text-white dark:bg-gray-950/40 dark:text-white-300"
                      : "text-gray-600"
                  }`}
                >
                  {tab === "all"
                    ? "All"
                    : tab === "leetcode"
                    ? "LeetCode"
                    : tab === "codeforces"
                    ? "CodeForces"
                    : "GeeksForGeeks"}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto relative">
        
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-300/20 dark:bg-purple-700/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-indigo-300/20 dark:bg-indigo-700/10 rounded-full blur-3xl -z-10"></div>
          {children}
        </div>
      </main>
    </div>
  </div>
);

export default DashboardLayout;
