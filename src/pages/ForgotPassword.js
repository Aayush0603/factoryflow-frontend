import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert
} from "@mui/material";
import API from "../api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      await API.post("/auth/forgot-password", { email });
      setMessage("Reset link sent to your email.");
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    }

    setLoading(false);
  };

  return (
    <Box sx={wrapperStyle}>
      <Card sx={cardStyle}>
        <CardContent>
          <Typography variant="h5" mb={2}>
            ERP Forgot Password
          </Typography>

          {message && <Alert severity="success">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Admin Email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              type="submit"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

const wrapperStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #0f172a, #1e293b)"
};

const cardStyle = {
  width: 400,
  borderRadius: 3,
  boxShadow: "0 15px 40px rgba(0,0,0,0.25)"
};

export default ForgotPassword;