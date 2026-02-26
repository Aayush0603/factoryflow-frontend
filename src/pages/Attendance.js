import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Button,
  MenuItem,
  Select,
  Box,
  FormControl,
} from "@mui/material";
import API from "../api";   // ✅ secured API

function Attendance({ dark }) {
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  /* ===== Fetch Workers ===== */
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await API.get("/api/workers");
        setWorkers(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchWorkers();
  }, []);

  /* ===== Fetch Today Status ===== */
  useEffect(() => {
    const fetchStatus = async () => {
      if (!selectedWorker) return;

      try {
        const res = await API.get(
          `/api/attendance/status/${selectedWorker}`
        );
        setStatus(res.data.status);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStatus();
  }, [selectedWorker]);

  /* ===== Check In ===== */
  const handleCheckIn = async () => {
    try {
      await API.post("/api/attendance/checkin", {
        workerId: selectedWorker
      });

      setMessage("Check-In Successful ✅");
      setStatus("checked_in");

    } catch (err) {
      setMessage(
        err.response?.data?.message || "Check-In failed"
      );
    }
  };

  /* ===== Check Out ===== */
  const handleCheckOut = async () => {
    try {
      const res = await API.post("/api/attendance/checkout", {
        workerId: selectedWorker
      });

      setMessage(
        `Worked ${res.data.workHours} hours. Checkout successful 🎉`
      );

      setStatus("completed");

    } catch (err) {
      setMessage(
        err.response?.data?.message || "Checkout failed"
      );
    }
  };

  return (
    <>
      <Typography
        sx={{
          fontSize: { xs: "1.3rem", md: "1.7rem" },
          fontWeight: "bold",
          mb: 2
        }}
      >
        Worker Attendance
      </Typography>

      <Card
        sx={{
          maxWidth: 480,
          borderRadius: 3,
          p: 3,
          background: dark ? "#1e293b" : "white",
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)"
        }}
      >
        <FormControl fullWidth size="small">
          <Select
            value={selectedWorker}
            onChange={e => setSelectedWorker(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">Select Worker</MenuItem>
            {workers.map(w => (
              <MenuItem key={w._id} value={w._id}>
                {w.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box
          sx={{
            mt: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1.5
          }}
        >
          {status === "not_checked_in" && (
            <Button
              variant="contained"
              fullWidth
              onClick={handleCheckIn}
            >
              Check In
            </Button>
          )}

          {status === "checked_in" && (
            <Button
              variant="contained"
              color="success"
              fullWidth
              onClick={handleCheckOut}
            >
              Check Out
            </Button>
          )}
        </Box>

        {status === "completed" && (
          <Typography
            sx={{
              mt: 2,
              fontWeight: 500,
              color: "#16a34a"
            }}
          >
            Attendance Completed ✔
          </Typography>
        )}

        {message && (
          <Typography
            sx={{
              mt: 1.5,
              fontSize: "0.9rem",
              color: "#64748b"
            }}
          >
            {message}
          </Typography>
        )}
      </Card>
    </>
  );
}

export default Attendance;