import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar"; // Reusable Sidebar component
import {
  CalendarDays,
  Clock,
  ListTodo,
  Code,
  Trophy,
  TrendingUp,
  BookOpen,
  Sparkles,
  MessageSquare,
  BellRing,
  ChevronRight,
} from "lucide-react";

// Utility function to join classes
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Custom hook to detect mobile screens
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  return isMobile;
}

// Decode JWT token from sessionStorage to extract current user's ID.
function getCurrentUserIdFromToken() {
  const token = sessionStorage.getItem("token");
  if (!token) return "";
  try {
    const payloadBase64 = token.split(".")[1];
    const payload = JSON.parse(atob(payloadBase64));
    console.log("Decoded token payload:", payload);
    return payload.id || payload.sub || "";
  } catch (error) {
    console.error("Error decoding token:", error);
    return "";
  }
}

// Helper: Extract user id from ticket.raisedBy field.
const getUserId = (user) => {
  if (!user) return "";
  if (typeof user === "string") return user;
  if (user._id) return user._id.toString();
  if (user.$oid) return user.$oid.toString();
  return "";
};

// Auth config: use the token from sessionStorage.
const getAuthConfig = () => {
  const token = sessionStorage.getItem("token");
  return {
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
  };
};

// Simple greeting function.
function getTimeBasedGreeting() {
  const hours = new Date().getHours();
  if (hours < 12) return "Good Morning";
  if (hours < 18) return "Good Afternoon";
  return "Good Evening";
}

// GreetingHeader Component – now fetches the logged-in user's name from the backend.
function GreetingHeader() {
  const [greeting, setGreeting] = useState(getTimeBasedGreeting());
  const [username, setUsername] = useState("User");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => setGreeting(getTimeBasedGreeting()), 60000);

    async function fetchUsername() {
      const currentUserId = getCurrentUserIdFromToken();
      try {
        const res = await axios.get(
          `http://localhost:8080/api/auth/${currentUserId}`,
          getAuthConfig()
        );
        // Adjust the property name if necessary (e.g., res.data.name)
        setUsername(res.data.username || res.data.name || "User");
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    }
    fetchUsername();

    setTimeout(() => setLoaded(true), 100);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="mb-8">
      <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-4xl font-bold mb-1 font-sans">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            {greeting}
          </span>
          , {username}
        </h1>
        <p className="text-gray-600 max-w-2xl font-sans">
          Welcome to your coding journey. Track your progress, manage your tasks, and stay connected with your favorite coding platforms all in one place.
        </p>
      </motion.div>
      <div className="h-1 w-24 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full mt-4 animate-pulse"></div>
    </div>
  );
}

const achievements = [
  { label: "Problems Solved", value: "256", icon: Code, color: "from-blue-400 to-blue-600" },
  { label: "Streak", value: "12 days", icon: CalendarDays, color: "from-green-400 to-green-600" },
  { label: "Tasks Today", value: "4/6", icon: ListTodo, color: "from-amber-400 to-amber-600" },
  { label: "Avg. Time", value: "45 mins", icon: Clock, color: "from-purple-400 to-purple-600" },
];

const recentActivities = [
  {
    title: "Completed 'Longest Common Subsequence'",
    platform: "LeetCode",
    time: "2 hours ago",
    difficulty: "Medium",
    difficultyColor: "bg-amber-500",
  },
  {
    title: "Participated in Weekly Contest #378",
    platform: "Codeforces",
    time: "Yesterday",
    difficulty: "Hard",
    difficultyColor: "bg-red-500",
  },
  {
    title: "Solved 'Minimum Spanning Tree'",
    platform: "GeeksforGeeks",
    time: "2 days ago",
    difficulty: "Easy",
    difficultyColor: "bg-green-500",
  },
];

