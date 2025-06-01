import React, { useState, useEffect, useMemo } from 'react';
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
import { BASE_URL } from '../config';
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(v => !v);

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

  const [leetcodeStats, setLeetcodeStats] = useState({ totalQuestions: 0, activeDays: 0, totalContests: 0, streak: 0, ranking: 0, reputation: 0 });
  const [cfStats, setCfStats] = useState({ totalQuestions: 0, activeDays: 0, totalContests: 0 });
  const [gfgStats, setGfgStats] = useState({ totalQuestions: 0, activeDays: 0, totalContests: 0 });
  const [leetcodeContest, setLeetcodeContest] = useState([]);
  const [cfContest, setCfContest] = useState([]);
  const [gfgContest, setGfgContest] = useState([]);

  const [leetcodeHeatmap, setLeetcodeHeatmap] = useState([]);
  const [cfHeatmap, setCfHeatmap] = useState([]);
  const [gfgHeatmap, setGfgHeatmap] = useState([]);

  const [leetcodeDifficultyCounts, setLeetcodeDifficultyCounts] = useState({ Easy: 0, Medium: 0, Hard: 0 });
  const [cfDifficultyCounts, setCfDifficultyCounts] = useState({ Easy: 0, Medium: 0, Hard: 0 });
  const [gfgDifficultyCounts, setGfgDifficultyCounts] = useState({ School: 0, Basic: 0, Easy: 0, Medium: 0, Hard: 0 });

  const [combinedDsaCount, setCombinedDsaCount] = useState(0);
  const [combinedCpCount, setCombinedCpCount] = useState(0);
  useEffect(() => {
    fetch(`${BASE_URL}/api/auth/profile`, {
      credentials: 'include',
    })
      .then(r => r.json())
      .then(json => {
        if (json.status === 'success') {
          const u = json.data.user;
          setUserData({
            name: u.name,
            email: u.email,
            dob: new Date(u.dateOfBirth).toLocaleDateString(),
            gender: u.gender,
            avatarUrl: u.profilePic,
          });
          setPlatforms({
            leetcode: u.leetcodeUsername || null,
            codeforces: u.codeforcesUsername || null,
            gfg: u.gfgUsername || null,
          });
        } else {
          toast.error('Failed to load user profile.');
        }
      })
      .catch(err => {
        console.error(err);
        toast.error('Error fetching user profile.');
      });
  }, []);

  useEffect(() => {
  if (!platforms.leetcode) return;

  fetch(`${BASE_URL}/api/leetcode-user/${platforms.leetcode}`, {
    credentials: 'include',
  })
    .then(res => res.json())
    .then(json => {
      if (json.status !== 'success') return;
      const data = json.data || json;
      setLeetcodeStats({
        totalQuestions: data.totalSolved,
        activeDays: data.totalActiveDays,
        totalContests: data.contest.totalContests,
        streak: data.streak,
        ranking: data.ranking,
        reputation: data.reputation,
      });

      const difficultyCounts = {
        Easy: Number(data.easySolved || 0),
        Medium: Number(data.mediumSolved || 0),
        Hard: Number(data.hardSolved || 0),
      };
      setLeetcodeDifficultyCounts(difficultyCounts);
      const contests = Array.isArray(data.contest.history)
        ? data.contest.history.map((contest, idx) => ({
            id: `leetcode-contest-${idx}`,
            name: contest.title,
            date: new Date(contest.startTime * 1000)
              .toISOString()
              .split('T')[0],
            rating: contest.rating,
            rank: contest.ranking,
            participants: 10000,
            platform: 'leetcode',
          }))
        : [];
      setLeetcodeContest(contests);
      const heatmap =
        data.heatmap && typeof data.heatmap === 'object'
          ? Object.entries(data.heatmap).map(([ts, count]) => ({
              date: new Date(Number(ts) * 1000)
                .toISOString()
                .split('T')[0],
              count: Number(count),
            }))
          : [];
      setLeetcodeHeatmap(heatmap);
    })
    .catch(err => {
      console.error(err);
      toast.error('Error fetching LeetCode data.');
    });
}, [platforms.leetcode]);


  useEffect(() => {
    if (!platforms.codeforces) return;

    fetch(`${BASE_URL}/api/codeforces-user/${platforms.codeforces}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(json => {
        if (json.status !== 'success') return;
        const data = json.data;

        const easyCount = Number(data.difficultyWiseSolved.easy || 0);
        const mediumCount = Number(data.difficultyWiseSolved.medium || 0);
        const hardCount = Number(data.difficultyWiseSolved.hard || 0);
        const totalSolved = easyCount + mediumCount + hardCount;
        setCfStats({
          totalQuestions: totalSolved,
          activeDays: data.totalActiveDays,
          totalContests: data.contestGraph.length,
        });

        setCfDifficultyCounts({
          Easy: easyCount,
          Medium: mediumCount,
          Hard: hardCount,
        });

        const contests = Array.isArray(data.contestGraph)
          ? data.contestGraph.map(contest => ({
              id: `codeforces-${contest.contestId}`,
              name: contest.contestName,
              date: new Date(contest.date).toISOString().split('T')[0],
              rating: contest.newRating,
              rank: contest.rank,
              participants: 10000,
              platform: 'codeforces',
            }))
          : [];
        setCfContest(contests);

        const heatmap =
          data.heatmapData && typeof data.heatmapData === 'object'
            ? Object.entries(data.heatmapData).map(([ts, count]) => ({
                date: new Date(Number(ts) * 1000).toISOString().split('T')[0],
                count: Number(count),
              }))
            : [];
        setCfHeatmap(heatmap);
      })
      .catch(err => {
        console.error(err);
        toast.error('Error fetching Codeforces data.');
      });
  }, [platforms.codeforces]);

  useEffect(() => {
    if (!platforms.gfg) return;

    fetch(`${BASE_URL}/api/gfg-user/${platforms.gfg}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(json => {
        if (json.status !== 'success') return;
        const data = json.data;

        const allCount = Number(
          data.submissions.difficultyBreakdown.find(d => d.difficulty === 'All')?.count || 0
        );

        setGfgStats({
          totalQuestions: allCount,
          activeDays: data.totalActiveDays,
          totalContests: data.contest.totalContests,
        });

        const breakdownCounts = {
          School: 0,
          Basic: 0,
          Easy: 0,
          Medium: 0,
          Hard: 0,
        };
        if (Array.isArray(data.submissions.difficultyBreakdown)) {
          data.submissions.difficultyBreakdown.forEach(item => {
            const key = item.difficulty; 
            if (key !== 'All' && breakdownCounts.hasOwnProperty(key)) {
              breakdownCounts[key] = Number(item.count || 0);
            }
          });
        }
        setGfgDifficultyCounts(breakdownCounts);

        setGfgContest([]);

        const heatmap =
          data.heatmaps &&
          data.heatmaps.problems &&
          typeof data.heatmaps.problems.heatmapData === 'object'
            ? Object.entries(data.heatmaps.problems.heatmapData).map(([ts, count]) => ({
                date: new Date(Number(ts) * 1000).toISOString().split('T')[0],
                count: Number(count),
              }))
            : [];
        setGfgHeatmap(heatmap);
      })
      .catch(err => {
        console.error(err);
        toast.error('Error fetching GFG data.');
      });
  }, [platforms.gfg]);

  useEffect(() => {
    const leetDsaApprox = leetcodeStats.totalQuestions;
    const gfgDsa = gfgStats.totalQuestions;
    setCombinedDsaCount(leetDsaApprox + gfgDsa);
    setCombinedCpCount(cfStats.totalQuestions);
  }, [leetcodeStats.totalQuestions, gfgStats.totalQuestions, cfStats.totalQuestions]);

  const combinedData = useMemo(() => {
    const allContests = [...leetcodeContest, ...cfContest, ...gfgContest];
    const validContests = allContests.filter(c => c.date && c.rating != null);
    const byDate = {};
    validContests.forEach(c => {
      if (!byDate[c.date]) byDate[c.date] = { rating: 0, contests: [] };
      byDate[c.date].rating += c.rating;
      byDate[c.date].contests.push({ name: c.name, platform: c.platform });
    });
    const series = Object.keys(byDate)
      .map(date => ({
        date,
        rating: byDate[date].rating,
        contests: byDate[date].contests,
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    return {
      statistics: {
        totalQuestions: leetcodeStats.totalQuestions + cfStats.totalQuestions + gfgStats.totalQuestions,
        activeDays: leetcodeStats.activeDays + cfStats.activeDays + gfgStats.activeDays,
        totalContests: leetcodeStats.totalContests + cfStats.totalContests + gfgStats.totalContests,
      },
      problemTypes: {
        counts: { DSA: combinedDsaCount, CP: combinedCpCount },
      },
      contestData: series,
      contestRankings: validContests.sort((a, b) => new Date(b.date) - new Date(a.date)),
      heatmapData: [...leetcodeHeatmap, ...cfHeatmap, ...gfgHeatmap],
    };
  }, [
    leetcodeStats,
    cfStats,
    gfgStats,
    leetcodeContest,
    cfContest,
    gfgContest,
    leetcodeHeatmap,
    cfHeatmap,
    gfgHeatmap,
    combinedDsaCount,
    combinedCpCount,
  ]);

  const filteredData = useMemo(() => {
    if (activeTab === 'all') {
      return {
        statistics: combinedData.statistics,

        platform: 'All',
        counts: combinedData.problemTypes.counts,
        contestData: combinedData.contestData,
        contestRankings: combinedData.contestRankings,
        heatmapData: combinedData.heatmapData,
      };
    }
    if (activeTab === 'leetcode') {
      return {
        statistics: leetcodeStats,
        platform: 'LeetCode',
        counts: leetcodeDifficultyCounts,
        contestData: leetcodeContest,
        contestRankings: leetcodeContest,
        heatmapData: leetcodeHeatmap,
      };
    }
    if (activeTab === 'codeforces') {
      return {
        statistics: cfStats,
        platform: 'Codeforces',
        counts: cfDifficultyCounts,
        contestData: cfContest,
        contestRankings: cfContest,
        heatmapData: cfHeatmap,
      };
    }

    return {
      statistics: gfgStats,
      platform: 'GFG',
      counts: gfgDifficultyCounts,
      contestData: gfgContest,
      contestRankings: gfgContest,
      heatmapData: gfgHeatmap,
    };
  }, [
    activeTab,
    combinedData,
    leetcodeStats,
    cfStats,
    gfgStats,
    leetcodeDifficultyCounts,
    cfDifficultyCounts,
    gfgDifficultyCounts,
    leetcodeContest,
    cfContest,
    gfgContest,
    leetcodeHeatmap,
    cfHeatmap,
    gfgHeatmap,
  ]);

  const platformName =
    activeTab === 'all'
      ? 'All Platforms'
      : activeTab === 'leetcode'
      ? 'LeetCode'
      : activeTab === 'codeforces'
      ? 'CodeForces'
      : 'GeeksForGeeks';

  const isConnected = activeTab === 'all' || !!platforms[activeTab];

  const savePlatform = async (platform, username) => {
    try {
      const payload = { platform, username };
      const response = await fetch(`${BASE_URL}/api/auth/update-platform`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || data.status !== 'success') {
        throw new Error(data.message || `Failed to update ${platform} username`);
      }
      setPlatforms(prev => ({ ...prev, [platform]: username }));
      toast.success(`Connected to ${platform} successfully!`);
      return data;
    } catch (err) {
      console.error(err);
      toast.error(err.message || `Unable to connect ${platform}.`);
      throw err;
    }
  };

  return (
    <MainLayout>
      <DashboardLayout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      >
        <div className="max-w-7xl mx-auto py-8 space-y-12">
          <motion.div
            className="grid grid-cols-1 gap-6"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
              <UserProfileCard {...userData} />
            </motion.div>

            <motion.section
              className="space-y-4"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            >
              <h2 className="text-2xl font-bold">Connected Platforms</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {['leetcode', 'codeforces', 'gfg'].map(p => (
                  <motion.div
                    key={p}
                    variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                  >
                    <PlatformCard
                      platform={p}
                      username={platforms[p]}
                      isConnected={!!platforms[p]}
                      onSave={u => savePlatform(p, u)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </motion.div>

          {isConnected && (
            <AnimatePresence mode="popLayout">
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-12"
              >
             
                <section>
                  <h2 className="text-2xl font-bold mb-4">{platformName} Statistics</h2>
                  <StatisticsCard {...filteredData.statistics} />
                </section>

               
                <section>
                  <h2 className="text-2xl font-bold mb-4">Problem Analysis</h2>
                  <ProblemTypeStats
                    platform={filteredData.platform}
                    counts={filteredData.counts}
                  />
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">Contest Rating Over Time</h2>
                  <ContestRatingChart data={filteredData.contestData} />
                </section>

              
                <section>
                  <h2 className="text-2xl font-bold mb-4">Activity Heatmap</h2>
                  <ActivityHeatmap data={filteredData.heatmapData} />
                </section>

             
                <section>
                  <h2 className="text-2xl font-bold mb-4">Recent Contest Rankings</h2>
                  <ContestRankingTable rankings={filteredData.contestRankings} />
                </section>
              </motion.div>
            </AnimatePresence>
          )}

      
          {!isConnected && activeTab !== 'all' && (
            <motion.div
              className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl text-gray-500"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <UserPlus className="w-12 h-12 mb-4 text-purple-600" />
              <h3 className="text-xl font-semibold mb-2">
                Connect Your {platformName} Account
              </h3>
              <p className="mb-6 text-center max-w-sm">
                To view your {platformName} stats, please connect your account below.
              </p>
              <PlatformCard
                platform={activeTab}
                username={platforms[activeTab]}
                isConnected={false}
                onSave={u => savePlatform(activeTab, u)}
              />
            </motion.div>
          )}
        </div>
      </DashboardLayout>
    </MainLayout>
  );
}
