import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircle, Code, Trash2,PanelRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from './Sidebar';
import MainLayout from "./MainLayout";
const API_BASE_URL = "http://localhost:8080/api/fav";

const FavoriteList = () => {
  const [lists, setLists] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const fetchLists = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/lists`, {
        headers: { Authorization: token },
      });
      if (res.ok) {
        const data = await res.json();
        setLists(data);
      } else {
        console.error("Failed to fetch lists");
      }
    } catch (error) {
      console.error("Error fetching lists:", error);
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
        fetchLists();
        setNewListName("");
        setCreateModalOpen(false);
      } else {
        console.error("Failed to create list");
      }
    } catch (error) {
      console.error("Error creating list:", error);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();

    try {
      const res = await fetch(`${API_BASE_URL}/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });

      if (res.ok) {
        setLists(lists.filter((list) => list.id !== id));
      } else {
        console.error("Failed to delete list");
      }
    } catch (error) {
      console.error("Error deleting list:", error);
    }
  };

  return (
    <>
    <MainLayout>
    <div className="container mx-auto py-8 px-4 sm:px-6 max-w-7xl">
     
      <header className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Code className="text-purple-600" size={32} />
            <span>Favorite Coding Questions</span>
          </h1>
          <button
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            onClick={() => setCreateModalOpen(true)}
          >
            <PlusCircle size={20} />
            Create New List
          </button>
        </div>
        <div className="max-w-md">
          <input
            type="text"
            placeholder="Search lists or questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
      </header>

     
      <main>
        {filteredLists.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-600">
              No lists match your search
            </h3>
            <p className="text-gray-500 mt-2">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLists.map((list) => (
              <motion.div
              key={list._id}
              className="relative bg-white p-6 rounded-lg shadow-md border border-gray-200 transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                console.log("Navigating to:", list._id); 
                if (list._id) {
                  navigate(`/list/${list._id}`);
                } else {
                  console.error("List ID is undefined:", list);
                }
              }}
            >
            
             
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                  onClick={(e) => handleDelete(list.id, e)}
                >
                  <Trash2 size={18} />
                </button>

         
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  {list.name}
                </h2>

                <div className="flex flex-wrap gap-2 mt-2">
                  {list.questions.length === 0 ? (
                    <p className="text-gray-500 text-sm">0 Questions</p>
                  ) : (
                    list.questions
                      .reduce((acc, q) => {
                        const existing = acc.find(
                          (item) => item.platform === q.platform
                        );
                        if (existing) existing.count += 1;
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
                  {list.questions.slice(0, 2).map((question) => (
                    <li key={question.id} className="truncate">
                      • {question.title}
                    </li>
                  ))}
                  {list.questions.length > 2 && (
                    <li className="text-purple-600 text-sm mt-2">
                      + {list.questions.length - 2} more...
                    </li>
                  )}
                </ul>
              </motion.div>
            ))}
          </div>
        )}
      </main>

    
      <AnimatePresence>
        {createModalOpen && (
          <motion.div
            className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg w-96"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <form onSubmit={handleCreateListSubmit}>
                <input
                  type="text"
                  placeholder="List Name"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
                <button type="submit" className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg">
                  Create
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </MainLayout>
    </>
    
  );
};

export default FavoriteList;
