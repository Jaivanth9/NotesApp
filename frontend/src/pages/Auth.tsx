import { useState } from "react";
import api from "../api/axios";
import useAuthStore from "../store/auth";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setAuth = useAuthStore(s => s.setAuth);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      setAuth(res.data.user, res.data.token);
      navigate("/welcome");
    } catch (err: any) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border p-2 mb-2"/>
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="border p-2 mb-2"/>
      <button onClick={handleLogin} className="bg-green-500 text-white p-2 rounded mb-2">Login</button>
      <p>Don't have an account? <a href="/register" className="text-blue-500">Register</a></p>
    </div>
  );
};

export default Auth;
