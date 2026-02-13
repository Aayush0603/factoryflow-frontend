import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function Dashboard({ dark }) {
  const [stats, setStats] = useState({
    totalWorkers: 0,
    presentToday: 0,
    completedShift: 0
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/dashboard")
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));
  }, []);

  const chartData = {
    labels: ["Workers", "Present", "Completed"],
    datasets: [
      {
        data: [
          stats.totalWorkers,
          stats.presentToday,
          stats.completedShift
        ],
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
        borderRadius: 8
      }
    ]
  };

  const chartOptions = {
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: dark ? "white" : "black" } },
      y: { ticks: { color: dark ? "white" : "black" } }
    }
  };

  return (
    <Box p={4}>

      <Typography
        variant="h4"
        fontWeight="bold"
        mb={4}
        sx={{ letterSpacing: "0.5px" }}
      >
        Factory Dashboard
      </Typography>

      {/* ===== STATS CARDS ===== */}
      <Grid container spacing={3} mb={3}>
        <StatCard
          title="Total Workers"
          value={stats.totalWorkers}
          color="#3b82f6"
        />
        <StatCard
          title="Present Today"
          value={stats.presentToday}
          color="#10b981"
        />
        <StatCard
          title="Completed Shift"
          value={stats.completedShift}
          color="#f59e0b"
        />
      </Grid>

      {/* ===== CHART CARD ===== */}
      <Card
        sx={{
          p: 4,
          borderRadius: 4,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 18px 40px rgba(0,0,0,0.12)"
          }
        }}
      >
        <Typography
          variant="h6"
          mb={3}
          fontWeight="600"
          sx={{ letterSpacing: "0.4px" }}
        >
          Attendance Overview
        </Typography>

        <Bar data={chartData} options={chartOptions} />
      </Card>
    </Box>
  );
}

/* ===== STAT CARD COMPONENT ===== */

const StatCard = ({ title, value, color }) => (
  <Grid item xs={12} md={4}>
    <Card
      sx={{
        borderLeft: `6px solid ${color}`,
        borderRadius: 4,
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        transition: "all 0.3s ease",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 15px 35px rgba(0,0,0,0.15)"
        }
      }}
    >
      <CardContent>
        <Typography
          variant="body2"
          sx={{ color: "#64748b", mb: 1 }}
        >
          {title}
        </Typography>

        <Typography
          variant="h4"
          fontWeight="bold"
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  </Grid>
);

export default Dashboard;