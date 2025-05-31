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

const PLATFORM_CATEGORIES = {
  All: ["DSA", "CP"],
  LeetCode: ["Easy", "Medium", "Hard"],
  GFG: ["School", "Basic", "Easy", "Medium", "Hard"],
  Codeforces: ["Easy", "Medium", "Hard"],
};

const DEFAULT_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

const ProblemTypeStats = ({ platform, counts = {} }) => {
  const categories = PLATFORM_CATEGORIES[platform] || [];
  const data = categories.map((cat, idx) => ({
    name: cat,
    value: Number(counts[cat] || 0),
    color: DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
  }));

  const total = data.reduce((sum, slice) => sum + slice.value, 0);
  const withPercentages = data.map((slice) => ({
    ...slice,
    percentage: total ? Math.round((slice.value / total) * 100) : 0,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.02, boxShadow: "0 12px 30px rgba(0, 0, 0, 0.1)" }}
      className="w-full bg-white/80 backdrop-blur-md border border-gray-200 rounded-3xl shadow-md p-4 sm:p-6 transition-all duration-300"
    >
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 text-center">
        {platform ? `${platform} Problem Breakdown` : "Problem Breakdown"}
      </h3>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={withPercentages}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              dataKey="value"
              nameKey="name"
            >
              {withPercentages.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} problems`, ""]} />
            <Legend verticalAlign="bottom" align="center" iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-4 mt-6 [grid-template-columns:repeat(auto-fit,minmax(140px,1fr))]">
  {withPercentages.map((slice) => (
    <div
      key={slice.name}
      className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl shadow-inner"
      style={{ borderTop: `4px solid ${slice.color}` }}
    >
      <span className="text-sm font-medium text-gray-700 mb-1">
        {slice.name}
      </span>
      <div className="flex items-baseline space-x-1">
        <span
          className="text-xl sm:text-2xl font-bold"
          style={{ color: slice.color }}
        >
          {slice.value}
        </span>
        <span className="text-sm text-gray-600">
          ({slice.percentage}%)
        </span>
      </div>
    </div>
  ))}
</div>

    </motion.div>
  );
};

export default ProblemTypeStats;
