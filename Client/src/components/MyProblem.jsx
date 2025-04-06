import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { ListChecks, Plus, Edit, Check, FileText, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import MainLayout from './MainLayout';


const navLinks = [
    { name: 'POTD Calendar', path: '/custom' },
    { name: 'My Problems', path: '/my-problems' },
    { name: 'Add Problem', path: '/add-problem' },
    
  ];
const MyProblem = () => {
  const [problemLists, setProblemLists] = useState([]);
  const [currentListId, setCurrentListId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newListName, setNewListName] = useState("");

  useEffect(() => {
    const lists = JSON.parse(localStorage.getItem("problemLists") || "[]");
    setProblemLists(lists);
    const current = localStorage.getItem("currentList");
    if (current) setCurrentListId(current);
  }, []);

  const handleSelectList = (listId) => {
    localStorage.setItem("currentList", listId);
    setCurrentListId(listId);
    alert("Selected problem list changed");
  };

  const handleCreateList = (e) => {
    e.preventDefault();
    if (newListName.trim().length < 3) {
      alert("Name must be at least 3 characters");
      return;
    }
    const newList = {
      id: uuidv4(),
      name: newListName.trim(),
      createdBy: 'current-user',
      createdAt: new Date().toISOString(),
      problems: {},
    };
    const updatedLists = [...problemLists, newList];
    setProblemLists(updatedLists);
    localStorage.setItem("problemLists", JSON.stringify(updatedLists));
    setNewListName("");
    setIsDialogOpen(false);
    alert("Problem list created successfully!");
  };

  return (
    <MainLayout  navLinks={navLinks}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center mb-2">
            <ListChecks className="mr-2 text-purple-600 h-7 w-7" />
            <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              My Problem Lists
            </h1>
          </div>
          <p className="text-gray-600">Manage your problem collections</p>
        </div>

        <div className="flex justify-between items-center mb-6 animate-fade-in">
          <h2 className="text-xl font-semibold">Your Lists</h2>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded"
          >
            <Plus className="mr-2 h-4 w-4" /> Create New List
          </button>
        </div>

        {isDialogOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm">
              <h2 className="text-xl font-bold mb-4">Create a new problem list</h2>
              <p className="mb-4 text-gray-600">
                Give your problem list a name to help you identify it.
              </p>
              <form onSubmit={handleCreateList}>
                <input
                  type="text"
                  placeholder="e.g. DP Problems"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsDialogOpen(false)}
                    className="px-4 py-2 border rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded"
                  >
                    Create List
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {problemLists.map((list) => {
            const problemCount = list.problems ? Object.keys(list.problems).length : 0;
            const isCurrent = list.id === currentListId;
            return (
              <div
                key={list.id}
                className={`border rounded-lg p-4 transition-all hover:shadow-lg ${
                  isCurrent ? "border-purple-600 shadow-md" : "border-gray-300"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold flex items-center">
                      {list.name}
                      {isCurrent && (
                        <span className="ml-2 px-2 py-1 bg-purple-600 text-white rounded text-xs">
                          Current
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Created on {format(new Date(list.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <button
                    onClick={() => alert("Edit functionality not implemented")}
                    className="p-2"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <FileText className="mr-2 h-4 w-4 text-purple-600" />
                  {problemCount} {problemCount === 1 ? 'problem' : 'problems'} assigned
                </div>
                <div>
                  {isCurrent ? (
                    <button disabled className="w-full flex items-center justify-center border px-4 py-2 text-purple-600 rounded">
                      <Check className="mr-1 h-4 w-4" /> Current List
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSelectList(list.id)}
                      className="w-full flex items-center justify-center border hover:border-purple-600 hover:text-purple-600 px-4 py-2 rounded"
                    >
                      Select List
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {problemLists.length === 0 && (
          <div className="text-center py-20 border rounded-xl bg-gray-50 animate-fade-in">
            <ListChecks className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No problem lists yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Create your first problem list to organize your coding challenges
            </p>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded"
            >
              <Plus className="mr-2 h-4 w-4" /> Create New List
            </button>
          </div>
        )}

        <div className="mt-12 border-t pt-8 animate-fade-in">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="border p-4 rounded-lg hover:shadow-lg transition-all">
              <h3 className="text-lg font-bold flex items-center">
                <Plus className="mr-2 h-5 w-5 text-purple-600" /> Add Problems
              </h3>
              <p className="text-sm text-gray-600 mb-4">Add new problems to your lists</p>
              <Link to="/add-problem">
                <button className="w-full border text-purple-600 px-4 py-2 rounded hover:bg-purple-50">
                  Add Problem
                </button>
              </Link>
            </div>
            <div className="border p-4 rounded-lg hover:shadow-lg transition-all">
              <h3 className="text-lg font-bold flex items-center">
                <CalendarDays className="mr-2 h-5 w-5 text-purple-600" /> View Calendar
              </h3>
              <p className="text-sm text-gray-600 mb-4">See your schedule on the calendar</p>
              <Link to="/potd">
                <button className="w-full border text-purple-600 px-4 py-2 rounded hover:bg-purple-50">
                  View Calendar
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MyProblem;
