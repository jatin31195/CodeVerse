import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import LiveChat from "./components/LiveChat";
import RaiseTicket from "./components/RaiseTicket";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/live-chat" element={<LiveChat />} />
                <Route path="/raise-ticket" element={<RaiseTicket />} />
            </Routes>
        </Router>
    );
}

export default App;
