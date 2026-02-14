import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  MenuItem,
  Select,
  Box,
  FormControl,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

function Attendance() {
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  /* ================= GET WORKERS ================= */
  useEffect(() => {
    axios
      .get(`${API}/api/workers`)
      .then(res => setWorkers(res.data))
      .catch(console.error);
  }, []);

  /* ================= GET TODAY STATUS ================= */
  useEffect(() => {
    if (selectedWorker) {
      axios
        .get(`${API}/api/attendance/status/${selectedWorker}`)
        .then(res => setStatus(res.data.status))
        .catch(console.error);
    }
  }, [selectedWorker]);

  /* ================= CHECK IN ================= */
  const handleCheckIn = async () => {
    try {
      await axios.post(`${API}/api/attendance/checkin`, {
        workerId: selectedWorker
      });

      setMessage("Check-In Successful ✅");
      setStatus("checked_in");
    } catch (err) {
      console.error(err);
      setMessage("Check-In failed");
    }
  };

  /* ================= CHECK OUT ================= */
  const handleCheckOut = async () => {
    try {
      const res = await axios.post(`${API}/api/attendance/checkout`, {
        workerId: selectedWorker
      });

      setMessage(
        `Worked ${res.data.workHours} hours. Checkout successful 🎉`
      );

      setStatus("completed");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Checkout failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: isMobile ? "flex-start" : "center",
        px: 2,
        py: 3
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 480,
          borderRadius: 3,
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)"
        }}
      >
        <CardContent>
          <Typography
            sx={{
              fontSize: { xs: "1.3rem", md: "1.5rem" },
              fontWeight: "bold",
              mb: 3
            }}
          >
            Worker Attendance
          </Typography>

          {/* ===== Worker Select ===== */}
          <FormControl fullWidth>
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

          {/* ===== Buttons ===== */}
          <Box
            sx={{
              mt: 3,
              display: "flex",
              flexDirection: "column",
              gap: 2
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

          {/* ===== Status Message ===== */}
          {status === "completed" && (
            <Typography
              sx={{
                mt: 3,
                fontWeight: 500,
                color: "green"
              }}
            >
              Attendance Completed ✔
            </Typography>
          )}

          {message && (
            <Typography
              sx={{
                mt: 2,
                fontSize: "0.9rem",
                color: "#64748b"
              }}
            >
              {message}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default Attendance;