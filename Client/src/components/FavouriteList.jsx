import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircle, Code, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "./MainLayout";

const API_BASE_URL = "http://localhost:8080/api/fav";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const FavoriteList = () => {
  const [lists, setLists] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const fetchLists = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/lists`, {
        headers: { Authorization: token },
      });
      if (res.ok) {
        const data = await res.json();
        setLists(data);
      }
    } catch (error) {
      toast.error("Error fetching lists:", error);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const filteredLists = lists.filter(
    (list) =>
      list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      list.questions.some((q) =>
        q.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const handleCreateListSubmit = async (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ name: newListName.trim() }),
      });
      if (res.ok) {
        setNewListName("");
        setCreateModalOpen(false);
        fetchLists();
      }
    } catch (error) {
      taost.error("Error creating list:", error);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${API_BASE_URL}/list/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });
      if (res.ok) {
        setLists(lists.filter((list) => list._id !== id));
      }
    } catch (error) {
      toast.error("Error deleting list:", error);
    }
  };

  return (
    <MainLayout>
      <motion.div
        className="container mx-auto py-8 px-4 sm:px-6 max-w-7xl"
        initial="hidden"
        animate="show"
        variants={fadeIn}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.header
          className="mb-8"
          variants={fadeIn}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Code className="text-purple-600" size={32} />
              Favorite Coding Questions
            </h1>
            <motion.button
              onClick={() => setCreateModalOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg transition"
            >
              <PlusCircle size={20} className="cursor-pointer"/>
              Create New List
            </motion.button>
          </div>
          <div className="max-w-md">
            <motion.input
              type="text"
              placeholder="Search lists or questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            />
          </div>
        </motion.header>

        {/* Lists Grid */}
        <motion.main variants={fadeIn} transition={{ delay: 0.3 }}>
          {filteredLists.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-600">
                No lists match your search
              </h3>
              <p className="text-gray-500 mt-2">Try a different search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLists.map((list, idx) => (
                <motion.div
                  key={list._id}
                  className="relative bg-white p-6 rounded-lg shadow-md border border-gray-200 transition-all cursor-pointer"
                  variants={fadeIn}
                  transition={{ delay: 0.4 + idx * 0.05 }}
                  whileHover={{ scale: 1.03, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
                  onClick={() => navigate(`/list/${list._id}`)}
                >
                  <motion.button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                    onClick={(e) => handleDelete(list._id, e)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 size={18} />
                  </motion.button>

                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    {list.name}
                  </h2>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {list.questions.length === 0 ? (
                      <p className="text-gray-500 text-sm">0 Questions</p>
                    ) : (
                      list.questions
                        .reduce((acc, q) => {
                          const found = acc.find((i) => i.platform === q.platform);
                          if (found) found.count++;
                          else acc.push({ platform: q.platform, count: 1 });
                          return acc;
                        }, [])
                        .map((item) => (
                          <span
                            key={item.platform}
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              item.platform === "LeetCode"
                                ? "bg-yellow-200 text-yellow-800"
                                : "bg-blue-200 text-blue-800"
                            }`}
                          >
                            {item.platform}: {item.count}
                          </span>
                        ))
                    )}
                  </div>

                  <ul className="mt-3 text-gray-600 text-sm">
                    {list.questions.slice(0, 2).map((q) => (
                      <li key={q.id} className="truncate">
                        • {q.title}
                      </li>
                    ))}
                    {list.questions.length > 2 && (
                      <li className="text-purple-600 text-sm mt-2">
                        +{list.questions.length - 2} more...
                      </li>
                    )}
                  </ul>
                </motion.div>
              ))}
            </div>
          )}
        </motion.main>

        
        <AnimatePresence>
          {createModalOpen && (
            <motion.div
              className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50"

              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white p-6 rounded-lg shadow-lg w-96"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="text-xl font-semibold mb-4">New Favorite List</h3>
                <form onSubmit={handleCreateListSubmit}>
                  <input
                    type="text"
                    placeholder="List Name"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    required
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setCreateModalOpen(false)}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
                    >
                      Cancel
                    </button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg transition cursor-pointer"
                    >
                      Create
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </MainLayout>
  );
};

export default FavoriteList;
