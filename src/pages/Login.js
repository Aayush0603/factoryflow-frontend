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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${API}/api/auth/login`,
        { username, password }
      );

      sessionStorage.setItem("loggedIn", "true");
      sessionStorage.setItem(
        "user",
        JSON.stringify(res.data.admin)
      );

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
          maxWidth: 400,
          borderRadius: 3,
          boxShadow: "0 12px 30px rgba(0,0,0,0.25)"
        }}
      >
        <CardContent>
          <Typography
            sx={{
              fontSize: { xs: "1.5rem", md: "1.7rem" },
              fontWeight: "bold",
              textAlign: "center",
              mb: 3
            }}
          >
            FactoryFlow Login
          </Typography>

          <TextField
            fullWidth
            label="Username"
            margin="normal"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              py: 1.2,
              fontWeight: 600
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