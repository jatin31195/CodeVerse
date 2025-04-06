import React from "react";
import { motion } from "framer-motion";
import { Mail, Calendar, User, Edit2 } from "lucide-react";

const UserProfileCard = ({ name, email, dob, gender, avatarUrl }) => {
  return (
    <motion.div
      className="w-full overflow-hidden bg-white  border border-gray-100 dark:border-gray-900/30 shadow-sm hover:shadow-md transition-all rounded-xl"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6">
       
        <div className="relative">
          <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 blur-sm opacity-70"></div>
          <div className="h-24 w-24 border-2 border-white dark:border-gray-800 relative rounded-full overflow-hidden">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-white">
                <span className="text-lg font-bold text-white">
                  {name.split(" ").map(n => n[0]).join("")}
                </span>
              </div>
            )}
          </div>
        </div>
       
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-purple-800 to-indigo-700 dark:from-purple-600 dark:to-indigo-400">
            {name}
          </h2>
          <p className="flex items-center justify-center md:justify-start text-dark dark:text-text-black mb-4">
            <Mail className="h-4 w-4 mr-1 opacity-70" />
            {email}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2 bg-white/60 dark:bg-gray-100/60 rounded-lg p-2 border border-purple-100/50 dark:border-purple-900/20">
              <Calendar className="h-4 w-4 text-black dark:text-black" />
              <span className="text-gray-600 dark:text-black">Born:</span>
              <span className="font-medium text-gray-800 dark:text-black">{dob}</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/60 dark:bg-gray-100/60 rounded-lg p-2 border border-purple-100/50 dark:border-purple-900/20">
              <User className="h-4 w-4 text-purple-500 dark:text-purple-800" />
              <span className="text-black dark:text-black">Gender:</span>
              <span className="font-medium text-gray-800 dark:text-black">{gender}</span>
            </div>
          </div>
        </div>
       
        <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0">
          <button className="flex items-center gap-1 px-3 py-1 border border-purple-200 dark:border-purple-800/30 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-sm">
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default UserProfileCard;
