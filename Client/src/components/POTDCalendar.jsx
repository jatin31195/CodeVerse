import React, { useState } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import {toast} from 'react-toastify'
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';

const API_BASE_URL = 'http://localhost:8080/api/fav';
const TASK_API_URL = 'http://localhost:8080/api/tasks';

const POTDCalendar = ({ selectedDate, onSelectDate, platform,showAddIcon = true }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDateForModal, setSelectedDateForModal] = useState(null);
  const [favoriteLists, setFavoriteLists] = useState([]);
  const [activeTab, setActiveTab] = useState('daily');

  const getPlatformShadow = () => {
    switch (platform) {
      case 'leetcode':
        return 'shadow-[0_4px_16px_rgba(255,193,7,0.25)]';
      case 'gfg':
        return 'shadow-[0_8px_30px_rgba(4,120,87,1)]';
      case 'codeforces':
        return 'shadow-[0_8px_30px_rgba(30,64,175,0.75)]';
      default:
        return 'shadow-[0_6px_20px_rgba(100,116,139,0.3)]';
    }
  };
  const shadow = getPlatformShadow();

  const goPrev = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goNext = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleSelect = (day) => onSelectDate(day);

  const openModal = (day, e) => {
    e.stopPropagation();
    setSelectedDateForModal(day);
    setModalOpen(true);
    fetchFavoriteLists();
  };

  const fetchFavoriteLists = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/lists`, {
        headers: { Authorization: token },
      });
      Array.isArray(res.data) ? setFavoriteLists(res.data) : setFavoriteLists([]);
    } catch {
      toast.error('Could not fetch lists');
    }
  };

  const addToTask = async () => {
    if (!selectedDateForModal) return toast.error('No date selected');
    try {
      const token = sessionStorage.getItem('token');
      const end = new Date(selectedDateForModal);
      end.setHours(23, 59, 59, 999);

      await axios.post(
        TASK_API_URL,
        {
          task: `${platform.toUpperCase()} POTD - ${format(
            selectedDateForModal,
            'MMMM d, yyyy'
          )}`,
          date: selectedDateForModal,
          endDateTime: end.toISOString(),
        },
        { headers: { Authorization: token } }
      );
      toast.success('Added to daily task!');
      setModalOpen(false);
    } catch {
      toast.error('Error adding task');
    }
  };

  const addToFavorites = async (listId) => {
    if (!selectedDateForModal) return toast.error('No date selected');
    try {
      const token = sessionStorage.getItem('token');
      const potdRes = await axios.get(
        `http://localhost:8080/api/ques/${platform}/potd/${format(
          selectedDateForModal,
          'yyyy-MM-dd'
        )}`,
        { headers: { Authorization: token } }
      );
      const potd = potdRes.data?.data;
      if (!potd?._id) return toast.error('No question on that date');

      await axios.post(
        `${API_BASE_URL}/add-question`,
        { listId, questionId: potd._id },
        {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success('Added to favorite list!');
      setModalOpen(false);
    } catch {
      toast.error('Error adding to list');
    }
  };

  const renderDay = (day) => {
    const isSelected =
      selectedDate && selectedDate.toDateString() === day.toDateString();

    return (
  <div
    key={day.toISOString()}
    onClick={() => handleSelect(day)}
    className="pl-20 relative flex flex-col items-center justify-center w-10 h-10 group cursor-pointer"
  >
    <span
      className={`text-lg ${
        isSelected ? 'font-bold text-black' : 'text-gray-500'
      }`}
    >
      {format(day, 'd')}
    </span>

    {showAddIcon && (
      <div className="relative group">
  <button
    onClick={(e) => openModal(day, e)}
    className="absolute -top-10 right-0 p-1 rounded-full  hover:bg-sky-200 transition-opacity opacity-100 group-hover:opacity-100 cursor-pointer"
  >
    <Plus className="h-2 w-2 text-gray-700" />
  </button>

  <div className="absolute -top-20 right-0 w-max max-w-[200px] scale-0 group-hover:scale-100 transition-transform duration-200 bg-white text-gray-700 text-xs px-3 py-1.5 rounded-md shadow-lg border border-gray-200">
    Click to add this question to your Daily Task or a Favorite List
  </div>
</div>

    )}
  </div>
);

  };

  const [month, year] = format(currentMonth, 'MMMM yyyy').split(' ');

  return (
    <div className="flex flex-col w-full mb-8">
      <div
        className={`rounded-md p-8 w-full max-w-full mx-auto transition duration-300 transform hover:-translate-y-1 hover:shadow-lg ${shadow}`}
      >
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-5xl font-semibold text-gray-900">{month}</h2>
            <span className="text-4xl font-light text-gray-400">{year}</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-gray-700">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="font-semibold text-sm">
              {d}
            </div>
          ))}

          {Array.from({
            length: new Date(
              currentMonth.getFullYear(),
              currentMonth.getMonth(),
              1
            ).getDay(),
          }).map((_, i) => (
            <div key={i} className="w-10 h-10" />
          ))}

          {Array.from({
            length: new Date(
              currentMonth.getFullYear(),
              currentMonth.getMonth() + 1,
              0
            ).getDate(),
          }).map((_, i) =>
            renderDay(
              new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth(),
                i + 1
              )
            )
          )}
        </div>

        <div className="flex justify-between mt-4">
          <button onClick={goPrev} className="p-2 rounded-full hover:bg-gray-100">
            <ChevronLeft className="h-6 w-6 text-gray-400" />
          </button>
          <button onClick={goNext} className="p-2 rounded-full hover:bg-gray-100">
            <ChevronRight className="h-6 w-6 text-gray-400" />
          </button>
        </div>
      </div>

      <AnimatePresence>
      {modalOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-6 rounded-lg w-96 shadow-lg"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
          >
            <div className="mb-6 text-center">
  <h2 className="text-2xl font-bold text-gray-900 mb-1">
    Choose Option
  </h2>
  <p className="text-sm text-gray-600">
    Select an option below to organize your question into your daily tasks or a favorite list.
  </p>
</div>

            <div className="flex mb-4 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('daily')}
                className={`flex-1 py-2 text-center font-medium transition ${
                  activeTab === 'daily'
                    ? 'text-gray-800 border-b-2 border-yellow-400'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Daily Task
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`flex-1 py-2 text-center font-medium transition ${
                  activeTab === 'favorites'
                    ? 'text-gray-800 border-b-2 border-yellow-400'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Favorite Lists
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'daily' ? (
              <div className="space-y-4">
                <button
                  onClick={addToTask}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-yellow-100 hover:bg-yellow-200 text-gray-900 font-medium transition"
                >
                  <Plus className="h-5 w-5" />
                  ✅ Add to Daily Task
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-gray-600">Select Favorite List:</div>
                {favoriteLists.length === 0 ? (
                  <div className="text-gray-500 italic text-sm px-2">
                    No favorite lists found.
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
                    {favoriteLists.map((list) => (
                      <button
                        key={list._id}
                        onClick={() => addToFavorites(list._id)}
                        className="flex items-center gap-2 p-2 rounded-md bg-gray-100 hover:bg-gray-200 text-left transition"
                      >
                        ⭐ {list.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setModalOpen(false);
                  setActiveTab('daily');
                }}
                className="px-4 py-2 text-sm rounded-md bg-red-100 hover:bg-red-200 text-red-800 font-medium transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </div>
  );
};

export default POTDCalendar;
