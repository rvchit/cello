import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("http://localhost:3002/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      alert("Registration successful! Please log in.");
      navigate("/login");
    } else {
      const error = await response.json();
      alert(error.message || "Registration failed.");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", width: "300px" }}>
        <h2>Register</h2>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ marginBottom: "10px", padding: "8px" }}
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ marginBottom: "10px", padding: "8px" }}
        />
        <button type="submit" style={{ padding: "10px", backgroundColor: "#4CAF50", color: "white", border: "none" }}>
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;