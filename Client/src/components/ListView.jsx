import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; 
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowLeft,
  Code,
  BookOpen,
  Plus,
  ListFilter,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {toast} from 'react-toastify'

const API_BASE = "http://localhost:8080/api/fav";


const getAuthHeaders = () => {
  return {
    "Content-Type": "application/json",
    
  };
};


const fetchListById = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/list/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials:"include",
    });
    if (!response.ok) throw new Error("Failed to fetch list");
    return await response.json();
  } catch (error) {
    toast.error(error);
    return null;
  }
};

export const addQuestionToListAPI = async (listId, questionId) => {
  try {
    const response = await fetch(`${API_BASE}/add-question`, {
      method: "POST",
      headers: getAuthHeaders(),
       credentials:"include",
      body: JSON.stringify({ listId, questionId }),
    });
    if (!response.ok) throw new Error("Failed to add question");
    return await response.json();
  } catch (error) {
    toast.error(error);
    throw error;
  }
};


const removeQuestionFromListAPI = async (listId, questionId) => {
  try {
    const response = await fetch(`${API_BASE}/remove-question`, {
      method: "POST",
      headers: getAuthHeaders(),
       credentials:"include",
      body: JSON.stringify({ listId, questionId })
    });
    if (!response.ok) throw new Error("Failed to remove question");
    return await response.json();
  } catch (error) {
    toast.error(error);
    throw error;
  }
};