const platforms = [
  {
    name: "LeetCode",
    description: "Enhance your coding skills with algorithmic challenges and competitions.",
    logoSrc: "https://leetcode.com/static/images/LeetCode_logo_rvs.png",
    url: "https://leetcode.com",
  },
  {
    name: "GeeksforGeeks",
    description: "Comprehensive platform for computer science topics and coding practice.",
    logoSrc: "https://media.geeksforgeeks.org/wp-content/cdn-uploads/gfg_200x200-min.png",
    url: "https://geeksforgeeks.org",
  },
  {
    name: "Codeforces",
    description: "Participate in competitive programming contests and improve your skills.",
    logoSrc: "https://codeforces.org/s/79558/images/codeforces-sponsored-by-ton.png",
    url: "https://codeforces.com",
  },
];

function PlatformCard({ name, description, logoSrc, url, index }) {
  const [hovering, setHovering] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100 + index * 200);
    return () => clearTimeout(timer);
  }, [index]);
  return (
    <motion.div
      className={cn(
        "glass-card rounded-xl p-4 sm:p-6 h-full flex flex-col transition-all duration-300",
        hovering ? "shadow-lg" : "shadow-md"
      )}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            "w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden flex items-center justify-center transition-all duration-300",
            hovering ? "scale-110" : "scale-100"
          )}
        >
          <img src={logoSrc} alt={`${name} logo`} className="w-full h-full object-contain" />
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "p-2 rounded-full transition-all duration-300 text-gray-500 hover:text-white hover:bg-gradient-to-r from-purple-400 to-pink-600",
            hovering ? "opacity-100" : "opacity-60"
          )}
        >
          <ChevronRight size={16} />
        </a>
      </div>
      <h3 className="text-lg sm:text-xl font-bold mb-2 font-sans">{name}</h3>
      <p className="text-gray-600 text-xs sm:text-sm flex-grow font-sans">{description}</p>
      <div
        className={cn(
          "mt-4 h-1 w-12 rounded-full transition-all duration-300",
          hovering ? "bg-gradient-to-r from-purple-400 to-pink-600 w-full" : "bg-gray-200 w-12"
        )}
      ></div>
    </motion.div>
  );
}

