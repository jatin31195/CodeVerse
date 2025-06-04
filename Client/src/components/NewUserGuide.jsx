import React, { useState } from 'react';
import MainLayout from './MainLayout';
import { motion } from 'framer-motion';
import {
  Rocket,
  Play,
  Key,
  BarChart3,
  Calendar,
  Star,
  CheckCircle,
  Clock,
  Bot,
  Ticket,
  Bug,
} from 'lucide-react';

const features = [
  {
    icon: Key,
    title: '🔑 Seamless Access',
    points: [
      'Google OAuth login/signup for instant entry',
      'Clean, intuitive interface—get coding right away',
      'Set your personal learning goals immediately',
    ],
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: BarChart3,
    title: '📊 Home Dashboard',
    points: [
      'Comprehensive overview of CodeVerse features',
      'Add & monitor daily goals in one click',
      '"Add POTD" button to instantly import problems from LeetCode, GFG, or Codeforces',
      'Personalized activity snapshot—your progress, at a glance',
    ],
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Calendar,
    title: '📆 Problem of the Day (POTD)',
    points: [
      'Aggregates today’s POTDs from LeetCode, GFG, and CF (CF selected by our proprietary algorithm)',
      'Submit and explore community solutions in C++, Java, Python, and more',
      'Easy Explanation section: real-world scenarios for each problem',
      'Dedicated chat room per POTD (open for 36 hours)',
    ],
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Star,
    title: '🗂 Custom POTD Lists',
    points: [
      'Create multiple named problem sets (Public or Private)',
      'Bulk-schedule up to a month of practice by pasting LeetCode/GFG links',
      "Click any date in the calendar to jump straight to that day’s problem",
    ],
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: CheckCircle,
    title: '⭐ Favorites',
    points: [
      'Save & categorize your “Must-Practice” questions',
      'Tag favorites by topic, difficulty, or platform',
      'Keep track of solution status—revisit anytime',
    ],
    color: 'from-red-500 to-pink-500',
  },
  {
    icon: Clock,
    title: '⏰ Daily Tasks + Smart Email Reminders',
    points: [
      'Define a single daily coding task—edit or mark complete up until midnight',
      'Calendar view for past tasks and accomplishments',
      'Automated email notifications tailored to time remaining:',
      '🕑 > 5 hrs left → Reminder 2 hrs before deadline',
      '⏲ 2–5 hrs left → Reminder 1 hr before',
      '⏳ 30 min–2 hrs left → Reminder 40 min before',
      '⏰ < 20 min left → Reminder 10 min before',
    ],
    color: 'from-indigo-500 to-purple-500',
  },
  {
    icon: Bot,
    title: '🤖 AI-Powered Timetable Generator',
    points: [
      'Automatically fetches upcoming contests from LeetCode, GFG, and CF',
      'If a contest is within 24 hrs, recommends focused revision topics',
      'Generates a personalized DSA + Dev schedule in ~3–4 minutes',
      'Run it in the background—your custom timetable will appear when ready',
    ],
    color: 'from-teal-500 to-cyan-500',
  },
  {
    icon: Ticket,
    title: '🎫 Raise a Ticket',
    points: [
      'Submit a doubt for any problem (POTD or from our database)',
      'Community-driven solutions: text explanations or video walkthroughs',
      'Ticket closes automatically once you accept a solution',
      'For video help, a live meeting link is generated for instant collaboration',
    ],
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Bug,
    title: '🐞 Report an Issue',
    points: [
      'Simple form to report bugs or improvements—attach screenshots if needed',
      'We’re in active development; your feedback drives rapid fixes',
    ],
    color: 'from-rose-500 to-red-500',
  },
];

const NewUserGuide = () => {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white"
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm"
            >
              <Rocket className="h-5 w-5" />
              <span className="text-sm font-medium">Welcome to CodeVerse</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent"
            >
              Your Personalized Coding Companion
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto"
            >
              An all-in-one platform built to elevate your DSA and development journey.
              Discover how CodeVerse makes staying on track effortless.
            </motion.p>
          </div>
        </motion.div>

        {/* Video Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-6xl mx-auto px-4 py-16"
        >
          <div className="rounded-2xl overflow-hidden shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white p-6">
              <div className="text-2xl flex items-center gap-2">
                <Play className="h-6 w-6" />
                <span>CodeVerse Introduction Video</span>
              </div>
              <p className="text-gray-300 mt-1">
                Watch this comprehensive guide to get started with CodeVerse
              </p>
            </div>

            <div className="relative aspect-video bg-black">
              {!showVideo ? (
  <div
    className="absolute inset-0 flex flex-col items-center justify-center text-white cursor-pointer"
    onClick={() => setShowVideo(true)}
  >
    <Play className="h-16 w-16 mb-4" />
    <p className="text-lg">Click to Play Video</p>
  </div>
) : (
  <iframe
    className="w-full h-full"
    src="https://player.vimeo.com/video/1090579109?autoplay=1"
    frameBorder="0"
    allow="autoplay; fullscreen"
    allowFullScreen
    title="CodeVerse Intro"
  />
)}

            </div>
          </div>
        </motion.div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 pb-20">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          >
            Powerful Features at Your Fingertips
          </motion.h2>

          <div className="grid gap-8 md:gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm group hover:scale-[1.02]">
                  <div className={`h-2 bg-gradient-to-r ${feature.color}`}></div>

                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">{feature.title}</h3>
                    </div>

                    <div className="space-y-3">
                      {feature.points.map((point, pointIndex) => (
                        <motion.div
                          key={pointIndex}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: pointIndex * 0.1 }}
                          viewport={{ once: true }}
                          className="flex items-start gap-3 group/item"
                        >
                          <div className="mt-1.5">
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.color} group-hover/item:scale-125 transition-transform duration-200`}></div>
                          </div>
                          <p className="text-gray-700 leading-relaxed group-hover/item:text-gray-900 transition-colors duration-200">
                            {point}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-20"
        >
          <div className="max-w-4xl mx-auto text-center px-4">
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your Journey?
            </h3>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of developers already using CodeVerse to accelerate their coding skills
            </p>
            <button className="inline-flex items-center bg-white text-indigo-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              Get Started Now
              <Rocket className="ml-2 h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default NewUserGuide;
