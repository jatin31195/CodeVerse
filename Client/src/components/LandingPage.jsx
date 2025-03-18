import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full py-4 px-6 md:px-12 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-2">
          <img src="/org_codeverse.png" alt="CodeVerse Logo" className="w-16 h-16" />
          <span className="font-bold text-xl">CodeVerse</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="px-6 py-2 rounded-lg font-medium text-gray-600 bg-transparent hover:bg-gray-100 transition-all duration-300 active:scale-95 text-sm"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="px-6 py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-[#33C3F0] to-[#A374FF] transition-all duration-300 hover:shadow-lg active:scale-95 text-sm"
          >
            Create account
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute -left-32 -top-32 w-96 h-96 rounded-full filter blur-3xl opacity-70 animate-[float_6s_ease-in-out_infinite]" 
            style={{ backgroundColor: "rgba(51, 195, 240, 0.1)" }}
          />
          <div 
            className="absolute -right-32 -bottom-32 w-96 h-96 rounded-full filter blur-3xl opacity-70 animate-[float_6s_ease-in-out_infinite]" 
            style={{ animationDelay: '1s', backgroundColor: "rgba(163, 116, 255, 0.1)" }}
          />
          <div 
            className="absolute left-1/4 bottom-1/3 w-32 h-32 rounded-full filter blur-xl opacity-70 animate-[float_6s_ease-in-out_infinite]" 
            style={{ animationDelay: '2s', backgroundColor: "rgba(51, 195, 240, 0.1)" }}
          />
          <div 
            className="absolute right-1/3 top-1/4 w-48 h-48 rounded-full filter blur-xl opacity-70 animate-[float_6s_ease-in-out_infinite]" 
            style={{ animationDelay: '1.5s', backgroundColor: "rgba(163, 116, 255, 0.1)" }}
          />
        </div>

        <div className="relative z-10 max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#A374FF] font-space">
                CodeVerse
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Your gateway to the universe of coding. Learn, create, and connect with fellow developers on this epic journey.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/signup" 
                  className="px-8 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-[#33C3F0] to-[#A374FF] transition-all duration-300 hover:shadow-lg active:scale-95 text-lg flex items-center gap-2"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/login" 
                  className="px-8 py-3 rounded-lg font-medium text-gray-600 bg-transparent hover:bg-gray-100 transition-all duration-300 active:scale-95 text-lg flex items-center gap-2"
                >
                  Sign In
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
