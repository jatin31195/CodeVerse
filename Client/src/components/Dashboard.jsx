import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import UserProfileCard from './UserProfileCard';
import PlatformCard from './PlatformCard';
import StatisticsCard from './StatisticsCard';
import ProblemTypeStats from './ProblemTypeStats';
import ContestRatingChart from './ContestRatingChart';
import ActivityHeatmap from './ActivityHeatmap';
import ContestRankingTable from './ContestRankingTable';
import { toast } from 'sonner';
import MainLayout from './MainLayout';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const [platforms, setPlatforms] = useState({
    leetcode: null,
    codeforces: null,
    gfg: null,
  });

  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    dob: '1990-01-01',
    gender: 'Male',
    avatarUrl: '',
  });

  const [leetcodeStats, setLeetcodeStats] = useState({ totalQuestions: 0, activeDays: 0, totalContests: 0 });
  const [leetcodeContest, setLeetcodeContest] = useState([]);
  const [leetcodeHeatmap, setLeetcodeHeatmap] = useState([]);
  const [leetcodeProblems, setLeetcodeProblems] = useState({ dsaCount: 0, cpCount: 0 });

  const [cfStats, setCfStats] = useState({ totalQuestions: 0, activeDays: 0, totalContests: 0 });
  const [cfContest, setCfContest] = useState([]);
  const [cfHeatmap, setCfHeatmap] = useState([]);
  const [cfCpCount, setCfCpCount] = useState(0);

  const [gfgStats, setGfgStats] = useState({ totalQuestions: 0, activeDays: 0, totalContests: 0 });
  const [gfgHeatmap, setGfgHeatmap] = useState([]);
  const [gfgProblems, setGfgProblems] = useState({ dsaCount: 0 });
  const [gfgData, setGfgData] = useState(null);

  
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      fetch("http://localhost:8080/api/auth/profile", {
        headers: { Authorization: token },
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.status === "success") {
            const user = json.data.user;
            setUserData({
              name: user.name,
              email: user.email,
              dob: new Date(user.dateOfBirth).toLocaleDateString(),
              gender: user.gender,
              avatarUrl: user.profilePic,
            });
            setPlatforms({
              leetcode: user.leetcodeUsername || null,
              codeforces: user.codeforcesUsername || null,
              gfg: user.gfgUsername || null,
            });
          }
        })
        .catch((err) => console.error(err));
    }
  }, []);

 
  useEffect(() => {
    if (platforms.leetcode) {
      fetch(`http://localhost:8080/api/leetcode-user/${platforms.leetcode}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.status === 'success') {
            const data = json.data;
            const allSubs = Number(
              data.submissions.difficultyBreakdown.find((d) => d.difficulty === 'All')?.count
            ) || 0;
            setLeetcodeStats({
              totalQuestions: allSubs,
              activeDays: data.totalActiveDays,
              totalContests: data.contest.totalContests,
            });
            const contests = data.contest.history.map((contest, index) => {
              const contestDate = new Date(contest.startTime * 1000);
              return {
                id: `leetcode-contest-${index}`,
                name: contest.title,
                date: contestDate.toISOString().split('T')[0],
                rating: contest.rating,
                rank: contest.ranking,
                participants: 10000,
                platform: 'leetcode',
              };
            });
            setLeetcodeContest(contests);
            const heatmap = Object.entries(data.heatmap).map(([ts, count]) => ({
              date: new Date(Number(ts) * 1000).toISOString().split('T')[0],
              count: Number(count),
            }));
            setLeetcodeHeatmap(heatmap);
            setLeetcodeProblems({
              dsaCount: allSubs,
              cpCount: 0,
            });
          }
        })
        .catch((err) => console.error(err));
    }
  }, [platforms.leetcode]);


  useEffect(() => {
    if (platforms.codeforces) {
      fetch(`http://localhost:8080/api/codeforces-user/${platforms.codeforces}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.status === 'success') {
            const data = json.data;
            const solved =
              (data.difficultyWiseSolved.easy || 0) +
              (data.difficultyWiseSolved.medium || 0) +
              (data.difficultyWiseSolved.hard || 0);
            setCfStats({
              totalQuestions: solved,
              activeDays: data.totalActiveDays,
              totalContests: data.contestGraph.length,
            });
            setCfCpCount(solved);
            const contests = data.contestGraph.map((contest) => ({
              id: `codeforces-${contest.contestId}`,
              name: contest.contestName,
              date: new Date(contest.date).toISOString().split('T')[0],
              rating: contest.newRating,
              rank: contest.rank,
              participants: 10000,
              platform: 'codeforces',
            }));
            setCfContest(contests);
            const heatmap = Object.entries(data.heatmapData).map(([ts, count]) => ({
              date: new Date(Number(ts) * 1000).toISOString().split('T')[0],
              count: Number(count),
            }));
            setCfHeatmap(heatmap);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [platforms.codeforces]);

  
  useEffect(() => {
    if (platforms.gfg) {
      fetch(`http://localhost:8080/api/gfg-user/${platforms.gfg}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.status === 'success') {
            const data = json.data;
            setGfgData(data);
            const allSubs = Number(
              data.submissions.difficultyBreakdown.find((d) => d.difficulty === 'All')?.count
            ) || 0;
            setGfgStats({
              totalQuestions: allSubs,
              activeDays: data.totalActiveDays,
              totalContests: data.contest.totalContests,
            });
            setGfgProblems({
              dsaCount: allSubs,
            });
            const heatmap = Object.entries(data.heatmaps.problems.heatmapData).map(([ts, count]) => ({
              date: new Date(Number(ts) * 1000).toISOString().split('T')[0],
              count: Number(count),
            }));
            setGfgHeatmap(heatmap);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [platforms.gfg]);

  
  const getCombinedData = () => {
    const lcContests = leetcodeContest || [];
    const cfContests = cfContest || [];
    const gfgContests = []; 
    const combinedContests = [...lcContests, ...cfContests, ...gfgContests].filter(
      (contest) => contest && contest.date && contest.rating !== undefined
    );
    let combinedSeries = [];
    if (combinedContests.length > 0) {
      const combinedMap = {};
      combinedContests.forEach((contest) => {
        if (combinedMap[contest.date]) {
          combinedMap[contest.date].rating += contest.rating;
          combinedMap[contest.date].contests.push({ name: contest.name, platform: contest.platform });
        } else {
          combinedMap[contest.date] = {
            rating: contest.rating,
            contests: [{ name: contest.name, platform: contest.platform }],
          };
        }
      });
      combinedSeries = Object.keys(combinedMap)
        .map((date) => ({
          date,
          rating: combinedMap[date].rating,
          contests: combinedMap[date].contests,
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    return {
      statistics: {
        totalQuestions: leetcodeStats.totalQuestions + cfStats.totalQuestions + gfgStats.totalQuestions,
        activeDays: leetcodeStats.activeDays + cfStats.activeDays + gfgStats.activeDays,
        totalContests: leetcodeStats.totalContests + cfStats.totalContests + gfgStats.totalContests,
      },
      problemTypes: {
        dsaCount: Number(leetcodeProblems.dsaCount) + Number(gfgProblems.dsaCount || 0),
        cpCount: cfCpCount,
      },
      contestData: combinedSeries,
      contestRankings: [...lcContests, ...cfContests, ...gfgContests].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      ),
      heatmapData: [...leetcodeHeatmap, ...cfHeatmap, ...gfgHeatmap],
    };
  };

  const getFilteredData = () => {
    if (activeTab === 'all') {
      return getCombinedData();
    } else if (activeTab === 'leetcode') {
      return {
        statistics: leetcodeStats,
        problemTypes: { dsaCount: leetcodeProblems.dsaCount, cpCount: 0 },
        contestData: leetcodeContest,
        contestRankings: leetcodeContest,
        heatmapData: leetcodeHeatmap,
      };
    } else if (activeTab === 'codeforces') {
      return {
        statistics: cfStats,
        problemTypes: { dsaCount: 0, cpCount: cfCpCount },
        contestData: cfContest,
        contestRankings: cfContest,
        heatmapData: cfHeatmap,
      };
    } else if (activeTab === 'gfg') {
      return {
        statistics: gfgStats,
        problemTypes: { dsaCount: gfgProblems.dsaCount, cpCount: 0 },
        contestData: [],
        contestRankings: [],
        heatmapData: gfgHeatmap,
      };
    }
  };

  const filteredData = getFilteredData();
  const platformName =
    activeTab === 'all'
      ? undefined
      : activeTab === 'leetcode'
      ? 'LeetCode'
      : activeTab === 'codeforces'
      ? 'CodeForces'
      : 'GeeksForGeeks';

  const isPlatformConnected = activeTab === 'all' || platforms[activeTab] !== null;

  const handleSavePlatform = (platform, username) => {
    setPlatforms((prev) => ({
      ...prev,
      [platform]: username,
    }));
  };

  return (
    <MainLayout>
    <DashboardLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      sidebarOpen={sidebarOpen}
      toggleSidebar={toggleSidebar}
    >
      <div className="w-full max-w-6xl mx-auto space-y-8">
    
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-4">
            <UserProfileCard
              name={userData.name}
              email={userData.email}
              dob={userData.dob}
              gender={userData.gender}
              avatarUrl={userData.avatarUrl}
            />
          </div>
          <h2 className="text-xl font-bold font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-purple-800 to-indigo-700 dark:from-purple-600 dark:to-indigo-400 flex items-center col-span-4">
            <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full mr-2"></span>
            Connected Platforms
          </h2>
          <PlatformCard
            platform="leetcode"
            username={platforms.leetcode}
            onSave={(username) => handleSavePlatform('leetcode', username)}
            isConnected={platforms.leetcode !== null}
          />
          <PlatformCard
            platform="codeforces"
            username={platforms.codeforces}
            onSave={(username) => handleSavePlatform('codeforces', username)}
            isConnected={platforms.codeforces !== null}
          />
          <PlatformCard
            platform="gfg"
            username={platforms.gfg}
            onSave={(username) => handleSavePlatform('gfg', username)}
            isConnected={platforms.gfg !== null}
          />
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {isPlatformConnected ? (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Overall Statistics */}
              <section>
                <h2 className="text-xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-purple-800 to-indigo-700 dark:from-purple-600 dark:to-indigo-400 flex items-center">
                  <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full mr-2"></span>
                  {platformName ? `${platformName} Statistics` : 'Overall Statistics'}
                </h2>
                <StatisticsCard
                  totalQuestions={filteredData.statistics.totalQuestions}
                  activeDays={filteredData.statistics.activeDays}
                  totalContests={filteredData.statistics.totalContests}
                  platform={platformName}
                />
              </section>

              {/* Problem Analysis */}
              <section className="mt-6">
                <h2 className="text-xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-purple-800 to-indigo-700 dark:from-purple-600 dark:to-indigo-400 flex items-center">
                  <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full mr-2"></span>
                  Problem Analysis
                </h2>
                <ProblemTypeStats
                  dsaCount={filteredData.problemTypes.dsaCount}
                  cpCount={filteredData.problemTypes.cpCount}
                  platform={platformName}
                />
              </section>

              {/* Coding Streaks */}
              <section className="mt-6">
                <h2 className="text-xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-purple-800 to-indigo-700 dark:from-purple-600 dark:to-indigo-400 flex items-center">
                  <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full mr-2"></span>
                  Coding Streaks
                </h2>
                <ContestRatingChart data={filteredData.contestData} platform={platformName} />
              </section>

              {/* Activity Heatmap */}
              <section className="mt-6">
                <ActivityHeatmap data={filteredData.heatmapData} platform={platformName} />
              </section>

              {/* Contest Performance */}
              <section className="mt-6">
                <h2 className="text-xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-purple-800 to-indigo-700 dark:from-purple-600 dark:to-indigo-400 flex items-center">
                  <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full mr-2"></span>
                  Contest Performance
                </h2>
                <ContestRankingTable rankings={filteredData.contestRankings} platform={platformName} />
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="connect"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center py-12 px-4 border rounded-lg border-dashed border-gray-300"
            >
              <div className="mb-4">
                <UserPlus className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Connect Your Account</h3>
              <p className="text-gray-500 text-center max-w-md mb-6">
                Please connect your {platformName} account to view your statistics and performance data.
              </p>
              <button
                className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
                onClick={() => {
                  handleSavePlatform(activeTab, 'demo_user');
                  toast.success(`Connected to ${platformName} for demonstration!`);
                }}
              >
                Connect for Demo
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
    </MainLayout>
  );
};

export default Dashboard;
