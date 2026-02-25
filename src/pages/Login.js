import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button
} from "@mui/material";

const API = process.env.REACT_APP_API_URL;

function Login() {
  const [email, setEmail] = useState("");     // ✅ changed
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${API}/api/auth/login`,
        {
          email,        // ✅ backend expects email
          password
        }
      );

      // ✅ Save login state
      sessionStorage.setItem("loggedIn", "true");
      sessionStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );
      sessionStorage.setItem(
        "token",
        res.data.token
      );

      // ✅ Optional: ensure only admin can access ERP
      if (res.data.user.role !== "admin") {
        alert("Access denied. Not an admin.");
        sessionStorage.clear();
        return;
      }

      window.location.href = "/";
    } catch (err) {
      alert("Invalid credentials");
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        background: "linear-gradient(135deg, #0f172a, #1e293b)"
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 360,
          borderRadius: 3,
          boxShadow: "0 10px 28px rgba(0,0,0,0.25)"
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            sx={{
              fontSize: "1.6rem",
              fontWeight: "bold",
              textAlign: "center",
              mb: 2.5
            }}
          >
            FactoryFlow
          </Typography>

          <Typography
            sx={{
              textAlign: "center",
              fontSize: "0.9rem",
              color: "#64748b",
              mb: 2
            }}
          >
            Sign in to continue
          </Typography>

          {/* ✅ Email Field */}
          <TextField
            fullWidth
            size="small"
            label="Email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* ✅ Password Field */}
          <TextField
            fullWidth
            size="small"
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 2.5,
              py: 1,
              fontWeight: 600,
              textTransform: "none"
            }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;