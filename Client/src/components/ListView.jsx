import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowLeft,
  Code,
  BookOpen,
  Plus,
  ListFilter,
  Trash2,
  Edit2 as EditIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { BASE_URL } from "../config";
import { apiRequest } from "../utils/api";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.5, ease: "easeOut" },
  }),
};

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
});

const fetchListById = async (id) => {
  try {
    const res = await apiRequest(`${BASE_URL}/api/fav/list/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    console.error(error);
    toast.error("Failed to fetch list");
    return null;
  }
};

const removeQuestionFromListAPI = async (listId, questionData) => {
  try {
    const res = await apiRequest(`${BASE_URL}/api/fav/remove-question`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ listId, questionData }),
    });
    return res.data;
  } catch (error) {
    toast.error("Failed to remove question");
    throw error;
  }
};

const addQuestionToListAPI = async (listId, questionData) => {
  try {
    const res = await apiRequest(`${BASE_URL}/api/fav/add-question`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ listId, questionData }),
    });
    return res.data;
  } catch (error) {
    toast.error("Failed to add question");
    throw error;
  }
};

const searchQuestionsAPI = async (query) => {
  try {
    const res = await apiRequest(
      `${BASE_URL}/api/fav/search?query=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );
    return res.data;
  } catch (error) {
    toast.error("Failed to search questions");
    return [];
  }
};

