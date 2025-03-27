import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Calendar as CalendarIcon,
  Award,
  Mail,
  User,
  Calendar as CalendarIcon2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as ReTooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip as ReTooltip2,
  ResponsiveContainer as ReResponsiveContainer,
} from 'recharts';

const DashboardLayout = ({ children, activeTab, onTabChange }) => (
  <div className="min-h-screen flex flex-col">
    <header className="w-full border-b backdrop-blur-sm bg-white/80 fixed top-0 z-10">
      <div className="container mx-auto flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white font-semibold">CV</span>
          </div>
          <h1 className="text-xl font-bold">CodeVerse</h1>
        </div>
      </div>
    </header>
    <main className="flex-1 container mx-auto py-20">
      <div className="w-full flex flex-col items-center space-y-8">
        <div className="w-full flex justify-center mb-4 mt-6">
          <div className="w-full max-w-4xl">
            <div className="grid grid-cols-4">
              {['all', 'leetcode', 'codeforces', 'gfg'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => onTabChange(tab)}
                  className={`py-2 transition-all duration-200 ${
                    activeTab === tab ? 'border-b-2 border-primary text-primary' : 'text-gray-600'
                  }`}
                >
                  {tab === 'all'
                    ? 'All'
                    : tab === 'leetcode'
                    ? 'LeetCode'
                    : tab === 'codeforces'
                    ? 'CodeForces'
                    : 'GeeksForGeeks'}
                </button>
              ))}
            </div>
          </div>
        </div>
        {children}
      </div>
    </main>
  </div>
);


const UserProfileCard = ({ name, email, dob, gender, avatarUrl }) => (
  <motion.div
    className="w-full bg-white rounded-lg shadow p-4 hover:shadow-xl"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center overflow-hidden bg-gray-100">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-lg font-bold text-primary">
              {name.split(' ').map((n) => n[0]).join('')}
            </span>
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold">{name}</h2>
          <div className="flex items-center mt-1 text-sm text-gray-500">
            <Mail className="h-4 w-4 mr-1" />
            <span>{email}</span>
          </div>
        </div>
      </div>
      <button className="hidden sm:block border border-primary text-primary px-3 py-1 rounded hover:bg-primary hover:text-primary transition-colors">
        Edit Profile
      </button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-sm">
      <div className="flex items-center space-x-2">
        <CalendarIcon2 className="h-4 w-4 text-gray-500" />
        <span className="text-gray-500">DOB:</span>
        <span>{dob}</span>
      </div>
      <div className="flex items-center space-x-2">
        <User className="h-4 w-4 text-gray-500" />
        <span className="text-gray-500">Gender:</span>
        <span>{gender}</span>
      </div>
    </div>
  </motion.div>
);


