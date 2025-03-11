import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) navigate("/auth"); // Redirect to login if not authenticated
    }, [navigate]);

    return (
        <div>
            <h2>Welcome to the Dashboard</h2>
            <button onClick={() => navigate("/live-chat")}>Go to Live Chat</button>
            <button onClick={() => navigate("/raise-ticket")}>Raise a Ticket</button>
        </div>
    );
};

export default Dashboard;
