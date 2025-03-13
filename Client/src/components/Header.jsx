
import React from 'react';
import { MessageSquarePlus, Code, Brain } from 'lucide-react';

const Header = ({ onNewTicket }) => {
  return (
    <header className="py-6 mb-8 relative z-10 backdrop-blur-sm bg-black/30">
      <div className="container flex flex-col md:flex-row items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="mr-4 animate-float">
            <img 
              src="/org_codeverse.png" 
              alt="CodeVerse Logo" 
              className="h-12 w-12"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-codeverse-gradient bg-clip-text text-transparent">
              CodeVerse Support
            </h1>
            <p className="text-gray-300">Welcome to the MultiVerse of Code</p>
          </div>
        </div>
        
        <button 
          onClick={onNewTicket}
          className="relative overflow-hidden group bg-gradient-to-r from-codeverse-cyan to-codeverse-purple text-white px-4 py-2 rounded-md font-medium transform transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-codeverse-purple to-codeverse-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <span className="relative flex items-center">
            <MessageSquarePlus className="h-5 w-5 mr-2" />
            Raise New Ticket
          </span>
        </button>
      </div>
      
      <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-codeverse-cyan via-codeverse-purple to-codeverse-blue"></div>
    </header>
  );
};

export default Header;