const PlatformCard = ({ platform, username, onSave, isConnected }) => {
  const [newUsername, setNewUsername] = useState(username || '');
  const [isOpen, setIsOpen] = useState(false);
  const platformDetails = {
    leetcode: {
      name: 'LeetCode',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png',
      color: 'from-yellow-400 to-orange-500',
    },
    codeforces: {
      name: 'CodeForces',
      logo: 'https://codeforces.org/s/0/favicon-32x32.png',
      color: 'from-blue-400 to-indigo-500',
    },
    gfg: {
      name: 'GeeksForGeeks',
      logo: 'https://media.geeksforgeeks.org/gfg-gg-logo.svg',
      color: 'from-green-400 to-emerald-500',
    },
  };
  const { name, logo, color } = platformDetails[platform];

  const handleSave = async () => {
    if (newUsername.trim()) {
      try {
        const token = sessionStorage.getItem('token');
        const res = await fetch('http://localhost:8080/api/auth/update-platform', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({ platform, username: newUsername }),
        });
        const result = await res.json();
        if (res.ok) {
          onSave(newUsername);
          setIsOpen(false);
          alert(`Connected to ${name}!`);
        } else {
          alert(result.message || 'Update failed');
        }
      } catch (error) {
        console.error(error);
        alert('Error updating platform username');
      }
    }
  };

  return (
    <motion.div
      className={`w-full bg-white rounded-lg shadow transition-transform hover:shadow-xl hover:-translate-y-1 border ${
        isConnected ? 'border-green-300' : 'border-gray-300'
      }`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={`h-1 w-full bg-gradient-to-r ${color}`}></div>
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded overflow-hidden bg-white">
            <img src={logo} alt={name} className="w-6 h-6 object-contain" />
          </div>
          <div>
            <h3 className="font-medium">{name}</h3>
            {username && <p className="text-xs text-gray-500">@{username}</p>}
          </div>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="px-3 py-1 rounded bg-gray-600 text-white hover:bg-primary/90 transition"
        >
          {isConnected ? 'Update' : 'Connect'}
        </button>
      </div>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
            <h3 className="text-lg font-bold mb-2">Connect {name}</h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter your {name} username to connect your account.
            </p>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder={`Enter your ${name} username`}
              className="w-full border rounded px-3 py-2 mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border rounded hover:bg-red-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-green-500/90 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const StatisticsCard = ({ totalQuestions, activeDays, totalContests, platform }) => (
  <motion.div
    className="w-full bg-white rounded-lg shadow p-4 hover:shadow-xl transition-transform"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <h3 className="text-lg font-bold mb-1">
      {platform ? `${platform} Statistics` : 'Overall Statistics'}
    </h3>
    <p className="text-sm text-gray-500 mb-4">Your coding journey in numbers</p>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="flex flex-col items-center p-4 bg-gray-50 rounded">
        <CheckCircle className="h-8 w-8 text-primary mb-2" />
        <span className="text-2xl font-bold">{totalQuestions}</span>
        <span className="text-sm text-gray-500">Problems Solved</span>
      </div>
      <div className="flex flex-col items-center p-4 bg-gray-50 rounded">
        <CalendarIcon className="h-8 w-8 text-primary mb-2" />
        <span className="text-2xl font-bold">{activeDays}</span>
        <span className="text-sm text-gray-500">Active Days</span>
      </div>
      <div className="flex flex-col items-center p-4 bg-gray-50 rounded">
        <Award className="h-8 w-8 text-primary mb-2" />
        <span className="text-2xl font-bold">{totalContests}</span>
        <span className="text-sm text-gray-500">Contests</span>
      </div>
    </div>
  </motion.div>
);

const ActivityHeatmap = ({ data, platform }) => {
  const currentYear = new Date().getFullYear();
  const availableYears = [currentYear, currentYear - 1, currentYear - 2];
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const generateGrid = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const startDate = new Date(selectedYear, 0, 1);
    const endDate = new Date(selectedYear, 11, 31);
    let currentDate = new Date(startDate);
    let weekNum = 0;
    let lastMonth = -1;
    const cells = [];
    const today = new Date();
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      const currentMonth = currentDate.getMonth();
      if (lastMonth !== -1 && currentMonth !== lastMonth) {
        weekNum++;
      }
      const column = weekNum + 2;
      const row = dayOfWeek + 2;
      const dateStr = currentDate.toISOString().split('T')[0];
      const cellData = data.find((d) => d.date === dateStr);
      let bgColor = 'bg-gray-100';
      if (cellData) {
        if (cellData.count >= 1 && cellData.count < 3) bgColor = 'bg-green-300';
        else if (cellData.count >= 3 && cellData.count < 5) bgColor = 'bg-green-400';
        else if (cellData.count >= 5 && cellData.count < 7) bgColor = 'bg-green-500';
        else if (cellData.count >= 7 && cellData.count < 9) bgColor = 'bg-green-600';
        else if (cellData.count >= 9) bgColor = 'bg-green-700';
      }
      const isFuture = currentDate > today;
      cells.push(
        <div
          key={dateStr}
          className={`w-3 h-3 rounded-sm transition-colors duration-200 ${
            isFuture ? 'bg-gray-50 border border-gray-100' : bgColor
          }`}
          style={{ gridColumn: column, gridRow: row }}
          title={isFuture ? 'Future date' : cellData ? `${cellData.count} submissions on ${dateStr}` : `No submissions on ${dateStr}`}
        ></div>
      );
      lastMonth = currentMonth;
      if (dayOfWeek === 6) weekNum++;
      currentDate.setDate(currentDate.getDate() + 1);
    }
    const monthLabels = months.map((m, index) => (
      <div key={m} className="text-xs text-gray-500" style={{ gridColumn: index * 5 + 2, gridRow: 1 }}>
        {m}
      </div>
    ));
    return [...monthLabels, ...cells];
  };

  return (
    <motion.div
      className="w-full bg-white rounded-lg shadow p-4 hover:shadow-xl transition-transform"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold">{platform ? `${platform} Activity` : 'Coding Activity'}</h3>
          <p className="text-sm text-gray-500">Daily contribution heatmap</p>
        </div>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {availableYears.map((yr) => (
            <option key={yr} value={yr}>
              {yr}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto pb-2">
        <div
          className="grid gap-1 min-w-[800px]"
          style={{ gridTemplateColumns: 'auto repeat(65, 1fr)', gridTemplateRows: 'auto repeat(7, 1fr)' }}
        >
          {generateGrid()}
        </div>
      </div>
    </motion.div>
  );
};

const CombinedContestTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-2 border rounded shadow">
        <p className="font-bold">Contests on {label}</p>
        {data.contests.map((contest, index) => (
          <p key={index} className="text-xs">
            {contest.name} ({contest.platform})
          </p>
        ))}
        <p className="mt-1 text-sm">
          <span className="font-bold">Total Rating:</span> {data.rating}
        </p>
      </div>
    );
  }
  return null;
};

