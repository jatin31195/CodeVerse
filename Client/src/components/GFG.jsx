import React, { useState } from 'react';
import { format } from 'date-fns';
import SolutionCard from './SolutionCard';
import POTDCalendar from './POTDCalendar';
import Navbar from './Navbar';
import MainLayout from './MainLayout';
const navLinks = [
  { name: 'LeetCode', path: '/leetcode' },
  { name: 'CodeForces', path: '/codeforces' },
  { name: 'Geeks for Geeks', path: '/gfg' },

];
const GFG = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getProblemForDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth();
    const problemIndex = (day + month) % 5;
    const problems = [
      {
        id: "gfg-1",
        title: "Longest Common Subsequence",
        platform: "gfg",
        difficulty: "Medium",
        link: "https://practice.geeksforgeeks.org/problems/longest-common-subsequence/0",
        date: format(date, 'MMMM d, yyyy')
      },
      {
        id: "gfg-2",
        title: "Maximum Sum Increasing Subsequence",
        platform: "gfg",
        difficulty: "Hard",
        link: "https://practice.geeksforgeeks.org/problems/maximum-sum-increasing-subsequence4749/1",
        date: format(date, 'MMMM d, yyyy')
      },
      {
        id: "gfg-3",
        title: "Detect Cycle in Undirected Graph",
        platform: "gfg",
        difficulty: "Medium",
        link: "https://practice.geeksforgeeks.org/problems/detect-cycle-in-an-undirected-graph/1",
        date: format(date, 'MMMM d, yyyy')
      },
      {
        id: "gfg-4",
        title: "Minimum Spanning Tree",
        platform: "gfg",
        difficulty: "Hard",
        link: "https://practice.geeksforgeeks.org/problems/minimum-spanning-tree/1",
        date: format(date, 'MMMM d, yyyy')
      },
      {
        id: "gfg-5",
        title: "Count Inversions",
        platform: "gfg",
        difficulty: "Medium",
        link: "https://practice.geeksforgeeks.org/problems/inversion-of-array-1587115620/1",
        date: format(date, 'MMMM d, yyyy')
      }
    ];
    return problems[problemIndex];
  };

  const problem = getProblemForDate(selectedDate);

  return (
    <>
     <MainLayout  navLinks={navLinks}>
    <div className="container mx-auto py-8 px-4 max-w-screen-xl">
      <h1 className="text-3xl font-bold text-center mb-6">GeeksforGeeks Problem of the Day</h1>
      {/* Simple Calendar Input */}
      <POTDCalendar/>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Problem for {format(selectedDate, 'MMMM d, yyyy')}</h2>
        <SolutionCard problem={problem} />
      </div>
    </div>
    </MainLayout>
    </>
  );
};

export default GFG;
