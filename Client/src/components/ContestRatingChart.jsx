import React from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const ContestRatingChart = ({ data, platform }) => {
  const colors = {
    leetcode: "#FFA116",
    codeforces: "#318CE7",
    gfg: "#10b981",
  };

  const filteredData = platform
    ? data.filter(
        (item) => item.platform.toLowerCase() === platform.toLowerCase()
      )
    : data;

  if (!data || data.length === 0) {
    return (
      <motion.div
        className="w-full bg-white/80 backdrop-blur-md border border-gray-200 rounded-3xl shadow-md p-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{
          scale: 1.02,
          boxShadow: "0 12px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Contest Ratings
        </h3>
        <p className="text-sm text-gray-500">No contest rating data available</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="w-full bg-white/80 backdrop-blur-md border border-gray-200 rounded-3xl shadow-md p-6 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 12px 30px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        {platform ? `${platform} Contest Ratings` : "Contest Ratings"}
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={filteredData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis
              dataKey="date"
              tickFormatter={(date) =>
                new Date(date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })
              }
              tick={{ fontSize: 12, fill: "#6b7280" }}
            />
            <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                backgroundColor: "#ffffff",
                border: "none",
              }}
            />
            <Area
              type="monotone"
              dataKey="rating"
              stroke={
                colors[platform ? platform.toLowerCase() : "leetcode"]
              }
              fill={`${
                colors[platform ? platform.toLowerCase() : "leetcode"]
              }33`}
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default ContestRatingChart;
