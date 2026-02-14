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
        data: Object.values(monthly),
        backgroundColor: dark ? "#38bdf8" : "#2563eb",
        borderRadius: 6
      }
    ]
  };

  return (
    <>
      {/* ===== Title ===== */}
      <Typography
        sx={{
          fontSize: { xs: "1.5rem", md: "1.9rem" },
          fontWeight: "bold",
          mb: 2
        }}
      >
        Factory Analytics Dashboard
      </Typography>

      {/* ===== Summary Cards ===== */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={4}>
          <Card sx={summaryCard("#f97316")}>
            <Typography variant="body2">Overtime Cost</Typography>
            <Typography sx={{ fontSize: "1.6rem", fontWeight: "bold", mt: 0.5 }}>
              ₹ {otCost}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={summaryCard("#ef4444")}>
            <Typography variant="body2">Absentee Alerts</Typography>
            <Typography sx={{ fontSize: "1.6rem", fontWeight: "bold", mt: 0.5 }}>
              {alerts.length}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={summaryCard("#10b981")}>
            <Typography variant="body2">Top Workers</Typography>
            <Typography sx={{ fontSize: "1.6rem", fontWeight: "bold", mt: 0.5 }}>
              {topWorkers.length}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* ===== Panels ===== */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card sx={panelCard(dark)}>
            <Typography sx={{ fontWeight: 600, mb: 1.5 }}>
              Attendance Trend
            </Typography>

            <Box sx={{ height: isMobile ? 240 : 300 }}>
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
            <Typography sx={{ fontWeight: 600, mb: 1.5 }}>
              Top Performing Workers
            </Typography>

            {topWorkers.map((w, i) => (
              <Typography
                key={i}
                sx={{ mb: 0.8, fontSize: "0.9rem" }}
              >
                {i + 1}. {w.name} — {w.totalHours} hrs
              </Typography>
            ))}
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

/* ===== Styles ===== */

const summaryCard = (color) => ({
  background: color,
  color: "white",
  p: 2,
  borderRadius: 3,
  textAlign: "center",
  boxShadow: 2
});

const panelCard = (dark) => ({
  p: 2,
  borderRadius: 3,
  background: dark ? "#1e293b" : "white",
  boxShadow: 2
});

export default Analytics;