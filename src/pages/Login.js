import React, { useState } from "react";
import API from "../api";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Link
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

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

      // Save session
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

      navigate("/");

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
          maxWidth: 380,
          borderRadius: 3,
          boxShadow: "0 15px 40px rgba(0,0,0,0.25)"
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Title */}
          <Typography
            sx={{
              fontSize: "1.8rem",
              fontWeight: "bold",
              textAlign: "center",
              mb: 1
            }}
          >
            FactoryFlow ERP
          </Typography>

          <Typography
            sx={{
              textAlign: "center",
              fontSize: "0.9rem",
              color: "#64748b",
              mb: 3
            }}
          >
            Admin Login
          </Typography>

          {/* Form */}
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              size="small"
              label="Email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <TextField
              fullWidth
              size="small"
              label="Password"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Forgot Password */}
            <Typography
              sx={{
                textAlign: "right",
                fontSize: "0.85rem",
                mt: 1
              }}
            >
              <Link
                component="button"
                underline="hover"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </Link>
            </Typography>

            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                py: 1.2,
                fontWeight: 600,
                textTransform: "none"
              }}
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;