const searchQuestionsAPI = async (query) => {
  try {
    const url = `${API_BASE}/search?query=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
       credentials:"include",
    });
    if (!response.ok) throw new Error("Failed to search questions");
    return await response.json();
  } catch (error) {
    toast.error(error);
    return [];
  }
};


const SearchBar = ({ onSearch, placeholder, listId, onQuestionAdded, className }) => {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
    if (value.trim().length > 0) {
      const results = await searchQuestionsAPI(value);
      setSearchResults(results.slice(0, 5));
      setShowResults(results.length > 0);
    } else {
      setShowResults(false);
    }
  };

  const handleAddQuestion = async (question) => {
  if (!listId || !onQuestionAdded) return;
  try {
    await addQuestionToListAPI(listId, question._id);
    toast.success(`Added "${question.title}" to your list`);
    onQuestionAdded();
    setShowResults(false);
    setQuery("");
  } catch (error) {
    toast.error("Failed to add question");
  }
};


  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <Code size={16} />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className="w-full pl-10 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
        onClick={(e) => e.stopPropagation()}
      />
      {showResults && listId && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-purple-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2 border-b bg-purple-50">
            <h3 className="text-sm font-medium text-purple-700">
              Questions to add:
            </h3>
          </div>
          {searchResults.map((question, idx) => (
            <div
              key={idx}
              className="p-3 border-b hover:bg-purple-50 flex justify-between items-center cursor-pointer transition"
              onClick={() => handleAddQuestion(question)}
            >
              <div>
                <div className="font-medium text-sm">{question.title}</div>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="px-2 py-1 text-xs bg-gray-200 rounded-full">
                    {question.platform.toLowerCase() === "leetcode"
                      ? "LeetCode"
                      : question.platform.toLowerCase() === "gfg"
                      ? "GeeksForGeeks"
                      : "CodeForces"}
                  </span>
                  {question.difficulty && (
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        question.difficulty === "easy"
                          ? "bg-green-200 text-green-800"
                          : question.difficulty === "medium"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {question.difficulty}
                    </span>
                  )}
                </div>
              </div>
              <Plus size={16} className="text-purple-600" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const QuestionCard = ({ question, listId, onDeleted }) => {
  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      await removeQuestionFromListAPI(listId, question._id);
      toast.success(`Deleted question "${question.title}"`);
      onDeleted();
    } catch (error) {
      toast.error("Failed to delete question");
    }
  };

  const platformLower = question.platform.toLowerCase();

  const getPlatformColor = (platform) => {
    if (platform === "leetcode") return "bg-yellow-200 text-yellow-800 border-yellow-300";
    if (platform === "gfg") return "bg-green-200 text-green-800 border-green-300";
    return "bg-blue-200 text-blue-800 border-blue-300";
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty === "easy") return "bg-green-200 text-green-800 border-green-300";
    if (difficulty === "medium") return "bg-yellow-200 text-yellow-800 border-yellow-300";
    if (difficulty === "hard") return "bg-red-200 text-red-800 border-red-300";
    return "bg-gray-200 text-gray-800";
  };

  return (
    <motion.div
      onClick={() => window.open(question.link, "_blank")}
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition relative cursor-pointer"
      whileHover={{ scale: 1.02 }}
    >
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
      >
        <Trash2 size={16} />
      </button>
      <h3 className="text-base font-medium mb-2">{question.title}</h3>
      <div className="flex items-center gap-2 mb-2">
        <span className={`px-2 py-1 text-xs rounded-full border ${getPlatformColor(platformLower)}`}>
          {platformLower === "leetcode"
            ? "LeetCode"
            : platformLower === "gfg"
            ? "GeeksForGeeks"
            : "CodeForces"}
        </span>
        {question.difficulty && (
          <span className={`px-2 py-1 text-xs rounded-full border ${getDifficultyColor(question.difficulty)}`}>
            {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
          </span>
        )}
      </div>
      <a
        href={question.link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 transition"
      >
        <span className="mr-1">Open Problem</span>
        <Code size={14} />
      </a>
    </motion.div>
  );
};

const AddQuestionModal = ({ listId, onQuestionAdded }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [platform, setPlatform] = useState("leetcode");
  const [difficulty, setDifficulty] = useState("none");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setTitle("");
    setLink("");
    setPlatform("leetcode");
    setDifficulty("none");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.warning("Please enter a question title");
      return;
    }
    if (!link.trim()) {
      toast.warning("Please enter a valid link");
      return;
    }
    try {
      new URL(link);
    } catch (e) {
      toast.warning("Please enter a valid link");
      return;
    }
    setIsSubmitting(true);
    const questionData = {
      title: title.trim(),
      link: link.trim(),
      platform,
      ...(difficulty !== "none" ? { difficulty } : {})
    };
    try {
      await addQuestionToListAPI(listId, questionData);
      toast.success("Question added to list");
      resetForm();
      setOpen(false);
      onQuestionAdded();
    } catch (error) {
      toast.error("Failed to add question");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
      >
        <Plus size={16} />
        Add Question
      </button>
      <AnimatePresence>
        {open && (
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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Add New Question</h2>
                <button onClick={() => setOpen(false)} className="text-gray-600 hover:text-gray-900">
                  X
                </button>
              </div>
              <p className="text-gray-500 text-sm mb-4">
                Add a coding question to your list.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Question Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    placeholder="e.g., Edit Distance"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    autoFocus
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="link" className="block text-sm font-medium text-gray-700">
                    Question Link
                  </label>
                  <input
                    id="link"
                    type="text"
                    placeholder="https://www.geeksforgeeks.org/problems/edit-distance3702/1"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Platform
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="leetcode">LeetCode</option>
                    <option value="gfg">GeeksForGeeks</option>
                    <option value="codeforces">CodeForces</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Difficulty (Optional)
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="none">Not specified</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
                  >
                    {isSubmitting ? "Adding..." : "Add Question"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};


const ListView = () => {
  const { id } = useParams();
  const [list, setList] = useState(null);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();
  const loadList = async () => {
    if (!id) return;
    const foundList = await fetchListById(id);
    if (foundList) {
      setList(foundList);
      filterQuestions(foundList.questions, searchQuery, activeFilter);
    } else {
      const emptyList = { listName: "My List", questions: [], updatedAt: new Date().toISOString() };
      setList(emptyList);
      filterQuestions(emptyList.questions, searchQuery, activeFilter);
    }
  };

  useEffect(() => {
    loadList();
  }, [id]);

  const filterQuestions = (questions, query, filter) => {
    let filtered = [...questions];
    if (filter !== "all") {
      filtered = filtered.filter((q) => q.platform.toLowerCase() === filter);
    }
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter((q) => q.title.toLowerCase().includes(lowerQuery));
    }
    setFilteredQuestions(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (list) {
      filterQuestions(list.questions, query, activeFilter);
    }
  };

  const handleFilterChange = (value) => {
    setActiveFilter(value);
    if (list) {
      filterQuestions(list.questions, searchQuery, value);
    }
  };

  const countByPlatform = list?.questions?.reduce((acc, q) => {
    const platform = q.platform.toLowerCase();
    acc[platform] = (acc[platform] || 0) + 1;
    return acc;
  }, {}) || {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-6 mb-6">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-2">
          <button
  onClick={() => window.history.back()}
  className="text-white/90 hover:text-white inline-flex items-center transition-colors cursor-pointer"
>
  <ArrowLeft size={16} className="mr-1" /> Back to Lists
</button>

          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center">
                <BookOpen className="mr-3 h-8 w-8" />
                {list?.listName || ""}
              </h1>
              <p className="text-white/80">
                {list?.questions?.length || 0} questions • Updated{" "}
                {list && list.updatedAt 
                  ? formatDistanceToNow(new Date(list.updatedAt), { addSuffix: true })
                  : "just now"}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        
          <div className="lg:col-span-3">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
              <SearchBar 
                onSearch={handleSearch} 
                placeholder="Search questions or add new ones..." 
                listId={list?._id || id}
                onQuestionAdded={loadList}
                className="w-full md:max-w-xl"
              />
              <div className="flex gap-2 w-full md:w-auto">
                <AddQuestionModal listId={list?._id || id} onQuestionAdded={loadList} />
              </div>
            </div>
            
         
            <div className="mb-6">
              <div className="flex space-x-2 overflow-x-auto">
                <button
                  onClick={() => handleFilterChange("all")}
                  className={`px-4 py-2 rounded-lg transition ${activeFilter === "all" ? "bg-purple-100 text-purple-800" : "bg-white text-gray-600"}`}
                >
                  All ({list?.questions?.length || 0})
                </button>
                {countByPlatform.leetcode && (
                  <button
                    onClick={() => handleFilterChange("leetcode")}
                    className={`px-4 py-2 rounded-lg transition ${activeFilter === "leetcode" ? "bg-yellow-100 text-yellow-800" : "bg-white text-gray-600"}`}
                  >
                    LeetCode ({countByPlatform.leetcode})
                  </button>
                )}
                {countByPlatform.gfg && (
                  <button
                    onClick={() => handleFilterChange("gfg")}
                    className={`px-4 py-2 rounded-lg transition ${activeFilter === "gfg" ? "bg-green-100 text-green-800" : "bg-white text-gray-600"}`}
                  >
                    GFG ({countByPlatform.gfg})
                  </button>
                )}
                {countByPlatform.codeforces && (
                  <button
                    onClick={() => handleFilterChange("codeforces")}
                    className={`px-4 py-2 rounded-lg transition ${activeFilter === "codeforces" ? "bg-blue-100 text-blue-800" : "bg-white text-gray-600"}`}
                  >
                    CF ({countByPlatform.codeforces})
                  </button>
                )}
              </div>
            </div>

            {list?.questions?.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-600">No questions available</h3>
                <p className="text-gray-500 mt-2">Add your first question to get started</p>
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-600">No questions match your criteria</h3>
                <p className="text-gray-500 mt-2">Try a different search term or filter</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQuestions.map((question) => (
                  <QuestionCard 
                    key={question._id} 
                    question={question} 
                    listId={list?._id || id}
                    onDeleted={loadList} 
                  />
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white shadow-sm p-5 sticky top-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <ListFilter className="mr-2 h-5 w-5 text-purple-500" /> Platform Distribution
              </h3>
              <div className="space-y-2">
                {countByPlatform.leetcode && (
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 border rounded-full text-xs bg-yellow-100 text-yellow-800">
                      LeetCode
                    </span>
                    <span className="font-medium">{countByPlatform.leetcode}</span>
                  </div>
                )}
                {countByPlatform.gfg && (
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 border rounded-full text-xs bg-green-100 text-green-800">
                      GeeksForGeeks
                    </span>
                    <span className="font-medium">{countByPlatform.gfg}</span>
                  </div>
                )}
                {countByPlatform.codeforces && (
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 border rounded-full text-xs bg-blue-100 text-blue-800">
                      CodeForces
                    </span>
                    <span className="font-medium">{countByPlatform.codeforces}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ListView;
