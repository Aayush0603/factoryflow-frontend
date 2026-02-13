import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
  if (e) e.preventDefault();

  try {
    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      { username, password }
    );

    console.log("Login Response:", res.data); // 🔎 debug

    sessionStorage.setItem("loggedIn", "true");

    sessionStorage.setItem(
      "user",
      JSON.stringify(res.data.admin)
    );

    console.log("Stored User:", sessionStorage.getItem("user"));

    window.location.href = "/";

  } catch (err) {
    console.log("Login Error:", err);
    alert("Invalid credentials");
  }
};

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={{ textAlign: "center", marginBottom: "15px" }}>
          FactoryFlow Login
        </h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button type="button" onClick={handleLogin} style={btnStyle}>
          Login
        </button>
      </div>
    </div>
  );
}

/* 🎨 Styles */
const container = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  background: "linear-gradient(135deg, #0f172a, #1e293b)"
};

const card = {
  background: "white",
  padding: "30px",
  borderRadius: "12px",
  width: "320px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

const btnStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "15px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

export default Login;