import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Typography,
  Grid,
  Box,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
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

const API = process.env.REACT_APP_API_URL;

function Analytics({ dark }) {
  const [monthly, setMonthly] = useState({});
  const [topWorkers, setTopWorkers] = useState([]);
  const [otCost, setOtCost] = useState(0);
  const [alerts, setAlerts] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    axios.get(`${API}/api/analytics/monthly-attendance`)
      .then(r => setMonthly(r.data))
      .catch(console.error);

    axios.get(`${API}/api/analytics/top-workers`)
      .then(r => setTopWorkers(r.data))
      .catch(console.error);

    axios.get(`${API}/api/analytics/overtime-cost`)
      .then(r => setOtCost(r.data.totalOTPay))
      .catch(console.error);

    axios.get(`${API}/api/analytics/absent-alert`)
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
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography
        sx={{
          fontSize: { xs: "1.5rem", md: "2rem" },
          fontWeight: "bold",
          mb: 3
        }}
      >
        Factory Analytics Dashboard
      </Typography>

      {/* ===== Summary Cards ===== */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={4}>
          <Card sx={bigCard("#f97316")}>
            <Typography variant="body1">Overtime Cost</Typography>
            <Typography sx={{ fontSize: "1.8rem", fontWeight: "bold" }}>
              ₹ {otCost}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={bigCard("#ef4444")}>
            <Typography variant="body1">Absentee Alerts</Typography>
            <Typography sx={{ fontSize: "1.8rem", fontWeight: "bold" }}>
              {alerts.length}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={bigCard("#10b981")}>
            <Typography variant="body1">Top Workers</Typography>
            <Typography sx={{ fontSize: "1.8rem", fontWeight: "bold" }}>
              {topWorkers.length}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* ===== Charts & Panels ===== */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card sx={panelCard(dark)}>
            <Typography variant="h6" mb={2}>
              Attendance Trend
            </Typography>

            <Box sx={{ height: isMobile ? 250 : 350 }}>
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } }
                }}
              />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={panelCard(dark)}>
            <Typography variant="h6" mb={2}>
              Top Performing Workers
            </Typography>

            {topWorkers.map((w, i) => (
              <Typography
                key={i}
                sx={{ mb: 1, fontSize: "0.95rem" }}
              >
                {i + 1}. {w.name} — {w.totalHours} hrs
              </Typography>
            ))}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

/* ===== Card Styles ===== */

const bigCard = (color) => ({
  background: color,
  color: "white",
  padding: 3,
  borderRadius: 3,
  textAlign: "center",
  boxShadow: "0 6px 18px rgba(0,0,0,0.15)"
});

const panelCard = (dark) => ({
  padding: 3,
  borderRadius: 3,
  background: dark ? "#1e293b" : "white",
  boxShadow: "0 6px 18px rgba(0,0,0,0.08)"
});

export default Analytics;