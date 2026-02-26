import React, { useEffect, useState } from "react";
import API from "../api";   // ✅ secured API
import {
  Card,
  Typography,
  Grid,
  Box
} from "@mui/material";
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
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/api/dashboard");
      setStats(res.data);
    } catch (error) {
      console.error("Dashboard error:", error);
    }
  };

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
        borderRadius: 6
      }
    ]
  };

  return (
    <>
      <Typography
        sx={{
          fontSize: { xs: "1.4rem", md: "1.8rem" },
          fontWeight: "bold",
          mb: 2
        }}
      >
        Factory Dashboard
      </Typography>

      <Grid container spacing={2} mb={2}>
        <StatCard
          title="Total Workers"
          value={stats.totalWorkers}
          color="#3b82f6"
          dark={dark}
        />
        <StatCard
          title="Present Today"
          value={stats.presentToday}
          color="#10b981"
          dark={dark}
        />
        <StatCard
          title="Completed Shift"
          value={stats.completedShift}
          color="#f59e0b"
          dark={dark}
        />
      </Grid>

      <Card
        sx={{
          borderRadius: 3,
          p: 2,
          background: dark ? "#1e293b" : "white",
          boxShadow: 3
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            mb: 1.5,
            fontSize: { xs: "1rem", md: "1.2rem" }
          }}
        >
          Attendance Overview
        </Typography>

        <Box sx={{ height: { xs: 220, md: 320 } }}>
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
    </>
  );
}

/* ===== Stat Card ===== */

const StatCard = ({ title, value, color, dark }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Card
      sx={{
        borderLeft: `5px solid ${color}`,
        borderRadius: 3,
        p: 2,
        background: dark ? "#1e293b" : "white",
        boxShadow: 2,
        transition: "0.2s",
        "&:hover": {
          transform: "translateY(-2px)"
        }
      }}
    >
      <Typography
        sx={{
          fontSize: "0.85rem",
          color: dark ? "#94a3b8" : "#64748b"
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          fontSize: { xs: "1.6rem", md: "1.9rem" },
          fontWeight: "bold",
          mt: 0.5
        }}
      >
        {value}
      </Typography>
    </Card>
  </Grid>
);

export default Dashboard;