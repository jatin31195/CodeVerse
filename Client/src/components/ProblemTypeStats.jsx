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
      className="w-full bg-white rounded-lg shadow p-4 hover:shadow-xl transition-transform"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-lg font-bold mb-1">
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
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="flex flex-col items-center p-3 bg-gray-50 rounded">
          <span className="text-xs text-green-600 mb-1">DSA Problems</span>
          <div className="flex items-baseline">
            <span className="text-xl font-bold mr-2">{dsaCount}</span>
            <span className="text-xs text-green-500">({dsaPercentage}%)</span>
          </div>
        </div>
        <div className="flex flex-col items-center p-3 bg-gray-50 rounded">
          <span className="text-xs text-blue-600 mb-1">CP Problems</span>
          <div className="flex items-baseline">
            <span className="text-xl font-bold mr-2">{cpCount}</span>
            <span className="text-xs text-blue-500">({cpPercentage}%)</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProblemTypeStats;
