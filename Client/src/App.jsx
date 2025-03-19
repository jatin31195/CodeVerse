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
                <Route path="/video-meeting/:meetingRoom" element={<VideoMeeting />} />
            </Routes>
        </Router>
    );
}

export default App;
