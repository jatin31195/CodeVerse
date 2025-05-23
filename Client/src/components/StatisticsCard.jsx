import React from "react";
import { CheckCircle, Calendar as CalendarIcon, Award } from "lucide-react";
import { motion } from "framer-motion";

const StatBox = ({ icon: Icon, count, label, iconBg, iconColor }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="flex flex-col items-center p-5 rounded-2xl bg-white border border-gray-200 shadow-md hover:shadow-xl transition-shadow"
  >
    <div className={`w-14 h-14 rounded-full ${iconBg} flex items-center justify-center mb-4 shadow-inner`}>
      <Icon className={`h-7 w-7 ${iconColor}`} />
    </div>
    <span className="text-4xl font-extrabold text-gray-800 mb-1">{count}</span>
    <span className="text-sm font-semibold text-gray-500 text-center">{label}</span>
  </motion.div>
);

const StatisticsCard = ({ totalQuestions, activeDays, totalContests, platform, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`w-full bg-gradient-to-br from-gray-50 to-white dark:from-white dark:to-gray-50 border border-gray-200 shadow-sm rounded-2xl p-6 ${className || ''}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatBox
          icon={CheckCircle}
          count={totalQuestions}
          label="Problems Solved"
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
        <StatBox
          icon={CalendarIcon}
          count={activeDays}
          label="Active Days"
          iconBg="bg-indigo-100"
          iconColor="text-indigo-600"
        />
        <StatBox
          icon={Award}
          count={totalContests}
          label="Contests"
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
        />
      </div>
    </motion.div>
  );
};

export default StatisticsCard;
