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
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const today = new Date();
    const isLeapYear = (yr) =>
      (yr % 4 === 0 && yr % 100 !== 0) || yr % 400 === 0;
    const monthLengths = [
      31,
      isLeapYear(selectedYear) ? 29 : 28,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31,
    ];
    const monthWeeks = monthLengths.map(() => ({ start: null, end: null }));

    const cells = [];
    let currentDate = new Date(selectedYear, 0, 1); 
    let weekIdx = 0; 
   
    const janFirstWeekday = currentDate.getDay();
    for (let blank = 0; blank < janFirstWeekday; blank++) {
      cells.push(
        <div
          key={`blank-jan-${blank}`}
          className="w-4 h-4"
          style={{ gridColumn: 2, gridRow: blank + 2 }}
        />
      );
    }

    while (currentDate.getFullYear() === selectedYear) {
      const dayOfWeek = currentDate.getDay();
      if (!(currentDate.getMonth() === 0 && currentDate.getDate() === 1) && dayOfWeek === 0) {
        weekIdx++;
      }

      const currentMonth = currentDate.getMonth(); 

      const year  = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day   = String(currentDate.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`; 
      if (monthWeeks[currentMonth].start === null) {
        monthWeeks[currentMonth].start = weekIdx;
      }
      monthWeeks[currentMonth].end = weekIdx;
      const gapsBefore = monthWeeks
        .slice(0, currentMonth)
        .filter((mw) => mw.end !== null).length;
      const column = weekIdx + 2 + gapsBefore;
      const row    = dayOfWeek + 2;
      const cellData = data.find((d) => d.date === dateStr);
      let bgColor = "bg-gray-100";
      if (cellData) {
        if      (cellData.count >= 1 && cellData.count <  3) bgColor = "bg-green-300";
        else if (cellData.count >= 3 && cellData.count <  5) bgColor = "bg-green-400";
        else if (cellData.count >= 5 && cellData.count <  7) bgColor = "bg-green-500";
        else if (cellData.count >= 7 && cellData.count <  9) bgColor = "bg-green-600";
        else if (cellData.count >= 9)                          bgColor = "bg-green-700";
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
    const monthLabels = months.map((m, idx) => {
      if (monthWeeks[idx].start === null) return null;

      const startWeek = monthWeeks[idx].start;
      const endWeek   = monthWeeks[idx].end;
      const gapsBefore = monthWeeks
        .slice(0, idx)
        .filter((mw) => mw.end !== null).length;

      const colStart = startWeek + 2 + gapsBefore;
      const colEnd   = endWeek + 2 + gapsBefore;

      return (
        <div
          key={m}
          className="text-[10px] md:text-xs font-semibold text-gray-600 select-none"
          style={{
            gridColumnStart: colStart,
            gridColumnEnd:   colEnd + 1,
            gridRow:         1,
            display:         "flex",
            justifyContent:  "center",
            alignItems:      "center",
            padding:         "0 4px",
            borderBottom:    "2px solid #a7f3d0",
          }}
        >
          {m}
        </div>
      );
    });
    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
      <div
        key={day}
        className="text-[10px] md:text-xs text-gray-400 select-none"
        style={{ gridColumn: 1, gridRow: i + 2, paddingRight: 4, textAlign: "right" }}
      >
        {day}
      </div>
    ));
    const topLeftEmpty = <div key="top-left" style={{ gridColumn: 1, gridRow: 1 }} />;

    return [topLeftEmpty, ...monthLabels, ...dayLabels, ...cells];
  };

  return (
    <motion.div
      className="w-full max-w-full bg-white rounded-lg shadow-lg p-4 md:p-6 hover:shadow-2xl transition-transform"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-green-100">
            <Calendar className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900">
              {platform ? `${platform} Activity` : "Coding Activity"}
            </h3>
            <p className="text-sm text-gray-500">Daily contribution heatmap</p>
          </div>
        </div>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
          className="border rounded px-3 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
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
          className="grid gap-1 min-w-[650px] sm:min-w-[800px] md:min-w-[900px]"
          style={{
            gridTemplateColumns: "auto repeat(70, 1fr)",
            gridTemplateRows: "auto repeat(7, 1fr)",
          }}
        >
          {generateGrid()}
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityHeatmap;
