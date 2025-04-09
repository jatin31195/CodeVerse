import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import LiveChat from "./components/LiveChat";
import RaiseTicket from "./components/RaiseTicket";
import VideoMeeting from "./components/VideoMeeting";
import LandingPage from "./components/LandingPage";
import SignUpPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import Home from "./components/Home";
import SchedulePage from "./components/SchedulePage";
import TasksPage from "./components/TasksPage";
import FavouriteList from "./components/FavouriteList";
import ListView from "./components/ListView";
import POTD from "./components/POTD";
import LeetCode from "./components/Leetcode";
import GFG from "./components/GFG";
import Codeforces from "./components/Codeforces";
import CustomPOTD from "./components/CustomPOTD";
import MyProblem from "./components/MyProblem";
import AddProblem from "./components/AddProblem";
import PasswordReset from "./components/PasswordReset";
import ForgotPassword from "./components/ForgotPassword";
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/signup" element={<SignUpPage/>} />
                <Route path='/home' element={<Home/>}/>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/live-chat" element={<LiveChat />} />
                <Route path="/community" element={<RaiseTicket />} />
                <Route path="/schedule" element={<SchedulePage/>} />
                <Route path="/task" element={<TasksPage/>} />
                <Route path="/fav" element={<FavouriteList/>} />
                <Route path="/list/:id" element={<ListView/>} />
                <Route path="/video-meeting/:meetingRoom" element={<VideoMeeting />} />
                <Route path="/potd" element={<POTD/>} />
                <Route path="/leetcode" element={<LeetCode/>} />
                <Route path="/gfg" element={<GFG/>} />
                <Route path="/codeforces" element={<Codeforces/>} />
                <Route path="/custom" element={<CustomPOTD/>} />
                <Route path="/my-problems" element={<MyProblem/>} />
                <Route path="/add-problem" element={<AddProblem/>} />
                <Route path="/reset" element={<PasswordReset/>}/>
                <Route path="/forgot-password" element={<ForgotPassword/>} />
            </Routes>
        </Router>
    );
}

export default App;
