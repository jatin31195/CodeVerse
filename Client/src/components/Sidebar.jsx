import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Home as HomeIcon,
  Code,
  Heart,
  LayoutDashboard,
  CheckSquare,
  Calendar,
  HelpCircle,
  LogOut,
} from "lucide-react";

// Utility function to join classes
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Sidebar = ({ className }) => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div
      className={cn(
        "fixed top-0 left-0 h-screen bg-[#080F2E] text-white transition-all duration-300 z-50 border-r border-gray-800",
        collapsed ? "w-[70px]" : "w-[240px]",
        className
      )}
    >
      <div className="flex items-center py-6 px-4 border-b border-gray-800">
        <div className="flex items-center space-x-2 overflow-hidden">
          <img
            src="/org_codeverse.png"
            alt="CodeVerse Logo"
            className={cn("transition-all duration-300", collapsed ? "w-8 h-8" : "w-10 h-10")}
          />
          <span
            className={cn(
              "font-bold text-xl transition-opacity duration-300 whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600",
              collapsed ? "opacity-0 w-0" : "opacity-100"
            )}
          >
            CodeVerse
          </span>
        </div>
        <button
          onClick={toggleSidebar}
          className="ml-auto hover:bg-gray-700 rounded-full p-1 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      <nav className="py-4 flex flex-col h-[calc(100%-140px)]">
        <ul className="space-y-2 flex-grow">
          {[
            { path: "/", icon: HomeIcon, label: "Home" },
            { path: "/custom-potd", icon: Code, label: "Custom POTD" },
            { path: "/favorites", icon: Heart, label: "Favorite List" },
            { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
            { path: "/daily-tasks", icon: CheckSquare, label: "Daily Tasks" },
            { path: "/timetable", icon: Calendar, label: "Time Table" },
            {path: "/community", icon:HelpCircle, label: "Community Support"}
            
          ].map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center py-2 px-4 text-sm transition-all hover:bg-gray-800 rounded-r-full overflow-hidden",
                    isActive
                      ? "border-l-4 border-gradient-to-r from-purple-400 to-pink-600 font-medium bg-gray-800"
                      : "border-l-4 border-transparent"
                  )
                }
              >
                <item.icon className={cn("flex-shrink-0", collapsed ? "w-6 h-6 mx-auto" : "w-5 h-5 mr-3")} />
                <span
                  className={cn(
                    "transition-opacity duration-300 whitespace-nowrap",
                    collapsed ? "opacity-0 w-0" : "opacity-100"
                  )}
                >
                  {item.label}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="mt-auto space-y-2 border-t border-gray-800 pt-4 mb-4">
          
          <button
            onClick={() => console.log("Sign out")}
            className="w-full flex items-center py-2 px-4 text-sm transition-all hover:bg-red-900/30 text-red-400 rounded-r-full overflow-hidden border-l-4 border-transparent"
          >
            <LogOut className={cn("flex-shrink-0", collapsed ? "w-6 h-6 mx-auto" : "w-5 h-5 mr-3")} />
            <span
              className={cn("transition-opacity duration-300 whitespace-nowrap", collapsed ? "opacity-0 w-0" : "opacity-100")}
            >
              Sign Out
            </span>
          </button>
        </div>
      </nav>
      <div className={cn("absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800", collapsed ? "hidden" : "block")}>
        <div className="text-xs text-gray-400 text-center">
          <div className="animate-pulse bg-gradient-to-r from-teal-300 to-purple-600 h-0.5 mb-2 rounded-full"></div>
          <p>© 2023 CodeVerse</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
