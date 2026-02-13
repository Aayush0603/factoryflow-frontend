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
    <Container maxWidth="lg" sx={{ px: 2 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Factory Dashboard
      </Typography>

      <Grid container spacing={2} mb={4}>
        <StatCard title="Total Workers" value={stats.totalWorkers} color="#3b82f6" />
        <StatCard title="Present Today" value={stats.presentToday} color="#10b981" />
        <StatCard title="Completed Shift" value={stats.completedShift} color="#f59e0b" />
      </Grid>

      <Card sx={{ p: 3 }}>
        <Typography fontWeight="bold" mb={2}>
          Attendance Overview
        </Typography>
        <Box sx={{ height: 300 }}>
          <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </Box>
      </Card>
    </Container>
  );
}

const StatCard = ({ title, value, color }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Card sx={{ borderLeft: `5px solid ${color}`, p: 2 }}>
      <CardContent>
        <Typography color="text.secondary">{title}</Typography>
        <Typography variant="h5" fontWeight="bold">{value}</Typography>
      </CardContent>
    </Card>
  </Grid>
);

export default Dashboard;