import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/features/userSlice';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    const dispatch = useDispatch();
    e.preventDefault();
    setError(null); // Reset any previous errors

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const { token, user } = response.data;
        dispatch(setUser({ userId: user._id, token }));

        // Store token in localStorage
        localStorage.setItem("token", token);

        // Optionally, store user details (excluding sensitive info)
        localStorage.setItem("user", JSON.stringify(user));

        alert("Login successful!");
        // Redirect to another page (e.g., dashboard)
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError("An error occurred during login.");
      }
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        {error && (
          <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>
        )}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007BFF",
            color: "#FFF",
            border: "none",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
