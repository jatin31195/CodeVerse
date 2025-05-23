import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

const ActivityHeatmap = ({ data = [], platform }) => {
  const currentYear = new Date().getFullYear();
  const availableYears = [currentYear, currentYear - 1, currentYear - 2];
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const generateGrid = () => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const startDate = new Date(selectedYear, 0, 1);   
    const endDate = new Date(selectedYear, 11, 31);  
    const today = new Date();

    const monthWeeks = new Array(12).fill(null).map(() => ({ start: null, end: null }));

    const cells = [];

    const startDayOfWeek = startDate.getDay();
    let weekNum = 0;

    for (let emptyDay = 0; emptyDay < startDayOfWeek; emptyDay++) {
      cells.push(
        <div
          key={`empty-start-${emptyDay}`}
          className="w-4 h-4"
          style={{ gridColumn: 2, gridRow: emptyDay + 2 }}
        />
      );
    }

    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();

      if (!(currentDate.getDate() === 1 && currentDate.getMonth() === 0)) {
        if (dayOfWeek === 0) weekNum++;
      }

      const currentMonth = currentDate.getMonth();
      const dateStr = currentDate.toISOString().split("T")[0];

      if (monthWeeks[currentMonth].start === null) monthWeeks[currentMonth].start = weekNum;
      monthWeeks[currentMonth].end = weekNum;

      const gapsBefore = monthWeeks
        .slice(0, currentMonth)
        .filter(m => m.end !== null)
        .length;

      const column = weekNum + 2 + gapsBefore; 
      const row = dayOfWeek + 2; 

      const cellData = data.find(d => d.date === dateStr);

      let bgColor = "bg-gray-100";
      if (cellData) {
        if (cellData.count >= 1 && cellData.count < 3) bgColor = "bg-green-300";
        else if (cellData.count >= 3 && cellData.count < 5) bgColor = "bg-green-400";
        else if (cellData.count >= 5 && cellData.count < 7) bgColor = "bg-green-500";
        else if (cellData.count >= 7 && cellData.count < 9) bgColor = "bg-green-600";
        else if (cellData.count >= 9) bgColor = "bg-green-700";
      }

      const isFuture = currentDate > today;

      cells.push(
        <motion.div
          key={dateStr}
          className={`w-4 h-4 rounded-sm border border-gray-200 shadow-sm
            ${isFuture ? "bg-white/20" : bgColor} 
            hover:scale-110 hover:shadow-lg transition-transform duration-200 cursor-pointer`}
          style={{ gridColumn: column, gridRow: row }}
          title={
            isFuture
              ? "Future date"
              : cellData
              ? `${cellData.count} submission${cellData.count === 1 ? "" : "s"} on ${dateStr}`
              : `No submissions on ${dateStr}`
          }
          aria-label={dateStr}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: (row + column) * 0.008 }}
        />
      );

      currentDate.setDate(currentDate.getDate() + 1);
    }

    const monthLabels = months.map((m, index) => {
      if (monthWeeks[index].start === null) return null; 

      const startWeek = monthWeeks[index].start;
      const endWeek = monthWeeks[index].end;
      const gapsBefore = monthWeeks
        .slice(0, index)
        .filter(m => m.end !== null)
        .length;

      
      const colStart = startWeek + 2 + gapsBefore;
      const colEnd = endWeek + 2 + gapsBefore;

      
      const colSpan = colEnd - colStart + 1;
      const centerColumn = colStart + Math.floor(colSpan / 2);

      return (
        <div
          key={m}
          className="text-xs font-semibold text-gray-600 select-none"
          style={{
            gridColumnStart: colStart,
            gridColumnEnd: colEnd + 1, 
            gridRow: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 4px",
            borderBottom: "2px solid #a7f3d0" 
          }}
        >
          {m}
        </div>
      );
    });

    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
      <div
        key={day}
        className="text-xs text-gray-400 select-none"
        style={{ gridColumn: 1, gridRow: i + 2, paddingRight: 4, textAlign: "right" }}
      >
        {day}
      </div>
    ));

    const topLeftEmpty = (
      <div key="top-left" style={{ gridColumn: 1, gridRow: 1 }} />
    );

    return [topLeftEmpty, ...monthLabels, ...dayLabels, ...cells];
  };

  return (
    <motion.div
      className="w-full bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition-transform"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-green-100">
            <Calendar className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {platform ? `${platform} Activity` : "Coding Activity"}
            </h3>
            <p className="text-sm text-gray-500">Daily contribution heatmap</p>
          </div>
        </div>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="border rounded px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          {availableYears.map((yr) => (
            <option key={yr} value={yr}>
              {yr}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <div
          className="grid gap-1 min-w-[850px]"
          style={{
            gridTemplateColumns: "auto repeat(70, 1fr)", 
            gridTemplateRows: "auto repeat(8, 1fr)",
          }}
        >
          {generateGrid()}
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityHeatmap;
