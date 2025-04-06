import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { Link } from 'react-router-dom';
import { CalendarDays, Shuffle, ChevronLeft, ChevronRight, ExternalLink, Code } from 'lucide-react';
import MainLayout from './MainLayout';

const navLinks = [
  { name: 'POTD Calendar', path: '/custom' },
  { name: 'My Problems', path: '/my-problems' },
  { name: 'Add Problem', path: '/add-problem' },
 
];

const CustomPOTD = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [currentList, setCurrentList] = useState(null);
  const [month, setMonth] = useState(new Date());

  useEffect(() => {
    const lists = JSON.parse(localStorage.getItem("problemLists") || "[]");
    if (lists.length > 0) {
      setCurrentList(lists[0]);
    }
  }, []);

  useEffect(() => {
    if (!selectedDate || !currentList) return;
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    const problem = currentList.problems ? currentList.problems[dateKey] : null;
    setSelectedProblem(problem);
  }, [selectedDate, currentList]);

  const handleRandomize = () => {
    const lists = JSON.parse(localStorage.getItem("problemLists") || "[]");
    if (lists.length > 0) {
      const randomList = lists[Math.floor(Math.random() * lists.length)];
      localStorage.setItem("currentList", randomList.id);
      setCurrentList(randomList);
      alert("Randomized! Now showing problems from: " + randomList.name);
    }
  };

  const handlePrevMonth = () => setMonth(subMonths(month, 1));
  const handleNextMonth = () => setMonth(addMonths(month, 1));

  return (
    <MainLayout  navLinks={navLinks}>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 font-display bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Problem of the Day
            </h1>
            <p className="text-gray-600">
              Track your daily coding practice with an interactive calendar
            </p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Link to="/add-problem">
              <button className="flex items-center gap-2 border border-purple-600 text-purple-600 px-4 py-2 rounded hover:bg-purple-50">
                <Code size={16} />
                <span>Add Problem</span>
              </button>
            </Link>
            <button onClick={handleRandomize} className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded hover:opacity-90">
              <Shuffle size={16} />
              <span>Randomize</span>
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="border shadow-md rounded-lg animate-fade-in">
              <div className="border-b bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      POTD Calendar
                    </h2>
                    <p className="text-gray-600">
                      {currentList ? `Showing problems from: ${currentList.name}` : 'No list selected'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={handlePrevMonth} className="border p-2 rounded hover:bg-purple-50">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <h2 className="text-lg font-semibold">{format(month, 'MMMM yyyy')}</h2>
                  <button onClick={handleNextMonth} className="border p-2 rounded hover:bg-purple-50">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Select Date:</label>
                  <input
                    type="date"
                    value={format(selectedDate, 'yyyy-MM-dd')}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    className="border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="border shadow-md rounded-lg h-full animate-fade-in delay-200">
              <div className={`border-b p-4 rounded-t-lg ${selectedProblem ? "bg-gradient-to-r from-purple-100 to-blue-100" : ""}`}>
                <h2 className="text-xl font-bold">
                  {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
                </h2>
                <p className="text-gray-600">
                  {selectedProblem ? 'Problem details' : 'No problem assigned for this date'}
                </p>
              </div>
              {selectedProblem ? (
                <div className="p-6">
                  <h3 className="text-2xl font-bold">{selectedProblem.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                      {selectedProblem.difficulty}
                    </span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                      {selectedProblem.platform}
                    </span>
                  </div>
                  {selectedProblem.tags && selectedProblem.tags.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-600 mb-2">Topics:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedProblem.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-200 text-gray-800 rounded text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex flex-col items-center justify-center h-48 border rounded-lg bg-gray-50 text-gray-600">
                    <p className="mb-2">No problem for this date</p>
                    <Link to="/add-problem">
                      <button className="border text-purple-600 px-4 py-2 rounded hover:bg-purple-50">
                        Add problem
                      </button>
                    </Link>
                  </div>
                </div>
              )}
              <div className="border-t p-4">
                {selectedProblem ? (
                  <button
                    onClick={() => window.open(selectedProblem.link, '_blank')}
                    className="w-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" /> Solve on {selectedProblem.platform}
                  </button>
                ) : (
                  <Link to="/my-problems" className="block w-full">
                    <button className="w-full border text-purple-600 px-4 py-2 rounded hover:bg-purple-50">
                      Browse My Problem Lists
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 animate-fade-in delay-300">
          <h2 className="text-2xl font-bold mb-4 font-display bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Getting Started
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="border p-4 rounded-lg hover:shadow-lg transition-all">
              <h3 className="text-lg font-bold mb-2">1. Create Problem List</h3>
              <p className="text-gray-600 text-sm">
                Create a collection to organize your coding practice
              </p>
              <Link to="/my-problems">
                <button className="mt-4 w-full border text-purple-600 px-4 py-2 rounded hover:bg-purple-50">
                  Go to Lists
                </button>
              </Link>
            </div>
            <div className="border p-4 rounded-lg hover:shadow-lg transition-all">
              <h3 className="text-lg font-bold mb-2">2. Add Problems</h3>
              <p className="text-gray-600 text-sm">
                Find problems from LeetCode, GFG, CodeForces and add them
              </p>
              <Link to="/add-problem">
                <button className="mt-4 w-full border text-purple-600 px-4 py-2 rounded hover:bg-purple-50">
                  Add Problem
                </button>
              </Link>
            </div>
            <div className="border p-4 rounded-lg hover:shadow-lg transition-all">
              <h3 className="text-lg font-bold mb-2">3. Start Practicing</h3>
              <p className="text-gray-600 text-sm">
                Return to the calendar and start your daily practice
              </p>
              <button onClick={handleRandomize} className="mt-4 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded">
                Randomize Problems
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CustomPOTD;
