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

function Dashboard({ dark }) {
  const [stats, setStats] = useState({
    totalWorkers: 0,
    presentToday: 0,
    completedShift: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API}/api/dashboard`)
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
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
        borderRadius: 8
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: dark ? "white" : "#111" } },
      y: { ticks: { color: dark ? "white" : "#111" } }
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        px: { xs: 2, sm: 3, md: 4 } // clean side padding
      }}
    >
      <Box
        sx={{
          py: { xs: 3, md: 5 },
          width: "100%"
        }}
      >
        {/* ===== PAGE TITLE ===== */}
        <Typography
          sx={{
            fontSize: { xs: "1.4rem", md: "2rem" },
            fontWeight: "bold",
            mb: { xs: 3, md: 4 },
            letterSpacing: "0.5px"
          }}
        >
          Factory Dashboard
        </Typography>

        {/* ===== STATS CARDS ===== */}
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          justifyContent="center"
          sx={{ mb: { xs: 3, md: 4 } }}
        >
          <StatCard
            title="Total Workers"
            value={stats.totalWorkers}
            color="#3b82f6"
            loading={loading}
          />
          <StatCard
            title="Present Today"
            value={stats.presentToday}
            color="#10b981"
            loading={loading}
          />
          <StatCard
            title="Completed Shift"
            value={stats.completedShift}
            color="#f59e0b"
            loading={loading}
          />
        </Grid>

        {/* ===== CHART CARD ===== */}
        <Card
          sx={{
            p: { xs: 2, md: 4 },
            borderRadius: 3,
            boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
            width: "100%"
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "0.95rem", md: "1.2rem" },
              fontWeight: 600,
              mb: { xs: 2, md: 3 }
            }}
          >
            Attendance Overview
          </Typography>

          <Box
            sx={{
              width: "100%",
              height: { xs: 240, md: 380 }
            }}
          >
            <Bar data={chartData} options={chartOptions} />
          </Box>
        </Card>
      </Box>
    </Container>
  );
}

/* ===== STAT CARD COMPONENT ===== */

const StatCard = ({ title, value, color, loading }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Card
      sx={{
        borderLeft: `5px solid ${color}`,
        borderRadius: 3,
        boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
        width: "100%"
      }}
    >
      <CardContent>
        <Typography
          sx={{
            fontSize: { xs: "0.8rem", md: "0.95rem" },
            color: "#64748b",
            mb: 1
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: "1.5rem", md: "1.9rem" },
            fontWeight: "bold"
          }}
        >
          {loading ? "..." : value}
        </Typography>
      </CardContent>
    </Card>
  </Grid>
);

export default Dashboard;