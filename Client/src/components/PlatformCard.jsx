import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Link as LinkIcon } from "lucide-react";
import { toast } from "react-toastify";

const PlatformCard = ({ platform, username, onSave, isConnected }) => {
  const [newUsername, setNewUsername] = useState(username || "");
  const [isOpen, setIsOpen] = useState(false);

  const platformDetails = {
    leetcode: {
      name: "LeetCode",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png",
      color: "from-yellow-400 to-orange-500",
    },
    codeforces: {
      name: "CodeForces",
      logo: "https://codeforces.org/s/0/favicon-32x32.png",
      color: "from-blue-400 to-indigo-500",
    },
    gfg: {
      name: "GeeksForGeeks",
      logo: "https://media.geeksforgeeks.org/gfg-gg-logo.svg",
      color: "from-green-400 to-emerald-500",
    },
  };

  const { name, logo, color } = platformDetails[platform];

  const handleSave = () => {
    if (newUsername.trim()) {
      onSave(newUsername.trim());
      setIsOpen(false);
      toast.success(`Connected to ${name}!`);
    }
  };

  return (
    <>
      <motion.div
        className={`w-full bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border-2 ${
          isConnected ? "border-green-400" : "border-gray-200"
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className={`h-2 w-full rounded-t-2xl bg-gradient-to-r ${color}`} />
        <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-wrap">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-white shadow-inner flex items-center justify-center">
              <img src={logo} alt={name} className="w-6 h-6 object-contain" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">{name}</h3>
              {username && (
                <p className="text-sm text-gray-500 tracking-wide break-all">
                  @{username}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="w-full sm:w-auto px-4 py-2 sm:px-4 sm:py-1.5 text-sm bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg hover:brightness-110 transition whitespace-nowrap"
          >
            {isConnected ? "Update" : "Connect"}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Connect to {name}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Enter your username to link your {name} profile.
              </p>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder={`Enter your ${name} username`}
                className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:ring-2 focus:ring-gray-500 outline-none transition"
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-100 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PlatformCard;
