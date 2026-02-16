import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import { Bar } from "react-chartjs-2";
import API from "../api";

const ProductionDashboard = () => {
  const [summary, setSummary] = useState({});
  const [machineData, setMachineData] = useState([]);
  const [materialStats, setMaterialStats] = useState({});

  useEffect(() => {
    API.get("/production/summary/today").then((res) =>
      setSummary(res.data)
    );

    API.get("/production/analytics/machine-efficiency").then((res) =>
      setMachineData(res.data)
    );

    API.get("/production/analytics/material-efficiency").then((res) => 
      setMaterialStats(res.data)
    );
  }, []);

  const chartData = {
    labels: machineData.map((m) => m.machineName),
    datasets: [
      {
        label: "Average Efficiency (%)",
        data: machineData.map((m) => m.avgEfficiency),
      },
    ],
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>
        Production Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography>Total Production Today</Typography>
            <Typography variant="h6">
              {summary.totalProduction || 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography>Raw Material Used (kg)</Typography>
            <Typography variant="h6">
              {summary.totalRawMaterial || 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography>Average Efficiency (%)</Typography>
            <Typography variant="h6">
              {summary.avgEfficiency || 0}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
       
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography>Material Efficiency</Typography>
          <Typography variant="h6">
            {materialStats.efficiencyRatio || 0} units/kg
          </Typography>
        </Paper>
      </Grid>

      <Box mt={5}>
        <Typography variant="h6" mb={2}>
          Machine Efficiency
        </Typography>
        <Bar data={chartData} />
      </Box>
    </Box>
  );
};

export default ProductionDashboard;