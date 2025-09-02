import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Code, Code2, Atom } from "lucide-react";
import MainLayout from "./MainLayout";


const topics = [
  {
    name: "JavaScript",
    slug: "javascript",
    icon: <Code className="w-10 h-10 text-yellow-400" />,    
    description: "Deep dive into modern JS, ES6+, and beyond.",
    gradient: "from-yellow-200 via-yellow-300 to-yellow-400"
  },

  {
    name: "React",
    slug: "react",
    icon: <Atom className="w-10 h-10 text-blue-400" />,
    description: "Explore React hooks, context, and best practices.",
    gradient: "from-blue-200 via-blue-300 to-blue-400"
  }
];

const cardVariants = {
  hover: {
    scale: 1.05,
    rotate: 1,
    transition: { duration: 0.3, ease: "easeInOut" }
  }
};

const InterviewHelp = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
    <div className="min-h-screen bg-white text-gray-900 p-8">
   
      <header className="text-center mb-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold tracking-tight bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
        >
          CodeVerse Interview Prep
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-4 text-lg max-w-2xl mx-auto text-gray-600"
        >
          Choose your path and conquer your interviews with curated questions and expert insights.
        </motion.p>
      </header>

      
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {topics.map((topic, idx) => (
          <motion.div
            key={idx}
            variants={cardVariants}
            whileHover="hover"
            onClick={() => navigate(`/interview/${topic.slug}`)}
            className={`relative cursor-pointer rounded-3xl p-6 bg-white border border-gray-200 shadow-md overflow-hidden transition`}
          >
            
            <div className={`absolute inset-0 bg-gradient-to-br ${topic.gradient} opacity-10`}></div>

            <div className="relative flex flex-col h-full justify-between">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{topic.name}</h2>
                {topic.icon}
              </div>
              <p className="text-base text-gray-600 mb-6 flex-grow">
                {topic.description}
              </p>
              <button
                className="self-start inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-800 transition"
              >
                Explore &rarr;
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
    </MainLayout>
  );
};

export default InterviewHelp;
