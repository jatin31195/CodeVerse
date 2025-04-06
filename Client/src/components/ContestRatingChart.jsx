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

  if (filteredData.length === 0) {
    return (
      <motion.div
        className="w-full bg-white rounded-lg shadow p-4 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-bold">Contest Ratings</h3>
        <p className="text-sm text-gray-500">
          No contest rating data available
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="w-full bg-white rounded-lg shadow p-4 hover:shadow-xl transition-transform"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-lg font-bold mb-1">
        {platform ? `${platform} Contest Ratings` : "Contest Ratings"}
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={filteredData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis
              dataKey="date"
              tickFormatter={(date) =>
                new Date(date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })
              }
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
            <Area
              type="monotone"
              dataKey="rating"
              stroke={
                colors[
                  platform ? platform.toLowerCase() : "leetcode"
                ]
              }
              fill={`${colors[platform ? platform.toLowerCase() : "leetcode"]}20`}
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