const SearchBar = ({
  onSearch,
  placeholder,
  listId,
  onQuestionAdded,
  className,
}) => {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
    if (value.trim().length > 0) {
      const results = await searchQuestionsAPI(value);
      const validResults = Array.isArray(results) ? results : [];
      setSearchResults(validResults.slice(0, 5));
      setShowResults(validResults.length > 0);
    } else {
      setShowResults(false);
    }
  };

  const handleAddQuestion = async (question) => {
    if (!listId || !onQuestionAdded) return;
    const questionData = {
      questionId: question._id,
      title: question.title,
      questionUrl: question.link,
      platform: question.platform,
    };
    try {
      await addQuestionToListAPI(listId, questionData);
      toast.success(`Added "${question.title}" to your list`);
      onQuestionAdded();
      setShowResults(false);
      setQuery("");
    } catch {
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
              <div className="w-full">
                <div className="font-medium text-sm truncate">
                  {question.title}
                </div>
                <div className="flex items-center space-x-2 mt-1 flex-wrap">
                  <span className="px-2 py-1 text-xs bg-gray-200 rounded-full">
                    {normalizePlatform(question.platform) === "leetcode"
                      ? "LeetCode"
                      : normalizePlatform(question.platform) === "gfg"
                      ? "GeeksForGeeks"
                      : "CodeForces"}
                  </span>
                </div>
              </div>
              <Plus size={16} className="text-purple-600 ml-2 flex-shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};



const AddQuestionModal = ({ listId, onQuestionAdded }) => {
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState("");
  const [platform, setPlatform] = useState("");
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setTitle("");
    setPlatform("");

    try {
      const url = new URL(link.trim());
      const host = url.hostname.toLowerCase();
      const path = url.pathname;

      if (host.includes("leetcode.com")) {
        setPlatform("LeetCode");
        const parts = path.split("/").filter(Boolean);
        const idx = parts.indexOf("problems");
        if (idx !== -1 && parts[idx + 1]) {
          const slug = parts[idx + 1];
          setTitle(
            slug
              .split("-")
              .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
              .join(" ")
          );
        }
      } else if (host.includes("geeksforgeeks.org")) {
        setPlatform("GeeksForGeeks");
        const parts = path.split("/").filter(Boolean);
        const idx = parts.indexOf("problems");
        if (idx !== -1 && parts[idx + 1]) {
          const slug = parts[idx + 1].replace(/\d+$/, "");
          setTitle(
            slug
              .split("-")
              .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
              .join(" ")
          );
        }
      } else if (host.includes("codeforces.com")) {
        setPlatform("CodeForces");
        const parts = path.split("/").filter(Boolean);
        let contestId, letter;
        const ci = parts.indexOf("problemset");
        const cj = parts.indexOf("contest");
        if (ci !== -1 && parts[ci + 2] && parts[ci + 3]) {
          contestId = parts[ci + 2];
          letter = parts[ci + 3];
        } else if (cj !== -1 && parts[cj + 1] && parts[cj + 3]) {
          contestId = parts[cj + 1];
          letter = parts[cj + 3];
        }
        if (contestId && letter) {
          fetch(link, { mode: "cors" })
            .then((res) => res.text())
            .then((html) => {
              if (cancelled) return;
              const doc = new DOMParser().parseFromString(html, "text/html");
              const titleDiv = doc.querySelector(
                ".problem-statement .header .title"
              );
              if (titleDiv) {
                setTitle(titleDiv.textContent.trim());
              } else {
                setTitle(`Problem ${contestId}${letter}`);
              }
            })
            .catch(() => {
              if (!cancelled) {
                setTitle(`Problem ${contestId}${letter}`);
              }
            });
        } else {
          setTitle("");
        }
      } else {
        setPlatform("Other");
        setTitle("");
      }
    } catch {
      setPlatform("");
      setTitle("");
    }

    return () => {
      cancelled = true;
    };
  }, [link]);

  const handleAddQuestion = async () => {
    if (!link.trim()) {
      toast.warning("Please paste a valid URL.");
      return;
    }
    setIsSubmitting(true);
    const questionData = { title: title.trim(), questionUrl: link.trim(), platform };
    try {
      await addQuestionToListAPI(listId, questionData);
      toast.success("Question added to list");
      setLink("");
      setTitle("");
      setPlatform("");
      onQuestionAdded();
      setIsEditing(false);
      setOpen(false);
    } catch {
      toast.error("Failed to add question");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition text-sm sm:text-base"
      >
        <Plus size={16} />
        Add Question
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white border border-gray-200 p-6 rounded-lg shadow-xl w-full max-w-md mx-auto overflow-y-auto"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-black font-semibold">Add New Question</h2>
                <button
                  onClick={() => {
                    setOpen(false);
                    setIsEditing(false);
                    setLink("");
                    setTitle("");
                    setPlatform("");
                  }}
                  className="cursor-pointer text-gray-600 hover:text-gray-900"
                >
                  X
                </button>
              </div>
              <p className="text-gray-500 text-sm mb-4">
                Paste a public problem link (CF, LC, GFG).
              </p>
              <div className="mb-4">
                <label htmlFor="link" className="block text-sm font-medium text-gray-700">
                  Problem URL
                </label>
                <input
                  id="link"
                  type="url"
                  placeholder="https://codeforces.com/…"
                  value={link}
                  onChange={(e) => {
                    setLink(e.target.value);
                    setIsEditing(false);
                  }}
                  className="text-gray-900 w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    <strong>Platform:</strong> {platform || "—"}
                  </p>
                  {platform && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-gray-500 hover:text-gray-800 p-1"
                    >
                      <EditIcon size={16} />
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    <strong>Title:</strong> {title || "—"}
                  </p>
                  {title && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-gray-500 hover:text-gray-800 p-1"
                    >
                      <EditIcon size={16} />
                    </button>
                  )}
                </div>
              </div>
              {isEditing && (
                <div className="space-y-4 mb-4">
                  <div>
                    <label htmlFor="platform-edit" className="block text-sm font-medium text-gray-700">
                      Edit Platform
                    </label>
                    <select
                      id="platform-edit"
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      className="text-gray-900 w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    >
                      <option className="bg-white" value="LeetCode">LeetCode</option>
                      <option className="bg-white" value="GFG">GeeksForGeeks</option>
                      <option className="bg-white" value="CodeForces">CodeForces</option>
                      <option className="bg-white" value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="title-edit" className="block text-sm font-medium text-gray-700">
                      Edit Title
                    </label>
                    <input
                      id="title-edit"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="text-gray-900 w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>
              )}
              <div className="pt-4">
                <motion.button
                  onClick={handleAddQuestion}
                  whileHover={{ scale: 1.03 }}
                  disabled={isSubmitting || !link.trim()}
                  className="flex items-center gap-2 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-3 rounded hover:opacity-90 disabled:opacity-50"
                >
                  <Plus size={16} />
                  {isSubmitting ? "Adding..." : "Save Problem"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const normalizePlatform = (plat) => {
  const p = plat?.toLowerCase() || "";
  if (p.includes("leetcode")) return "leetcode";
  if (p === "gfg" || p === "geeksforgeeks") return "gfg";
  if (p.includes("codeforces") || p.includes("cf")) return "codeforces";
  return "other";
};





const QuestionCard = ({ question, listId, onDeleted }) => {
  const handleDelete = async (e) => {
    e.stopPropagation();
    const questionData = {
      _id: question._id,
      questionId: question.questionId,
      title: question.title,
      questionUrl: question.questionUrl,
      platform: question.platform,
    };
    try {
      await removeQuestionFromListAPI(listId, questionData);
      toast.success(`Deleted question "${question.title}"`);
      onDeleted();
    } catch {
      toast.error("Failed to delete question");
    }
  };

  const platformKey = normalizePlatform(question.platform);

  const getPlatformColor = (platform) => {
    if (platform === "leetcode")
      return "bg-yellow-200 text-yellow-800 border-yellow-300";
    if (platform === "gfg")
      return "bg-green-200 text-green-800 border-green-300";
    return "bg-blue-200 text-blue-800 border-blue-300";
  };

  return (
    <motion.div
      onClick={() => window.open(question.questionUrl, "_blank")}
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition relative cursor-pointer flex flex-col justify-between"
      whileHover={{ scale: 1.02 }}
    >
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
      >
        <Trash2 size={16} />
      </button>
      <div>
        <h3 className="text-base font-medium mb-2 line-clamp-2">
          {question.title}
        </h3>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span
            className={`px-2 py-1 text-xs rounded-full border ${getPlatformColor(
              platformKey
            )}`}
          >
            {platformKey === "leetcode"
              ? "LeetCode"
              : platformKey === "gfg"
              ? "GeeksForGeeks"
              : "CodeForces"}
          </span>
        </div>
      </div>
      <a
        href={question.questionUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="mt-auto inline-flex items-center text-sm text-purple-600 hover:text-purple-800 transition"
      >
        <span className="mr-1">Open Problem</span>
        <Code size={14} />
      </a>
    </motion.div>
  );
};

const ListView = () => {
  const { id } = useParams();
  const [list, setList] = useState(null);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const loadList = async () => {
    if (!id) return;
    const foundList = await fetchListById(id);
    if (foundList) {
      setList(foundList);
    } else {
      setList({
        listName: "My List",
        questions: [],
        updatedAt: new Date().toISOString(),
      });
    }
  };

  useEffect(() => {
    loadList();
  }, [id]);

  useEffect(() => {
    if (!list) return;
    let filtered = [...(list.questions || [])];

    // Filter by normalized platform
    if (activeFilter !== "all") {
      filtered = filtered.filter(
        (q) => normalizePlatform(q.platform) === activeFilter
      );
    }

    // Filter by title search
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((q) =>
        q.title?.toLowerCase().includes(lowerQuery)
      );
    }

    setFilteredQuestions(filtered);
  }, [list, searchQuery, activeFilter]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (value) => {
    setActiveFilter(value);
  };

  // Count how many questions per normalized platform
  const countByPlatform =
    list?.questions?.reduce((acc, q) => {
      const key = normalizePlatform(q.platform);
      if (key && key !== "other") {
        acc[key] = (acc[key] || 0) + 1;
      }
      return acc;
    }, {}) || {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-4 sm:py-6 mb-4 sm:mb-6">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <button
            onClick={() => window.history.back()}
            className="text-white/90 hover:text-white inline-flex items-center text-sm sm:text-base"
          >
            <ArrowLeft size={16} className="mr-1" /> Back to Lists
          </button>
          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold flex items-center">
                <BookOpen className="mr-2 h-7 w-7 sm:h-8 sm:w-8" />
                {list?.listName || ""}
              </h1>
              <p className="text-white/80 text-sm sm:text-base mt-1">
                {list?.questions?.length || 0} questions • Updated{" "}
                {list && list.updatedAt
                  ? formatDistanceToNow(new Date(list.updatedAt), {
                      addSuffix: true,
                    })
                  : "just now"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <AddQuestionModal
                listId={list?._id || id}
                onQuestionAdded={loadList}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column */}
          <div className="flex-1">
            {/* Search + Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search questions..."
                listId={list?._id || id}
                onQuestionAdded={loadList}
                className="w-full sm:w-2/3"
              />
              <div className="w-full sm:w-1/3 flex justify-end sm:justify-start">
                {/* AddQuestionModal is already rendered above */}
              </div>
            </div>

            {/* Platform Filters */}
            <div className="mb-6 overflow-x-auto">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleFilterChange("all")}
                  className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base transition ${
                    activeFilter === "all"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-white text-gray-600"
                  }`}
                >
                  All ({list?.questions?.length || 0})
                </button>
                {countByPlatform.leetcode > 0 && (
                  <button
                    onClick={() => handleFilterChange("leetcode")}
                    className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base transition ${
                      activeFilter === "leetcode"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-white text-gray-600"
                    }`}
                  >
                    LeetCode ({countByPlatform.leetcode})
                  </button>
                )}
                {countByPlatform.gfg > 0 && (
                  <button
                    onClick={() => handleFilterChange("gfg")}
                    className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base transition ${
                      activeFilter === "gfg"
                        ? "bg-green-100 text-green-800"
                        : "bg-white text-gray-600"
                    }`}
                  >
                    GFG ({countByPlatform.gfg})
                  </button>
                )}
                {countByPlatform.codeforces > 0 && (
                  <button
                    onClick={() => handleFilterChange("codeforces")}
                    className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base transition ${
                      activeFilter === "codeforces"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-white text-gray-600"
                    }`}
                  >
                    CF ({countByPlatform.codeforces})
                  </button>
                )}
              </div>
            </div>

            {/* Question Grid or “No questions” message */}
            {list?.questions?.length === 0 ? (
              <div className="text-center py-10 sm:py-12 bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-600">
                  No questions available
                </h3>
                <p className="text-gray-500 mt-2">
                  Add your first question to get started
                </p>
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div className="text-center py-10 sm:py-12 bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-600">
                  No questions match your criteria
                </h3>
                <p className="text-gray-500 mt-2">
                  Try a different search term or filter
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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

          {/* Right Sidebar: Platform Distribution */}
          <div className="hidden lg:block lg:w-1/4">
            <div className="bg-white shadow-sm p-5 rounded-lg sticky top-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <ListFilter className="mr-2 h-5 w-5 text-purple-500" /> Platform
                Distribution
              </h3>
              <div className="space-y-2">
                {countByPlatform.leetcode > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 border rounded-full text-xs bg-yellow-100 text-yellow-800">
                      LeetCode
                    </span>
                    <span className="font-medium">
                      {countByPlatform.leetcode}
                    </span>
                  </div>
                )}
                {countByPlatform.gfg > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 border rounded-full text-xs bg-green-100 text-green-800">
                      GeeksForGeeks
                    </span>
                    <span className="font-medium">
                      {countByPlatform.gfg}
                    </span>
                  </div>
                )}
                {countByPlatform.codeforces > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 border rounded-full text-xs bg-blue-100 text-blue-800">
                      CodeForces
                    </span>
                    <span className="font-medium">
                      {countByPlatform.codeforces}
                    </span>
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

