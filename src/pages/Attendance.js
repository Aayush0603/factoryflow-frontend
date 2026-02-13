import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button, MenuItem, Select, Box } from "@mui/material";
import axios from "axios";

function Attendance() {
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/workers")
      .then(res => setWorkers(res.data))
      .catch(err => console.log(err));
  }, []);

  // 🔍 Check today's attendance status
  useEffect(() => {
    if (selectedWorker) {
      axios.get(`http://localhost:5000/attendance-status/${selectedWorker}`)
        .then(res => setStatus(res.data.status))
        .catch(err => console.log(err));
    }
  }, [selectedWorker]);

  const handleCheckIn = async () => {
    await axios.post("http://localhost:5000/checkin", { workerId: selectedWorker });
    setMessage("Check-In Successful ✅");
    setStatus("checked_in");
  };

  const handleCheckOut = async () => {
  try {
    const res = await axios.post("http://localhost:5000/checkout", { workerId: selectedWorker });
    setMessage(`Worked ${res.data.workHours} hours. Checkout successful 🎉`);
  } catch (err) {
    console.log("CHECKOUT ERROR:", err.response.data);  // 👈 important
    setMessage(err.response?.data?.message || "Checkout failed");
  }
};

  return (
  <Box display="flex" justifyContent="center" mt={5}>
    <Card sx={{ width: 420, boxShadow: 4, borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Worker Attendance
        </Typography>

        <Select
          fullWidth
          value={selectedWorker}
          onChange={e => setSelectedWorker(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">Select Worker</MenuItem>
          {workers.map(w => (
            <MenuItem key={w._id} value={w._id}>{w.name}</MenuItem>
          ))}
        </Select>

        <Box mt={3} display="flex" justifyContent="center" gap={2}>
          {status === "not_checked_in" && (
            <Button variant="contained" color="primary" onClick={handleCheckIn}>
              Check In
            </Button>
          )}

          {status === "checked_in" && (
            <Button variant="contained" color="success" onClick={handleCheckOut}>
              Check Out
            </Button>
          )}
        </Box>

        {status === "completed" && (
          <Typography color="green" mt={2}>
            Attendance Completed ✔
          </Typography>
        )}

        <Typography mt={2}>{message}</Typography>
      </CardContent>
    </Card>
  </Box>
);
}

export default Attendance;
