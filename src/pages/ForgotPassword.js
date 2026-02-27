import React, { useState } from "react";
import { Box, Card, CardContent, Typography, TextField, Button } from "@mui/material";
import API from "../api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/customer/forgot-password", { email });
      setMessage("Password reset link sent to your email.");
    } catch (error) {
      setMessage("Failed to send reset link.");
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
        background: "linear-gradient(135deg, #0f172a, #1e293b)"
      }}
    >
      <Card sx={{ maxWidth: 400, width: "100%", borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" textAlign="center" mb={3}>
            Forgot Password
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              type="submit"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          {message && (
            <Typography mt={2} textAlign="center">
              {message}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default ForgotPassword;