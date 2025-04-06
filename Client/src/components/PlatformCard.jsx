import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Link } from "lucide-react";

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
      onSave(newUsername);
      setIsOpen(false);
      alert(`Connected to ${name}!`);
    }
  };

  return (
    <motion.div
      className={`w-full bg-white rounded-lg shadow transition-transform hover:shadow-xl ${
        isConnected ? "border-green-300" : "border-gray-300"
      }`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={`h-1 w-full bg-gradient-to-r ${color}`}></div>
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded overflow-hidden bg-white">
            <img src={logo} alt={name} className="w-6 h-6 object-contain" />
          </div>
          <div>
            <h3 className="font-medium">{name}</h3>
            {username && <p className="text-xs text-gray-500">@{username}</p>}
          </div>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="px-3 py-1 rounded bg-gray-600 text-white hover:bg-primary/90 transition"
        >
          {isConnected ? "Update" : "Connect"}
        </button>
      </div>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
            <h3 className="text-lg font-bold mb-2">Connect {name}</h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter your {name} username to connect your account.
            </p>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder={`Enter your ${name} username`}
              className="w-full border rounded px-3 py-2 mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border rounded hover:bg-red-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-green-500/90 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PlatformCard;
