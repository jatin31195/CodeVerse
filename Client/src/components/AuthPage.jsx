import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify'
const AuthPage = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        const url = isLogin
            ? "http://localhost:8080/api/auth/login"
            : "http://localhost:8080/api/auth/register";
        const payload = isLogin
            ? { email, password }
            : { email, username, password };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (response.ok) {
                sessionStorage.setItem("token", data.token);
                navigate("/dashboard");
            } else {
                toast.error(data.message || "Authentication failed");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Something went wrong");
        }
    };

    return (
        <div>
            <h2>{isLogin ? "Login" : "Register"}</h2>
            <form onSubmit={handleAuth}>
                {!isLogin && (
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                )}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">{isLogin ? "Login" : "Register"}</button>
            </form>
            <p onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
            </p>
        </div>
    );
};

export default AuthPage;
