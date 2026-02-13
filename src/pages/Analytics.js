import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Typography, Grid, Box } from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Analytics({ dark }) {
  const [monthly, setMonthly] = useState({});
  const [topWorkers, setTopWorkers] = useState([]);
  const [otCost, setOtCost] = useState(0);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/analytics/monthly-attendance")
      .then(r => setMonthly(r.data));

    axios
      .get("http://localhost:5000/api/analytics/top-workers")
      .then(r => setTopWorkers(r.data));

    axios
      .get("http://localhost:5000/api/analytics/overtime-cost")
      .then(r => setOtCost(r.data.totalOTPay));

    // remove this if backend route doesn't exist
    axios
      .get("http://localhost:5000/api/analytics/absent-alert")
      .then(r => setAlerts(r.data))
      .catch(() => setAlerts([]));
  }, []);

  const chartData = {
    labels: Object.keys(monthly),
    datasets: [
      {
        label: "Monthly Attendance",
        data: Object.values(monthly),
        backgroundColor: dark ? "#38bdf8" : "#2563eb",
        borderRadius: 6
      }
    ]
  };

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Factory Analytics Dashboard
      </Typography>

      <Grid container spacing={3} mb={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={bigCard("#f97316")}>
            <Typography variant="h6">Overtime Cost</Typography>
            <Typography variant="h4">₹ {otCost}</Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={bigCard("#ef4444")}>
            <Typography variant="h6">Absentee Alerts</Typography>
            <Typography variant="h4">{alerts.length}</Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={bigCard("#10b981")}>
            <Typography variant="h6">Top Workers</Typography>
            <Typography variant="h4">{topWorkers.length}</Typography>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={panelCard(dark)}>
            <Typography variant="h6" mb={2}>
              Attendance Trend
            </Typography>
            <Bar data={chartData} />
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={panelCard(dark)}>
            <Typography variant="h6" mb={2}>
              Top Performing Workers
            </Typography>
            {topWorkers.map((w, i) => (
              <Typography key={i}>
                {i + 1}. {w.name} — {w.totalHours} hrs
              </Typography>
            ))}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

/* 🎨 STYLE FUNCTIONS (THESE WERE MISSING) */

const bigCard = (color) => ({
  background: color,
  color: "white",
  padding: 3,
  borderRadius: 3,
  textAlign: "center"
});

const panelCard = (dark) => ({
  padding: 3,
  borderRadius: 3,
  background: dark ? "#1e293b" : "white"
});

export default Analytics;