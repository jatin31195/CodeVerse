import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  Code,
  ChevronDown,
  BookOpen,
  PenTool,
  Users,
  Lightbulb,
} from 'lucide-react';
import MainLayout from './MainLayout';

const navLinks = [
  { name: 'LeetCode', path: '/leetcode' },
  { name: 'CodeForces', path: '/codeforces' },
  { name: 'Geeks for Geeks', path: '/gfg' },
];

export default function POTD() {
  const features = [
    {
      icon: <Calendar className="h-6 w-6 text-purple-600" />,
      title: 'Daily Problems',
      desc: 'Curated challenges delivered every day to sharpen your skills.',
      bg: 'bg-purple-50',
    },
    {
      icon: <Code className="h-6 w-6 text-purple-600" />,
      title: 'Detailed Solutions',
      desc: 'Clean, commented code in C++, Java, and JavaScript.',
      bg: 'bg-purple-50',
    },
    {
      icon: <Users className="h-6 w-6 text-purple-600" />,
      title: 'Community Insights',
      desc: 'See peer approaches and best practices.',
      bg: 'bg-purple-50',
    },
    {
      icon: <PenTool className="h-6 w-6 text-purple-600" />,
      title: 'Complexity Analysis',
      desc: 'In‑depth time & space trade‑offs explained.',
      bg: 'bg-purple-50',
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-purple-600" />,
      title: 'Real‑World Use Cases',
      desc: 'How algorithms apply in engineering scenarios.',
      bg: 'bg-purple-50',
    },
    {
      icon: <BookOpen className="h-6 w-6 text-purple-600" />,
      title: 'Favorites & Lists',
      desc: 'Bookmark and organize problems into custom lists.',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <MainLayout navLinks={navLinks} className="w-full">
      <div className="w-full min-h-screen bg-neutral-50 text-slate-800 font-poppins">
        {/* Hero Section */}
       <section className="relative w-full py-20 bg-white from-purple-50 to-blue-50 overflow-hidden">
  <div className="relative z-10 flex flex-col items-center justify-center text-center px-2 lg:px-0  mx-auto">
    <motion.p
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-sm uppercase tracking-widest text-purple-600 mb-4"
    >
      Elevate Your Coding
    </motion.p>

    <motion.h1
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 }}
      className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-6"
    >
      Daily <span className="italic">POTD</span>
    </motion.h1>

    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="text-lg sm:text-xl text-gray-700 mb-10"
    >
      Hand‑picked algorithm challenges, expert solutions, and community insights—every single day.
    </motion.p>

    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="flex flex-wrap justify-center gap-10"
    >
      <Link to="/leetcode">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 
    px-8 py-4 rounded-full font-semibold 
    shadow-lg border-2 border-purple-600 text-purple-600
    transition-all duration-200 ease-in-out

    hover:shadow-2xl
    hover:border-transparent
    hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600
    hover:text-white cursor-pointer"
        >
          LeetCode POTD <ArrowRight className="h-5 w-5" />
        </motion.button>
      </Link>
      <Link to="/gfg">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 
    px-8 py-4 rounded-full font-semibold 
    shadow-lg border-2 border-purple-600 text-purple-600
    transition-all duration-200 ease-in-out

    hover:shadow-2xl
    hover:border-transparent
    hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600
    hover:text-white cursor-pointer"
        >
          GFG POTD <ArrowRight className="h-5 w-5" />
        </motion.button>
      </Link>
      <Link to="/codeforces">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 
    px-8 py-4 rounded-full font-semibold 
    shadow-lg border-2 border-purple-600 text-purple-600
    transition-all duration-200 ease-in-out

    hover:shadow-2xl
    hover:border-transparent
    hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600
    hover:text-white cursor-pointer"
        >
          Codeforces POTD <ArrowRight className="h-5 w-5" />
        </motion.button>
      </Link>
    </motion.div>
  </div>
</section>



        {/* Features Section */}
        <section className="w-full bg-neutral-50 py-16">
          <div className="flex flex-col items-center text-center px-6">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Features
              </span>
            </h2>
            <p className="max-w-2xl text-base sm:text-lg text-slate-600 mb-10">
              Everything you need to master algorithms and excel in your coding
              interviews.
            </p>
            <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4, boxShadow: '0 12px 18px rgba(0,0,0,0.1)' }}
                  className="bg-white p-6 rounded-2xl shadow-md transition-all duration-200"
                >
                  <div className={`${f.bg} inline-block p-4 rounded-xl mb-4`}>
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    {f.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
