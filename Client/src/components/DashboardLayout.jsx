import '../App.css'
const DashboardLayout = ({
  children,
  activeTab,
  onTabChange,
  sidebarOpen,
  toggleSidebar,
}) => (
    
  <div className=" min-h-screen w-full bg-gradient-to-br from-white via-slate-50 to-purple-50 text-gray-900 transition-colors duration-300">
    <main className="flex flex-col w-full px-4 sm:px-6 lg:px-8 py-8 relative">
    <div className="fixed top-25 left-6 bg-white/80 backdrop-blur-md shadow-md rounded-full px-4 py-2 text-sm text-gray-800 flex items-center gap-2 border border-gray-300 hover:shadow-lg transition-all duration-400 z-40 animate-pulse">
  <span className="text-blue-600 font-semibold">Tip:</span>
  <span>Connect your LeetCode, GFG, and Codeforces accounts to track your progress seamlessly.</span>
</div>

    
      <div className="absolute -top-28 -right-24 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl -z-10" />
      <div className="absolute -bottom-40 -left-24 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl -z-10" />

      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 animate-fade-in-up">
          {{
            all: "CodeVerse Arena",
            leetcode: "LeetCode Dashboard",
            codeforces: "CodeForces Dashboard",
            gfg: "GeeksForGeeks Dashboard",
          }[activeTab]}
        </h1>
        <p className="text-gray-600 mt-3 text-base sm:text-lg md:text-xl font-medium animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {{
            all: "Your unified coding journey across all platforms",
            leetcode: "Visualize your progress on LeetCode",
            codeforces: "Competitive coding insights from CodeForces",
            gfg: "Your GeeksForGeeks learning dashboard",
          }[activeTab]}
        </p>
        <div className="mt-5 flex justify-center">
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full animate-fade-in-up" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>

  
      <div className="mb-6">
      
        <div className="hidden md:flex justify-center">
          <div className="bg-white backdrop-blur-md rounded-full shadow-md border border-gray-200 p-1">
            <div className="grid grid-cols-4 gap-1">
              {["all", "leetcode", "codeforces", "gfg"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => onTabChange(tab)}
                  className={`cursor-pointer py-2 px-6 text-sm font-semibold rounded-full transition-all duration-200 ${
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

        <div className="md:hidden grid grid-cols-2 gap-3 max-w-xs mx-auto">
          {["all", "leetcode", "codeforces", "gfg"].map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`w-full py-2 px-4 text-sm font-medium rounded-full transition-colors duration-200 ${
                activeTab === tab
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
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

      <div className="w-full max-w-7xl mx-auto animate-fade-in-up">
        {children}
      </div>
    </main>
  </div>
);

export default DashboardLayout;
