import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { CalendarDays, AlertTriangle, Code, Save } from 'lucide-react';
import MainLayout from './MainLayout';

const navLinks = [
    { name: 'POTD Calendar', path: '/custom' },
    { name: 'My Problems', path: '/my-problems' },
    { name: 'Add Problem', path: '/add-problem' },

  ];

const AddProblem = () => {
  const [searchParams] = useSearchParams();
  const prefilledDate = searchParams.get("date") || "";

  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [platform, setPlatform] = useState("leetcode");
  const [difficulty, setDifficulty] = useState("easy");
  const [tags, setTags] = useState("");
  const [date, setDate] = useState(prefilledDate);
  const [listName, setListName] = useState("");

  const handleAddProblem = () => {
    if (!title || !link || !platform || !difficulty || !date || !listName) {
      alert("Please fill in all required fields");
      return;
    }
    const tagsArray = tags.split(",").map(tag => tag.trim()).filter(Boolean);
    const problem = {
      id: uuidv4(),
      title,
      link,
      platform,
      difficulty,
      tags: tagsArray,
      createdBy: "user",
      createdAt: new Date().toISOString(),
    };

    const existingLists = JSON.parse(localStorage.getItem("problemLists") || "[]");
    let targetList = existingLists.find(list => list.name === listName);
    if (targetList) {
      targetList.problems[date] = problem;
    } else {
      const newList = {
        id: uuidv4(),
        name: listName,
        createdBy: "user",
        createdAt: new Date().toISOString(),
        problems: { [date]: problem }
      };
      existingLists.push(newList);
    }
    localStorage.setItem("problemLists", JSON.stringify(existingLists));
    setTitle("");
    setLink("");
    setPlatform("leetcode");
    setDifficulty("easy");
    setTags("");
    setDate("");
    setListName("");
    alert("Problem added successfully!");
  };

  return (
    <MainLayout navLinks={navLinks}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center mb-2">
            <Code className="mr-2 text-purple-600 h-7 w-7" />
            <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Add Problem
            </h1>
          </div>
          <p className="text-gray-600">Add a coding challenge to your calendar</p>
        </div>

        <div className="border shadow-lg rounded-lg animate-fade-in delay-100">
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 border-b p-4 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-5 w-5 text-purple-600" />
              <h2 className="text-xl font-bold">Problem Details</h2>
            </div>
            <p className="text-gray-600">Fill in the information about the problem</p>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="listName" className="block text-base">List Name</label>
                <input
                  id="listName"
                  placeholder="E.g. Dynamic Programming"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  className="mt-1 h-11 w-full border border-gray-300 rounded px-3"
                />
                <p className="text-xs text-gray-500">Collection this problem belongs to</p>
              </div>
              <div>
                <label htmlFor="date" className="block text-base">Schedule Date</label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 h-11 w-full border border-gray-300 rounded px-3"
                />
                <p className="text-xs text-gray-500">When you plan to solve this problem</p>
              </div>
            </div>
            <div>
              <label htmlFor="title" className="block text-base">Problem Title</label>
              <input
                id="title"
                placeholder="E.g. Two Sum"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 h-11 w-full border border-gray-300 rounded px-3"
              />
            </div>
            <div>
              <label htmlFor="link" className="block text-base">Problem URL</label>
              <input
                id="link"
                placeholder="https://leetcode.com/problems/two-sum/"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="mt-1 h-11 w-full border border-gray-300 rounded px-3"
              />
              <div className="flex items-start gap-2 text-xs text-gray-500 mt-1">
                <AlertTriangle className="h-4 w-4" />
                <p>Make sure the URL is correct and points directly to the problem</p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="platform" className="block text-base">Platform</label>
                <select
                  id="platform"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="mt-1 h-11 w-full border border-gray-300 rounded px-3"
                >
                  <option value="leetcode">LeetCode</option>
                  <option value="gfg">GeeksForGeeks</option>
                  <option value="codeforces">CodeForces</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="difficulty" className="block text-base">Difficulty</label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="mt-1 h-11 w-full border border-gray-300 rounded px-3"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="tags" className="block text-base">Tags (comma separated)</label>
              <input
                id="tags"
                placeholder="arrays, strings, dynamic programming"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="mt-1 h-11 w-full border border-gray-300 rounded px-3"
              />
              <p className="text-xs text-gray-500">Topics covered by this problem</p>
            </div>
            <div className="pt-4">
              <button
                onClick={handleAddProblem}
                className="flex items-center gap-2 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded"
              >
                <Save className="mr-2 h-5 w-5" /> Save Problem
              </button>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 animate-fade-in delay-200">
          <h2 className="text-xl font-bold mb-4">Quick Tips</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2 text-purple-600">Finding Good Problems</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Check platform's daily challenges</li>
                <li>Sort by acceptance rate or frequency</li>
                <li>Look for company-specific questions</li>
                <li>Follow curated topic lists</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2 text-purple-600">Effective Tagging</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Use specific algorithm names (e.g., "Dijkstra")</li>
                <li>Include data structures (e.g., "hash map")</li>
                <li>Add technique tags (e.g., "two-pointers")</li>
                <li>Consider problem types (e.g., "optimization")</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AddProblem;
