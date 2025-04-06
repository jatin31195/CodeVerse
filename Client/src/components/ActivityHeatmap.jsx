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
    let currentDate = new Date(startDate);
    let weekNum = 0;
    let lastMonth = -1;
    const cells = [];
    const today = new Date();

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      const currentMonth = currentDate.getMonth();

      
      if (lastMonth !== -1 && currentMonth !== lastMonth) {
        weekNum++;
      }

    
      const column = weekNum + 2;
      const row = dayOfWeek + 2;
      const dateStr = currentDate.toISOString().split("T")[0];
      const cellData = data.find((d) => d.date === dateStr);

      
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
          className={`w-3 h-3 rounded-sm transition-colors duration-200 ${
            isFuture ? "bg-gray-50 border border-gray-100" : bgColor
          }`}
          style={{ gridColumn: column, gridRow: row }}
          title={
            isFuture
              ? "Future date"
              : cellData
              ? `${cellData.count} submission${cellData.count === 1 ? "" : "s"} on ${dateStr}`
              : `No submissions on ${dateStr}`
          }
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: (row + column) * 0.01 }}
        ></motion.div>
      );

      lastMonth = currentMonth;
  
      if (dayOfWeek === 6) weekNum++;
      currentDate.setDate(currentDate.getDate() + 1);
    }

   
    const monthLabels = months.map((m, index) => (
      <div
        key={m}
        className="text-xs font-bold text-gray-500"
        style={{ gridColumn: index * 5 + 2, gridRow: 1 }}
      >
        {m}
      </div>
    ));

    return [...monthLabels, ...cells];
  };

  return (
    <motion.div
      className="w-full bg-white rounded-lg shadow p-4 hover:shadow-xl transition-transform"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-green-100">
            <Calendar className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold">
              {platform ? `${platform} Activity` : "Coding Activity"}
            </h3>
            <p className="text-sm text-gray-500">Daily contribution heatmap</p>
          </div>
        </div>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {availableYears.map((yr) => (
            <option key={yr} value={yr}>
              {yr}
            </option>
          ))}
        </select>
      </div>

      
      <div className="overflow-x-auto pb-2">
        <div
          className="grid gap-1 min-w-[800px]"
          style={{
            gridTemplateColumns: "auto repeat(65, 1fr)",
            gridTemplateRows: "auto repeat(7, 1fr)"
          }}
        >
          {generateGrid()}
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityHeatmap;
