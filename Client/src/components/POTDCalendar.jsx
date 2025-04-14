import React, { useState } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const POTDCalendar = ({ selectedDate, onSelectDate, platform }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [addToFavoritesOpen, setAddToFavoritesOpen] = useState(false);
  const [selectedDateForFavorite, setSelectedDateForFavorite] = useState(null);

  const handleSelect = (newDate) => {
    if (newDate) {
      onSelectDate(newDate);
    }
  };

  const handleAddToFavorites = (date, e) => {
    e.stopPropagation();
    setSelectedDateForFavorite(date);
    setAddToFavoritesOpen(true);
  };

  const addToList = (listName) => {
    if (selectedDateForFavorite) {
      const dateStr = format(selectedDateForFavorite, 'MMMM d, yyyy');
      toast.success(`Problem from ${dateStr} added to ${listName}!`);
      setAddToFavoritesOpen(false);
    }
  };

  const getPlatformStyles = () => {
    switch (platform) {
      case 'leetcode':
        return { borderColor: 'border-orange-500', dotColor: 'bg-orange-500' };
      case 'gfg':
        return { borderColor: 'border-green-500', dotColor: 'bg-green-500' };
      case 'codeforces':
        return { borderColor: 'border-red-500', dotColor: 'bg-red-500' };
      default:
        return { borderColor: 'border-blue-500', dotColor: 'bg-blue-500' };
    }
  };

  const { borderColor, dotColor } = getPlatformStyles();

  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  
  

  const renderDay = (day) => {
    const hasProblem = problemDates.some((d) => d.toDateString() === day.toDateString());
    const isSelected = selectedDate && selectedDate.toDateString() === day.toDateString();

    return (
      <div
        onClick={() => handleSelect(day)}
        className="relative flex flex-col items-center justify-center w-10 h-10 group cursor-pointer"
      >
        <span className={`text-lg ${isSelected ? 'font-bold text-black' : 'text-gray-500'}`}>
          {format(day, 'd')}
        </span>
        {hasProblem && <div className={`w-2 h-2 rounded-full mt-1 `}></div>}
        <button
          onClick={(e) => handleAddToFavorites(day, e)}
          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Plus className="h-4 w-4 text-gray-400 hover:text-gray-700" />
        </button>
      </div>
    );
  };

  const monthYear = format(currentMonth, 'MMMM yyyy');
  const [month, year] = monthYear.split(' ');

  return (
    <div className="flex flex-col w-full mb-8">
      <div className={`rounded-md border p-8 w-full max-w-full mx-auto shadow-sm ${borderColor}`}>
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-5xl font-semibold text-gray-900">{month}</h2>
            <span className="text-4xl font-light text-gray-400">{year}</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-gray-700">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="font-semibold text-sm">
              {day}
            </div>
          ))}

          {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() }).map(
            (_, i) => (
              <div key={i} className="w-10 h-10"></div>
            )
          )}

          {Array.from({
            length: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate(),
          }).map((_, i) => (
            <div key={i}>
              {renderDay(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1))}
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-4">
          <button onClick={goToPreviousMonth} className="p-2 rounded-full hover:bg-gray-100">
            <ChevronLeft className="h-6 w-6 text-gray-400" />
          </button>
          <button onClick={goToNextMonth} className="p-2 rounded-full hover:bg-gray-100">
            <ChevronRight className="h-6 w-6 text-gray-400" />
          </button>
        </div>
      </div>

      {addToFavoritesOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Add to Favorites</h3>
            <p className="text-sm text-gray-600 mb-4">Select a list:</p>
            <div className="flex flex-col gap-2">
              <button onClick={() => addToList('My Favorite Problems')} className="p-2 rounded-md bg-gray-100 hover:bg-gray-200">
                ⭐ My Favorite Problems
              </button>
              <button onClick={() => addToList('Study List')} className="p-2 rounded-md bg-gray-100 hover:bg-gray-200">
                📚 Study List
              </button>
              <button onClick={() => addToList('Revisit Later')} className="p-2 rounded-md bg-gray-100 hover:bg-gray-200">
                🔄 Revisit Later
              </button>
              <button onClick={() => addToList('Algorithm Patterns')} className="p-2 rounded-md bg-gray-100 hover:bg-gray-200">
                🧠 Algorithm Patterns
              </button>
            </div>
            <div className="flex justify-between mt-4">
              <button onClick={() => setAddToFavoritesOpen(false)} className="p-2 rounded-md bg-red-100 hover:bg-red-200">
                Cancel
              </button>
              <button onClick={() => addToList('My Favorite Problems')} className="p-2 rounded-md bg-blue-500 text-white">
                Add to List
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POTDCalendar;
