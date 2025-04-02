import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import { 
  ArrowRight, 
  Star, 
  MessageSquare, 
  TrendingUp, 
  Calendar, 
  Code, 
  Trophy,
  Menu,
  X
} from "lucide-react";


const problems = {
  leetcode: {
    title: "Maximum Subarray",
    description: "Given an integer array nums, find the contiguous subarray which has the largest sum and return its sum.",
    platform: "LeetCode",
    difficulty: "Medium",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    discussionCount: 243,
    link: "#"
  },
  gfg: {
    title: "Merge Without Extra Space",
    description: "Given two sorted arrays arr1[] and arr2[] of sizes n and m, merge them in sorted order.",
    platform: "GeeksForGeeks",
    difficulty: "Hard",
    timeComplexity: "O((n+m)log(n+m))",
    spaceComplexity: "O(1)",
    discussionCount: 152,
    link: "#"
  },
  codeforces: {
    title: "K-th Beautiful String",
    description: "Find the k-th lexicographically smallest beautiful string of length n.",
    platform: "CodeForces",
    difficulty: "Easy",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    discussionCount: 87,
    link: "#"
  }
};

const renderProblemCard = (p, key) => {
  const borderTopColor =
    p.platform === "LeetCode"
      ? "#FFA116"
      : p.platform === "GeeksForGeeks"
      ? "#2F8D46"
      : "#1890FF";
  const difficultyClasses =
    p.difficulty === "Easy"
      ? "bg-green-100 text-green-800"
      : p.difficulty === "Medium"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-red-100 text-red-800";
  return (
    <div
      key={key}
      className="bg-white rounded-lg shadow-md border-t-4 overflow-hidden transition-shadow hover:shadow-lg"
      style={{ borderTopColor }}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex space-x-2">
            <span className="text-xs font-medium rounded px-2 py-1 bg-yellow-100 text-yellow-800">
              {p.platform}
            </span>
            <span className={`text-xs font-medium rounded px-2 py-1 ${difficultyClasses}`}>
              {p.difficulty}
            </span>
          </div>
          <button className="text-yellow-500 hover:text-yellow-600">
            <Star className="h-5 w-5" />
          </button>
        </div>
        <h3 className="text-lg font-bold">{p.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{p.description}</p>
        <div className="flex space-x-2">
          <span className="text-xs font-medium rounded px-2 py-1 bg-blue-50 text-blue-700">
            Time: {p.timeComplexity}
          </span>
          <span className="text-xs font-medium rounded px-2 py-1 bg-purple-50 text-purple-700">
            Space: {p.spaceComplexity}
          </span>
        </div>
      </div>
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center space-x-1 text-gray-600">
          <MessageSquare className="h-4 w-4" />
          <span className="text-xs">{p.discussionCount} discussions</span>
        </div>
        <a href={p.link} target="_blank" rel="noopener noreferrer">
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm flex items-center gap-1 hover:bg-gray-100">
            Solve <ArrowRight className="h-3 w-3" />
          </button>
        </a>
      </div>
    </div>
  );
};

function Home() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("User");

  const toggleSidebar = () => setSidebarOpen(prev => !prev);


  const filteredProblems = Object.values(problems).filter(p =>
    selectedTab === "all" ? true : p.platform === selectedTab
  );

  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get("http://localhost:8080/api/auth/profile", {
          headers: { Authorization: token }
        });
        const user = res.data.data.user;
        setUserName(user.name || user.username || "User");
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 relative">
  
      {sidebarOpen && (
        <div className="fixed inset-0 z-20">
          <div className="absolute inset-0 bg-black opacity-50" onClick={toggleSidebar} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-lg z-30">
            <Sidebar />
          </div>
        </div>
      )}

   
      <header className="sticky top-0 z-10 flex items-center justify-between bg-white p-4 border-b">
        <button onClick={toggleSidebar} className="p-2">
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <h1 className="text-xl font-bold">CodeVerse</h1>
        <div></div>
      </header>

   
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 py-16 px-4 sm:px-6 lg:px-8 rounded-2xl mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome, {userName}!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ready to level up your coding skills? Dive into daily challenges from LeetCode, GeeksForGeeks, and CodeForces.
          </p>
        </div>

      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Daily Challenges</h3>
              <p className="text-gray-600">Fresh problems every day</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <Code className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Multiple Platforms</h3>
              <p className="text-gray-600">LeetCode, GFG, CodeForces</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border">
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <Trophy className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Track Progress</h3>
              <p className="text-gray-600">Build your coding streak</p>
            </div>
          </div>
        </div>

   
        <div className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold tracking-tight">Problem of the Day</h2>
            <Link to="/potd">
              <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md flex items-center gap-2 hover:bg-blue-600 hover:text-white">
                View All <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
          
    
          <div className="mb-6 flex space-x-4">
            <button 
              onClick={() => setSelectedTab("all")}
              className={`px-6 py-2 rounded-md ${selectedTab === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}
            >
              All
            </button>
            <button 
              onClick={() => setSelectedTab("LeetCode")}
              className={`px-6 py-2 rounded-md ${selectedTab === "LeetCode" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}
            >
              LeetCode
            </button>
            <button 
              onClick={() => setSelectedTab("GeeksForGeeks")}
              className={`px-6 py-2 rounded-md ${selectedTab === "GeeksForGeeks" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}
            >
              GeeksForGeeks
            </button>
            <button 
              onClick={() => setSelectedTab("CodeForces")}
              className={`px-6 py-2 rounded-md ${selectedTab === "CodeForces" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}
            >
              CodeForces
            </button>
          </div>

     
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProblems.map((p, idx) => renderProblemCard(p, idx))}
          </div>
        </div>

  
        <div className="mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-8 text-center">Why Use CodeVerse?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white shadow-sm rounded-lg p-6 transform transition-all duration-300 hover:scale-105">
              <div className="bg-blue-100 p-3 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <TrendingUp className="text-blue-600" />
              </div>
              <h3 className="font-bold text-lg">Track Your Progress</h3>
              <p className="text-sm text-gray-600">Visualize your improvement over time with detailed statistics.</p>
            </div>
            <div className="bg-white shadow-sm rounded-lg p-6 transform transition-all duration-300 hover:scale-105">
              <div className="bg-purple-100 p-3 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <MessageSquare className="text-purple-600" />
              </div>
              <h3 className="font-bold text-lg">Join Discussions</h3>
              <p className="text-sm text-gray-600">Share your solution approach and learn from others.</p>
            </div>
            <div className="bg-white shadow-sm rounded-lg p-6 transform transition-all duration-300 hover:scale-105">
              <div className="bg-green-100 p-3 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <Star className="text-green-600" />
              </div>
              <h3 className="font-bold text-lg">Create Favorites</h3>
              <p className="text-sm text-gray-600">Save interesting problems for future practice.</p>
            </div>
          </div>
        </div>

  
        <div className="bg-blue-600 text-white rounded-2xl p-8 md:p-12 mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to level up your coding skills?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of developers who solve daily coding challenges.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-6 py-3 bg-blue-700 rounded-md flex items-center gap-2 hover:bg-blue-800">
                Sign Up <ArrowRight className="h-5 w-5" />
              </button>
              <button className="px-6 py-3 border border-white rounded-md flex items-center gap-2 hover:bg-white hover:text-blue-600">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
