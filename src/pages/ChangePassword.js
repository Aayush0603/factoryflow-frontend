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

function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      await API.put("/auth/change-password", form);

      setMessage("Password changed successfully.");

      sessionStorage.clear();
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);

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
            Change ERP Password
          </Typography>

          {message && <Alert severity="success">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              margin="normal"
              value={form.currentPassword}
              onChange={(e) =>
                setForm({ ...form, currentPassword: e.target.value })
              }
              required
            />

            <TextField
              fullWidth
              label="New Password"
              type="password"
              margin="normal"
              value={form.newPassword}
              onChange={(e) =>
                setForm({ ...form, newPassword: e.target.value })
              }
              required
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              type="submit"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
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

export default ChangePassword;