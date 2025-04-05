import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Sidebar from './Sidebar';
import {
  ChevronLeft,
  CalendarClock,
  Coffee,
  Book,
  Briefcase,
  Home,
  Code,
  Users,
  CheckCircle,
  Plus,
  Pencil,
  Send,
  Loader2,
  RefreshCw,
  ArrowRightLeft,
  PanelRight
} from "lucide-react";
import {motion,AnimatePresence} from 'framer-motion'
function convertTo24Hour(timeStr) {
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return timeStr;
  let hour = parseInt(match[1], 10);
  const minute = match[2];
  const meridiem = match[3].toUpperCase();
  if (meridiem === "PM" && hour !== 12) hour += 12;
  else if (meridiem === "AM" && hour === 12) hour = 0;
  const hourStr = hour < 10 ? `0${hour}` : `${hour}`;
  return `${hourStr}:${minute}`;
}

function parseTimeRange(timeRange) {
  const parts = timeRange.split("-");
  if (parts.length !== 2) return { startTime: "", endTime: "" };
  const start = parts[0].trim();
  const end = parts[1].trim();
  return {
    startTime: convertTo24Hour(start),
    endTime: convertTo24Hour(end),
  };
}

function getIconFromClass(scheduleClass) {
  switch (scheduleClass.toLowerCase()) {
    case "classes":
      return "Book";
    case "mess time":
      return "Coffee";
    case "dsa practice":
      return "Briefcase";
    case "development":
      return "Code";
    case "break":
      return "CalendarClock";
    case "assignments":
      return "CheckCircle";
    default:
      return "CalendarClock";
  }
}

function getGradientClass(icon) {
  switch (icon) {
    case "Coffee":
      return "from-amber-400 to-orange-500";
    case "Book":
      return "from-blue-400 to-indigo-500";
    case "Briefcase":
      return "from-gray-500 to-gray-700";
    case "Home":
      return "from-green-400 to-emerald-500";
    case "Code":
      return "from-cyan-400 to-indigo-400";
    case "Users":
      return "from-violet-400 to-purple-500";
    case "CheckCircle":
      return "from-emerald-400 to-green-500";
    default:
      return "from-blue-400 to-purple-500";
  }
}

function renderIcon(icon) {
  switch (icon) {
    case "Coffee":
      return <Coffee className="h-5 w-5" />;
    case "Book":
      return <Book className="h-5 w-5" />;
    case "Briefcase":
      return <Briefcase className="h-5 w-5" />;
    case "Home":
      return <Home className="h-5 w-5" />;
    case "Code":
      return <Code className="h-5 w-5" />;
    case "Users":
      return <Users className="h-5 w-5" />;
    case "CheckCircle":
      return <CheckCircle className="h-5 w-5" />;
    default:
      return <CalendarClock className="h-5 w-5" />;
  }
}

function calculateDuration(startTime, endTime) {
  if (!startTime || !endTime) return "";
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  let durationMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
  if (durationMinutes < 0) durationMinutes += 24 * 60;
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
}


function transformTimetableData(timetableArray) {
  return timetableArray.map((item, index) => {
    const { startTime, endTime } = parseTimeRange(item.time);
    return {
      id: item._id || index + 1,
      startTime,
      endTime,
      activity: item.description,
      icon: getIconFromClass(item.class),
    };
  });
}


