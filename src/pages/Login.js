import React, { useState } from "react";
import API from "../api";   // ✅ use centralized API
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button
} from "@mui/material";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/api/auth/login", {
        email,
        password
      });

      // Save token + user
      sessionStorage.setItem("loggedIn", "true");
      sessionStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );
      sessionStorage.setItem(
        "token",
        res.data.token
      );

      // Restrict ERP to admin only
      if (res.data.user.role !== "admin") {
        alert("Access denied. Not an admin.");
        sessionStorage.clear();
        setLoading(false);
        return;
      }

      window.location.href = "/";

    } catch (err) {
      alert(
        err.response?.data?.message || "Invalid credentials"
      );
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

          <TextField
            fullWidth
            size="small"
            label="Email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

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