function Home() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [loaded, setLoaded] = useState(false);
  const [otherTickets, setOtherTickets] = useState([]);
  const [questions, setQuestions] = useState([]);

  // Get current user ID from token (sessionStorage only has token)
  const currentUserId = getCurrentUserIdFromToken();

  // Fetch all questions once.
  const fetchAllQuestions = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/questions", getAuthConfig());
      let qs = [];
      if (Array.isArray(res.data)) {
        qs = res.data;
      } else if (res.data.questions) {
        qs = res.data.questions;
      }
      setQuestions(qs);
    } catch (err) {
      console.error("Error fetching questions:", err);
    }
  };

  // Fetch community tickets (tickets not raised by the current user)
  const fetchOtherTickets = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/ticket-Raise", getAuthConfig());
      let tickets = [];
      if (Array.isArray(res.data)) {
        tickets = res.data;
      } else if (res.data.tickets) {
        tickets = res.data.tickets;
      }
      const communityTickets = tickets.filter((t) => getUserId(t.raisedBy) !== currentUserId);
      console.log("Fetched Other Tickets:", communityTickets);
      // Pick the last ticket from the community tickets array (assuming ascending order)
      const last = communityTickets.length > 0 ? communityTickets[communityTickets.length - 1] : null;
      setOtherTickets(last ? [last] : []);
    } catch (err) {
      console.error("Error fetching other tickets:", err);
    }
  };

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
    fetchAllQuestions();
    fetchOtherTickets();
  }, []);

  // lastTicket is either the only element in otherTickets (if found) or null.
  const lastTicket = otherTickets.length > 0 ? otherTickets[0] : null;

  // Find the corresponding question details from the questions array.
  const questionDetails = lastTicket
    ? questions.find((q) => q._id === lastTicket.questionId)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 font-sans">
      <Sidebar />
      <div className={cn("transition-all duration-300 min-h-screen p-4 sm:p-6 md:p-8", isMobile ? "ml-0" : "ml-[240px]")}>
        <div className="max-w-6xl mx-auto">
          <GreetingHeader />

          {/* Achievements Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8">
            {achievements.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="glass-card rounded-xl p-3 sm:p-4 transition-all flex items-center space-x-3 sm:space-x-4 hover:translate-y-[-5px]"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 8 }}
                transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-md`}>
                  <stat.icon size={isMobile ? 20 : 24} />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 font-sans">{stat.label}</p>
                  <h3 className="text-base sm:text-xl font-bold font-sans">{stat.value}</h3>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Recent Coding Activities Section */}
          <motion.div
            className="glass-card rounded-xl p-4 sm:p-6 mb-6 md:mb-8 transition-all hover:shadow-lg"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 8 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="flex items-center mb-3 sm:mb-4">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-600" />
              <h2 className="text-lg sm:text-xl font-bold font-sans">Recent Coding Activities</h2>
            </div>
            {/* (Recent activities content would be here) */}
          </motion.div>

          {/* Popular Coding Platforms Section */}
          <div>
            <motion.h2
              className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center font-sans"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 8 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-600" />
              Popular Coding Platforms
            </motion.h2>
            {/* (Platform cards would be rendered here) */}
          </div>

          {/* Daily Problem Suggestion Section */}
          <motion.div
            className="glass-card rounded-xl p-4 sm:p-6 mt-6 md:mt-8 border-l-4 border-purple-600 transition-all hover:shadow-lg"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 8 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="flex flex-col sm:flex-row justify-between gap-2">
              <div>
                <h3 className="text-base sm:text-lg font-bold mb-1 flex items-center font-sans">
                  <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
                  Daily Problem Suggestion
                </h3>
                <p className="text-gray-600 mb-2 sm:mb-4 text-sm sm:text-base font-sans">
                  Two Sum - LeetCode
                </p>
                <p className="text-xs sm:text-sm text-gray-500 font-sans">
                  Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
                </p>
              </div>
              <div className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-green-500 text-xs font-medium text-white shadow-sm px-3 py-1">
                Easy
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <a
                href="https://leetcode.com/problems/two-sum/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-cyan-400 to-purple-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md hover:opacity-90 transition-all text-xs sm:text-sm font-medium shadow-md"
              >
                Solve Now →
              </a>
            </div>
          </motion.div>

          {/* Last Support Ticket Section */}
          <motion.div
            className="glass-card rounded-xl p-4 sm:p-6 mt-4 sm:mt-6 border-l-4 border-blue-600 transition-all hover:shadow-lg"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 8 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-lg w-fit">
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between mb-2 gap-1">
                  <h3 className="text-base sm:text-lg font-bold flex items-center font-sans">
                    Last Support Ticket
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <BellRing className="w-3 h-3 mr-1" />
                      Open
                    </span>
                  </h3>
                  {lastTicket && lastTicket.createdAt && (
                    <span className="text-xs text-gray-500 font-sans">
                      {new Date(lastTicket.createdAt).toLocaleString()}
                    </span>
                  )}
                </div>
                {lastTicket ? (
                  <>
                    <p className="text-sm sm:text-base text-gray-700 mb-3 font-sans">
                      {questionDetails 
                        ? `${questionDetails.title} – ${questionDetails.description}` 
                        : "Unknown Question"}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {lastTicket.raisedBy &&
                          (lastTicket.raisedBy.username || lastTicket.raisedBy.name)
                            ? (lastTicket.raisedBy.username || lastTicket.raisedBy.name).charAt(0)
                            : "U"}
                        </div>
                        <span className="ml-2 text-xs sm:text-sm text-gray-600 font-sans">
                          {lastTicket.raisedBy &&
                          (lastTicket.raisedBy.username || lastTicket.raisedBy.name)
                            ? (lastTicket.raisedBy.username || lastTicket.raisedBy.name)
                            : "Unknown"}
                        </span>
                      </div>
                      <a
                        onClick={() => navigate("/community")}
                        className="cursor-pointer text-blue-600 hover:text-purple-600 transition-colors text-xs sm:text-sm font-medium flex items-center font-sans"
                      >
                        View Details
                        <ChevronRight className="ml-1 w-3 h-3 sm:w-4 sm:h-4" />
                      </a>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-700 font-sans">No support tickets available.</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
        <footer className="mt-8 sm:mt-12 pb-6 sm:pb-8 text-center text-xs sm:text-sm text-gray-500 font-sans">
          © 2023 CodeVerse. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

export default Home;
