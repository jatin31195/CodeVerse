import React from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const ProblemTypeStats = ({ dsaCount, cpCount, platform }) => {
  const data = [
    { name: "DSA", value: dsaCount, color: "#10b981" },
    { name: "CP", value: cpCount, color: "#3b82f6" },
  ];
  const total = dsaCount + cpCount;
  const dsaPercentage = total ? Math.round((dsaCount / total) * 100) : 0;
  const cpPercentage = total ? Math.round((cpCount / total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.02, boxShadow: "0 12px 30px rgba(0, 0, 0, 0.1)" }}
      className="w-full bg-white/80 backdrop-blur-md border border-gray-200 rounded-3xl shadow-md p-6 transition-all duration-300"
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        {platform ? `${platform} Problem Types` : "Problem Types"}
      </h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} problems`, ""]} />
            <Legend verticalAlign="bottom" align="center" iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="flex flex-col items-center p-4 bg-green-50 rounded-2xl shadow-inner">
          <span className="text-sm font-medium text-green-700 mb-1">
            DSA Problems
          </span>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold text-green-800">{dsaCount}</span>
            <span className="text-sm text-green-600">({dsaPercentage}%)</span>
          </div>
        </div>
        <div className="flex flex-col items-center p-4 bg-blue-50 rounded-2xl shadow-inner">
          <span className="text-sm font-medium text-blue-700 mb-1">
            CP Problems
          </span>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold text-blue-800">{cpCount}</span>
            <span className="text-sm text-blue-600">({cpPercentage}%)</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProblemTypeStats;
