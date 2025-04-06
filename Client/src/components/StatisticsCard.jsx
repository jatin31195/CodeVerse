import React from 'react';
import { CheckCircle, Calendar as CalendarIcon, Award } from 'lucide-react';

const StatisticsCard = ({ totalQuestions, activeDays, totalContests, platform, className }) => {
  return (
    <div className={`w-full overflow-hidden bg-white dark:bg-white border border-gray-200 dark:border-white shadow-sm hover:shadow-md transition-all rounded-xl ${className || ''}`}>
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
        
          <div className="flex flex-col items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-100 border border-gray-200/60 dark:border-gray-100 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-300/30 flex items-center justify-center mb-3">
              <CheckCircle className="h-6 w-6 text-purple-600 dark:text-purple-800" />
            </div>
            <span className="text-3xl font-bold text-black dark:text-blackmb-1">
              {totalQuestions}
            </span>
            <span className="font-bold text-sm text-gray-600 dark:text-gray-400 text-center">
              Problems Solved
            </span>
          </div>

         
          <div className="flex flex-col items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-100 border border-gray-200/60 dark:border-gray-100 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-300/30 flex items-center justify-center mb-3">
              <CalendarIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-800" />
            </div>
            <span className="text-3xl font-bold text-black dark:text-black mb-1">
              {activeDays}
            </span>
            <span className="font-bold text-sm text-gray-600 dark:text-gray-400 text-center">
              Active Days
            </span>
          </div>

         
          <div className="flex flex-col items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-100 border border-gray-200/60 dark:border-gray-100 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-300/30 flex items-center justify-center mb-3">
              <Award className="h-6 w-6 text-violet-600 dark:text-violet-800" />
            </div>
            <span className="text-3xl font-bold text-black dark:text-black mb-1">
              {totalContests}
            </span>
            <span className="font-bold text-sm text-gray-600 dark:text-gray-400 text-center">
              Contests
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StatisticsCard;
