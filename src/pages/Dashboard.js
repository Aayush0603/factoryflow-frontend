import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Container
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

const API = process.env.REACT_APP_API_URL;

function Dashboard() {
  const [stats, setStats] = useState({
    totalWorkers: 0,
    presentToday: 0,
    completedShift: 0
  });

  useEffect(() => {
    axios.get(`${API}/api/dashboard`).then(res => {
      setStats(res.data);
    });
  }, []);

  const chartData = {
    labels: ["Workers", "Present", "Completed"],
    datasets: [
      {
        label: "Attendance", // fixes undefined
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

  return (
    <Container maxWidth={false} disableGutters>
      <Box sx={{ px: 2, py: 2 }}>

        {/* ===== Page Title ===== */}
        <Typography
          sx={{
            fontSize: { xs: "1.4rem", md: "1.8rem" },
            fontWeight: "bold",
            mb: 3
          }}
        >
          Factory Dashboard
        </Typography>

        {/* ===== Stat Cards ===== */}
        <Grid container spacing={2} mb={3}>
          <StatCard title="Total Workers" value={stats.totalWorkers} color="#3b82f6" />
          <StatCard title="Present Today" value={stats.presentToday} color="#10b981" />
          <StatCard title="Completed Shift" value={stats.completedShift} color="#f59e0b" />
        </Grid>

        {/* ===== Chart Section ===== */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            p: 2
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              mb: 2,
              fontSize: { xs: "1rem", md: "1.2rem" }
            }}
          >
            Attendance Overview
          </Typography>

          <Box sx={{ height: { xs: 240, md: 350 } }}>
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
      </Box>
    </Container>
  );
}

const StatCard = ({ title, value, color }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Card
      sx={{
        borderLeft: `6px solid ${color}`,
        borderRadius: 3,
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
        transition: "0.2s",
        "&:hover": {
          transform: "translateY(-3px)"
        }
      }}
    >
      <CardContent>
        <Typography
          sx={{
            fontSize: "0.9rem",
            color: "#64748b"
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: "1.8rem", md: "2rem" },
            fontWeight: "bold",
            mt: 1
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  </Grid>
);

export default Dashboard;