const ContestRatingChart = ({ data, platform }) => {
  const colors = {
    leetcode: '#FFA116',
    codeforces: '#318CE7',
  };

  const filteredData = platform
    ? data.filter((item) => item.platform === platform.toLowerCase())
    : data;

  if (filteredData.length === 0) {
    return (
      <motion.div
        className="w-full bg-white rounded-lg shadow p-4 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-bold">Contest Ratings</h3>
        <p className="text-sm text-gray-500">No contest rating data available</p>
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
        {platform ? `${platform} Contest Ratings` : 'Contest Ratings'}
      </h3>
      <p className="text-sm text-gray-500 mb-4">Your performance over time</p>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            {platform ? (
              <ReTooltip
                contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value) => [value, 'Rating']}
              />
            ) : (
              <ReTooltip content={<CombinedContestTooltip />} />
            )}
            {platform ? (
              <Area
                type="monotone"
                dataKey="rating"
                stroke={colors[platform.toLowerCase()]}
                fill={`${colors[platform.toLowerCase()]}20`}
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
            ) : (
              <Area
                type="monotone"
                dataKey="rating"
                name="Combined"
                stroke={colors.leetcode}
                fill={`${colors.leetcode}20`}
                strokeWidth={2}
                activeDot={{ r: 6 }}
                connectNulls
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

const ProblemTypeStats = ({ dsaCount, cpCount, platform }) => {
  const data = [
    { name: 'DSA', value: dsaCount, color: '#10b981' },
    { name: 'CP', value: cpCount, color: '#3b82f6' },
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
        {platform ? `${platform} Problem Types` : 'Problem Types'}
      </h3>
      <p className="text-sm text-gray-500 mb-4">DSA vs Competitive Programming</p>
      <div className="h-[250px] w-full">
        <ReResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <ReTooltip2
              formatter={(value) => [`${value} problems`, '']}
              contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Legend />
          </PieChart>
        </ReResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="flex flex-col items-center p-2 bg-gray-100 rounded">
          <span className="text-sm text-gray-500">DSA Problems</span>
          <div className="flex items-baseline">
            <span className="text-xl font-bold mr-2">{dsaCount}</span>
            <span className="text-xs text-gray-500">({dsaPercentage}%)</span>
          </div>
        </div>
        <div className="flex flex-col items-center p-2 bg-gray-100 rounded">
          <span className="text-sm text-gray-500">CP Problems</span>
          <div className="flex items-baseline">
            <span className="text-xl font-bold mr-2">{cpCount}</span>
            <span className="text-xs text-gray-500">({cpPercentage}%)</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ContestRankingTable = ({ rankings, platform }) => {
  const filteredRankings = platform
    ? rankings.filter((r) => r.platform === platform.toLowerCase())
    : rankings;
  const sortedRankings = [...filteredRankings].sort((a, b) => new Date(b.date) - new Date(a.date));
  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'leetcode':
        return 'bg-yellow-100 text-yellow-800';
      case 'codeforces':
        return 'bg-blue-100 text-blue-800';
      case 'gfg':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const getRankingBadge = (rank, participants) => {
    const percentile = 100 - (rank / participants) * 100;
    if (percentile >= 99) return { text: 'Top 1%', className: 'bg-purple-100 text-purple-800' };
    if (percentile >= 95) return { text: 'Top 5%', className: 'bg-indigo-100 text-indigo-800' };
    if (percentile >= 90) return { text: 'Top 10%', className: 'bg-blue-100 text-blue-800' };
    if (percentile >= 75) return { text: 'Top 25%', className: 'bg-green-100 text-green-800' };
    if (percentile >= 50) return { text: 'Top 50%', className: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Participated', className: 'bg-gray-100 text-gray-800' };
  };
  return (
    <motion.div
      className="w-full bg-white rounded-lg shadow p-4 hover:shadow-xl transition-transform overflow-x-auto"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-lg font-bold mb-1">
        {platform ? `${platform} Contest Rankings` : 'Contest Rankings'}
      </h3>
      <p className="text-sm text-gray-500 mb-4">Your performance in competitive contests</p>
      <table className="min-w-full">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-left">Contest</th>
            {!platform && <th className="px-4 py-2 text-left">Platform</th>}
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-right">Rank</th>
            <th className="px-4 py-2 text-right">Performance</th>
          </tr>
        </thead>
        <tbody>
          {sortedRankings.length > 0 ? (
            sortedRankings.map((contest) => {
              const badge = getRankingBadge(contest.rank, contest.participants);
              return (
                <tr key={contest.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{contest.name}</td>
                  {!platform && (
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs ${getPlatformColor(contest.platform)}`}>
                        {contest.platform === 'leetcode'
                          ? 'LeetCode'
                          : contest.platform === 'codeforces'
                          ? 'CodeForces'
                          : 'GeeksForGeeks'}
                      </span>
                    </td>
                  )}
                  <td className="px-4 py-2">{new Date(contest.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-right">
                    {contest.rank}/{contest.participants}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <span className={`px-2 py-1 rounded text-xs ${badge.className}`}>{badge.text}</span>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={platform ? 4 : 5} className="text-center text-gray-500 py-4">
                No contest rankings found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </motion.div>
  );
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('all');

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
    const lcContests = leetcodeContest && leetcodeContest.length > 0 ? leetcodeContest : [];
    const cfContests = cfContest && cfContest.length > 0 ? cfContest : [];
    const gfgContests =
      gfgData && gfgData.contest && Number(gfgData.contest.totalContests) > 0
        ? [] 
        : [];
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
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
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
        {isPlatformConnected ? (
          <>
            <StatisticsCard
              totalQuestions={filteredData.statistics.totalQuestions}
              activeDays={filteredData.statistics.activeDays}
              totalContests={filteredData.statistics.totalContests}
              platform={platformName}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProblemTypeStats
                dsaCount={filteredData.problemTypes.dsaCount}
                cpCount={filteredData.problemTypes.cpCount}
                platform={platformName}
              />
              <ContestRatingChart data={filteredData.contestData} platform={platformName} />
            </div>
            <ActivityHeatmap data={filteredData.heatmapData} platform={platformName} />
            <ContestRankingTable rankings={filteredData.contestRankings} platform={platformName} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 border rounded-lg border-dashed border-gray-300">
            <h3 className="text-xl font-medium mb-2">Connect Your Account</h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              Please connect your {platformName} account to view your statistics and performance data.
            </p>
            <button
              className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
              onClick={() => {
                handleSavePlatform(activeTab, 'demo_user');
                alert(`Connected to ${platformName} for demonstration!`);
              }}
            >
              Connect for Demo
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