const TimeTableEntry = ({ entry, onEdit }) => {
  const { id, startTime, endTime, activity, icon } = entry;
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiped, setIsSwiped] = useState(false);
  const cardRef = useRef(null);
  const startXRef = useRef(null);

  
  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  
  const buildEndDateTime = (dateString, timeString) => {
    
    const [hour, minute] = timeString.split(":").map(Number);
    const date = new Date(dateString); 
    
    date.setUTCHours(hour, minute, 0, 0);
    return date.toISOString();
  };
  
  

  
  const addTaskToDailyTasks = async () => {
 
    const getTodayDateString = () => {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    };
  
    const dateString = getTodayDateString();
    
    const endDateTimeISO = buildEndDateTime(dateString, endTime);
  
    const payload = {
      task: activity, 
      date: dateString,
      endDateTime: endDateTimeISO,
    };
  
    const token = sessionStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:8080/api/tasks/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        toast.success(`Task "${activity}" added successfully.`);
      } else {
        toast.error("Failed to add task.");
      }
    } catch (err) {
      console.error("Error adding task:", err);
      toast.error("Failed to add task.");
    }
  };
  

 
  const handleAddToTasks = async (e) => {
    e.stopPropagation();
    if (isSwiped) return;
    await addTaskToDailyTasks();
    setIsSwiped(true);
    
    setTimeout(() => {
      setSwipeOffset(0);
    }, 300);
  };

  
  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(entry);
  };

  const handleTouchStart = (e) => {
    const touch = e.touches ? e.touches[0] : e;
    startXRef.current = touch.clientX;
  };

  const handleTouchMove = (e) => {
    if (startXRef.current === null || isSwiped) return;
    const touch = e.touches ? e.touches[0] : e;
    const diff = touch.clientX - startXRef.current;
    if (diff < 0) setSwipeOffset(Math.max(diff, -100));
  };

  const handleTouchEnd = (e) => {
    if (startXRef.current === null) return;
    if (swipeOffset < -50 && !isSwiped) {
      setSwipeOffset(-100);
      handleAddToTasks(e);
    } else {
      setSwipeOffset(0);
    }
    startXRef.current = null;
  };

  return (
    <div
      ref={cardRef}
      className={`relative group cursor-pointer overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg p-8 transition-all duration-300 hover:shadow-xl mx-auto w-full max-w-xl ${isSwiped ? "opacity-70" : ""}`}
      style={{ transform: `translateX(${swipeOffset}px)`, transition: "transform 0.3s ease-out" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
    >
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 flex items-center justify-center rounded-full p-2.5 bg-gradient-to-r ${getGradientClass(icon)} text-white`}>
          {renderIcon(icon)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between mb-2">
            <h3 className="font-semibold text-gray-900 truncate">{activity}</h3>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
              {startTime} - {endTime}
            </span>
            <span className="mx-1 text-gray-300">•</span>
            <span className="text-xs">{calculateDuration(startTime, endTime)}</span>
          </div>
        </div>
        <button
          className="flex-shrink-0 p-2 rounded-full border border-gray-300 hover:bg-gray-100"
          onClick={(e) => {
            e.stopPropagation();
            handleAddToTasks(e);
          }}
          disabled={isSwiped}
          title="Add to daily tasks"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      
      <div
        className="absolute top-0 right-0 bottom-0 flex items-center bg-green-500 text-white px-2 rounded-r-xl transition-opacity"
        style={{ width: `${Math.abs(swipeOffset)}px`, opacity: swipeOffset < 0 ? 1 : 0 }}
      >
        <CheckCircle className="h-4 w-4" />
      </div>
      
      <div
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleEdit} 
      >
        <Pencil className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
};






const EditTimeTableModal = ({ isOpen, onClose, entry, onSave }) => {
  const [activity, setActivity] = useState(entry.activity);
  const [startTime, setStartTime] = useState(entry.startTime);
  const [endTime, setEndTime] = useState(entry.endTime);
  const [icon, setIcon] = useState(entry.icon);

  const iconOptions = [
    { value: "Coffee", label: "Coffee/Break" },
    { value: "Book", label: "Study/Learn" },
    { value: "Briefcase", label: "Work" },
    { value: "Home", label: "Home/Personal" },
    { value: "Code", label: "Coding" },
    { value: "Users", label: "Meeting/Social" },
    { value: "CheckCircle", label: "Task/Complete" },
    { value: "CalendarClock", label: "Other" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activity.trim().length < 3) {
      toast.error("Activity must be at least 3 characters");
      return;
    }
    onSave({ activity, startTime, endTime, icon });
    toast.success("Activity updated successfully");
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-2xl shadow-2xl z-10 w-full max-w-md p-6">
        <h2
          className="text-2xl font-semibold mb-4 bg-clip-text text-transparent"
          style={{ background: "linear-gradient(to right, #0ea5e9, #9b87f5)" }}
        >
          Edit Timetable Entry
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Activity</label>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your activity"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Time</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="HH:MM"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Time</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="HH:MM"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category Icon</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
            >
              {iconOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-gradient-to-r text-white hover:opacity-90"
              style={{ background: "linear-gradient(to right, #0ea5e9, #9b87f5)" }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SchedulePage = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timetableData, setTimetableData] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditEntry, setCurrentEditEntry] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
  
    const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const token = sessionStorage.getItem("token");

  
  const fetchTimetable = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8080/api/tt/schedule", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        },
      });
      if (response.ok) {
        const jsonData = await response.json();
        if (jsonData.timetable) {
          let timetableArray = jsonData.timetable;
         
          if (typeof timetableArray === "string") {
            const regex = /```json\s*([\s\S]*?)\s*```/;
            const match = timetableArray.match(regex);
            if (!match || !match[1]) {
              throw new Error("Could not extract timetable JSON from response");
            }
            timetableArray = JSON.parse(match[1]);
          }
          const transformedData = transformTimetableData(timetableArray);
          setTimetableData(transformedData);
          setIsSubmitted(true);
        } else {
          setTimetableData([]);
          setIsSubmitted(false);
        }
      }
    } catch (error) {
      console.error("Error fetching timetable:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, [token]);

  const handlePromptChange = (e) => setPrompt(e.target.value);

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a description for your timetable");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/tt/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        },
        body: JSON.stringify({ dailySchedule: prompt }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const jsonData = await response.json();
      let timetableArray;
      
      if (typeof jsonData.timetable === "string") {
        const regex = /```json\s*([\s\S]*?)\s*```/;
        const match = jsonData.timetable.match(regex);
        if (!match || !match[1]) {
          throw new Error("Could not extract timetable JSON from response");
        }
        timetableArray = JSON.parse(match[1]);
      } else if (Array.isArray(jsonData.timetable)) {
        timetableArray = jsonData.timetable;
      } else {
        throw new Error("Unexpected timetable format");
      }
      const transformedData = transformTimetableData(timetableArray);
      setTimetableData(transformedData);
      setIsSubmitted(true);
      toast.success("Your timetable has been generated!");
      
      fetchTimetable();
    } catch (error) {
      toast.error("Failed to generate timetable");
      console.error("Error in handleSubmit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    if (!token) return;
    try {
      const response = await fetch("http://localhost:8080/api/tt/schedule", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        },
      });
      if (!response.ok) throw new Error("Failed to delete timetable");
      toast.success("Timetable removed");
      setPrompt("");
      setTimetableData([]);
      setIsSubmitted(false);
      fetchTimetable();
    } catch (error) {
      toast.error("Failed to remove timetable");
      console.error("Error in handleReset:", error);
    }
  };

  const handleEditEntry = (entry) => {
    setCurrentEditEntry(entry);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedEntry) => {
    if (currentEditEntry) {
      const updatedData = timetableData.map((entry) =>
        entry.id === currentEditEntry.id ? { ...entry, ...updatedEntry } : entry
      );
      setTimetableData(updatedData);
    }
  };

  return (
    <div className="min-h-screen bg-white">
     
     <header className="sticky top-0 z-50 border-b bg-white bg-opacity-95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
       
        <div className="flex items-center gap-3">
          <button onClick={toggleSidebar} className="p-2">
            {!sidebarOpen && <PanelRight className="h-6 w-6" />}
          </button>
          <h1 className="text-xl font-bold">CodeVerse</h1>
        </div>
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-20">
           
            <motion.div
              className="absolute inset-0 bg-black opacity-50"
              onClick={toggleSidebar}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-lg z-30"
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ duration: 0.3 }}
            >
              <Sidebar toggleSidebar={toggleSidebar} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>

  
      <main className="max-w-6xl mx-auto px-6 py-10">
     
        <div className="text-center mb-12">
          <div
            className="inline-block rounded-full p-3 mb-4"
            style={{ background: "linear-gradient(to right, #0ea5e9, #9b87f5)" }}
          >
            <CalendarClock className="h-8 w-8 text-white" />
          </div>
          <h1
            className="text-4xl font-bold mb-3 bg-clip-text text-transparent"
            style={{
              background: "linear-gradient(to right, #0ea5e9, #9b87f5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            AI Timetable Creator
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Describe your day and requirements in detail for a personalized, beautifully designed timetable.
          </p>
        </div>

      
        <div className="max-w-4xl mx-auto mb-8 p-6 rounded-2xl shadow-xl bg-white/50 border border-gray-200 backdrop-blur-md">
          <h2 className="text-2xl font-semibold mb-2">Create Your Timetable</h2>
          <p className="text-sm text-gray-600 mb-4">
            Describe your day and requirements in detail for better results.
          </p>
          <textarea
            className="w-full h-36 p-4 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80"
            placeholder="Example: I need a productive work schedule for a software developer. I prefer to start at 8 AM and finish by 8 PM. Include time for breaks, meetings, focused coding sessions, and learning."
            value={prompt}
            onChange={handlePromptChange}
            disabled={isLoading}
          ></textarea>
          <div className="flex justify-end gap-3 mt-4">
            {isSubmitted && (
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 flex items-center gap-3 mr-5"
              >
                <RefreshCw className="h-5 w-5" />
                Reset
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={isLoading || !prompt.trim()}
              className="px-6 py-2 rounded-xl text-white hover:opacity-90 flex items-center gap-2"
              style={{ background: "linear-gradient(to right, #0ea5e9, #9b87f5)" }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Generate Timetable
                </>
              )}
            </button>
          </div>
        </div>

     
        {isSubmitted && (
          <div className="mt-10">
            <h2
              className="text-3xl font-semibold mb-6 text-center bg-clip-text text-transparent"
              style={{
                background: "linear-gradient(to right, #0ea5e9, #9b87f5)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Your Personalized Timetable
            </h2>
            <div className="flex flex-col items-center gap-5">
              <div className="flex items-center gap-2 mb-2 text-lg text-gray-500">
                <ArrowRightLeft className="h-5 w-5" />
                <span>Swipe cards left to add to daily tasks or click to edit</span>
              </div>
              <div className="w-full">
                {timetableData.map((entry, index) => (
                  <div key={entry.id || index} className="mb-6">
                    <TimeTableEntry entry={entry} onEdit={handleEditEntry} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

    
      {currentEditEntry && (
        <EditTimeTableModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          entry={currentEditEntry}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default SchedulePage;
