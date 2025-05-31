import React from "react";
import { Award, ChevronUp, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const ContestRankingTable = ({ rankings, platform }) => {
  const currentYear = new Date().getFullYear();
  const availableYears = [currentYear, currentYear - 1, currentYear - 2];
  const [selectedYear, setSelectedYear] = React.useState(currentYear);

  const filteredRankings = platform
    ? rankings.filter((rank) => rank.platform === platform.toLowerCase())
    : rankings;

  const sortedRankings = [...filteredRankings]
    .filter((r) => new Date(r.date).getFullYear() === selectedYear)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getPlatformColor = (platform) => {
    switch (platform) {
      case "leetcode":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "codeforces":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "gfg":
        return "bg-green-100 text-green-800 border border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getRankingBadge = (rank, participants) => {
    const percentile = 100 - (rank / participants) * 100;
    if (percentile >= 99)
      return {
        text: "Top 1%",
        icon: <Award className="h-4 w-4 mr-1" />,
        class: "bg-gradient-to-r from-purple-500 to-indigo-500 text-white",
      };
    if (percentile >= 95)
      return {
        text: "Top 5%",
        icon: <ChevronUp className="h-4 w-4 mr-1" />,
        class: "bg-indigo-100 text-indigo-800 border border-indigo-200",
      };
    if (percentile >= 90)
      return {
        text: "Top 10%",
        icon: null,
        class: "bg-blue-100 text-blue-800 border border-blue-200",
      };
    if (percentile >= 75)
      return {
        text: "Top 25%",
        icon: null,
        class: "bg-green-100 text-green-800 border border-green-200",
      };
    if (percentile >= 50)
      return {
        text: "Top 50%",
        icon: null,
        class: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      };
    return {
      text: "Participated",
      icon: null,
      class: "bg-gray-100 text-gray-700 border border-gray-200",
    };
  };

  const getContestLink = (contest) => {
    if (contest.url) return contest.url;
    if (contest.platform === "codeforces") {
      const parts = contest.id.split("-");
      const contestId = parts[1];
      return `https://codeforces.com/contest/${contest.Id}`;
    }
    if (contest.platform === "leetcode") {
      const slug = contest.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      return `https://leetcode.com/contest/${slug}`;
    }
    if (contest.platform === "gfg") {
      return contest.url || `https://practice.geeksforgeeks.org/contest`;
    }
    return null;
  };

  return (
    <motion.div
      className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-3xl shadow-lg transition-all duration-300"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.01,
        boxShadow: "0 16px 40px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-green-100">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {platform ? `${platform} Rankings` : "Contest Rankings"}
              </h3>
              <p className="text-gray-500">Tap a contest to view details</p>
            </div>
          </div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
            className="border rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            {availableYears.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:hidden flex flex-col gap-4">
          {sortedRankings.length > 0 ? (
            sortedRankings.map((contest) => {
              const badge = getRankingBadge(
                contest.rank,
                contest.participants
              );
              const link = getContestLink(contest);
              return (
                <motion.div
                  key={contest.id}
                  onClick={() => link && window.open(link, "_blank")}
                  className="bg-white shadow-md rounded-2xl p-4 flex flex-col gap-3 hover:shadow-xl transition cursor-pointer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {contest.name}
                    </h4>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded ${getPlatformColor(
                        contest.platform
                      )}`}
                    >
                      {contest.platform === "leetcode"
                        ? "LeetCode"
                        : contest.platform === "codeforces"
                        ? "CodeForces"
                        : "GeeksForGeeks"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600 text-sm">
                    <span>
                      {new Date(contest.date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="text-gray-700 font-medium">
                      {contest.rank}/{contest.participants}
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${badge.class}`}
                    >
                      {badge.icon}
                      {badge.text}
                    </span>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-10 text-gray-500">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-lg font-semibold mb-1">
                  No contest rankings found
                </p>
                <p className="text-sm text-gray-400">
                  Participate in contests to see your rankings here
                </p>
              </motion.div>
            </div>
          )}
        </div>

        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-[600px] w-full table-auto">
            <thead>
              <tr className="border-b border-gray-200 text-sm text-gray-700">
                <th className="px-4 py-2 text-left font-semibold">Contest</th>
                {!platform && (
                  <th className="px-4 py-2 text-left font-semibold">Platform</th>
                )}
                <th className="px-4 py-2 text-left font-semibold">Date</th>
                <th className="px-4 py-2 text-right font-semibold">Rank</th>
                <th className="px-4 py-2 text-right font-semibold">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedRankings.length > 0 ? (
                sortedRankings.map((contest) => {
                  const badge = getRankingBadge(
                    contest.rank,
                    contest.participants
                  );
                  const link = getContestLink(contest);
                  return (
                    <motion.tr
                      key={contest.id}
                      onClick={() => link && window.open(link, "_blank")}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                    >
                      <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                        {contest.name}
                      </td>
                      {!platform && (
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-2 py-1 text-xs font-medium rounded ${getPlatformColor(
                              contest.platform
                            )}`}
                          >
                            {contest.platform === "leetcode"
                              ? "LeetCode"
                              : contest.platform === "codeforces"
                              ? "CodeForces"
                              : "GeeksForGeeks"}
                          </span>
                        </td>
                      )}
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(contest.date).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-gray-700">
                        {contest.rank}
                        <span className="text-gray-500">
                          /{contest.participants}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        <span
                          className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${badge.class}`}
                        >
                          {badge.icon}
                          {badge.text}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={platform ? 4 : 5}
                    className="text-center py-10 text-gray-500"
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-lg font-semibold mb-1">
                        No contest rankings found
                      </p>
                      <p className="text-sm text-gray-400">
                        Participate in contests to see your rankings here
                      </p>
                    </motion.div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default ContestRankingTable;
