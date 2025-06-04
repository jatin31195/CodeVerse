import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Dashboard from "./components/Dashboard";
import RaiseTicket from "./components/RaiseTicket";
import VideoMeeting from "./components/VideoMeeting";
import LandingPage from "./components/LandingPage";
import SignUpPage from "./components/SignUpPage";
import LoginPage from "./components/LoginPage";
import Home from "./components/Home";
import SchedulePage from "./components/SchedulePage";
import TasksPage from "./components/TasksPage";
import FavouriteList from "./components/FavouriteList";
import ListView from "./components/ListView";
import POTD from "./components/POTD";
import LeetCode from "./components/LeetCode";
import GFG from "./components/GFG";
import Codeforces from "./components/Codeforces";
import CustomPOTD from "./components/CustomPOTD";
import MyProblem from "./components/MyProblem";
import AddProblem from "./components/AddProblem";
import PasswordReset from "./components/PasswordReset";
import ForgotPassword from "./components/ForgotPassword";
import ReportIssuePage from "./components/ReportIssuePage";

import { apiRequest } from "./utils/api";
import { BASE_URL } from "./config";
import NewUserGuide from "./components/NewUserGuide";

const AppContent = () => {
  const [profileChecked, setProfileChecked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const publicPaths = ["/", "/login", "/signup"];
    if (!publicPaths.includes(location.pathname)) {
      setProfileChecked(true);
      return;
    }

    apiRequest(`${BASE_URL}/api/auth/profile`, { method: "GET" })
      .then((res) => {
        if (res.data?.data?.user) {
          navigate("/home", { replace: true });
        }
      })
      .catch(() => {
      })
      .finally(() => {
        setProfileChecked(true);
      });
  }, [location.pathname, navigate]);

  if (!profileChecked) {
    return null; 
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/reset" element={<PasswordReset />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/community" element={<RaiseTicket />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/task" element={<TasksPage />} />
        <Route path="/fav" element={<FavouriteList />} />
        <Route path="/list/:id" element={<ListView />} />
        <Route path="/video-meeting/:meetingRoom" element={<VideoMeeting />} />
        <Route path="/potd" element={<POTD />} />
        <Route path="/leetcode" element={<LeetCode />} />
        <Route path="/gfg" element={<GFG />} />
        <Route path="/codeforces" element={<Codeforces />} />
        <Route path="/custom" element={<CustomPOTD />} />
        <Route path="/my-problems" element={<MyProblem />} />
        <Route path="/add-problem" element={<AddProblem />} />
        <Route path="/report-issue" element={<ReportIssuePage />} />
        <Route path="new-user-guide" element={<NewUserGuide/>}/>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
