import React from "react";

const DashboardLayout = ({
  children,
  activeTab,
  onTabChange,
  sidebarOpen,
  toggleSidebar,
}) => (
  <div className="min-h-screen w-full bg-gradient-to-br from-white via-slate-50 to-purple-50 text-gray-900 transition-colors duration-300">
    <main className="flex flex-col w-full px-1 sm:px-1 lg:px-1 xl:px-1 py-12 relative">

      <div className="absolute -top-28 -right-24 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl -z-10" />
      <div className="absolute -bottom-40 -left-24 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl -z-10" />

      <div className="mb-12 text-center">
        <div className="floating-animation">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 animate-fade-in-up">
            {{
              all: "CodeVerse Arena",
              leetcode: "LeetCode Dashboard",
              codeforces: "CodeForces Dashboard",
              gfg: "GeeksForGeeks Dashboard",
            }[activeTab]}
          </h1>
        </div>
        <p className="text-gray-600 mt-4 text-lg md:text-xl font-medium animate-fade-in-up floating-animation" style={{ animationDelay: '0.2s' }}>
          {{
            all: "Your unified coding journey across all platforms",
            leetcode: "Visualize your progress on LeetCode",
            codeforces: "Competitive coding insights from CodeForces",
            gfg: "Your GeeksForGeeks learning dashboard",
          }[activeTab]}
        </p>
        <div className="mt-6 flex justify-center">
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full animate-fade-in-up" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>

      <div className="hidden md:flex justify-center mb-10">
        <div className="bg-white backdrop-blur-md rounded-full shadow-md border border-gray-200 p-1">
          <div className="grid grid-cols-4 gap-1">
            {["all", "leetcode", "codeforces", "gfg"].map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`py-2 px-6 text-sm sm:text-base font-semibold rounded-full transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {{
                  all: "All",
                  leetcode: "LeetCode",
                  codeforces: "CodeForces",
                  gfg: "GeeksForGeeks",
                }[tab]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto animate-fade-in-up">
        {children}
      </div>
    </main>
  </div>
);

export default DashboardLayout;
