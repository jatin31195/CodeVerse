import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Calendar,
  Code,
  BookOpen,
  PenTool,
  Users,
  Lightbulb,
} from 'lucide-react';
import Navbar from './Navbar';
import MainLayout from './MainLayout';
const navLinks = [
  { name: 'LeetCode', path: '/leetcode' },
  { name: 'CodeForces', path: '/codeforces' },
  { name: 'Geeks for Geeks', path: '/gfg' },
  // Add more links as needed
];
const POTD = () => {
  return (
    <>
    <MainLayout  navLinks={navLinks}>
    <div className="min-h-screen bg-white text-gray-950">
      <main className="flex-1">
      
        <section className="py-16 relative overflow-hidden bg-white">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-200 rounded-full opacity-30"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-100 rounded-full opacity-30"></div>
          <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">
                Daily POTD
              </span>
              {' '}Section
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your daily dose of algorithmic challenges from the top competitive programming platforms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/leetcode" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-6 py-3 rounded-full bg-purple-500 text-white font-semibold flex items-center justify-center hover:bg-purple-600 transition-all">
                  LeetCode POTD <ArrowRight className="ml-2" size={16} />
                </button>
              </Link>
              <Link to="/gfg" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-6 py-3 rounded-full border border-purple-300 text-purple-500 font-semibold hover:bg-purple-100 transition-all">
                  GeeksforGeeks POTD
                </button>
              </Link>
              <Link to="/codeforces" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-6 py-3 rounded-full border border-cyan-300 text-cyan-500 font-semibold hover:bg-cyan-100 transition-all">
                  Codeforces POTD
                </button>
              </Link>
            </div>
          </div>
        </section>

      
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-purple-500 to-cyan-400 text-transparent bg-clip-text">
                Features
              </span>
            </h2>
            <p className="text-center text-gray-600 mb-12 text-lg">
              Everything you need to master algorithmic problem solving and ace your technical interviews.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Calendar size={24} className="text-purple-500" />,
                  title: 'Daily Problems',
                  desc: 'Access daily challenges from LeetCode, GeeksforGeeks, and Codeforces all in one place.',
                  bg: 'bg-purple-100',
                },
                {
                  icon: <Code size={24} className="text-cyan-500" />,
                  title: 'Detailed Solutions',
                  desc: 'Get optimal solutions in C++ and Java with detailed explanations.',
                  bg: 'bg-cyan-100',
                },
                {
                  icon: <Users size={24} className="text-purple-500" />,
                  title: 'Community Solutions',
                  desc: 'Share your solutions and learn from others with our community-driven approach.',
                  bg: 'bg-purple-100',
                },
                {
                  icon: <PenTool size={24} className="text-cyan-500" />,
                  title: 'Time Complexity Analysis',
                  desc: 'Understand the efficiency of solutions with our detailed analysis.',
                  bg: 'bg-cyan-100',
                },
                {
                  icon: <Lightbulb size={24} className="text-purple-500" />,
                  title: 'Real-life Applications',
                  desc: 'See how algorithmic concepts apply to real-world challenges.',
                  bg: 'bg-purple-100',
                },
                {
                  icon: <BookOpen size={24} className="text-cyan-500" />,
                  title: 'Favorites System',
                  desc: 'Save problems to custom lists for later review.',
                  bg: 'bg-cyan-100',
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-6 shadow hover:shadow-md transition bg-white"
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${feature.bg}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        
      </main>
    </div>
    </MainLayout>
    </>

  );
};

export default POTD;
